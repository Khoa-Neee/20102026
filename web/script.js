(() => {
  "use strict";
  const cfg = window.GIFT_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const flowerTypes = [
    { id: "rose", cls: "", petal: "#ef6b82", center: "#f6c74e", name: "Hoa hồng" },
    { id: "tulip", cls: "tulip", petal: "#ee6685", center: "#f6c74e", name: "Tulip" },
    { id: "sun", cls: "sun", petal: "#f5bd32", center: "#71472b", name: "Hướng dương" },
    { id: "daisy", cls: "white", petal: "#fff", center: "#e9b934", name: "Cúc trắng" },
    { id: "blue", cls: "blue", petal: "#819cdf", center: "#ffdf73", name: "Hoa xanh" },
    { id: "lotus", cls: "lotus purple", petal: "#a776cc", center: "#f2cf5b", name: "Hoa tím" }
  ];
  let arrangement = [];
  let records = [];
  let selectedSeat = null;
  let dodgeCount = 0;
  let slideIndex = 0;
  let slideTimer = null;
  let pollTimer = null;
  let muted = false;
  let currentTrack = null;
  let drag = null;

  const audio = {
    start: $("#musicStart"), middle: $("#musicMiddle"), finale: $("#musicFinale")
  };

  function init() {
    setupCursor(); setupAudio(); setupStart(); setupStory(); setupFlowers(); setupClassroom(); setupForm();
    $("#finalWish").textContent = cfg.finalWish || "Chúc bạn một ngày 20/10 thật nhiều niềm vui!";
    $("#className").textContent = cfg.className || "lớp chúng mình";
    $("#replay").addEventListener("click", () => location.reload());
    $("#skipStory").addEventListener("click", openGame);
  }

  function setupAudio() {
    audio.start.src = cfg.music?.start || "assets/1.mp3";
    audio.middle.src = cfg.music?.middle || "assets/2.mp3";
    audio.finale.src = cfg.music?.finale || "assets/3.mp3";
    audio.start.volume = .82; audio.middle.volume = 0; audio.finale.volume = 0;
    $("#soundToggle").addEventListener("click", async () => {
      muted = !muted;
      $(".audio-dock").classList.toggle("muted", muted);
      $("#soundToggle").textContent = muted ? "♪" : "♫";
      Object.values(audio).forEach(a => { a.muted = muted; });
      if (!muted && currentTrack?.paused) currentTrack.play().catch(() => {});
    });
  }

  function playStartMusic() {
    if (currentTrack === audio.start && !audio.start.paused) return;
    currentTrack = audio.start; $("#trackLabel").textContent = "Nhạc mở đầu";
    audio.start.play().catch(() => {});
  }

  function crossfade(from, to, duration = 2200, toVolume = .72) {
    clearInterval(crossfade.timer);
    to.volume = 0; to.muted = muted; to.play().catch(() => {}); currentTrack = to;
    const start = performance.now();
    crossfade.timer = setInterval(() => {
      const p = clamp((performance.now() - start) / duration, 0, 1);
      from.volume = Math.max(0, (1 - p) * .82); to.volume = p * toVolume;
      if (p >= 1) { clearInterval(crossfade.timer); from.pause(); }
    }, 50);
  }

  function setupCursor() {
    if (!matchMedia("(pointer:fine)").matches) return;
    const cursor = $("#cursor"), inner = $("span", cursor);
    if (cfg.cursorImage) inner.innerHTML = `<img src="${cfg.cursorImage}" alt="">`; else inner.textContent = cfg.cursorEmoji || "🌷";
    document.body.classList.add("cursor-ready");
    addEventListener("pointermove", e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; cursor.style.opacity = 1; });
    addEventListener("pointerdown", e => { cursor.classList.add("active"); sparks(e.clientX, e.clientY, 5); });
    addEventListener("pointerup", () => cursor.classList.remove("active"));
  }

  function setupStart() {
    const button = $("#runawayStart"), hint = $("#startHint");
    const hints = ["Ơ kìa, trượt rồi 😝", "Nhanh tay hơn chút nữa!", "Sắp bắt được rồi…", "Rồi rồi, lần này cho bấm 🌷"];
    button.addEventListener("click", () => {
      playStartMusic();
      if (dodgeCount < 4) {
        const margin = 90;
        button.style.left = `${margin + Math.random() * Math.max(20, innerWidth - margin * 2)}px`;
        button.style.top = `${margin + Math.random() * Math.max(20, innerHeight - margin * 2)}px`;
        button.style.bottom = "auto"; hint.textContent = hints[dodgeCount++]; return;
      }
      crossfade(audio.start, audio.middle); $("#trackLabel").textContent = "Những kỷ niệm";
      showScreen("storyScreen"); startStory(); petals(25);
    });
  }

  function setupStory() {
    const stage = $("#slideStage"), dots = $("#slideDots");
    (cfg.slides || []).forEach((slide, i) => {
      const article = document.createElement("article"); article.className = "story-slide"; article.dataset.index = i;
      article.style.setProperty("--slide-color", ["#a43f54", "#654470", "#955c34", "#365b52", "#98495e"][i % 5]);
      const copy = document.createElement("div"); copy.className = "story-copy";
      copy.innerHTML = `<span class="kicker"></span><h2><span></span><em></em></h2><p></p>`;
      $(".kicker", copy).textContent = slide.kicker; $("h2 span", copy).textContent = slide.title; $("h2 em", copy).textContent = slide.accent; $("p", copy).textContent = slide.note;
      const photos = document.createElement("div"); photos.className = "photo-composition";
      slide.photos.forEach((src, p) => {
        const frame = document.createElement("div"); frame.className = "slide-photo";
        const layouts = [{x:"8%",y:"8%",w:"55%",h:"56%",r:"-6deg"},{x:"47%",y:"35%",w:"48%",h:"52%",r:"5deg"},{x:"27%",y:"54%",w:"42%",h:"39%",r:"-2deg"}]; const l = layouts[p % 3];
        Object.entries(l).forEach(([k,v]) => frame.style.setProperty(`--${k}`,v)); frame.style.setProperty("--delay",`${.18+p*.14}s`);
        const img = document.createElement("img"); img.src = src; img.alt = `Kỷ niệm ${i + 1}.${p + 1}`; frame.appendChild(img); photos.appendChild(frame);
      });
      article.append(copy, photos); stage.appendChild(article); dots.appendChild(document.createElement("i"));
    });
  }

  function startStory() { slideIndex = 0; showSlide(0); }
  function showSlide(index) {
    clearTimeout(slideTimer); const slides = $$(".story-slide"), dots = $$(".slide-dots i");
    slides.forEach((s,i) => { s.classList.remove("active","leaving"); if(i===index)s.classList.add("active"); }); dots.forEach((d,i)=>d.classList.toggle("active",i===index));
    const bar = $("#storyProgress"), duration = cfg.slideDuration || 5200; bar.classList.remove("running"); bar.style.setProperty("--duration",`${duration}ms`); void bar.offsetWidth; bar.classList.add("running");
    slideTimer = setTimeout(() => {
      slides[index].classList.add("leaving");
      setTimeout(() => { if (index + 1 < slides.length) { slideIndex = index + 1; showSlide(slideIndex); } else openGame(); }, 760);
    }, duration);
  }

  function openGame() {
    clearTimeout(slideTimer); showScreen("gameScreen"); loadClassroom(); clearInterval(pollTimer); pollTimer = setInterval(loadClassroom, 2500); $("#trackLabel").textContent = "Những kỷ niệm";
  }

  function flowerArt(typeId) {
    const f = flowerTypes.find(x => x.id === typeId) || flowerTypes[0], el = document.createElement("span");
    el.className = `flower-art ${f.cls}`; el.style.setProperty("--petal",f.petal); el.style.setProperty("--center",f.center); el.title = f.name; return el;
  }

  function setupFlowers() {
    const choices = $("#flowerChoices");
    flowerTypes.forEach(f => { const b=document.createElement("button"); b.type="button"; b.className="flower-choice"; b.setAttribute("aria-label",`Kéo ${f.name}`); b.appendChild(flowerArt(f.id)); b.addEventListener("pointerdown",e=>beginFlowerDrag(e,f.id,null)); choices.appendChild(b); });
    $("#clearBouquet").addEventListener("click",()=>{arrangement=[];renderArrangement();});
  }

  function beginFlowerDrag(e, type, index) {
    e.preventDefault(); if (index == null && arrangement.length >= 12) { toast("Bó hoa đã đủ 12 bông rồi!"); return; }
    drag={type,index,pointerId:e.pointerId}; const ghost=$("#dragGhost"); ghost.innerHTML=""; ghost.appendChild(flowerArt(type)); ghost.classList.add("dragging"); moveGhost(e);
    addEventListener("pointermove",onFlowerMove); addEventListener("pointerup",endFlowerDrag,{once:true});
  }
  function onFlowerMove(e){if(!drag||e.pointerId!==drag.pointerId)return;moveGhost(e);$("#bouquetDrop").classList.toggle("drag-over",pointIn(e,$("#bouquetDrop")));}
  function moveGhost(e){const g=$("#dragGhost");g.style.left=`${e.clientX}px`;g.style.top=`${e.clientY}px`;}
  function endFlowerDrag(e){removeEventListener("pointermove",onFlowerMove);const drop=$("#bouquetDrop"),area=$("#arrangement");drop.classList.remove("drag-over");$("#dragGhost").classList.remove("dragging");
    if(drag&&pointIn(e,drop)){const r=area.getBoundingClientRect(),x=clamp((e.clientX-r.left)/r.width*100,5,95),y=clamp((e.clientY-r.top)/r.height*100,6,94);const item={type:drag.type,x:+x.toFixed(2),y:+y.toFixed(2),r:Math.round(-24+Math.random()*48)};if(drag.index==null)arrangement.push(item);else arrangement[drag.index]=item;renderArrangement();}
    drag=null;
  }
  function pointIn(e,el){const r=el.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;}
  function renderArrangement(){const wrap=$("#arrangement");wrap.innerHTML="";$("#dropHint").hidden=arrangement.length>0;arrangement.forEach((item,i)=>{const el=document.createElement("button");el.type="button";el.className="placed-flower";el.style.setProperty("--x",`${item.x}%`);el.style.setProperty("--y",`${item.y}%`);el.style.setProperty("--r",`${item.r}deg`);el.setAttribute("aria-label","Kéo lại vị trí bông hoa");el.appendChild(flowerArt(item.type));el.addEventListener("pointerdown",e=>beginFlowerDrag(e,item.type,i));wrap.appendChild(el);});}

  function setupClassroom(){buildDeskGrid($("#deskGrid"),true);buildBoardRoom();}
  function buildDeskGrid(container,interactive){container.innerHTML="";for(let deskNo=1;deskNo<=24;deskNo++){const desk=document.createElement("div");desk.className="desk";const n=document.createElement("span");n.className="desk-number";n.textContent=deskNo;desk.appendChild(n);[0,1].forEach(side=>{const seatNo=(deskNo-1)*2+side+1,seat=document.createElement("button");seat.type="button";seat.className=`seat ${side===0?"left":"right"}`;seat.dataset.seat=seatNo;seat.setAttribute("aria-label",`Ghế ${seatNo}`);if(interactive)seat.addEventListener("click",()=>chooseSeat(seatNo));else seat.disabled=true;desk.appendChild(seat);});container.appendChild(desk);}}
  function buildBoardRoom(){const room=$("#boardRoom");room.innerHTML='<div class="teacher-zone"><span>BẢNG 20102026</span><div class="teacher-desk">Bàn giáo viên</div></div><div class="desk-grid"></div><div class="room-door">CỬA</div>';buildDeskGrid($(".desk-grid",room),false);}
  function chooseSeat(seat){if(records.some(r=>Number(r.seat)===seat)){toast("Ghế này đã có người chọn rồi");return;}selectedSeat=seat;$("#seatChoice").textContent=`Đã chọn ghế ${seat}`;updateSeats();}
  function updateSeats(){[...$$('[data-seat]')].forEach(btn=>{const seat=Number(btn.dataset.seat),record=records.find(r=>Number(r.seat)===seat);btn.classList.toggle("taken",!!record);btn.classList.toggle("selected",!record&&seat===selectedSeat);btn.disabled=!!record;btn.title=record?`Ghế ${seat}: ${record.name}`:`Ghế ${seat}`;});if(selectedSeat&&records.some(r=>Number(r.seat)===selectedSeat)){selectedSeat=null;$("#seatChoice").textContent="Ghế vừa có người chọn — chọn ghế khác nhé";}}

  async function loadClassroom(){try{const res=await fetch("/api/classroom",{cache:"no-store"});if(!res.ok)throw new Error("api");const data=await res.json();records=data.records||[];$("#onlineStatus").textContent=`${records.length}/48 ghế · cập nhật trực tiếp`;$("#onlineStatus").dataset.mode="live";}catch{records=JSON.parse(localStorage.getItem("classroom-20102026")||"[]");$("#onlineStatus").textContent="bản thử trên máy này";$("#onlineStatus").dataset.mode="local";}updateSeats();renderRecent();}
  async function saveRecord(record){try{const res=await fetch("/api/classroom",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(record)});if(res.status===409)throw new Error("SEAT_TAKEN");if(!res.ok)throw new Error("API_ERROR");return await res.json();}catch(err){if(err.message==="SEAT_TAKEN")throw err;const local=JSON.parse(localStorage.getItem("classroom-20102026")||"[]");if(local.some(r=>Number(r.seat)===record.seat))throw new Error("SEAT_TAKEN");local.unshift({...record,id:Date.now(),created_at:new Date().toISOString()});localStorage.setItem("classroom-20102026",JSON.stringify(local.slice(0,48)));return{local:true};}}

  function setupForm(){$("#nameForm").addEventListener("submit",async e=>{e.preventDefault();const status=$("#formStatus"),name=$("#recipientName").value.trim();if(arrangement.length<3){status.textContent="Kéo ít nhất 3 bông hoa vào bó nhé.";return;}if(!selectedSeat){status.textContent="Chọn một chiếc ghế trống bên phải nhé.";return;}if(!name){status.textContent="Nhập tên của bạn nhé.";return;}status.textContent="Đang đặt bó hoa vào lớp…";try{await saveRecord({name:name.slice(0,30),seat:selectedSeat,flowers:arrangement.map(x=>x.type),arrangement});await loadClassroom();showBoard();}catch(err){status.textContent=err.message==="SEAT_TAKEN"?"Ghế vừa có người chọn trước. Chọn ghế khác nhé!":"Có lỗi nhỏ, thử lại giúp mình nhé.";await loadClassroom();}});}

  function renderRecent(){const box=$("#recentBouquets");if(!box)return;box.innerHTML="";records.slice(0,5).forEach((r,i)=>{const card=document.createElement("div");card.className="recent-card";card.style.setProperty("--r",`${[-2,1,-1,2][i%4]}deg`);const mini=document.createElement("div");mini.className="mini-flowers";(r.flowers||[]).slice(0,5).forEach(type=>mini.appendChild(flowerArt(type)));const b=document.createElement("b");b.textContent=`Hoa của ${r.name}`;const s=document.createElement("span");s.textContent=`Ghế ${r.seat}`;card.append(mini,b,s);box.appendChild(card);});}
  function showBoard(){clearInterval(pollTimer);showScreen("boardScreen");updateSeats();renderRecent();pollTimer=setInterval(loadClassroom,2500);$("#trackLabel").textContent="Khoảnh khắc cuối";setTimeout(startFinaleSequence,3800);}
  function startFinaleSequence(){audio.finale.currentTime=0;audio.finale.volume=0;audio.finale.muted=muted;audio.finale.play().catch(()=>{});currentTrack=audio.finale;const label=$("#finaleStatus"),started=performance.now(),fadeMs=4200,dropAt=(cfg.music?.finalDropAt||7.8)*1000;clearInterval(crossfade.timer);const fade=setInterval(()=>{const p=clamp((performance.now()-started)/fadeMs,0,1);audio.finale.volume=p;audio.middle.volume=Math.max(.12,.72*(1-p));if(p>=1)clearInterval(fade);},50);const words=[[0,"Có một điều cuối cùng…"],[2200,"Dành riêng cho các bạn nữ…"],[4500,"Sẵn sàng nhé…"]];words.forEach(([t,w])=>setTimeout(()=>label.textContent=w,t));setTimeout(explodeFinal,dropAt);}
  function explodeFinal(){audio.middle.pause();audio.finale.volume=1;showScreen("finalScreen");requestAnimationFrame(()=>$("#finalScreen").classList.add("boom"));petals(120);sparks(innerWidth/2,innerHeight/2,40);$("#trackLabel").textContent="Lời chúc 20/10";}

  function showScreen(id){["startScreen","storyScreen","gameScreen","boardScreen","finalScreen"].forEach(x=>$("#"+x).hidden=x!==id);scrollTo(0,0);}
  function sparks(x,y,count=8){for(let i=0;i<count;i++){const s=document.createElement("i");s.className="spark";s.textContent=i%3?"✦":"♡";s.style.left=`${x}px`;s.style.top=`${y}px`;s.style.color=i%2?"#ee657c":"#ffd45f";s.style.setProperty("--dx",`${(Math.random()-.5)*240}px`);s.style.setProperty("--dy",`${(Math.random()-.62)*220}px`);$("#effects").appendChild(s);setTimeout(()=>s.remove(),800);}}
  function petals(count){const colors=["#ee657c","#f7a4b3","#f2c45e","#b8d3c2"];for(let i=0;i<count;i++){const p=document.createElement("i");p.className="petal";p.style.left=`${Math.random()*100}%`;p.style.setProperty("--c",colors[i%colors.length]);p.style.setProperty("--d",`${4+Math.random()*5}s`);p.style.setProperty("--drift",`${(Math.random()-.5)*260}px`);p.style.animationDelay=`${Math.random()*2}s`;$("#effects").appendChild(p);setTimeout(()=>p.remove(),11000);}}
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2300);}
  init();
})();
