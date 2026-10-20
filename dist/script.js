(() => {
  "use strict";

  const cfg = window.GIFT_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scenes = ["memoryScene", "transitionScene", "gameScene", "boardScene", "finalScene"];
  const flowers = [
    { id: "tulip", emoji: "🌷", name: "Tulip" },
    { id: "sunflower", emoji: "🌻", name: "Hướng dương" },
    { id: "rose", emoji: "🌹", name: "Hoa hồng" },
    { id: "daisy", emoji: "🌼", name: "Cúc họa mi" },
    { id: "hibiscus", emoji: "🌺", name: "Dâm bụt" },
    { id: "cherry", emoji: "🌸", name: "Anh đào" },
    { id: "lavender", emoji: "🪻", name: "Oải hương" },
    { id: "bouquet", emoji: "💐", name: "Hoa nhỏ" }
  ];
  const chosen = [];
  let memoryIndex = 0;
  let dodgeCount = 0;
  let records = [];

  function init() {
    setupCursor();
    setupMusic();
    setupStart();
    setupMemories();
    setupWorkshop();
    setupNavigation();
    $("#finalWish").textContent = cfg.finalWish || "Chúc bạn luôn vui, tự tin và rực rỡ theo cách của riêng mình!";
    $("#className").textContent = cfg.className || "lớp chúng mình";
  }

  function setupCursor() {
    if (!matchMedia("(pointer: fine)").matches) return;
    const cursor = $("#cursor");
    const inner = $("span", cursor);
    if (cfg.cursorImage) inner.outerHTML = `<img src="${escapeAttr(cfg.cursorImage)}" alt="">`;
    else inner.textContent = cfg.cursorEmoji || "🌷";
    document.body.classList.add("cursor-ready");
    addEventListener("pointermove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.opacity = "1";
    });
    addEventListener("pointerdown", (event) => {
      cursor.classList.add("active");
      burstAt(event.clientX, event.clientY, 6);
    });
    addEventListener("pointerup", () => cursor.classList.remove("active"));
  }

  function burstAt(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "click-spark";
      spark.textContent = i % 2 ? "♡" : "✦";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.color = i % 2 ? "#ee647c" : "#e4a33a";
      spark.style.setProperty("--dx", `${(Math.random() - .5) * 110}px`);
      spark.style.setProperty("--dy", `${(Math.random() - .65) * 100}px`);
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  }

  function setupMusic() {
    const audio = $("#bgMusic");
    const toggle = $("#soundToggle");
    if (!cfg.musicFile) { toggle.hidden = true; return; }
    audio.src = cfg.musicFile;
    toggle.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); toggle.classList.add("playing"); toggle.textContent = "♫"; }
        catch { toast("Thêm file assets/music.mp3 để bật nhạc nhé"); }
      } else {
        audio.pause(); toggle.classList.remove("playing"); toggle.textContent = "♪";
      }
    });
    audio.addEventListener("error", () => { toggle.title = "Chưa có file nhạc — xem README"; }, { once: true });
  }

  function setupStart() {
    const button = $("#runawayStart");
    const hint = $("#startHint");
    const hints = ["Ơ kìa, trượt rồi 😝", "Nhanh tay hơn chút nữa!", "Sắp bắt được rồi đó…", "Thôi được, lần này cho bấm 🌷"];
    button.addEventListener("click", () => {
      if (dodgeCount < 4) {
        const margin = 95;
        const x = margin + Math.random() * Math.max(20, innerWidth - margin * 2);
        const y = margin + Math.random() * Math.max(20, innerHeight - margin * 2);
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.bottom = "auto";
        hint.textContent = hints[dodgeCount];
        dodgeCount++;
        return;
      }
      startExperience();
    });
  }

  function startExperience() {
    $("#startScreen").animate([{ opacity: 1 }, { opacity: 0, transform: "scale(1.04)" }], { duration: 650, fill: "forwards" })
      .finished.then(() => {
        $("#startScreen").hidden = true;
        showScene("memoryScene");
        rainPetals(26);
        const audio = $("#bgMusic");
        if (cfg.musicFile) audio.play().then(() => { $("#soundToggle").classList.add("playing"); $("#soundToggle").textContent = "♫"; }).catch(() => {});
      });
  }

  function setupMemories() {
    const button = $("#nextMemory");
    button.addEventListener("click", () => {
      const photos = cfg.photos || [];
      if (memoryIndex < photos.length) {
        addMemoryCard(photos[memoryIndex], memoryIndex);
        memoryIndex++;
        $("#memoryProgress").style.width = `${memoryIndex / photos.length * 100}%`;
        button.innerHTML = memoryIndex === photos.length ? "Đi tiếp thôi <span>→</span>" : `Mở tấm tiếp theo <span>${memoryIndex + 1}/${photos.length}</span>`;
      } else {
        showScene("transitionScene");
      }
    });
  }

  function addMemoryCard(photo, index) {
    const stage = $("#photoStage");
    const card = document.createElement("article");
    const positions = [
      { x: 25, y: 40, r: -7 }, { x: 70, y: 38, r: 5 },
      { x: 42, y: 66, r: 3 }, { x: 79, y: 70, r: -4 }
    ];
    const pos = positions[index % positions.length];
    card.className = "memory-card";
    card.style.setProperty("--x", `${pos.x}%`);
    card.style.setProperty("--y", `${pos.y}%`);
    card.style.setProperty("--rot", `${pos.r}deg`);
    const safeFile = escapeAttr(photo.file || "");
    card.innerHTML = `
      <div class="memory-photo">
        <img src="${safeFile}" alt="${escapeAttr(photo.label || "Ảnh kỷ niệm")}">
        <div class="photo-placeholder"><b>Ảnh của bọn mình</b><small>${safeFile || "assets/photos/photo.jpg"}</small></div>
      </div>
      <h3>${escapeHTML(photo.label || "Một kỷ niệm đẹp")}</h3>
      <p>${escapeHTML(photo.note || "Cảm ơn vì đã ở đây.")}</p>`;
    const img = $("img", card);
    const placeholder = $(".photo-placeholder", card);
    img.addEventListener("load", () => { placeholder.hidden = true; });
    img.addEventListener("error", () => { img.remove(); });
    stage.appendChild(card);
    burstAt(innerWidth / 2, innerHeight / 2, 10);
  }

  function setupWorkshop() {
    const choices = $("#flowerChoices");
    flowers.forEach((flower) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "flower-choice";
      button.draggable = true;
      button.dataset.flower = flower.id;
      button.innerHTML = `<span aria-hidden="true">${flower.emoji}</span><span class="sr-only">${flower.name}</span>`;
      button.setAttribute("aria-label", `Thêm ${flower.name}`);
      button.addEventListener("click", () => addFlower(flower.id));
      button.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", flower.id));
      choices.appendChild(button);
    });
    const drop = $("#bouquetDrop");
    drop.addEventListener("dragover", (event) => { event.preventDefault(); drop.classList.add("drag-over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("drag-over"));
    drop.addEventListener("drop", (event) => {
      event.preventDefault(); drop.classList.remove("drag-over"); addFlower(event.dataTransfer.getData("text/plain"));
    });
    $("#clearBouquet").addEventListener("click", () => { chosen.splice(0); renderArrangement(); });
    $("#nameForm").addEventListener("submit", saveBouquet);
  }

  function addFlower(id) {
    if (chosen.length >= 12) { toast("Bó hoa đầy rồi — đẹp lắm đó!"); return; }
    const flower = flowers.find((item) => item.id === id);
    if (!flower) return;
    chosen.push(flower);
    renderArrangement();
    burstAt(innerWidth / 2, innerHeight / 2, 4);
  }

  function renderArrangement() {
    const wrap = $("#arrangement");
    wrap.innerHTML = "";
    $("#dropHint").hidden = chosen.length > 0;
    chosen.forEach((flower, index) => {
      const el = document.createElement("span");
      const angle = (index / Math.max(chosen.length, 1)) * Math.PI * 2;
      const ring = 18 + (index % 3) * 10;
      const x = 50 + Math.cos(angle) * ring;
      const y = 48 + Math.sin(angle) * ring * .65 - (index % 2) * 8;
      el.className = "placed-flower";
      el.textContent = flower.emoji;
      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
      el.style.setProperty("--rot", `${-22 + (index * 19) % 44}deg`);
      wrap.appendChild(el);
    });
  }

  async function saveBouquet(event) {
    event.preventDefault();
    const name = $("#recipientName").value.trim();
    const status = $("#formStatus");
    if (chosen.length < 3) { status.textContent = "Hái ít nhất 3 bông hoa đã nhé 🌷"; return; }
    if (!name) { status.textContent = "Điền tên để mọi người biết bó hoa của ai nhé."; return; }
    const record = { name: name.slice(0, 30), flowers: chosen.map((item) => item.emoji).join(""), created_at: new Date().toISOString() };
    status.textContent = "Đang ghim bó hoa lên bảng…";
    try {
      await createRecord(record);
      status.textContent = "Đã ghim thành công!";
      await loadBoard();
      showScene("boardScene");
      rainPetals(38);
    } catch (error) {
      console.error(error);
      status.textContent = "Có lỗi nhỏ, thử lại giúp mình nhé.";
    }
  }

  async function createRecord(record) {
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      const response = await fetch(`${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/bouquets`, {
        method: "POST",
        headers: supabaseHeaders({ Prefer: "return=minimal" }),
        body: JSON.stringify(record)
      });
      if (!response.ok) throw new Error(`Supabase POST ${response.status}`);
      return;
    }
    const local = JSON.parse(localStorage.getItem("flower-board-20-10") || "[]");
    local.unshift({ ...record, id: crypto.randomUUID?.() || String(Date.now()) });
    localStorage.setItem("flower-board-20-10", JSON.stringify(local.slice(0, 40)));
  }

  async function loadBoard() {
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      const response = await fetch(`${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/bouquets?select=id,name,flowers,created_at&order=created_at.desc&limit=40`, { headers: supabaseHeaders() });
      if (!response.ok) throw new Error(`Supabase GET ${response.status}`);
      records = await response.json();
      $("#boardMode").textContent = "Bảng chung của cả lớp — mọi thiết bị đều thấy ✿";
    } else {
      records = JSON.parse(localStorage.getItem("flower-board-20-10") || "[]");
      $("#boardMode").textContent = "Bản xem thử đang lưu trên thiết bị này · kết nối bảng chung theo README ✿";
    }
    renderBoard();
  }

  function renderBoard() {
    const board = $("#bouquetBoard");
    board.innerHTML = "";
    if (!records.length) {
      board.innerHTML = `<div class="board-empty">Chưa có bó hoa nào. Bạn sẽ là người đầu tiên chứ? 🌷</div>`;
      return;
    }
    const colors = ["#ffefaa", "#ffd8df", "#d8efdf", "#dbe9ff", "#f6d9ff"];
    records.forEach((record, index) => {
      const note = document.createElement("article");
      note.className = "board-note";
      note.style.setProperty("--note", colors[index % colors.length]);
      note.style.setProperty("--note-rot", `${[-2, 1.5, -1, 2.4][index % 4]}deg`);
      const date = new Date(record.created_at);
      note.innerHTML = `<div class="board-flowers">${escapeHTML(record.flowers)}</div><h3>Đây là hoa của ${escapeHTML(record.name)}</h3><time>${date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</time>`;
      board.appendChild(note);
    });
  }

  function supabaseHeaders(extra = {}) {
    return { "Content-Type": "application/json", apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}`, ...extra };
  }

  function setupNavigation() {
    $("#goToGame").addEventListener("click", () => showScene("gameScene"));
    $("#toFinal").addEventListener("click", () => { showScene("finalScene"); rainPetals(70); });
    $("#replay").addEventListener("click", () => location.reload());
  }

  function showScene(id) {
    scenes.forEach((sceneId) => { $("#" + sceneId).hidden = sceneId !== id; });
    const target = $("#" + id);
    target.hidden = false;
    scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => $$(".reveal", target).forEach((el, index) => setTimeout(() => el.classList.add("visible"), index * 110)));
  }

  function rainPetals(count) {
    const container = $("#petals");
    const colors = ["#ee647c", "#f5a4b2", "#f2c45e", "#b8d3c2"];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("i");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty("--c", colors[i % colors.length]);
      petal.style.setProperty("--d", `${4 + Math.random() * 5}s`);
      petal.style.setProperty("--drift", `${(Math.random() - .5) * 240}px`);
      petal.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(petal);
      setTimeout(() => petal.remove(), 11000);
    }
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }
  function escapeAttr(value) { return escapeHTML(value).replace(/`/g, "&#96;"); }

  init();
})();
