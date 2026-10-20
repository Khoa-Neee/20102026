(() => {
  "use strict";
  const cfg = window.GIFT_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const audio = { start: $("#musicStart"), middle: $("#musicMiddle"), finale: $("#musicFinale") };
  let dodgeCount = 0, slideTimer, clockTimer, finaleTimer, muted = false, currentTrack = null, storyStarted = 0, finaleStarted = false;

  function init() {
    setupCursor(); setupAudio(); buildSlides(); setupStart();
    $("#finalWish").textContent = cfg.finalWish || "Chúc bạn một ngày 20/10 thật nhiều niềm vui!";
    $("#className").textContent = cfg.className || "lớp chúng mình";
    $("#replay").addEventListener("click", () => location.reload());
  }

  function setupAudio() {
    audio.start.src = cfg.music?.start || "assets/1.mp3"; audio.middle.src = cfg.music?.middle || "assets/2.mp3"; audio.finale.src = cfg.music?.finale || "assets/3.mp3";
    audio.start.volume = .82; audio.middle.volume = 0; audio.finale.volume = 0;
    $("#soundToggle").addEventListener("click", () => { muted = !muted; $(".audio-dock").classList.toggle("muted", muted); Object.values(audio).forEach(a => a.muted = muted); if (!muted && currentTrack?.paused) currentTrack.play().catch(() => {}); });
  }
  function startOpeningMusic() { if (currentTrack === audio.start && !audio.start.paused) return; currentTrack = audio.start; audio.start.play().catch(() => {}); }
  function crossfade(from, to, duration, target = .72) { clearInterval(crossfade.timer); to.volume = 0; to.muted = muted; to.play().catch(() => {}); currentTrack = to; const began = performance.now(); crossfade.timer = setInterval(() => { const p = clamp((performance.now() - began) / duration, 0, 1); from.volume = .82 * (1 - p); to.volume = target * p; if (p >= 1) { clearInterval(crossfade.timer); from.pause(); } }, 50); }

  function setupCursor() { if (!matchMedia("(pointer:fine)").matches) return; const cursor = $("#cursor"); document.body.classList.add("cursor-ready"); addEventListener("pointermove", e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; cursor.style.opacity = 1; }); addEventListener("pointerdown", e => { cursor.classList.add("active"); sparks(e.clientX, e.clientY, 5); }); addEventListener("pointerup", () => cursor.classList.remove("active")); }
  function setupStart() { const button = $("#runawayStart"), hint = $("#startHint"), screen = $("#startScreen"), hints = ["Ơ kìa, trượt rồi 😝", "Nhanh tay hơn chút nữa!", "Sắp bắt được rồi…", "Rồi rồi, lần này cho bấm 🌷"]; const moveButton = () => { const rect = button.getBoundingClientRect(); const safeX = Math.max(18, Math.min(72, innerWidth * .06)); const safeTop = Math.max(72, innerHeight * .14); const safeBottom = Math.max(68, innerHeight * .17); const maxX = Math.max(safeX, innerWidth - rect.width - safeX); const maxY = Math.max(safeTop, innerHeight - rect.height - safeBottom); button.classList.add("is-running"); button.style.left = `${safeX + Math.random() * Math.max(0, maxX - safeX)}px`; button.style.top = `${safeTop + Math.random() * Math.max(0, maxY - safeTop)}px`; hint.textContent = hints[dodgeCount++]; }; button.addEventListener("click", () => { startOpeningMusic(); if (dodgeCount < 4) { moveButton(); screen.classList.add("has-runaway"); return; } crossfade(audio.start, audio.middle, 2400); $("#trackLabel").textContent = "Cuốn phim của lớp"; show("storyScreen"); startStory(); petals(24); }); }

  function buildSlides() {
    const stage = $("#slideStage"), dots = $("#slideDots");
    (cfg.slides || []).forEach((slide, index) => {
      const article = document.createElement("article"); article.className = `story-slide variant-${slide.variant || "scrap"}`; article.dataset.index = index;
      article.style.setProperty("--glow", ["#9d4054","#54416f","#8b5636","#385a54","#9a485e"][index % 5]); article.style.setProperty("--gx", `${62 + index % 3 * 10}%`); article.style.setProperty("--gy", `${18 + index % 4 * 8}%`);
      const backdrop = document.createElement("div"); backdrop.className = "slide-backdrop"; backdrop.style.backgroundImage = `url("${slide.background || slide.photos[0]}")`; backdrop.setAttribute("aria-hidden", "true");
      const copy = document.createElement("div"); copy.className = "story-copy"; copy.innerHTML = '<span class="kicker"></span><h2><span></span><em></em></h2><p></p>'; $(".kicker", copy).textContent = slide.kicker; $("h2 span", copy).textContent = slide.title; $("h2 em", copy).textContent = slide.accent; $("p", copy).textContent = slide.note;
      const composition = document.createElement("div"); composition.className = "composition"; slide.photos.forEach((src, p) => { const frame = document.createElement("div"); frame.className = "frame"; frame.style.setProperty("--delay", `${.14 + p * .15}s`); frame.style.setProperty("--r", `${[-5,4,-2,7,-8][p%5]}deg`); const img = document.createElement("img"); img.src = src; img.alt = `Kỷ niệm ${index + 1}.${p + 1}`; frame.appendChild(img); composition.appendChild(frame); }); article.append(backdrop, copy, composition); stage.appendChild(article); dots.appendChild(document.createElement("i"));
    });
  }

  function startStory() { storyStarted = performance.now(); finaleStarted = false; const total = totalDuration(); showSlide(0); clockTimer = setInterval(updateClock, 200); finaleTimer = setTimeout(startFinaleMusic, Math.max(0, total - (cfg.finaleLead || 21000))); }
  function totalDuration() { return (cfg.slides?.length || 0) * (cfg.slideDuration || 8000); }
  function showSlide(index) { clearTimeout(slideTimer); const slides = $$(".story-slide"), dots = $$(".slide-dots i"), duration = cfg.slideDuration || 8000; slides.forEach((s,i) => { s.classList.remove("active","leaving"); if (i === index) s.classList.add("active"); }); dots.forEach((d,i) => d.classList.toggle("active", i === index)); slideTimer = setTimeout(() => { slides[index].classList.add("leaving"); setTimeout(() => { if (index + 1 < slides.length) showSlide(index + 1); else explodeFinal(); }, 780); }, Math.max(500, duration - 780)); }
  function updateClock() { const total = totalDuration(), elapsed = clamp(performance.now() - storyStarted, 0, total); $("#timelineFill").style.width = `${elapsed / total * 100}%`; $("#storyClock").textContent = `${formatTime(elapsed)} / ${formatTime(total)}`; }
  function formatTime(ms) { const sec = Math.floor(ms / 1000); return `${String(Math.floor(sec / 60)).padStart(2,"0")}:${String(sec % 60).padStart(2,"0")}`; }
  function startFinaleMusic() { if (finaleStarted) return; finaleStarted = true; audio.finale.currentTime = 0; audio.finale.volume = 0; audio.finale.muted = muted; audio.finale.play().catch(() => {}); currentTrack = audio.finale; $("#trackLabel").textContent = "Đoạn cuối · sắp cao trào"; const began = performance.now(), fade = 10000; clearInterval(crossfade.timer); crossfade.timer = setInterval(() => { const p = clamp((performance.now() - began) / fade, 0, 1); audio.finale.volume = p; audio.middle.volume = Math.max(.06, .72 * (1 - p)); if (p >= 1) clearInterval(crossfade.timer); }, 50); }
  function explodeFinal() { clearTimeout(slideTimer); clearTimeout(finaleTimer); clearInterval(clockTimer); if (!finaleStarted) startFinaleMusic(); audio.middle.pause(); audio.finale.volume = 1; show("finalScreen"); requestAnimationFrame(() => $("#finalScreen").classList.add("boom")); $("#trackLabel").textContent = "Lời chúc 20/10"; petals(130); sparks(innerWidth/2, innerHeight/2, 45); }
  function show(id) { ["startScreen","storyScreen","finalScreen"].forEach(x => $("#"+x).hidden = x !== id); }
  function sparks(x,y,count) { for (let i=0;i<count;i++) { const s=document.createElement("i"); s.className="spark"; s.textContent=i%3?"✦":"♡"; s.style.left=`${x}px`; s.style.top=`${y}px`; s.style.color=i%2?"#ef667e":"#ffd45f"; s.style.setProperty("--dx",`${(Math.random()-.5)*280}px`); s.style.setProperty("--dy",`${(Math.random()-.62)*240}px`); $("#effects").appendChild(s); setTimeout(()=>s.remove(),850); } }
  function petals(count) { const colors=["#ef667e","#f7a4b3","#f2c45e","#b8d3c2"]; for(let i=0;i<count;i++){const p=document.createElement("i");p.className="petal";p.style.left=`${Math.random()*100}%`;p.style.setProperty("--c",colors[i%4]);p.style.setProperty("--d",`${4+Math.random()*5}s`);p.style.setProperty("--drift",`${(Math.random()-.5)*280}px`);p.style.animationDelay=`${Math.random()*2}s`;$("#effects").appendChild(p);setTimeout(()=>p.remove(),11000);}}
  init();
})();
