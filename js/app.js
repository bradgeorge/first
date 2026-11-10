/* THE ROSENBERG FILE — engine
   A camera flies across a "world" layer of papers. Each story step is one sheet. */
(function () {
  "use strict";

  const IMG = "assets/img/";
  const STORE_KEY = "rosenberg-file-v1";
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- seeded random ---------------- */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const R = rng(1953);
  const rr = (a, b) => a + R() * (b - a);

  /* ---------------- sound (synthesised paper sounds) ---------------- */
  const Sfx = {
    ctx: null, noise: null, on: true,
    init() {
      if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        const len = this.ctx.sampleRate * 2;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = w * 0.6 + last * 2.2; }
        this.noise = buf;
      } catch (e) { this.ctx = null; }
    },
    burst({ t = 0, dur = 0.15, type = "bandpass", f = 2500, f2 = null, q = 0.8, vol = 0.4, attack = 0.005 }) {
      if (!this.on || !this.ctx || !this.noise) return;
      const c = this.ctx, now = c.currentTime + t;
      const src = c.createBufferSource(); src.buffer = this.noise;
      const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, now); fl.Q.value = q;
      if (f2) fl.frequency.exponentialRampToValueAtTime(f2, now + dur);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(vol, now + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(fl); fl.connect(g); g.connect(c.destination);
      src.start(now, Math.random() * 1.5, dur + 0.05);
    },
    tone({ t = 0, f = 90, f2 = 40, dur = 0.2, vol = 0.5, type = "sine" }) {
      if (!this.on || !this.ctx) return;
      const c = this.ctx, now = c.currentTime + t;
      const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, now); o.frequency.exponentialRampToValueAtTime(f2, now + dur);
      const g = c.createGain(); g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); g.connect(c.destination); o.start(now); o.stop(now + dur + 0.02);
    },
    rustle() { for (let i = 0; i < 5; i++) this.burst({ t: i * 0.05 + Math.random() * 0.04, dur: 0.06 + Math.random() * 0.08, f: 1800 + Math.random() * 2600, q: 1.2, vol: 0.12 + Math.random() * 0.12 }); },
    slide() { this.burst({ dur: 0.55, type: "lowpass", f: 500, f2: 1600, q: 0.4, vol: 0.22, attack: 0.08 }); this.burst({ t: 0.42, dur: 0.12, f: 2600, q: 1, vol: 0.15 }); },
    flip() { this.burst({ dur: 0.22, type: "bandpass", f: 900, f2: 4200, q: 0.7, vol: 0.38, attack: 0.02 }); this.burst({ t: 0.16, dur: 0.07, f: 3200, q: 1.4, vol: 0.18 }); },
    tick() { this.burst({ dur: 0.035, type: "highpass", f: 3000, vol: 0.18, attack: 0.002 }); },
    click() { this.burst({ dur: 0.05, type: "bandpass", f: 2400, q: 2, vol: 0.3, attack: 0.002 }); this.tone({ f: 1400, f2: 900, dur: 0.04, vol: 0.05, type: "square" }); },
    tear() { for (let i = 0; i < 3; i++) this.burst({ t: i * 0.025, dur: 0.03 + Math.random() * 0.03, f: 1400 + Math.random() * 2400, q: 3, vol: 0.2 + Math.random() * 0.2, attack: 0.002 }); },
    rip() { for (let i = 0; i < 14; i++) this.burst({ t: i * 0.03, dur: 0.05, f: 1200 + Math.random() * 3000, q: 2, vol: 0.18 + Math.random() * 0.25, attack: 0.002 }); },
    stamp() { this.tone({ f: 120, f2: 38, dur: 0.22, vol: 0.7 }); this.burst({ dur: 0.08, type: "lowpass", f: 900, vol: 0.5, attack: 0.002 }); },
    pin() { this.tone({ f: 2200, f2: 1800, dur: 0.06, vol: 0.06, type: "triangle" }); this.burst({ dur: 0.04, f: 3500, q: 2, vol: 0.12, attack: 0.002 }); },
    wrong() { this.tone({ f: 180, f2: 120, dur: 0.25, vol: 0.18, type: "sawtooth" }); }
  };

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function fmt(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\{\{(.+?)\}\}/g, '<span class="declass" tabindex="0" role="button" aria-label="Classified. Tap to declassify.">$1</span>')
      .replace(/\[\[(.+?)\]\]/g, '<span class="redact" aria-hidden="true">$1</span>');
  }
  function photo(name, cap, o = {}) {
    const kb = o.kb || {};
    const style = [
      `--kbo:${kb.o || `${Math.round(rr(30, 70))}% ${Math.round(rr(30, 60))}%`}`,
      `--kbx:${kb.x || `${rr(-4, 4).toFixed(1)}%`}`,
      `--kby:${kb.y || `${rr(-3, 3).toFixed(1)}%`}`,
      `--kbs:${kb.s || rr(1.12, 1.22).toFixed(2)}`,
      `--kbd:${Math.round(rr(13, 20))}s`
    ].join(";");
    return `<div class="photo ${o.tall ? "tall" : ""} ${o.contain ? "contain" : ""} ${o.zoom ? "zoom" : ""}" style="${style}${o.zoom ? `;--z:${o.zoom};--kb0:${o.zoom}` : ""}"><img src="${IMG}${name}"${o.pos ? ` style="object-position:${o.pos}"` : ""} alt="${esc(cap || "")}" draggable="false" loading="lazy"></div>`;
  }
  function stampHTML(st) {
    return `<div class="stamp ${st.cls || ""}" style="left:${st.x};top:${st.y};--sr:${st.r || -10}deg">${esc(st.txt)}</div>`;
  }
  function refHTML(ref) { return ref ? `<div class="ref"><span>${esc(ref[0])}</span><span>${esc(ref[1])}</span></div>` : ""; }
  function bodyHTML(b) { return `<div class="body">${(Array.isArray(b) ? b : [b]).map((p) => `<p>${fmt(p)}</p>`).join("")}</div>`; }

  // replace images that fail to load with a labelled placeholder
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t && t.tagName === "IMG" && t.closest(".photo") && !t.dataset.failed) {
      t.dataset.failed = "1"; t.style.visibility = "hidden";
      const m = document.createElement("div"); m.className = "missing"; m.textContent = "PHOTO REMOVED FROM FILE";
      t.parentNode.appendChild(m);
    }
  }, true);

  /* ---------------- story flattening + desk layout ---------------- */
  const SECTIONS = window.STORY;
  const STEPS = [];
  SECTIONS.forEach((sec, s) => sec.steps.forEach((step, i) => STEPS.push({ s, i, step, sec })));

  (function layout() {
    let x = 0, y = 0, dir = 0;
    STEPS.forEach((st, k) => {
      if (k > 0) {
        const newSec = st.i === 0;
        if (newSec) dir += rr(-1.1, 1.1);
        else dir += rr(-0.5, 0.5);
        dir = Math.max(-1.3, Math.min(1.3, dir)); // keep travelling broadly to the right
        const d = newSec ? rr(820, 980) : rr(540, 640);
        x += Math.cos(dir) * d; y += Math.sin(dir) * d * 0.9;
      }
      st.x = Math.round(x); st.y = Math.round(y); st.r = +rr(-5, 5).toFixed(1);
    });
  })();

  /* ---------------- state ---------------- */
  const S = { cur: 0, maxSeen: 0, done: new Set(), cam: { x: 0, y: 0, r: 0, s: 1 }, flying: null };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && Number.isInteger(saved.maxSeen)) S.maxSeen = Math.min(saved.maxSeen, STEPS.length - 1);
  } catch (e) { /* storage unavailable */ }
  try { if (localStorage.getItem(STORE_KEY + "-mute") === "1") Sfx.on = false; } catch (e) {}
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify({ maxSeen: S.maxSeen })); } catch (e) {} }

  const world = $("#world"), desk = $("#desk"), viewport = $("#viewport");
  const btnBack = $("#back"), hint = $("#hint"), caseTitle = $("#casetitle");

  /* ---------------- camera ---------------- */
  function camTarget(st) {
    const el = st.el;
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    const top = $("#topbar").offsetHeight, bot = $("#bottombar").offsetHeight;
    const w = el.offsetWidth, h = el.offsetHeight;
    const availW = vw - 24, availH = vh - top - bot - 12;
    const s = Math.min(availW / w, availH / h, 1.35);
    return { x: st.x, y: st.y, r: -st.r * 0.85, s, cx: vw / 2, cy: top + availH / 2 + 6 };
  }
  const tf = (c) => `translate(${c.cx}px, ${c.cy}px) scale(${c.s}) rotate(${c.r}deg) translate(${-c.x}px, ${-c.y}px)`;
  function applyCam(c, animate) {
    const from = S.cam.cx === undefined ? c : S.cam;
    world.style.transform = tf(c);
    desk.style.backgroundPosition = `${-c.x * 0.25}px ${-c.y * 0.25}px, ${-c.x * 0.25}px 0, 0 0`;
    if (animate && !reduceMotion && world.animate) {
      if (S.flying) S.flying.cancel();
      const dist = Math.hypot(c.x - from.x, c.y - from.y);
      const zoomOut = Math.max(0.35, Math.min(from.s, c.s) * (dist > 700 ? 0.5 : 0.72));
      const mid = { cx: (from.cx + c.cx) / 2, cy: (from.cy + c.cy) / 2, x: (from.x + c.x) / 2, y: (from.y + c.y) / 2, r: (from.r + c.r) / 2 + (dist > 700 ? 6 : 2), s: zoomOut };
      S.flying = world.animate([{ transform: tf(from) }, { transform: tf(mid), offset: 0.45 }, { transform: tf(c) }],
        { duration: dist > 700 ? 1500 : 1100, easing: "cubic-bezier(.55,.05,.3,1)" });
      S.flying.onfinish = () => { S.flying = null; };
    }
    S.cam = c;
  }

  /* ---------------- props (desk clutter) ---------------- */
  const PROP_KINDS = ["ring", "pencil", "clip", "stray", "cup", "folderprop", "matches", "lens", "stray", "ring"];
  function addProps(st, k) {
    const pr = rng(k * 97 + 11);
    const n = k === 0 ? 3 : 1 + Math.floor(pr() * 2);
    for (let j = 0; j < n; j++) {
      const kind = k === 0 ? ["cup", "lens", "pencil"][j] : PROP_KINDS[Math.floor(pr() * PROP_KINDS.length)];
      const el = document.createElement("div");
      el.className = "prop " + kind;
      const ang = pr() * Math.PI * 2, dist = 330 + pr() * 160;
      el.style.left = st.x + Math.cos(ang) * dist * 1.1 + "px";
      el.style.top = st.y + Math.sin(ang) * dist + "px";
      el.style.setProperty("--r", Math.round(pr() * 360) + "deg");
      if (kind === "stray") {
        el.innerHTML = Array.from({ length: 14 }, () => `<i class="${pr() < 0.25 ? "r" : ""}" style="width:${50 + Math.round(pr() * 50)}%"></i>`).join("") +
          `<div class="stamp small" style="--sr:-8deg">${["Secret", "Confidential", "Eyes only", "Top secret"][Math.floor(pr() * 4)]}</div>`;
      } else if (kind === "folderprop") {
        el.innerHTML = `<div class="stamp">${["Classified", "Top secret", "Evidence"][Math.floor(pr() * 3)]}</div>`;
      } else if (kind === "matches") {
        el.textContent = "HOTEL\nSTATLER";
      }
      world.insertBefore(el, world.firstChild);
    }
  }

  /* ---------------- sheet renderers ---------------- */
  const HINTS = {
    cover: "Tap the folder to open the case",
    doc: "", polaroid: "", stack: "Swipe the photo away", package: "Drag down the tape to cut it open",
    quiz: "Make your guess", poll: "What do you think?", jello: "Drag the left half to its match",
    board: "Tap the photos in order", verdict: "Tap the pad to stamp the verdict", folder: "Tap the folder to open it", end: ""
  };
  const INTERACTIVE = new Set(["cover", "stack", "package", "quiz", "poll", "jello", "board", "verdict", "folder"]);

  function makeSheet(k) {
    const st = STEPS[k], step = st.step;
    const el = document.createElement("article");
    el.className = "sheet tone-" + (step.tone || "white");
    el.style.left = st.x + "px"; el.style.top = st.y + "px";
    el.style.setProperty("--r", st.r + "deg");
    el.style.setProperty("--tex-x", Math.round(rr(0, 600)) + "px");
    el.style.setProperty("--tex-y", Math.round(rr(0, 600)) + "px");
    el.setAttribute("aria-label", step.head || step.q || st.sec.title);
    const done = () => complete(k);
    const fn = R_[step.t] || R_.doc;
    fn(el, step, done, st);
    // tap-to-declassify bars (optional, never block progress)
    el.querySelectorAll(".declass").forEach((d) => {
      const open = () => { if (!d.classList.contains("open")) { d.classList.add("open"); d.removeAttribute("role"); d.removeAttribute("tabindex"); Sfx.tear(); } };
      d.addEventListener("click", open);
      d.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    return el;
  }

  const R_ = {
    cover(el, step, done) {
      el.className = "sheet folder";
      el.style.width = "440px";
      el.innerHTML = `
        <div class="back"></div>
        <div class="inside">
          <div class="ref"><span>Reader instructions</span><span>Form 1-A</span></div>
          <h2><small>How to read this file</small>Handle the evidence</h2>
          <div class="body">
            <p><b>Tap</b>, <b>drag</b> and <b>swipe</b> the papers on the desk. Black bars hide classified words. Tap them to declassify.</p>
            <p>When you finish reading, <b>tap anywhere</b> to move to the next document. <b>Back</b> takes you to the previous one.</p>
            <p>The <b>Case Index</b> lists every section. Sections you haven't reached stay classified.</p>
          </div>
          <p class="hand" style="margin-top:18px">Sound on for the full effect. — Agent on duty</p>
        </div>
        <div class="cover" data-tab="FILE No. 1953-R" role="button" tabindex="0" aria-label="Open the case file">
          <div class="holes"><i></i><i></i></div>
          <div class="label">SUBJECTS: ROSENBERG, Julius<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROSENBERG, Ethel<br>CHARGE: Conspiracy to commit espionage<br>OPENED: 1950 &nbsp;·&nbsp; CLOSED: 1953</div>
          <div class="title">The<br>Rosenberg<br>File</div>
          <div class="tapme">tap to open →</div>
          ${stampHTML({ txt: "Top Secret", x: "44%", y: "13%", r: -11 })}
          ${stampHTML({ txt: "Eyes only", cls: "small blue", x: "8%", y: "58%", r: 8 })}
        </div>`;
      el.style.minHeight = "600px";
      const cover = $(".cover", el);
      const open = () => { Sfx.init(); el.classList.add("open"); Sfx.flip(); setTimeout(() => Sfx.rustle(), 300); done(); };
      cover.addEventListener("click", open);
      cover.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    },

    doc(el, step) {
      el.innerHTML = `${refHTML(step.ref)}
        <h2>${step.kicker ? `<small>${esc(step.kicker)}</small>` : ""}${esc(step.head)}</h2>
        ${step.img ? `<div class="media-row">${photo(step.img, step.cap, step)}${step.cap ? `<div class="cap">${esc(step.cap)}</div>` : ""}<div class="tape" style="left:-18px;top:-10px;--tr:-28deg"></div></div>` : ""}
        ${bodyHTML(step.body)}
        ${(step.stamps || []).map(stampHTML).join("")}`;
    },

    folder(el, step, done) {
      el.className = "sheet folder";
      el.innerHTML = `
        <div class="back"></div>
        <div class="inside">
          <h2>${step.kicker ? `<small>${esc(step.kicker)}</small>` : ""}${esc(step.head)}</h2>
          ${bodyHTML(step.body)}
          ${(step.stamps || []).map(stampHTML).join("")}
        </div>
        <div class="cover" data-tab="${esc(step.tab || "FILE")}" role="button" tabindex="0" aria-label="Open folder">
          <div class="holes"><i></i><i></i></div>
          <div class="label">${esc(step.label).replace(/\n/g, "<br>")}</div>
          <div class="tapme">tap to open →</div>
          ${stampHTML({ txt: "Restricted", x: "40%", y: "52%", r: -9 })}
        </div>`;
      const cover = $(".cover", el);
      const open = () => { el.classList.add("open"); Sfx.flip(); done(); };
      cover.addEventListener("click", open);
      cover.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    },

    polaroid(el, step) {
      el.classList.add("tone-white");
      el.innerHTML = `
        <div class="polaroid" style="--pr:-2.5deg">${photo(step.img, step.cap, step)}<div class="cap">${esc(step.cap)}</div></div>
        <div class="tape" style="left:42%;top:14px;--tr:3deg"></div>
        <h2 style="margin-top:20px">${esc(step.head)}</h2>
        ${bodyHTML(step.body)}`;
    },

    stack(el, step, done) {
      const n = step.cards.length;
      el.innerHTML = `${refHTML(step.ref)}<h2>${esc(step.head)}</h2>
        <div class="stack">${step.cards.map((c, i) => `
          <div class="card" data-i="${i}" style="z-index:${n - i};transform:rotate(${(i % 2 ? 1 : -1) * (1 + i)}deg)" tabindex="${i === 0 ? 0 : -1}" role="button" aria-label="Photo ${i + 1} of ${n}. Swipe or press Enter for the next photo.">
            <div class="polaroid">${photo(c.img, c.cap, { kb: c.kb, pos: c.pos })}<div class="cap">${esc(c.cap)}</div></div>
            <div class="txt">${fmt(c.body)}</div>
          </div>`).join("")}
        </div>`;
      const cards = [...el.querySelectorAll(".card")];
      let top = 0;
      const advance = (dir) => {
        if (top >= n - 1) return;
        const c = cards[top];
        c.classList.remove("dragging");
        c.style.transform = `translate(${dir * 520}px, ${rr(-60, 60)}px) rotate(${dir * 28}deg)`;
        c.classList.add("gone"); Sfx.slide();
        top++;
        cards[top].tabIndex = 0; cards[top].style.transform = "rotate(0deg)";
        if (cards[top].matches(":focus-within") || document.activeElement === c) cards[top].focus({ preventScroll: true });
        // restart Ken Burns on the newly revealed photo
        const img = cards[top].querySelector("img"); if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
        setHint(top >= n - 1 ? "" : `Swipe the photo away (${n - 1 - top} more)`);
        if (top >= n - 1) done();
      };
      cards.forEach((c, i) => {
        let sx = 0, sy = 0, dragging = false, moved = 0;
        c.addEventListener("pointerdown", (e) => {
          if (i !== top || i >= n - 1) return;
          dragging = true; moved = 0; sx = e.clientX; sy = e.clientY; c.setPointerCapture(e.pointerId); c.classList.add("dragging"); Sfx.tick();
        });
        c.addEventListener("pointermove", (e) => {
          if (!dragging) return;
          const d = localDelta(e.clientX - sx, e.clientY - sy); moved = Math.hypot(d.x, d.y);
          c.style.transform = `translate(${d.x}px, ${d.y * 0.4}px) rotate(${d.x / 14}deg)`;
        });
        const up = (e) => {
          if (!dragging) return; dragging = false;
          const d = localDelta(e.clientX - sx, e.clientY - sy);
          if (Math.abs(d.x) > 80) advance(Math.sign(d.x));
          else if (moved < 6) advance(1);
          else { c.classList.remove("dragging"); c.style.transform = "rotate(0deg)"; }
        };
        c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
        c.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && i === top) { e.preventDefault(); advance(1); } });
      });
      el._onActive = () => setHint(top >= n - 1 ? "" : `Swipe the photo away (${n - 1 - top} more)`);
    },

    package(el, step, done) {
      el.classList.add("tone-white");
      el.innerHTML = `${refHTML(step.ref)}<h2>${esc(step.head)}</h2>
        <div class="parcel">
          <div class="box"></div>
          <div class="contents">${photo(step.img, step.cap, { contain: true, kb: { s: 1.08 } })}<div class="note">${fmt(step.body)}</div></div>
          <div class="flap l"></div><div class="flap r"></div>
          <div class="shipping">${esc(step.label).replace(/\n/g, "<br>")}</div>
          ${stampHTML({ txt: "Fragile", cls: "small", x: "8%", y: "64%", r: -14 })}
          ${stampHTML({ txt: "Do not open", cls: "small blue", x: "62%", y: "76%", r: 9 })}
          <div class="tapebar" role="button" tabindex="0" aria-label="Cut the tape. Drag down, or press Enter."><div class="guide"></div><div class="slit"></div></div>
          <div class="knife"></div>
          <div class="pull">drag ↓</div>
        </div>`;
      const parcel = $(".parcel", el), bar = $(".tapebar", el), slit = $(".slit", el), knife = $(".knife", el);
      let dragging = false, sy = 0, sx = 0, prog = 0, lastTick = 0, cut = false;
      const H = () => parcel.offsetHeight;
      const setProg = (p) => { prog = Math.max(prog, Math.min(1, p)); slit.style.height = prog * 100 + "%"; knife.style.top = prog * H() + "px"; };
      const finish = () => { if (cut) return; cut = true; setProg(1); parcel.classList.add("cut"); Sfx.rip(); setTimeout(() => Sfx.rustle(), 450); done(); };
      bar.addEventListener("pointerdown", (e) => { if (cut) return; dragging = true; sx = e.clientX; sy = e.clientY - (prog * H()) * S.cam.s; bar.setPointerCapture(e.pointerId); });
      bar.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const d = localDelta(e.clientX - sx, e.clientY - sy);
        setProg(d.y / H());
        if (prog * H() - lastTick > 22) { lastTick = prog * H(); Sfx.tear(); }
        if (prog > 0.93) { dragging = false; finish(); }
      });
      const up = () => { dragging = false; };
      bar.addEventListener("pointerup", up); bar.addEventListener("pointercancel", up);
      bar.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } });
    },

    quiz(el, step, done) {
      el.classList.add("quiz", "tone-white");
      el.innerHTML = `<div class="ref"><span>Field test</span><span>Agent's guess</span></div>
        <div class="q">${esc(step.q)}</div>
        <div class="opts">${step.opts.map((o, i) => `<button class="opt" type="button" data-i="${i}"><span class="k">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="ex">${fmt(step.ex)}</div>`;
      el.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
        if (el.classList.contains("done")) return;
        const i = +b.dataset.i, ok = i === step.a;
        el.classList.add("done"); b.classList.add("picked");
        el.querySelectorAll(".opt").forEach((x, j) => x.classList.add(j === step.a ? "right" : "wrong"));
        const s = document.createElement("div"); s.className = `stamp slam ${ok ? "blue" : ""}`;
        s.style.cssText = "right:18px;top:12px;--sr:-12deg"; s.textContent = ok ? "Correct" : "Wrong";
        el.appendChild(s); Sfx.stamp(); if (!ok) setTimeout(() => Sfx.wrong(), 120);
        done();
      }));
    },

    poll(el, step, done) {
      el.classList.add("quiz", "tone-yellow");
      el.innerHTML = `<div class="ref"><span>Your opinion</span><span>No wrong answer</span></div>
        <div class="q">${esc(step.q)}</div>
        <div class="opts">${step.opts.map((o, i) => `<button class="opt" type="button" data-i="${i}"><span class="k">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="ex">${fmt(step.ex)}</div>`;
      el.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
        if (el.classList.contains("done")) return;
        el.classList.add("done"); b.classList.add("picked");
        const s = document.createElement("div"); s.className = "stamp slam blue";
        s.style.cssText = "right:18px;top:12px;--sr:-10deg"; s.textContent = "Noted";
        el.appendChild(s); Sfx.stamp(); done();
      }));
    },

    jello(el, step, done) {
      el.classList.add("tone-white");
      // one box face, torn along a shared jagged line; each half shows its side of the face
      const J = [[150, 0], [138, 14], [156, 28], [140, 42], [154, 58], [142, 72], [156, 86], [146, 100]];
      const OFF = 136;
      const clipA = "polygon(0 0," + J.map(([x, y]) => `${x}px ${y}%`).join(",") + ",0 100%)";
      const clipB = "polygon(" + J.map(([x, y]) => `${x - OFF}px ${y}%`).join(",") + `,160px 100%,160px 0)`;
      const face = `<div class="face"><div class="brand">JELL-O</div><div class="flav">RASPBERRY · AMERICA'S MOST FAMOUS DESSERT</div></div>`;
      el.innerHTML = `${refHTML(step.ref)}<h2>${esc(step.head)}</h2>
        <div class="jello">
          <div class="half a" style="clip-path:${clipA}" role="button" tabindex="0" aria-label="Ruth's half of the box. Drag it to the other half, or press Enter.">${face}</div>
          <div class="half b" style="clip-path:${clipB}">${face.replace('class="face"', 'class="face" style="left:-' + OFF + 'px"')}</div>
          <div class="who a">Ruth's half</div><div class="who b">courier's half</div>
        </div>
        <div class="body" hidden>${`<p>${fmt(step.body)}</p>`}</div>`;
      const box = $(".jello", el), a = $(".half.a", el), b = $(".half.b", el), body = $(".body", el);
      let tx = 0, ty = 0, sx = 0, sy = 0, dragging = false, matched = false;
      const set = (rot) => { a.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`; };
      const match = () => {
        if (matched) return; matched = true;
        box.classList.add("matched");
        tx = (b.offsetLeft - OFF) - a.offsetLeft; ty = 0; set(0); b.style.transform = "rotate(0deg)";
        Sfx.stamp(); body.hidden = false;
        const s = document.createElement("div"); s.className = "stamp slam blue small"; s.style.cssText = "left:28%;top:84%;--sr:-6deg"; s.textContent = "Identity confirmed";
        box.appendChild(s);
        setTimeout(() => el.dispatchEvent(new CustomEvent("refit")), 50);
        done();
      };
      a.addEventListener("pointerdown", (e) => { if (matched) return; dragging = true; sx = e.clientX; sy = e.clientY; a.setPointerCapture(e.pointerId); Sfx.tick(); });
      a.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const d = localDelta(e.clientX - sx, e.clientY - sy); tx = d.x; ty = d.y; set(-8 + Math.min(8, d.x / 12));
        const gap = (b.offsetLeft - OFF) - (a.offsetLeft + tx);
        if (gap < 26 && Math.abs(ty) < 70) { dragging = false; match(); }
      });
      const up = () => { if (!dragging) return; dragging = false; if (!matched) { tx = 0; ty = 0; a.style.transition = "transform .4s"; set(-8); setTimeout(() => (a.style.transition = ""), 400); } };
      a.addEventListener("pointerup", up); a.addEventListener("pointercancel", up);
      a.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); match(); } });
    },

    board(el, step, done) {
      el.classList.add("board");
      el.style.width = "440px";
      const nodes = step.nodes;
      el.innerHTML = `${refHTML(step.ref)}<h2>${esc(step.head)}</h2>
        <div class="pins">
          <svg class="strings" aria-hidden="true"></svg>
          ${nodes.map((n, i) => `<div class="node" data-i="${i}" role="button" tabindex="0" aria-label="${esc(n.name)}, ${esc(n.date)}" style="left:${n.x}%;top:${n.y}%;transform:rotate(${(i % 2 ? 4 : -4)}deg)">
              <div class="polaroid">${photo(n.img, n.name, { kb: n.pos ? { s: (n.zoom || 1) * 1.1, o: n.pos, x: "0%", y: "0%" } : { s: 1.1 }, pos: n.pos, zoom: n.zoom })}<div class="cap">${esc(n.name)}</div></div>
              <div class="date">${esc(n.date)}</div>
            </div>`).join("")}
        </div>
        <div class="note">Start with the scientist in England. Tap <b>Fuchs</b>.</div>`;
      const svg = $("svg", el), note = $(".note", el), els = [...el.querySelectorAll(".node")];
      let next = 0;
      const center = (n) => ({ x: n.offsetLeft + n.offsetWidth / 2, y: n.offsetTop + 30 });
      const mark = () => els.forEach((n, i) => n.classList.toggle("next", i === next));
      mark();
      const hit = (i) => {
        if (i !== next) { Sfx.wrong(); els[i].animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 240 }); return; }
        els[i].classList.add("linked"); Sfx.pin();
        if (i > 0) {
          const p = center(els[i - 1]), q = center(els[i]);
          const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
          ln.setAttribute("x1", p.x); ln.setAttribute("y1", p.y); ln.setAttribute("x2", q.x); ln.setAttribute("y2", q.y);
          const L = Math.hypot(q.x - p.x, q.y - p.y);
          ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L; ln.style.transition = "stroke-dashoffset .6s ease-out";
          svg.appendChild(ln); requestAnimationFrame(() => requestAnimationFrame(() => (ln.style.strokeDashoffset = 0)));
          Sfx.slide();
        }
        note.innerHTML = fmt(nodes[i].note);
        next++; mark();
        if (next >= nodes.length) { setHint(""); done(); }
      };
      els.forEach((n, i) => {
        n.addEventListener("click", () => hit(i));
        n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(i); } });
      });
    },

    verdict(el, step, done) {
      el.classList.add("tone-white");
      el.innerHTML = `${refHTML(step.ref)}<h2>${esc(step.head)}</h2>${bodyHTML(step.body)}
        <div class="stamper" role="button" tabindex="0" aria-label="Stamp the verdict"><span class="tap">tap to stamp the verdict</span></div>
        <div class="after" hidden><p style="margin-top:12px">Julius Rosenberg: <b>guilty</b>.<br>Ethel Rosenberg: <b>guilty</b>.<br>Morton Sobell: <b>guilty</b>.</p></div>`;
      const pad = $(".stamper", el), after = $(".after", el);
      const go = () => {
        if (pad.classList.contains("done")) return;
        pad.classList.add("done");
        const s = document.createElement("div"); s.className = "stamp big slam"; s.style.cssText = "position:relative;--sr:-9deg"; s.textContent = step.stamp;
        pad.appendChild(s); Sfx.stamp(); setTimeout(() => Sfx.stamp(), 90);
        after.hidden = false; done();
      };
      pad.addEventListener("click", go);
      pad.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    },

    end(el) {
      el.classList.add("tone-manila");
      el.innerHTML = `<div class="ref"><span>Final report</span><span>File closed</span></div>
        <h2><small>The Rosenberg File</small>Case closed</h2>
        <div class="body">
          <p>You've reviewed the whole file: a Depression-era romance, a wartime spy ring, a brother's testimony, and two executions that still divide historians.</p>
          <p>Every section is now unlocked. Open the <b>Case Index</b> to revisit any part of the story.</p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">
          <button class="btn primary" type="button" data-act="index">Case index</button>
          <button class="btn" type="button" data-act="credits" style="color:var(--ink);border-color:rgba(0,0,0,.4);background:transparent">Sources &amp; photo credits</button>
          <button class="btn" type="button" data-act="restart" style="color:var(--ink);border-color:rgba(0,0,0,.4);background:transparent">Start over</button>
        </div>
        ${stampHTML({ txt: "Case closed", cls: "", x: "56%", y: "3%", r: -9 })}`;
      el.querySelector('[data-act="index"]').addEventListener("click", openIndex);
      el.querySelector('[data-act="credits"]').addEventListener("click", openCredits);
      el.querySelector('[data-act="restart"]').addEventListener("click", () => goTo(0));
    }
  };

  // convert a screen-space drag delta into the local coordinates of the active sheet
  function localDelta(dx, dy) {
    const st = STEPS[S.cur];
    const a = -((st.r + S.cam.r) * Math.PI) / 180;
    const s = S.cam.s || 1;
    return { x: (dx * Math.cos(a) - dy * Math.sin(a)) / s, y: (dx * Math.sin(a) + dy * Math.cos(a)) / s };
  }

  /* ---------------- navigation ---------------- */
  // There is no Continue button: once a step is done, a tap anywhere moves on.
  // A pulsing "tap" cue appears only after the reader has had time to read.
  const WPS = 3.3;                      // ~200 words per minute, a comfortable reading pace
  const GRACE = 2000;                   // extra wait after the estimated reading time
  const words = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;

  function isComplete(k) {
    const t = STEPS[k].step.t;
    return !INTERACTIVE.has(t) || S.done.has(k) || k < S.maxSeen;
  }
  function complete(k) {
    const fresh = !S.done.has(k);
    S.done.add(k);
    S.doneAt = performance.now();      // the tap that finished an interaction must not also advance
    if (k === S.cur) { updateUI(); if (fresh) armCue(revealedWords(k)); }
  }
  function setHint(t) { hint.textContent = t; }

  // words the reader still has to read once an interaction finishes
  function revealedWords(k) {
    const el = STEPS[k].el; if (!el) return 0;
    const parts = el.querySelectorAll(".ex, .parcel .note, .jello ~ .body, .after, .board .note, .folder .inside, .stack .card:last-child .txt");
    return [...parts].reduce((n, p) => n + words(p.innerText), 0);
  }
  function sheetWords(k) { const el = STEPS[k].el; return el ? words(el.innerText) : 0; }

  const cue = $("#tapcue");
  let cueTimer = 0;
  function hideCue() { clearTimeout(cueTimer); cue.classList.remove("show"); }
  function armCue(n) {
    hideCue();
    if (S.cur >= STEPS.length - 1 || !isComplete(S.cur)) return;
    const ms = Math.max(2500, (n / WPS) * 1000) + GRACE;
    cueTimer = setTimeout(() => { if (isComplete(S.cur)) cue.classList.add("show"); }, ms);
  }

  function next() {
    if (S.cur >= STEPS.length - 1 || !isComplete(S.cur)) return;
    Sfx.init(); Sfx.click(); goTo(S.cur + 1);
  }

  function ensure(k) {
    const st = STEPS[k];
    if (st.el) return false;
    st.el = makeSheet(k);
    st.el.addEventListener("refit", () => { if (S.cur === k) applyCam(camTarget(st), false); });
    world.appendChild(st.el);
    addProps(st, k);
    return true;
  }

  function goTo(k, opts = {}) {
    k = Math.max(0, Math.min(STEPS.length - 1, k));
    if (k > S.maxSeen + 1) return;              // never skip ahead into unseen territory
    const prev = STEPS[S.cur];
    const fresh = ensure(k);
    const st = STEPS[k];
    if (prev && prev.el && prev !== st) { prev.el.classList.remove("active"); prev.el.classList.add("dim", "seen"); }
    st.el.classList.remove("dim");
    // restart reveal + Ken Burns
    st.el.classList.remove("active"); void st.el.offsetWidth; st.el.classList.add("active");
    if (fresh && !opts.instant && !reduceMotion) {
      const a = rr(0, Math.PI * 2);
      st.el.style.setProperty("--tx", Math.round(Math.cos(a) * 900) + "px");
      st.el.style.setProperty("--ty", Math.round(Math.sin(a) * 700) + "px");
      st.el.classList.add("toss");
      st.el.addEventListener("animationend", (e) => { if (e.target === st.el) st.el.classList.remove("toss"); }, { once: false });
    }
    S.cur = k; S.navAt = performance.now();
    if (k > S.maxSeen) { S.maxSeen = k; save(); }
    applyCam(camTarget(st), !opts.instant);
    if (!opts.instant) { Sfx.slide(); if (fresh) setTimeout(() => Sfx.rustle(), 500); }
    updateUI();
    if (st.el._onActive) st.el._onActive();
    hideCue();
    if (isComplete(k)) armCue(sheetWords(k) + 3); // + time for the sheet to land
  }

  function updateUI() {
    const st = STEPS[S.cur];
    const ok = isComplete(S.cur);
    btnBack.disabled = S.cur === 0;
    let h = ok ? "" : HINTS[st.step.t] || "";
    if (ok && st.el && st.el.querySelector(".declass:not(.open)")) h = "Tap the black bars to declassify";
    if (st.step.t === "stack" && !ok) h = hint.textContent && hint.textContent.startsWith("Swipe") ? hint.textContent : HINTS.stack;
    setHint(h);
    caseTitle.textContent = `§ ${String(st.s + 1).padStart(2, "0")} · ${st.sec.title}`;
  }

  // tap anywhere to continue
  document.addEventListener("click", (e) => {
    const now = performance.now();
    if (now - (S.doneAt || 0) < 450 || now - (S.navAt || 0) < 450) return;
    const t = e.target;
    if (!t.closest || t.closest("#topbar, #bottombar, #index, a, button:not(.opt), .declass:not(.open), [data-act]")) return;
    const st = STEPS[S.cur];
    // an unfinished interaction keeps its taps
    if (!isComplete(S.cur)) {
      if (st.el && !st.el.contains(t)) { hideCue(); setHint(HINTS[st.step.t] || hint.textContent); st.el.animate([{ filter: "brightness(1.25)" }, { filter: "none" }], { duration: 500 }); }
      return;
    }
    next();
  });
  btnBack.addEventListener("click", () => { Sfx.init(); Sfx.click(); goTo(S.cur - 1); });
  document.addEventListener("keydown", (e) => {
    if (!$("#index").hidden) { if (e.key === "Escape") closeIndex(); return; }
    if (e.target.closest && e.target.closest("button, [role=button]") && (e.key === "Enter" || e.key === " ")) return;
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft" && !btnBack.disabled) btnBack.click();
  });
  // keep declass hint fresh
  world.addEventListener("click", () => setTimeout(updateUI, 0));

  /* ---------------- case index ---------------- */
  const ix = $("#index"), ixBody = $("#ixbody");
  function sectionStart(s) { return STEPS.findIndex((st) => st.s === s); }
  function openIndex() {
    Sfx.init(); Sfx.flip();
    $("#ixtitle").textContent = "Case index";
    $("#ixsub").textContent = "Sections reviewed are open. The rest stay classified until you reach them.";
    ixBody.innerHTML = `<ol>${SECTIONS.map((sec, s) => {
      const start = sectionStart(s), seen = start <= S.maxSeen, cur = STEPS[S.cur].s === s;
      return `<li class="${seen ? "" : "locked"} ${cur ? "current" : ""}">
        <button type="button" data-k="${start}" ${seen ? "" : 'aria-disabled="true"'} aria-label="${seen ? esc(sec.title) : "Classified section"}">
          <span class="n">${String(s + 1).padStart(2, "0")}</span>
          <span class="name" style="--w:${40 + ((s * 37) % 50)}%">${seen ? esc(sec.title) : "&nbsp;"}</span>
          <span class="st">${cur ? "YOU ARE HERE" : seen ? "REVIEWED" : "CLASSIFIED"}</span>
        </button></li>`;
    }).join("")}</ol>`;
    ixBody.querySelectorAll("button[data-k]").forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k;
      if (k > S.maxSeen) { Sfx.wrong(); b.animate([{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 220 }); return; }
      closeIndex(); setTimeout(() => goTo(k), 120);
    }));
    ix.hidden = false;
    $(".ixsheet .close", ix).focus({ preventScroll: true });
  }
  function openCredits() {
    Sfx.init(); Sfx.flip();
    $("#ixtitle").textContent = "Sources & credits";
    $("#ixsub").textContent = "Photographs from Wikimedia Commons. Most are U.S. government records in the public domain.";
    const C = window.CREDITS || [];
    ixBody.innerHTML = `<ol class="credits">${C.map((c) => `<li style="font-size:13px;line-height:1.4;background:#f3ecd8;padding:8px 10px"><b>${esc(c.what)}</b><br>${esc(c.author || "")}${c.author ? " · " : ""}${esc(c.license)}<br><a href="${esc(c.url)}" target="_blank" rel="noopener" style="color:var(--stamp-blue);word-break:break-all">${esc(c.file)}</a></li>`).join("")}
      <li style="font-size:13px;line-height:1.4;background:#f3ecd8;padding:8px 10px"><b>Proximity fuze schematic</b><br>Drawn for this project.</li></ol>
      <p style="font-size:13px;margin-top:14px">Key sources: the National Security Agency's VENONA releases (1995); Sam Roberts, <i>The Brother</i> (2001); Alexander Feklisov, <i>The Man Behind the Rosenbergs</i> (2001); <i>New York Times</i> interview with Morton Sobell (Sept. 2008); the trial record, <i>U.S. v. Rosenberg</i> (1951).</p>`;
    ix.hidden = false;
    $(".ixsheet .close", ix).focus({ preventScroll: true });
  }
  function closeIndex() { ix.hidden = true; Sfx.rustle(); S.navAt = performance.now(); }
  $("#openindex").addEventListener("click", openIndex);
  $(".ixsheet .close", ix).addEventListener("click", closeIndex);
  ix.addEventListener("click", (e) => { if (e.target === ix) closeIndex(); });

  /* ---------------- sound toggle ---------------- */
  const sbtn = $("#sound");
  const syncSound = () => { sbtn.textContent = Sfx.on ? "Sound on" : "Sound off"; sbtn.setAttribute("aria-pressed", String(Sfx.on)); };
  sbtn.addEventListener("click", () => { Sfx.on = !Sfx.on; Sfx.init(); if (Sfx.on) Sfx.click(); syncSound(); try { localStorage.setItem(STORE_KEY + "-mute", Sfx.on ? "0" : "1"); } catch (e) {} });
  syncSound();

  /* ---------------- boot ---------------- */
  window.addEventListener("resize", () => { const st = STEPS[S.cur]; if (st.el) applyCam(camTarget(st), false); });
  document.addEventListener("pointerdown", () => Sfx.init(), { once: true });

  // scatter a few sheets ahead of time so the desk already looks busy
  goTo(0, { instant: true });
  // refit once fonts/images settle
  const refit = () => { const st = STEPS[S.cur]; if (st.el && !S.flying) applyCam(camTarget(st), false); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  window.addEventListener("load", refit);
})();
