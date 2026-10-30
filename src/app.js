/* =====================================================================
   THE FEAR COLLECTOR · a Halloween speaking-club lesson (B1)
   Local version: all state lives in S and changes only through act.*
   (to add live rooms later, swap act.* for Firebase writes + listeners)
   ===================================================================== */
const LESSON_ID = 'fear-collector';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ptOf = (e, el) => {
  if (e && e.clientX) return [e.clientX, e.clientY];
  const r = (el || (e && e.currentTarget) || document.body).getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 3];
};

/* ---------- images: your own picture wins, otherwise the drawn one ---------- */
function myImage(key) {
  return (typeof MY_IMAGES !== 'undefined' && MY_IMAGES[key]) || (typeof EMBEDDED !== 'undefined' && EMBEDDED[key]) || '';
}
function artHTML(key, ...args) {
  const mine = myImage(key);
  if (mine) return `<img src="${esc(mine)}" alt="" class="my-img">`;
  const f = ART[key];
  return f ? f(...args) : '';
}
const JARS = {
  nursery: ['The dark', '#8fe0d0'], kitchen: ['The unknown', '#ffb347'],
  library: ['Failure', '#e07a8f'], mirrors: ['Others', '#b9a8f0'], candles: ['Alone', '#ffd27a'],
};
function paintArt(root = document) {
  $$('[data-art]', root).forEach((el) => {
    if (el.dataset.painted) return;
    el.dataset.painted = '1';
    const mine = myImage(el.dataset.art);
    if (el.dataset.art === 'cauldron' && mine) { paintMyCauldron(el, mine); return; }
    el.innerHTML = artHTML(el.dataset.art);
  });
  $$('[data-edge]', root).forEach((el) => { el.innerHTML = ART.edge(el.dataset.edge); });
  $$('[data-jar]', root).forEach((el) => { const [l, t] = JARS[el.dataset.jar]; el.innerHTML = ART.jar(l, t); });
}

/* your own cauldron picture: the biggest transparent hole inside it (the opening)
   is found automatically, the potion colour shows through it and it boils */
function paintMyCauldron(el, src) {
  el.classList.add('mine');
  el.innerHTML = `<div class="pot-wrap"><div class="pot-fill" hidden></div><img src="${esc(src)}" alt="" class="my-img pot-img"><div class="pot-steam" hidden></div></div>`;
  const img = $('img', el), fill = $('.pot-fill', el), steam = $('.pot-steam', el);
  const find = () => {
    try {
      const k = Math.min(1, 480 / img.naturalWidth), W = Math.max(1, Math.round(img.naturalWidth * k)), H = Math.max(1, Math.round(img.naturalHeight * k));
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const cx = c.getContext('2d'); cx.drawImage(img, 0, 0, W, H);
      const px = cx.getImageData(0, 0, W, H).data;
      const clear = (i) => px[i * 4 + 3] < 60;
      /* 1. everything transparent that touches the edge of the picture is background */
      const out = new Uint8Array(W * H), stack = [];
      const push = (x, y) => { const i = y * W + x; if (!out[i] && clear(i)) { out[i] = 1; stack.push(i); } };
      for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
      for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
      while (stack.length) {
        const i = stack.pop(), x = i % W, y = (i / W) | 0;
        if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
      }
      /* 2. closed transparent areas: keep only the biggest one (the opening), not the holes in the handles */
      const lab = new Int32Array(W * H); let cur = 0, best = 0, bestN = 0;
      for (let i = 0; i < W * H; i++) {
        if (!clear(i) || out[i] || lab[i]) continue;
        cur++; let n = 0; lab[i] = cur; stack.push(i);
        while (stack.length) {
          const j = stack.pop(), x = j % W, y = (j / W) | 0; n++;
          for (const q of [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, y > 0 ? j - W : -1, y < H - 1 ? j + W : -1]) {
            if (q >= 0 && !lab[q] && !out[q] && clear(q)) { lab[q] = cur; stack.push(q); }
          }
        }
        if (n > bestN) { bestN = n; best = cur; }
      }
      if (bestN < W * H * 0.004) return;
      const m = cx.createImageData(W, H); let x0 = W, x1 = 0, y0 = H, y1 = 0;
      for (let i = 0; i < W * H; i++) {
        if (lab[i] !== best) continue;
        const x = i % W, y = (i / W) | 0;
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H) m.data[(yy * W + xx) * 4 + 3] = 255; }
      }
      cx.putImageData(m, 0, 0);
      const url = `url(${c.toDataURL()})`;
      fill.style.webkitMaskImage = url; fill.style.maskImage = url;
      /* 3. boiling: bubbles on the surface (inside the hole) and bubbles + steam above it */
      const L = (x0 / W) * 100, T = (y0 / H) * 100, BW = ((x1 - x0) / W) * 100, BH = ((y1 - y0) / H) * 100;
      let surf = '';
      for (let i = 0; i < 14; i++) {
        const sz = 3 + Math.random() * 5;
        surf += `<i style="left:${(L + BW * (0.08 + Math.random() * 0.84)).toFixed(1)}%;top:${(T + BH * (0.2 + Math.random() * 0.65)).toFixed(1)}%;width:${sz.toFixed(1)}%;animation-duration:${(1.1 + Math.random() * 1.4).toFixed(2)}s;animation-delay:-${(Math.random() * 2.5).toFixed(2)}s"></i>`;
      }
      fill.innerHTML = `<b class="pot-shine"></b>${surf}`;
      Object.assign(steam.style, { left: L + '%', top: T + '%', width: BW + '%', height: BH + '%' });
      let up = '';
      for (let i = 0; i < 9; i++) {
        const sz = 5 + Math.random() * 7;
        up += `<i style="left:${(10 + Math.random() * 80).toFixed(1)}%;width:${sz.toFixed(1)}%;animation-duration:${(1.8 + Math.random() * 1.6).toFixed(2)}s;animation-delay:-${(Math.random() * 3).toFixed(2)}s"></i>`;
      }
      for (let i = 0; i < 3; i++) up += `<em style="left:${20 + i * 25}%;animation-delay:-${i * 1.3}s"></em>`;
      steam.innerHTML = up;
      fill.hidden = false; steam.hidden = false;
    } catch (e) { /* the picture can't be read (opened from a local file): it simply stays as it is */ }
  };
  if (img.complete && img.naturalWidth) find(); else img.addEventListener('load', find);
}

/* ================= SOUND (Web Audio, no files) ================= */
const Snd = (() => {
  let ctx = null, master = null, muted = false;
  try { muted = localStorage.getItem('collector_muted') === '1'; } catch (e) { /* private mode */ }
  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone({ f = 440, f2 = null, t = 0, d = 0.2, type = 'sine', v = 0.3, a = 0.01 }) {
    const c = ac(); if (!c || muted) return;
    const o = c.createOscillator(), g = c.createGain(), st = c.currentTime + t;
    o.type = type; o.frequency.setValueAtTime(f, st);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, st + d);
    g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(v, st + a); g.gain.exponentialRampToValueAtTime(0.0001, st + d);
    o.connect(g); g.connect(master); o.start(st); o.stop(st + d + 0.05);
  }
  function noise({ t = 0, d = 0.3, v = 0.3, f = 1000, f2 = null, q = 1, type = 'bandpass', a = 0 }) {
    const c = ac(); if (!c || muted) return;
    const len = Math.max(1, Math.floor(c.sampleRate * d)), buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), st = c.currentTime + t;
    src.buffer = buf; fl.type = type; fl.frequency.setValueAtTime(f, st); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, st + d);
    if (a) { g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(v, st + a); } else g.gain.setValueAtTime(v, st);
    g.gain.exponentialRampToValueAtTime(0.0001, st + d);
    src.connect(fl); fl.connect(g); g.connect(master); src.start(st); src.stop(st + d);
  }
  function wobbly({ type = 'sawtooth', from = 70, mid = 130, to = 90, d = 1.2, lfo = 28, depth = 25, bp = 900, q = 4, v = 0.32 }) {
    const c = ac(); if (!c || muted) return;
    const st = c.currentTime, o = c.createOscillator(), l = c.createOscillator(), lg = c.createGain(), fl = c.createBiquadFilter(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(from, st); o.frequency.linearRampToValueAtTime(mid, st + d * 0.5); o.frequency.linearRampToValueAtTime(to, st + d);
    l.frequency.value = lfo; lg.gain.value = depth; l.connect(lg); lg.connect(o.frequency);
    fl.type = 'bandpass'; fl.frequency.value = bp; fl.Q.value = q;
    g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(v, st + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, st + d);
    o.connect(fl); fl.connect(g); g.connect(master); o.start(st); l.start(st); o.stop(st + d + 0.05); l.stop(st + d + 0.05);
  }
  const fx = {
    creak() { wobbly({}); },
    whisper() { noise({ d: 1.4, v: 0.18, f: 2600, q: 2.5, a: 0.4 }); noise({ t: 0.5, d: 1.1, v: 0.12, f: 3400, q: 3, a: 0.3 }); },
    pop() { tone({ f: 520, f2: 880, d: 0.12, v: 0.22 }); },
    tick() { tone({ f: 2200, d: 0.03, type: 'square', v: 0.05 }); },
    page() { noise({ d: 0.35, v: 0.2, f: 1800, f2: 600, q: 0.8 }); },
    bubble() { [0, 0.09, 0.18, 0.27].forEach((t, i) => tone({ f: 260 + i * 110, f2: 700 + i * 160, t, d: 0.1, v: 0.18 })); },
    burp() { tone({ f: 120, f2: 55, d: 0.5, type: 'sawtooth', v: 0.2 }); noise({ d: 0.35, v: 0.1, f: 300, type: 'lowpass' }); },
    chime() { [659, 784, 988].forEach((f, i) => tone({ f, t: i * 0.11, d: 0.7, type: 'triangle', v: 0.17 })); },
    wrong() { tone({ f: 220, f2: 150, d: 0.28, type: 'triangle', v: 0.18 }); },
    musicBox() { [1319, 1175, 988, 1175, 1319, 1568, 1319, 988, 880, 988].forEach((f, i) => tone({ f, t: i * 0.22, d: 0.6, type: 'sine', v: 0.12 })); },
    lock() { noise({ d: 0.06, v: 0.5, f: 3500, type: 'highpass' }); tone({ f: 1500, t: 0.04, d: 0.08, type: 'square', v: 0.06 }); tone({ f: 180, f2: 90, t: 0.05, d: 0.12, v: 0.3 }); },
    key() { [2637, 3136, 2349, 2794].forEach((f, i) => tone({ f: f * (0.98 + Math.random() * 0.04), t: i * 0.06, d: 0.25, type: 'triangle', v: 0.07 })); },
    glass() { noise({ d: 0.5, v: 0.4, f: 4000, type: 'highpass' }); [3520, 4186, 2960, 5274].forEach((f, i) => tone({ f, t: 0.02 + i * 0.05, d: 0.4, type: 'triangle', v: 0.06 })); },
    dong() { [[1, 0.36, 2.8], [2.76, 0.14, 2.0], [5.4, 0.06, 1.4], [0.5, 0.2, 3.0]].forEach(([m, v, d]) => tone({ f: 174 * m, d, v, a: 0.005 })); },
    whoosh() { noise({ d: 0.7, v: 0.3, f: 250, f2: 3000, q: 0.7 }); },
    release() { wobbly({ type: 'sine', from: 300, mid: 620, to: 900, d: 1.3, lfo: 9, depth: 18, bp: 800, q: 0.7, v: 0.22 }); fx.key(); },
    tada() { [523, 659, 784, 1047].forEach((f, i) => tone({ f, t: i * 0.12, d: 0.8, type: 'triangle', v: 0.16 })); },
    courage() { tone({ f: 1250, f2: 1650, d: 0.08, type: 'sine', v: 0.06 }); },
    dawn() {
      [262, 330, 392, 523, 659].forEach((f, i) => tone({ f, t: i * 0.25, d: 4, type: 'triangle', v: 0.09, a: 0.8 }));
      for (let i = 0; i < 6; i++) { const t = 2 + i * 0.4 + Math.random() * 0.3; tone({ f: 2600, f2: 3400, t, d: 0.09, v: 0.05 }); tone({ f: 3000, f2: 2400, t: t + 0.11, d: 0.08, v: 0.04 }); }
    },
  };
  return {
    ...fx,
    unlock: ac,
    get muted() { return muted; },
    setMuted(m) { muted = m; try { localStorage.setItem('collector_muted', m ? '1' : '0'); } catch (e) { /* ignore */ } },
  };
})();

/* ================= STATE ================= */
const AVATARS = [['mummy', 'Mummy'], ['monster', 'Monster'], ['ragdoll', 'Ragdoll'], ['spirit', 'Spirit'], ['spider', 'Spider'], ['creeper', 'Creeper'], ['domo', 'Domo']];
const KEY_ROOMS = ['nursery', 'kitchen', 'library', 'mirrors', 'candles'];
const ROOM_NAMES = { nursery: 'the Nursery', kitchen: 'the Kitchen', library: 'the Library', mirrors: 'the Hall of Mirrors', candles: 'the Candle Room' };
const S = {
  me: null, pendingAvatar: null, courage: 0, done: {}, keys: {}, used: {}, fakes: {}, fears: [],
  stats: { brave: 0, words: 0, mirrors: 0, candles: 0 }, flags: {},
};
const me = () => S.me || { id: 'guest', name: 'Guest', avatar: 'mummy' };
const act = {
  join(name, avatar) { S.me = { id: S.me?.id || 'p' + Math.random().toString(36).slice(2, 8), name, avatar }; renderMe(); },
  courage(n, x, y) { S.courage += n; renderCourage(); floaty(`+${n}`, x, y); Snd.courage(); Sync.bump('courage', n); },
  complete(room, title, text) { if (S.done[room]) return; S.done[room] = true; renderRooms(); if (title) achieve(title, text); Sync.set('done/' + room, true); },
  key(room) { if (S.keys[room]) return; S.keys[room] = true; renderKeys(); Sync.set('keys/' + room, true); },
  fake(id, text) { if (S.fakes[id]) return; S.fakes[id] = true; fakeToast(text); },
  leaveFear(text) { const m = me(); const f = { by: m.id, name: m.name, avatar: m.avatar, text };
    if (Sync.live) { Sync.push('fears', f); return; } S.fears.push(f); renderFears(); },
};

/* ================= SHARED UI ================= */
function renderMe() {
  const m = me();
  $('#tbMeName').textContent = m.name;
  $('#tbMeAv').innerHTML = S.me ? artHTML('av_' + m.avatar) : '';
}
function renderCourage() {
  $('#courageN').textContent = S.courage;
  const c = $('.tb-courage'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  renderPass();
}
const ROOMS = ['hall', 'nursery', 'kitchen', 'library', 'mirrors', 'candles', 'clock', 'door'];
function renderRooms() {
  ROOMS.forEach((r) => {
    const on = !!S.done[r];
    $('#' + r).classList.toggle('done', on);
    $(`.tbw[data-go="${r}"]`)?.classList.toggle('lit', on);
    $$('.mansion').forEach((m) => m.classList.toggle('lit-' + r, on));
  });
}
function renderKeys() {
  $$('#keyring .kslot').forEach((k) => {
    const got = !!S.keys[k.dataset.k];
    if (got && !k.classList.contains('got')) { k.innerHTML = ART.key(); k.classList.add('got'); }
    if (!got) { k.innerHTML = ART.keyEmpty(); k.classList.remove('got'); }
  });
  renderDoorKeys(); renderPass();
}
function floaty(text, x, y) {
  const el = document.createElement('div');
  el.className = 'floaty'; el.innerHTML = `${esc(text)}<span class="flame-ic"></span>`;
  el.style.left = (x ?? innerWidth / 2) + 'px'; el.style.top = ((y ?? innerHeight / 2) - 20) + 'px';
  document.body.appendChild(el); setTimeout(() => el.remove(), 2700);
}
function keepRoom(box) { const max = innerWidth < 600 ? 1 : 2; while (box.children.length >= max) box.firstElementChild.remove(); }
function achieve(title, text) {
  const el = document.createElement('div');
  el.className = 'ach';
  el.innerHTML = `<div class="ach-ic">${ART.key()}</div><div><small>Achievement unlocked</small><b>${esc(title)}</b><span>${esc(text)}</span></div>`;
  keepRoom($('#toasts')); $('#toasts').appendChild(el); Snd.tada(); setTimeout(() => el.remove(), 7500);
}
function fakeToast(text) {
  const el = document.createElement('div');
  el.className = 'fake';
  el.innerHTML = `<small>Totally real achievement</small>${esc(text)}`;
  keepRoom($('#fakes')); $('#fakes').appendChild(el); Snd.pop(); setTimeout(() => el.remove(), 7500);
}
function scrollToRoom(id) {
  const el = $('#' + id); if (!el) return;
  const top = el.getBoundingClientRect().top + scrollY - $('#topbar').offsetHeight + 2;
  window.scrollTo({ top, behavior: 'smooth' });
}
function moths(x, y, n = 7) {
  for (let i = 0; i < n; i++) {
    const m = document.createElement('div');
    m.className = 'moth-fly'; m.innerHTML = ART.moth();
    m.style.left = x - 15 + (Math.random() - 0.5) * 40 + 'px'; m.style.top = y - 15 + 'px';
    m.style.setProperty('--dx', (Math.random() - 0.5) * 260 + 'px'); m.style.setProperty('--rot', (Math.random() - 0.5) * 80 + 'deg');
    m.style.animationDelay = i * 0.12 + 's';
    document.body.appendChild(m); setTimeout(() => m.remove(), 3200);
  }
}
/* the jar opens, the fear flies away, the key goes to your keyring */
async function releaseJar(room, title, text) {
  if (S.keys[room]) return;
  const box = $('#jar-' + room);
  box.classList.add('open');
  $('.jar-state', box).innerHTML = 'Released. The key is yours.';
  Snd.release();
  const r = $('.jar', box).getBoundingClientRect();
  moths(r.left + r.width / 2, r.top + r.height * 0.4);
  await sleep(900);
  const slot = $(`#keyring .kslot[data-k="${room}"]`).getBoundingClientRect();
  const k = document.createElement('div'); k.className = 'key-fly'; k.innerHTML = ART.key();
  Object.assign(k.style, { left: r.left + r.width / 2 - 45 + 'px', top: r.top + r.height * 0.4 + 'px' });
  document.body.appendChild(k);
  const dx = slot.left + slot.width / 2 - (r.left + r.width / 2), dy = slot.top - (r.top + r.height * 0.4);
  await k.animate([
    { transform: 'translate(0,0) scale(1) rotate(0)' },
    { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 80}px) scale(1.4) rotate(-200deg)`, offset: 0.4 },
    { transform: `translate(${dx}px, ${dy}px) scale(.35) rotate(-360deg)`, opacity: 0.6 },
  ], { duration: 1300, easing: 'ease-in-out' }).finished.catch(() => {});
  k.remove();
  act.key(room); Snd.key();
  act.courage(5, slot.left + slot.width / 2, slot.top + 40);
  act.complete(room, title, text);
  if (Object.keys(S.keys).length === 1) act.fake('firstkey', "Found a key. Haven't lost it. Yet.");
}

/* full-screen story moments: one phrase at a time, tap to go on */
function cinema(lines) {
  return new Promise((resolve) => {
    const ov = $('#cinema'), box = $('#cinLine');
    let i = -1, timer = null, done = false, busy = false;
    ov.hidden = false; document.body.classList.add('noscroll');
    const end = () => {
      if (done) return; done = true; clearTimeout(timer);
      ov.classList.add('fade');
      setTimeout(() => { ov.hidden = true; ov.classList.remove('fade'); box.className = 'cin-line'; box.innerHTML = ''; document.body.classList.remove('noscroll'); resolve(); }, 520);
    };
    const next = () => {
      if (done || busy) return;
      i++; if (i >= lines.length) return end();
      const L = lines[i]; busy = true;
      box.classList.remove('show');
      setTimeout(() => {
        box.className = 'cin-line ' + (L.cls || ''); box.innerHTML = L.h || L.t;
        if (L.sfx) Snd[L.sfx]();
        requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('show')));
        busy = false;
        const plain = (L.t || '').replace(/<[^>]+>/g, '');
        clearTimeout(timer); timer = setTimeout(next, L.hold || Math.max(2900, 1500 + plain.length * 55));
      }, i === 0 ? 80 : 500);
    };
    ov.onclick = (e) => { if (e.target.id === 'cinSkip') { end(); return; } next(); };
    next();
  });
}

/* ================= THE GATE ================= */
const INTRO = [
  { t: 'You open your eyes.' },
  { t: 'It\'s dark. It smells of dust, candle wax and old roses.' },
  { t: 'You\'re lying on the floor of an old mansion. You don\'t remember how you got here.' },
  { t: 'Somewhere upstairs, a clock is ticking.', sfx: 'tick' },
  { t: 'You run to the front door. It\'s locked. Five times.', sfx: 'lock' },
  { t: 'On the floor, there\'s a small black card:' },
  { t: '"Welcome to my collection. You may leave... if you can. C."', cls: 'note', hold: 4200 },
  { t: 'Who is <b>C.</b>?', sfx: 'whisper' },
];
let JOIN_HTML = '';
function initGate() {
  $('#toJoin').addEventListener('click', () => { Snd.unlock(); Snd.whoosh(); $('#join').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#moonBtn').addEventListener('click', () => {
    Snd.unlock(); Snd.whisper();
    const m = $('#mansion'); m.classList.remove('howl'); void m.offsetWidth; m.classList.add('howl');
    act.fake('moon', 'Asked the moon for directions. It said nothing.');
  });
  JOIN_HTML = $('#join').innerHTML;
  bindJoin();
}
function bindJoin() {
  const box = $('#avatars');
  box.innerHTML = AVATARS.map(([id, label]) => `<button class="av-btn" data-av="${id}"><div class="av-art">${artHTML('av_' + id)}</div><span>${label}</span></button>`).join('');
  if (S.pendingAvatar) $(`.av-btn[data-av="${S.pendingAvatar}"]`, box)?.classList.add('sel');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.av-btn'); if (!b) return;
    Snd.unlock(); Snd.pop();
    S.pendingAvatar = b.dataset.av; $('#joinErr').hidden = true;
    $$('.av-btn', box).forEach((x) => x.classList.toggle('sel', x === b));
  });
  $('#enterBtn').addEventListener('click', enter);
  $('#nameIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') enter(); });
  $('#nameIn').addEventListener('input', () => { $('#joinErr').hidden = true; });
}
async function enter() {
  const name = $('#nameIn').value.trim(), err = $('#joinErr');
  if (!name || !S.pendingAvatar) { err.hidden = false; err.style.animation = 'none'; void err.offsetWidth; err.style.animation = ''; Snd.wrong(); return; }
  err.hidden = true; Snd.unlock();
  if (Sync.live) {
    const id = S.me?.id || 'p' + Math.random().toString(36).slice(2, 8);
    const free = await Sync.claim(id, name, S.pendingAvatar);
    if (!free) {
      err.hidden = false; err.textContent = 'Someone in your room already took that shadow. Pick another one.';
      Snd.wrong(); return;
    }
    S.me = { id, name, avatar: S.pendingAvatar };
  }
  act.join(name, S.pendingAvatar);
  const label = AVATARS.find((a) => a[0] === S.pendingAvatar)[1].toLowerCase();
  const join = $('#join');
  join.classList.add('joined');
  join.innerHTML = `<div class="joined-msg"><div class="av-art">${artHTML('av_' + S.pendingAvatar)}</div><span>Tonight you are <b>${esc(name)}, the ${esc(label)}</b>.</span><button class="btn small btn-ghost" id="changeMe">Change</button></div>`;
  $('#changeMe').addEventListener('click', () => { join.classList.remove('joined'); join.innerHTML = JOIN_HTML; bindJoin(); $('#nameIn').value = S.me.name; });
  if (S.flags.entered) return;
  S.flags.entered = true;
  await cinema(INTRO);
  act.fake('wake', 'Woke up in a strange house. Stayed calm. Mostly.');
  scrollToRoom('hall');
}


/* one room's shared state: writes go to Firebase when live, stay local otherwise */
function roomState(key, paint) {
  let st = {};
  onShared(key, (remote) => { st = remote || {}; paint(st); });
  return {
    get: () => st,
    push(patch) {
      if (Sync.live) { Object.keys(patch).forEach((k) => Sync.set('game/' + key + '/' + k, patch[k])); return; }
      Object.keys(patch).forEach((k) => {
        const parts = k.split('/');
        let o = st;
        parts.slice(0, -1).forEach((pp) => { if (typeof o[pp] !== 'object' || o[pp] === null) o[pp] = {}; o = o[pp]; });
        o[parts[parts.length - 1]] = patch[k];
      });
      paint(st);
    },
  };
}

/* ================= 1 · THE HALL · BRAVE OR NOPE ================= */
const BON = [
  'Spend a night alone in this mansion. No phone, no light.',
  'Sing karaoke on a stage in front of 200 strangers.',
  'Hold a big, hairy spider in your hand for one minute.',
  'Read your teenage diary aloud to this group.',
  'Jump out of a plane (with a parachute!) tomorrow morning.',
  "Eat a dish without knowing what's in it.",
];
const BON_RESULT = [
  [1, 'The Sensible One', "You'd survive any horror film. Mostly by staying at home."],
  [3, 'Brave on Weekends', "Brave when it matters, careful when it doesn't."],
  [5, 'Fearless-ish', 'Most fears are a little scared of you.'],
  [6, "The Collector's Nightmare", 'You have no fears to collect. Suspicious.'],
];
function initHall() {
  let i = 0, brave = 0, timer = null, t0 = 0, answered = false;
  const box = $('#bon'), timerEl = $('#bonTimer');
  const R = roomState('hall', paintBoard);
  function paintBoard(st) {
    const board = $('#bonBoard'); if (!board) return;
    board.hidden = !Sync.live;
    if (!Sync.live) return;
    const P = Sync.players;
    const who = (a, v) => Object.keys(a).filter((id) => a[id] === v)
      .map((id) => (P[id] ? `<span class="bb-av" title="${esc(P[id].name)}">${artHTML('av_' + P[id].avatar)}</span>` : '')).join('');
    board.innerHTML = '<p class="card-title">Who said what</p>' + BON.map((q, k) => {
      const a = (st && st[k]) || {}, b = who(a, 'brave'), n = who(a, 'nope');
      return `<div class="bb-row"><p>${k + 1}. ${esc(q)}</p>
        <div class="bb-side"><b>I'd do it</b><span>${b || '<i>nobody yet</i>'}</span></div>
        <div class="bb-side"><b>No way</b><span>${n || '<i>nobody yet</i>'}</span></div></div>`;
    }).join('');
  }
  const stopTimer = () => { clearInterval(timer); timer = null; };
  const show = () => {
    answered = false;
    $('#bonN').textContent = i + 1;
    const q = $('#bonQ'); q.textContent = BON[i]; q.style.animation = 'none'; void q.offsetWidth; q.style.animation = '';
    $('#bonBtns').classList.remove('done'); $$('#bonBtns .btn').forEach((x) => { x.classList.remove('picked'); x.disabled = false; });
    $('#bonWhy').hidden = true;
    t0 = Date.now(); timerEl.classList.remove('low');
    stopTimer();
    timer = setInterval(() => {
      const left = Math.max(0, 10 - (Date.now() - t0) / 1000);
      timerEl.style.setProperty('--p', (left / 10) * 100);
      $('#bonSec').textContent = Math.ceil(left);
      if (left < 3.5) timerEl.classList.add('low');
      if (left <= 0) choose(null);
    }, 100);
  };
  const choose = (v, e) => {
    if (answered) return; answered = true; stopTimer(); timerEl.classList.remove('low');
    $$('#bonBtns .btn').forEach((x) => { x.disabled = true; if (x.dataset.v === v) x.classList.add('picked'); });
    $('#bonBtns').classList.add('done');
    if (v === 'brave') brave++;
    $('#bonSay').textContent = v === 'brave' ? 'Tell the group: "I\'d do it, because..."' : v === 'nope' ? 'Tell the group: "I\'d never do it, because..."' : 'Time\'s up! Silence means nope. "I\'d never do it, because..."';
    $('#bonWhy').hidden = false;
    $('#bonNext').textContent = i < BON.length - 1 ? 'Next situation' : 'See my result';
    R.push({ [i + '/' + me().id]: v || 'nope' });
    if (v) { Snd.pop(); act.courage(1, ...ptOf(e, $('#bonBtns'))); } else Snd.wrong();
  };
  $('#bonGo').addEventListener('click', () => { Snd.unlock(); Snd.whoosh(); i = 0; brave = 0; $('#bonResult').hidden = true; box.classList.add('running'); show(); });
  $('#bonBtns').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (b) choose(b.dataset.v, e); });
  $('#bonNext').addEventListener('click', () => {
    i++;
    if (i < BON.length) { show(); return; }
    box.classList.remove('running');
    const [, title, text] = BON_RESULT.find(([max]) => brave <= max);
    const r = $('#bonResult'); r.hidden = false;
    r.innerHTML = `<div class="bon-meter">${BON.map((_, k) => `<i class="${k < brave ? 'b' : ''}"></i>`).join('')}</div>
      <p>You said "I'd do it" <b style="display:inline;font:inherit;font-weight:800">${brave} / ${BON.length}</b> times. You are...</p><b>${esc(title)}</b><p>${esc(text)}</p><p>Compare with the group: who is the bravest in the room?</p>`;
    $('#bonGo').textContent = 'Play again';
    S.stats.brave = brave; Snd.tada();
    act.complete('hall', 'Warmed Up', 'Six quick decisions. Nobody ran away.');
    renderPass();
  });
  paintBoard({});
}

/* ================= 2 · THE NURSERY · TORCH SEARCH ================= */
const GAPS = [
  { pre: 'When Tom was little, he', opts: ['used to', 'use to', 'was used'], ans: 'used to', post: 'sleep with the light on.', rule: 'used to + verb: something you did often in the past.' },
  { pre: 'He', opts: ["didn't use to", "didn't used to", 'not used to'], ans: "didn't use to", post: 'like the dark at all.', rule: 'After didn\'t there is no -d: didn\'t use to.' },
  { pre: '', opts: ['Did', 'Do', 'Was'], ans: 'Did', post: 'he use to look under the bed every night?', rule: 'Questions: Did + person + use to...?' },
  { pre: 'His mum', opts: ['used to', 'uses to', 'using to'], ans: 'used to', post: 'leave the door open a little.', rule: 'used to is the same for everyone: I, he, she, they used to.' },
  { pre: 'Now Tom is 46. He', opts: ["doesn't sleep", 'used to sleep', "didn't use to sleep"], ans: "doesn't sleep", post: "with the light on any more. But he's still afraid of spiders.", rule: 'Now = Present Simple. used to only talks about the past.' },
];
const NLETTERS = [
  { ch: 'L', x: 11.4, y: 63.5, r: -8 }, { ch: 'I', x: 89.8, y: 43, r: 10 }, { ch: 'G', x: 61.5, y: 60, r: -12 },
  { ch: 'H', x: 78, y: 68.6, r: 6 }, { ch: 'T', x: 44.2, y: 88, r: -6 },
];
const NEYES = [
  { x: 17, y: 50, msg: 'Two eyes on the wardrobe... Oh. Just two old door knobs.' },
  { x: 74.5, y: 80, msg: "Something under the bed! ...Slippers. Grandma sewed eyes on them." },
  { x: 57, y: 47.5, msg: 'Eyes at the window! It\'s only a little toy owl.' },
];
const GSTARS = [[44, 6], [55, 3], [68, 8], [93, 6], [97, 22], [72, 30], [36, 24], [62, 66]];
function initNursery() {
  const scene = $('#nscene'), cv = $('#ntorch'), ctx = cv.getContext('2d');
  $('#nletters').innerHTML = NLETTERS.map((l, k) => `<span class="nl" data-k="${k}" style="left:${l.x}%;top:${l.y}%;--r:${l.r}deg">${l.ch}</span>`).join('');
  $('#neyes').innerHTML = NEYES.map((e, k) => `<span class="eye-pair" data-k="${k}" style="left:${e.x}%;top:${e.y}%"><i></i><i></i></span>`).join('') +
    GSTARS.map(([x, y]) => `<span class="gstar" style="left:${x}%;top:${y}%"></span>`).join('');
  let torch = { x: 50, y: 50 }, running = false, shownNote = null;
  const R = roomState('nursery', paint);
  const pct = (cx, cy) => { const r = scene.getBoundingClientRect(); return [((cx - r.left) / r.width) * 100, ((cy - r.top) / r.height) * 100]; };
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, (ay - by) * 0.75);
  const size = () => { const r = scene.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); };
  const draw = (tm) => {
    const W = cv.width, H = cv.height;
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(4,6,10,.975)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out';
    const RR = W * 0.13 * (1 + Math.sin((tm || 0) / 110) * 0.02 + (Math.random() - 0.5) * 0.025);
    const x = (torch.x / 100) * W, y = (torch.y / 100) * H;
    const g = ctx.createRadialGradient(x, y, 0, x, y, RR);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.6, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, RR, 0, Math.PI * 2); ctx.fill();
  };
  const loop = (tm) => { if (!running) return; draw(tm); requestAnimationFrame(loop); };
  new IntersectionObserver(([en]) => {
    const want = en.isIntersecting && !scene.classList.contains('lit');
    if (want && !running) { running = true; size(); requestAnimationFrame(loop); } else if (!want) running = false;
  }).observe(scene);
  addEventListener('resize', size);
  const msg = (t) => { const m = $('#nmsg'); m.textContent = t; m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); };

  function paint(st) {
    st = st || {};
    const got = st.got || {}, eyes = st.eyes || {}, open = typeof st.open === 'number' ? st.open : -1;
    const n = Object.keys(got).length;
    NLETTERS.forEach((l, k) => {
      const on = !!got[k];
      $(`.nl[data-k="${k}"]`).classList.toggle('got', on);
      const slot = $$('#letters span')[k];
      if (slot) { slot.textContent = on ? l.ch : ''; slot.classList.toggle('on', on); }
    });
    NEYES.forEach((e, k) => { const el = $(`.eye-pair[data-k="${k}"]`); if (el) el.classList.toggle('gone', !!eyes[k]); });
    if (open >= 0) showNote(open, st.note || 0, !!st.solved);
    else { $('#nnote').hidden = true; shownNote = null; }
    if (n >= NLETTERS.length) {
      if (!scene.classList.contains('lit')) { scene.classList.add('lit'); running = false; msg('L, I, G, H, T. You found the light.'); }
      $('#sayRow').hidden = !!S.keys.nursery;
    }
  }
  function showNote(k, note, solved) {
    const G = GAPS[note]; if (!G) return;
    const n = $('#nnote'); n.hidden = false;
    const tag = k + ':' + note + ':' + solved;
    if (shownNote === tag) return;
    const fresh = shownNote === null || shownNote.split(':')[0] !== String(k);
    shownNote = tag;
    if (fresh) { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; }
    $('#noteH').textContent = `The Collector's notes - Tom, age 7, 1987 - note ${note + 1} / 5`;
    if (solved) {
      $('#noteS').innerHTML = `${esc(G.pre)} <span class="gap-ok">${esc(G.ans)}</span> ${esc(G.post)}`;
      const rule = $('#noteRule'); rule.hidden = false; rule.textContent = G.rule;
    } else {
      $('#noteS').innerHTML = `${esc(G.pre)} <span class="gap-slot">${shuffle(G.opts).map((o) => `<button>${esc(o)}</button>`).join('')}</span> ${esc(G.post)}`;
      $('#noteRule').hidden = true;
      if (fresh) n.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  const offset = (e) => (e.pointerType === 'touch' ? 9 : 0);
  scene.addEventListener('pointermove', (e) => { const [x, y] = pct(e.clientX, e.clientY); torch = { x, y: y - offset(e) }; });
  scene.addEventListener('pointerdown', (e) => {
    Snd.unlock();
    const [x, y] = pct(e.clientX, e.clientY);
    torch = { x, y: y - offset(e) };
    if (scene.classList.contains('lit')) return;
    const st = R.get(), got = st.got || {}, eyes = st.eyes || {};
    const open = typeof st.open === 'number' ? st.open : -1;
    const k = NLETTERS.findIndex((l, i) => !got[i] && dist(x, y, l.x, l.y) < 7);
    if (k >= 0) {
      if (open >= 0 && !st.solved) { msg('Finish the note first!'); $('#nnote').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
      Snd.pop();
      msg(`You found the letter ${NLETTERS[k].ch}! Read the note.`);
      R.push({ open: k, note: Object.keys(got).length, solved: false });
      return;
    }
    const ey = NEYES.findIndex((ee, i) => !eyes[i] && dist(x, y, ee.x, ee.y) < 6);
    if (ey >= 0) {
      msg(NEYES[ey].msg); Snd.whisper();
      R.push({ ['eyes/' + ey]: true });
      act.fake('eyes', 'Got scared of something with eyes. It was not a monster.');
      return;
    }
    msg(pick(['Nothing here. Just dust.', 'Only shadows.', 'Brrr. It feels cold here.', 'Keep looking!', 'Was that a whisper? No. Nothing.']));
  });
  $('#noteS').addEventListener('click', (e) => {
    const b = e.target.closest('.gap-slot button'); if (!b) return;
    const st = R.get(), k = typeof st.open === 'number' ? st.open : -1;
    if (k < 0 || st.solved) return;
    const G = GAPS[st.note || 0];
    if (b.textContent !== G.ans) { b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); Snd.wrong(); return; }
    Snd.chime(); act.courage(2, ...ptOf(e, b));
    const left = NLETTERS.length - (Object.keys(st.got || {}).length + 1);
    R.push({ ['got/' + k]: true, solved: true });
    if (left > 0) msg(`${left} more to find.`);
  });
  $('#sayBtn').addEventListener('click', () => {
    Snd.unlock(); Snd.musicBox(); $('#sayRow').hidden = true;
    releaseJar('nursery', 'Key of Light', 'Things in the dark are only things.');
  });
  paint({});
}

/* ================= 3 · THE KITCHEN ================= */
const WORDS = [
  { w: 'terrified', d: 'Extremely afraid. Much more than just scared.', ex: "I'm ___ of flying. I always take the train." },
  { w: 'anxious', d: 'Worried and nervous about something that might happen.', ex: 'She always feels ___ the night before an exam.' },
  { w: 'panic', d: 'To suddenly feel so afraid that you can\'t think clearly.', ex: "Don't ___! We'll find the key." },
  { w: 'freeze', d: 'To stop moving completely because you are very scared.', ex: 'When I saw the shadow, I couldn\'t move. I ___.' },
  { w: 'avoid', d: 'To stay away from something or someone on purpose.', ex: 'He tries to ___ dark streets at night.' },
  { w: 'comfort zone', d: 'The situation where you feel safe, relaxed and in control.', ex: 'Moving to a new city took me out of my ___.' },
  { w: 'face', d: 'To deal with something difficult instead of running away from it.', ex: "It's time to ___ your fear and open the door." },
  { w: 'brave', d: 'Ready to do something difficult or dangerous, even when you are afraid.', ex: 'It was very ___ of you to speak first.' },
  { w: 'nervous', d: 'A little worried, especially before something important.', ex: "I'm always ___ before a job interview." },
  { w: 'nightmare', d: 'A very bad, frightening dream.', ex: 'I had a ___ about falling from a tall building.' },
  { w: 'calm down', d: 'To become quiet and relaxed after being upset or excited.', ex: 'Take a deep breath and ___.' },
  { w: 'relief', d: 'The good feeling when something bad or worrying is finally over.', ex: 'What a ___! The door is open at last.' },
];
const POTION = ['#8fe0d0', '#9be22d', '#57c4b8', '#b9a8f0', '#e07a8f', '#ffb347', '#7fd3ff', '#c9a8ff', '#5fe3a1', '#ff8fc2', '#ffd27a', '#f2b544'];
const SHAPES = ['round', 'tall', 'flask', 'square'];
const BOT_COLS = ['#e07a8f', '#9be22d', '#57c4b8', '#f2b544', '#b9a8f0', '#ff8a5a'];
function initKitchen() {
  let order = null, shownStep = -1, flying = false;
  const R = roomState('kitchen', paint);
  const makeOrder = () => (Sync.live && Sync.code ? seededShuffle(WORDS, Sync.code) : shuffle(WORDS));
  const stepOf = (st) => (st && typeof st.i === 'number' ? st.i : 0);
  function paint(st) {
    if (!order) order = makeOrder();
    const i = stepOf(st);
    S.stats.words = i;
    $('#potionN').textContent = i;
    $('#potionBar').style.width = (i / WORDS.length) * 100 + '%';
    $('#cauldron').style.setProperty('--potion', POTION[i % POTION.length]);
    if (i >= WORDS.length) {
      $('#recipe').hidden = true; $('#potionDone').hidden = false; shownStep = i;
      return;
    }
    $('#recipe').hidden = false; $('#potionDone').hidden = true;
    if (shownStep === i) return;
    shownStep = i;
    const W = order[i];
    $('#stepN').textContent = i + 1;
    $('#rdef').textContent = W.d;
    $('#rex').innerHTML = esc(W.ex).replace('___', '<span class="gap">&nbsp;</span>');
    const opts = shuffle([W, ...shuffle(WORDS.filter((x) => x !== W)).slice(0, 3)]);
    const cols = shuffle(BOT_COLS), shp = shuffle(SHAPES);
    $('#bottles').innerHTML = opts.map((o, k) => `<button class="bottle-btn" data-w="${esc(o.w)}"><div class="b-art">${ART.bottle(shp[k], cols[k])}</div><span class="b-lbl">${esc(o.w)}</span></button>`).join('');
  }
  $('#bottles').addEventListener('click', async (e) => {
    const b = e.target.closest('.bottle-btn'); if (!b || flying) return;
    Snd.unlock();
    const i = stepOf(R.get()), W = order[i];
    if (!W || b.classList.contains('gone')) return;
    if (b.dataset.w !== W.w) {
      b.classList.add('nope'); setTimeout(() => b.classList.add('tried'), 450);
      Snd.burp(); const bp = $('#burp'); bp.hidden = false; bp.style.animation = 'none'; void bp.offsetWidth; bp.style.animation = '';
      const c = $('#cauldron'); c.classList.remove('angry'); void c.offsetWidth; c.classList.add('angry');
      setTimeout(() => { bp.hidden = true; }, 1200);
      act.fake('burp', 'The potion did not like that ingredient.');
      return;
    }
    flying = true;
    $('#rex').innerHTML = esc(W.ex).replace('___', `<span class="filled">${esc(W.w)}</span>`);
    const from = $('.b-art', b).getBoundingClientRect(), to = $('#cauldron').getBoundingClientRect();
    const fl = document.createElement('div'); fl.className = 'flyer'; fl.innerHTML = $('.b-art', b).innerHTML;
    Object.assign(fl.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px' });
    document.body.appendChild(fl); b.classList.add('gone');
    const dx = to.left + to.width / 2 - from.left - from.width / 2, dy = to.top + to.height * 0.3 - from.top - from.height / 2;
    await fl.animate([
      { transform: 'translate(0,0) rotate(0) scale(1)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) rotate(-120deg) scale(1.1)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) rotate(-200deg) scale(.4)`, opacity: 0.2 },
    ], { duration: 750, easing: 'ease-in-out' }).finished.catch(() => {});
    fl.remove();
    const c = $('#cauldron'); c.classList.remove('splash'); void c.offsetWidth; c.classList.add('splash');
    Snd.bubble();
    const cr = c.getBoundingClientRect(); act.courage(2, cr.left + cr.width / 2, cr.top + 40);
    await sleep(700);
    flying = false;
    R.push({ i: i + 1 });
    if (i + 1 >= WORDS.length) {
      $('#spellbook').open = true;
      releaseJar('kitchen', 'Key of Courage', 'Twelve brave words in one pot.');
    }
  });
  $('#drinkBtn').addEventListener('click', () => {
    Snd.unlock(); Snd.bubble(); Snd.chime();
    document.body.classList.remove('brave'); void document.body.offsetWidth; document.body.classList.add('brave');
    setTimeout(() => document.body.classList.remove('brave'), 2500);
    act.fake('potion', 'Drank something glowing. Feeling... braver?');
  });
  $('#potionAgain').addEventListener('click', () => { shownStep = -1; R.push({ i: 0 }); });
  $('#wordList').innerHTML = WORDS.map((W) => `<div class="word"><b>${esc(W.w)}</b>${esc(W.d)}<i>${esc(W.ex.replace('___', W.w))}</i></div>`).join('');
  paint({});
}

/* ================= 4 · THE LIBRARY ================= */
const BQ = [
  { q: "What's strange about the books in this library?", opts: [['They are all unfinished.', 4], ['They are all about ghosts.'], ['They have no words inside.']] },
  { q: 'Why did Clara stop writing?', opts: [['She was too busy at work.'], ['She was afraid the book was bad and people would laugh.', 7], ['She lost the last pages.']] },
  { q: 'What does Clara regret when she is eighty?', opts: [['Failing at many things.'], ['Writing the book in the first place.'], ['Never writing page 100.', 2]] },
];
const CODE = '472';
function initLibrary() {
  const R = roomState('library', paint);
  $('#bqList').innerHTML = BQ.map((q, i) => `<div class="bq-row" data-i="${i}"><p>${i + 1}. ${esc(q.q)}</p><div class="bq-opts">${shuffle(q.opts).map((o) => `<button class="btn" data-d="${o[1] ?? ''}">${esc(o[0])}</button>`).join('')}</div></div>`).join('');
  function paint(st) {
    st = st || {};
    if (st.open) {
      $('#book').hidden = false; $('#lockZone').hidden = false;
      $('#openBook').hidden = true; $('#shelfHint').hidden = true;
    }
    const ans = st.ans || {};
    Object.keys(ans).forEach((i) => {
      const row = $(`.bq-row[data-i="${i}"]`); if (!row || row.dataset.done) return;
      row.dataset.done = '1';
      const b = $$('.bq-opts .btn', row).find((x) => x.dataset.d === String(ans[i]));
      if (b) b.classList.add('right');
      $$('.bq-opts .btn', row).forEach((x) => { if (x !== b) x.disabled = true; });
      $('p', row).insertAdjacentHTML('beforeend', `<span class="digit">${esc(String(ans[i]))}</span>`);
    });
    if (st.code) {
      const combo = $('#combo');
      if (!combo.classList.contains('ok')) { combo.classList.add('ok'); $('#codeMsg').textContent = 'Click. The lock opens.'; }
    }
  }
  $('#openBook').addEventListener('click', () => {
    Snd.unlock(); Snd.page();
    R.push({ open: true });
    $('#book').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#bqList').addEventListener('click', (e) => {
    const b = e.target.closest('.bq-opts .btn'); if (!b) return;
    const row = b.closest('.bq-row'); if (row.dataset.done) return;
    Snd.unlock();
    if (!b.dataset.d) { b.classList.add('wrong'); b.disabled = true; Snd.wrong(); return; }
    Snd.chime(); act.courage(2, ...ptOf(e, b));
    R.push({ ['ans/' + row.dataset.i]: b.dataset.d });
  });
  const wheels = $$('#combo .wheel'), val = [0, 0, 0];
  wheels.forEach((w, k) => {
    $('.up', w).addEventListener('click', () => { val[k] = (val[k] + 1) % 10; $('b', w).textContent = val[k]; Snd.tick(); });
    $('.dn', w).addEventListener('click', () => { val[k] = (val[k] + 9) % 10; $('b', w).textContent = val[k]; Snd.tick(); });
  });
  $('#tryCode').addEventListener('click', () => {
    Snd.unlock();
    const code = val.join(''), combo = $('#combo'), msg = $('#codeMsg');
    if (S.keys.library) return;
    if (code === CODE) {
      msg.textContent = 'Click. The lock opens.'; Snd.lock();
      R.push({ code: true });
      releaseJar('library', 'Key of the Last Page', 'Clara would be proud of you.');
      return;
    }
    combo.classList.remove('bad'); void combo.offsetWidth; combo.classList.add('bad'); Snd.wrong();
    msg.textContent = 'Not this code. Look at the numbers next to your answers.';
    if (code === '000') act.fake('lock000', 'Tried 0-0-0. Bold strategy.');
    else act.fake('lockwrong', 'The lock is not impressed.');
  });
  paint({});
}

/* ================= 5 · THE HALL OF MIRRORS ================= */
const MIRRORS = [
  { critic: "Don't say anything. Your English isn't good enough.", idea: 'Nobody speaks perfectly. People remember what you say, not your mistakes.' },
  { critic: "Everyone else has their life together. Why don't you?", idea: 'Nobody has their life together. Some people are just better at hiding it.' },
  { critic: 'If you fail, everyone will remember it forever.', idea: 'Most people are too busy with their own lives to remember my mistakes.' },
  { critic: "It's too late to start something new.", idea: "In five years I'll be five years older anyway. Why not with a new skill?" },
];
function initMirrors() {
  $('#mirrorGrid').innerHTML = MIRRORS.map((m, i) => `<div class="mirror-card" data-i="${i}">
      <div class="m-art">${ART.mirror()}</div>
      <div><p class="m-critic">${esc(m.critic)}</p>
        <div class="m-form"><textarea rows="3" maxlength="200" placeholder="Talk back..."></textarea>
          <div class="m-btns"><button class="btn small btn-gold m-go">Talk back</button><button class="m-idea">Need an idea?</button></div>
          <p class="m-sample" hidden>${esc(m.idea)}</p></div></div></div>`).join('');
  const R = roomState('mirrors', paint);
  function paint(st) {
    st = st || {};
    let broken = 0;
    MIRRORS.forEach((m, i) => {
      const e = st[i]; if (!e) return;
      broken++;
      const card = $(`.mirror-card[data-i="${i}"]`);
      if (!card || card.classList.contains('broken')) return;
      card.classList.add('broken');
      const form = $('.m-form', card);
      const by = e.name ? `<span class="m-by">${artHTML('av_' + (e.avatar || 'mummy'))}${esc(e.name)}</span>` : '';
      if (form) form.outerHTML = `<p class="m-reply">${esc(e.text)}${by}</p>`;
    });
    S.stats.mirrors = broken;
  }
  $('#mirrorGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.mirror-card'); if (!card) return;
    Snd.unlock();
    if (e.target.closest('.m-idea')) { $('.m-sample', card).hidden = false; Snd.pop(); act.fake('idea', 'Borrowed some kindness. Please give it back later.'); return; }
    if (!e.target.closest('.m-go')) return;
    const ta = $('textarea', card), t = ta.value.trim();
    if (t.split(/\s+/).filter(Boolean).length < 3) { ta.classList.remove('bad'); void ta.offsetWidth; ta.classList.add('bad'); Snd.wrong(); ta.placeholder = 'Write at least a few words...'; return; }
    const m = me();
    Snd.glass();
    act.courage(3, ...ptOf(e, card));
    const i = card.dataset.i;
    const was = Object.keys(R.get() || {}).filter((k) => /^\d+$/.test(k)).length;
    R.push({ [i]: { text: t, name: m.name, avatar: m.avatar, by: m.id } });
    if (was + 1 === MIRRORS.length) setTimeout(() => releaseJar('mirrors', 'Key of Mirrors', 'You talked back to your inner critic. Four times.'), 900);
  });
  paint({});
}

/* ================= 6 · THE CANDLE ROOM · THE FIVE CANDLES (team puzzle) ================= */
/* solution: blue, white, green, red, gold. Every clue is needed:
   gold must be last (red, green, white and blue can't be), then only white-green in 2-3 works */
const FC_CANDLES = [
  { id: 'green', wax: '#4f9e62', drip: '#7cc48c', h: 78 },
  { id: 'gold', wax: '#e2a93a', drip: '#f6cf72', h: 104 },
  { id: 'blue', wax: '#4a72c0', drip: '#7a9ce0', h: 88 },
  { id: 'white', wax: '#efe3c8', drip: '#fff8e6', h: 96 },
  { id: 'red', wax: '#c4424e', drip: '#e0707a', h: 70 },
];
const FC_SOLUTION = ['blue', 'white', 'green', 'red', 'gold'];
const FC_CLUES = [
  'The blue candle burns before the red one, but not just before it.',
  'The green candle is lit just after the white one.',
  'The red candle is not the last one.',
  'The last candle is not green.',
];
const FC_HINTS = [
  'Start at the end. Which candle can be the last one?',
  "Red can't be last, and green can't be last. White can't be last either (green comes after it), and blue can't be last (red comes after it).",
  'So gold is the last candle. Now put the white and green pair in places 1-2, 2-3 or 3-4 and check the blue and red clue.',
];
const ENV_SVG = (n) => `<svg viewBox="0 0 120 82"><rect x="4" y="4" width="112" height="74" rx="6" fill="#f1e4c8" stroke="#1b1622" stroke-width="3"/>
  <path d="M4 10 L60 48 L116 10" fill="none" stroke="#1b1622" stroke-width="3"/><circle cx="60" cy="48" r="12" fill="#a8242e" stroke="#1b1622" stroke-width="2"/>
  <text x="60" y="54" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="16" fill="#f4c1c4">${n}</text></svg>`;
const candleHTML = (id) => {
  const E = typeof EMBEDDED !== 'undefined' ? EMBEDDED : {}, body = E['candle_' + id], fl = E.candleFlame;
  if (!body || !fl) return ART.roomCandle(78, '#e2a93a', '#f6cf72');
  return `<div class="cd"><div class="c-glow"></div><img class="c-flame" src="${fl}" alt=""><img class="cd-body" src="${body}" alt=""><i class="c-smoke"></i></div>`;
};
function initCandles() {
  const altar = $('#altar'), row = $('#altarCandles'), msg = $('#fcMsg');
  let busy = false, hint = 0, tries = 0, lastShown = '';
  const R = roomState('candles', paint);
  $('#envs').innerHTML = FC_CLUES.map((_, i) => `<button class="env" data-i="${i}" aria-label="Clue ${i + 1}">${ENV_SVG(i + 1)}<b>Clue ${i + 1}</b></button>`).join('');
  $('#envs').addEventListener('click', (e) => {
    const b = e.target.closest('.env'); if (!b) return;
    Snd.unlock(); Snd.page();
    const i = +b.dataset.i, mine = Sync.live ? Sync.myClue() : -1;
    if (mine >= 0 && i !== mine) {
      msg.className = 'fc-msg bad';
      msg.textContent = `That envelope belongs to someone else. Yours is Clue ${mine + 1}.`;
      Snd.wrong(); return;
    }
    $$('.env').forEach((x) => x.classList.toggle('sel', x === b)); b.classList.add('open');
    const box = $('#clueOpen'); box.hidden = false; box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
    box.innerHTML = `<small>Clue ${i + 1} - read it to your team</small><p>${esc(FC_CLUES[i])}</p><button id="clueHide">Hide my clue</button>`;
    if ($$('.env.open').length === 1) act.fake('clue', 'Opened a secret envelope. Felt like a spy.');
  });
  $('#clueOpen').addEventListener('click', (e) => {
    if (e.target.id !== 'clueHide') return;
    $('#clueOpen').hidden = true; $$('.env').forEach((x) => x.classList.remove('sel'));
  });
  row.innerHTML = FC_CANDLES.map((c) => `<button class="ac" data-id="${c.id}" aria-label="${c.id} candle">${candleHTML(c.id)}<span class="ac-n"></span><span class="ac-l">${c.id}</span></button>`).join('');

  const orderOf = (st) => (st && Array.isArray(st.order) ? st.order : []);
  function paint(st) {
    st = st || {};
    const order = orderOf(st), solved = !!st.solved;
    const tag = order.join() + '|' + solved;
    if (tag === lastShown) return;
    const wasFull = lastShown.split('|')[0].split(',').filter(Boolean).length === 5;
    lastShown = tag;
    $$('.ac', row).forEach((b) => {
      const k = order.indexOf(b.dataset.id);
      b.classList.toggle('lit', k >= 0);
      b.classList.remove('gust');
      $('.ac-n', b).textContent = k >= 0 ? k + 1 : '';
      if (!order.length && wasFull) { b.classList.remove('smoke'); void b.offsetWidth; b.classList.add('smoke'); }
    });
    altar.style.setProperty('--a', order.length / 5);
    if (solved) {
      altar.classList.add('won');
      $$('.ac', row).forEach((x) => x.classList.add('win'));
      msg.className = 'fc-msg good'; msg.textContent = 'All five flames burn high. The wax melts... and inside it, there is a key!';
      $('#candles').style.setProperty('--lit', 1);
      return;
    }
    if (order.length === 5) {
      altar.classList.remove('wind'); void altar.offsetWidth; altar.classList.add('wind');
      Snd.whisper();
      $$('.ac', row).forEach((x) => x.classList.add('gust'));
      msg.className = 'fc-msg bad'; msg.textContent = 'A cold wind blows all the candles out. Wrong order. Check your clues again!';
      return;
    }
    if (!order.length && wasFull) return;
    msg.className = 'fc-msg';
    msg.textContent = order.length ? `${5 - order.length} more...` : 'Tap the candles in the order you think is right.';
  }
  row.addEventListener('click', async (e) => {
    const b = e.target.closest('.ac'); if (!b || busy) return;
    const st = R.get(), order = orderOf(st);
    if (st.solved || order.length >= 5 || order.indexOf(b.dataset.id) >= 0) return;
    Snd.unlock(); Snd.whoosh();
    const next = order.concat(b.dataset.id);
    R.push({ order: next });
    if (next.length < 5) return;
    busy = true;
    await sleep(700);
    if (next.join() === FC_SOLUTION.join()) {
      R.push({ solved: true });
      Snd.chime(); Snd.tada();
      setTimeout(() => releaseJar('candles', 'Key of Fire', 'Five candles, one team. Nobody did it alone.'), 900);
      busy = false; return;
    }
    tries++;
    await sleep(900);
    R.push({ order: [] });
    if (tries === 3) act.fake('tries', 'Tried three orders. That is called science.');
    busy = false;
  });
  $('#fcReset').addEventListener('click', () => {
    const st = R.get();
    if (busy || st.solved) return;
    Snd.whisper(); R.push({ order: [] });
  });
  $('#fcHint').addEventListener('click', () => {
    Snd.unlock(); Snd.whisper();
    const t = $('#fcHintText'); t.hidden = false;
    t.textContent = `"${FC_HINTS[Math.min(hint, FC_HINTS.length - 1)]}" C.`;
    hint++;
    if (hint >= FC_HINTS.length) $('#fcHint').disabled = true;
    if (hint === 2) act.fake('hint', 'Asked a villain for help. Bold.');
  });
  paint({});
}

/* ================= OPTIONAL · THE CLOCK ROOM ================= */
const CLOCK_Q = [
  'What change in your life scared you, but turned out well?',
  'If you could go back ten years, what would you tell yourself?',
  'What do you want to change, but keep putting off?',
  'Is there something you\'re afraid of losing?',
  'Which habit are you scared to give up, even though it\'s not good for you?',
  'Do you think people really change? Have you?',
  'At fifteen, what did you think your life would look like now?',
  'What would you do with one extra hour every day?',
  'Which is harder for you: starting something new or ending something old?',
  "What's one thing you'd like to stay exactly the same forever?",
  'When did you last surprise yourself?',
  'What are you looking forward to this year?',
];
function initClock() {
  let angle = 0, spinning = false, spins = 0, shown = '';
  const hand = () => $('#bigClock .clock-hand');
  const R = roomState('clock', paint);
  async function paint(st) {
    st = st || {};
    const used = st.used || {};
    $$('#bigClock .cnum').forEach((c) => c.classList.toggle('used', !!used[c.dataset.n]));
    const tag = String(st.t || '');
    if (!st.n || tag === shown) { if (!st.n) { $('#clockQ').hidden = true; $$('#bigClock .cnum').forEach((c) => c.classList.remove('now')); } return; }
    shown = tag;
    const n = st.n;
    spinning = true; $('#spinBtn').disabled = true;
    const target = n * 30;
    angle = angle - (angle % 360) + 720 + target + (target <= angle % 360 ? 360 : 0);
    if (hand()) hand().style.transform = `rotate(${angle}deg)`;
    let t = 0; const iv = setInterval(() => { Snd.tick(); t++; if (t > 26) clearInterval(iv); }, 110);
    $$('#bigClock .cnum').forEach((c) => c.classList.remove('now'));
    await sleep(3300);
    clearInterval(iv); Snd.dong();
    const num = $(`#bigClock .cnum[data-n="${n}"]`); if (num) num.classList.add('now', 'used');
    $('#clockQ').hidden = false; $('#cqN').textContent = n; $('#cqText').textContent = CLOCK_Q[n - 1];
    spinning = false; $('#spinBtn').disabled = false;
  }
  $('#spinBtn').addEventListener('click', () => {
    if (spinning || !hand()) return;
    Snd.unlock();
    const st = R.get();
    let used = st.used || {};
    if (Object.keys(used).length >= 12) { R.push({ used: {} }); used = {}; }
    const free = [...Array(12).keys()].map((x) => x + 1).filter((x) => !used[x]);
    const n = pick(free);
    spins++;
    R.push({ n, t: Date.now(), ['used/' + n]: true });
    if (spins === 3) act.fake('spin', "Spun time three times. Time didn't notice.");
    if (spins === 1) act.complete('clock');
  });
  $('#clockReset').addEventListener('click', () => {
    shown = ''; Snd.pop();
    $$('#bigClock .cnum').forEach((c) => c.classList.remove('used', 'now'));
    $('#clockQ').hidden = true;
    R.push({ used: {}, n: 0, t: 0 });
  });
}

/* ================= 6 · THE FRONT DOOR ================= */
const FINALE = [
  { t: 'Click. Click. Click. Click. Click.', sfx: 'lock' },
  { t: 'Five keys. Five open locks.' },
  { t: "But the door doesn't move." },
  { t: 'Behind you, a soft voice: "Leaving so soon?"', cls: 'whisper', sfx: 'whisper' },
  { t: "You turn around. There's nobody there." },
  { t: 'Only your shadow on the wall.' },
  { t: "But your shadow isn't copying you." },
  { h: `<span class="cin-shadow">${'COLLECTOR'}</span><br>It stretches. It grows a tall black hat. It bows.`, t: 'It stretches. It grows a tall black hat. It bows.', hold: 4200 },
  { t: 'The Collector is your shadow.', cls: 'big', sfx: 'dong', hold: 3600 },
  { t: '"I keep your fears," it says. "The dark. The unknown. Failure. What people think. Being alone."', cls: 'whisper' },
  { t: '"I only wanted to keep you safe."', cls: 'whisper' },
  { t: '"But a house full of fears is not a home. It\'s a cage."', cls: 'whisper' },
  { t: '"The door was never really locked. Leave one fear here. Then go."', cls: 'whisper', hold: 4200 },
];
function renderDoorKeys() {
  const box = $('#doorKeys'); if (!box) return;
  box.innerHTML = KEY_ROOMS.map((r) => `<span class="${S.used[r] ? 'used' : S.keys[r] ? 'got' : ''}"><i>${S.keys[r] ? ART.key() : ART.keyEmpty()}</i>${ROOM_NAMES[r].replace('the ', '')}</span>`).join('') +
    '';
}
function renderFears() {
  $('#fearShelf').innerHTML = S.fears.map((f) => `<div class="fear-jar"><div class="fj-glass">${esc(f.text)}</div><div class="fj-who"><span class="mini-av">${artHTML('av_' + f.avatar)}</span>${esc(f.name)}</div></div>`).join('');
  $('#openDoor').disabled = S.fears.length === 0;
  renderPass();
}
function initDoor() {
  const door = $('#finalDoor');
  const say = (t) => { $('#doorSay').textContent = t; };
  door.addEventListener('click', async (e) => {
    const lock = e.target.closest('.lock'); if (!lock) return;
    Snd.unlock();
    const n = [1, 2, 3, 4, 5].find((k) => lock.classList.contains('lock' + k)), room = KEY_ROOMS[n - 1];
    if (S.used[room]) return;
    if (!S.keys[room]) {
      lock.classList.remove('need'); void lock.getBBox(); lock.classList.add('need'); Snd.wrong();
      say(`This lock needs the key from ${ROOM_NAMES[room]}.`); return;
    }
    S.used[room] = true; lock.classList.add('open'); Snd.lock(); renderDoorKeys(); Sync.set('used/' + room, true);
    const left = KEY_ROOMS.filter((r) => !S.used[r]).length;
    say(left ? `Click. ${left} more to go.` : 'All five locks are open...');
    if (!left) await finale();
  });
  /* host's secret: the skeleton key under the doormat (drag the mat aside) */
  const mat = $('#mat'), mkey = $('#matKey');
  mkey.innerHTML = ART.key();
  let sx = null, dx = 0;
  mat.addEventListener('pointerdown', (e) => { sx = e.clientX; dx = 0; mat.classList.add('dragging'); try { mat.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
  mat.addEventListener('pointermove', (e) => {
    if (sx === null) return;
    const base = mat.classList.contains('moved') ? mat.offsetWidth * 0.78 : 0;
    dx = Math.max(-base - 10, Math.min(240 - base, e.clientX - sx));
    mat.style.transform = `translateX(${base + dx}px) rotate(${(base + dx) / 60}deg)`;
  });
  const endDrag = () => {
    if (sx === null) return; sx = null; mat.classList.remove('dragging'); mat.style.transform = '';
    if (dx > 50 && !mat.classList.contains('moved')) { mat.classList.add('moved'); Snd.page(); }
    else if (dx < -40 && mat.classList.contains('moved')) { mat.classList.remove('moved'); Snd.page(); }
  };
  mat.addEventListener('pointerup', endDrag); mat.addEventListener('pointercancel', endDrag);
  mkey.addEventListener('click', () => {
    Snd.unlock();
    if (KEY_ROOMS.every((r) => S.keys[r])) { say("An old skeleton key. You don't need it: you found all five keys yourselves."); Snd.pop(); return; }
    KEY_ROOMS.forEach((r) => { S.keys[r] = true; }); renderKeys(); Snd.key();
    act.fake('skeleton', 'Found a key under the doormat. Classic hiding place.');
    say('A skeleton key! It fits every lock. Tap each lock.');
    mat.classList.remove('moved');
  });
  $('#fearBtn').addEventListener('click', () => {
    const ta = $('#fearText'), t = ta.value.trim();
    if (!t) { ta.classList.remove('bad'); void ta.offsetWidth; ta.classList.add('bad'); Snd.wrong(); return; }
    act.leaveFear(t); ta.value = ''; Snd.release();
    act.fake('fear', 'Travelling lighter now.');
  });
  $('#openDoor').addEventListener('click', async () => {
    if (S.done.door) return;
    Snd.unlock(); Snd.creak();
    $('#finalDoor').classList.add('opening');
    await sleep(1200);
    const fl = $('#flash'); fl.hidden = false; fl.style.animation = 'none'; void fl.offsetWidth; fl.style.animation = '';
    setTimeout(() => { fl.hidden = true; }, 2700);
    $('#door').classList.add('dawn'); Snd.dawn();
    $$('.mansion').forEach((m) => m.classList.add('lit-all'));
    $('#leave').hidden = true; $('#out').hidden = false; $('#pass').hidden = false;
    act.courage(10);
    act.complete('door', 'Free at Dawn', 'You walked out. The house let you go.');
    renderPass();
    setTimeout(() => $('#out').scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  });
  $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  renderDoorKeys();
}
async function finale() {
  await sleep(1100);
  const lines = FINALE.map((L) => (L.h ? { ...L, h: L.h.replace('COLLECTOR', artHTML('collector')) } : L));
  await cinema(lines);
  $('#doorSay').textContent = 'The Collector is waiting. Leave one fear behind, then open the door.';
  $('#leave').hidden = false;
  setTimeout(() => $('#leave').scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
}
function renderPass() {
  const m = me();
  if (!$('#pass')) return;
  $('#passName').textContent = m.name;
  $('#passAv').innerHTML = artHTML('av_' + m.avatar);
  $('#passStats').innerHTML = [
    ['Keys', `${Object.keys(S.keys).length} / 5`], ['Courage', S.courage], ['Brave answers', `${S.stats.brave || 0} / 6`],
    ['Words in the potion', `${S.stats.words} / 12`], ['Mirrors broken', `${S.stats.mirrors} / 4`], ['Fears left behind', S.fears.length],
  ].map(([l, v]) => `<span><b>${v}</b>${l}</span>`).join('');
  const mine = S.fears.filter((f) => f.by === m.id).map((f) => f.text);
  $('#passLeft').hidden = !mine.length;
  if (mine.length) $('#passLeft').textContent = `Left behind: "${mine.join('", "')}"`;
}

/* ================= TOP BAR ================= */
function initTopbar() {
  $$('.tbw').forEach((b) => b.addEventListener('click', () => scrollToRoom(b.dataset.go)));
  const mute = $('#muteBtn');
  mute.classList.toggle('muted', Snd.muted);
  mute.addEventListener('click', () => { Snd.setMuted(!Snd.muted); mute.classList.toggle('muted', Snd.muted); if (!Snd.muted) { Snd.unlock(); Snd.pop(); } });
  const here = new IntersectionObserver((ens) => {
    ens.forEach((en) => { if (en.isIntersecting) $$('.tbw').forEach((b) => b.classList.toggle('here', b.dataset.go === en.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.room').forEach((r) => here.observe(r));
}

/* rooms register here: when the room's shared state changes, their paint runs */
const SHARED = {};
const onShared = (key, fn) => { SHARED[key] = fn; };
/* a shuffle everyone in the same room gets identically (seeded by the room code) */
function seededShuffle(arr, seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/* ================= GROUP MODE (Firebase) =================
   Everything below only wakes up when FIREBASE_CONFIG at the top of the file
   is filled in. Without it the lesson stays exactly as it is: local only. */
const Sync = (() => {
  const CFG = (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG) || {};
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const PATH = 'lessons/fear-collector/rooms/';
  const able = !!(CFG.apiKey && CFG.databaseURL);
  let ref = null, code = '', live = false, players = {}, lastErr = '';
  const load = (f) => new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = SDK + f; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  });
  const clean = (c) => String(c || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 14);
  const apply = (d) => {
    d = d || {};
    players = d.players || {};
    if (typeof d.courage === 'number' && d.courage !== S.courage) { S.courage = d.courage; renderCourage(); }
    let rooms = false, keys = false;
    Object.keys(d.done || {}).forEach((r) => { if (!S.done[r]) { S.done[r] = true; rooms = true; } });
    Object.keys(d.keys || {}).forEach((r) => { if (!S.keys[r]) { S.keys[r] = true; keys = true; } });
    Object.keys(d.used || {}).forEach((r) => { if (!S.used[r]) { S.used[r] = true; keys = true; } });
    if (rooms) renderRooms();
    if (keys) { renderKeys(); renderLocks(); }
    const fears = Object.keys(d.fears || {}).sort().map((k) => d.fears[k]);
    if (fears.length !== S.fears.length) { S.fears = fears; renderFears(); }
    const g = d.game || {};
    Object.keys(SHARED).forEach((k) => { try { SHARED[k](g[k] || {}); } catch (e) { /* one room must not break the rest */ } });
    renderMates();
  };
  const api = {
    get able() { return able; },
    get live() { return live; },
    get code() { return code; },
    get players() { return players; },
    /* which of the 4 candle clues belongs to me: by the order people joined */
    myClue() {
      const ids = Object.keys(players).sort((a, b) => (players[a].t || 0) - (players[b].t || 0));
      const i = ids.indexOf(me().id);
      return i < 0 ? -1 : i % FC_CLUES.length;
    },
    get error() { return lastErr; },
    async connect(c) {
      if (!able) return 'off';
      code = clean(c); if (!code) return 'bad';
      lastErr = '';
      try {
        if (!window.firebase) { await load('firebase-app-compat.js'); await load('firebase-database-compat.js'); firebase.initializeApp(CFG); }
      } catch (e) { lastErr = 'the Firebase script did not load'; return 'nosdk'; }
      /* one real write first: it tells us straight away whether the rules let us in */
      try {
        ref = firebase.database().ref(PATH + code);
        await ref.child('ping').set(Date.now());
      } catch (e) {
        lastErr = (e && e.message) || String(e); live = false;
        return /permission|denied/i.test(lastErr) ? 'denied' : 'fail';
      }
      ref.on('value', (snap) => { try { apply(snap.val()); } catch (e) { /* keep playing */ } },
        (e) => { lastErr = (e && e.message) || String(e); });
      live = true; renderMates();
      try { localStorage.setItem('fc-room', code); } catch (e) { /* private mode */ }
      return 'ok';
    },
    /* the avatar is mine only if nobody else in the room has taken it */
    async claim(id, name, avatar) {
      if (!live) return true;
      try {
        const r = await ref.child('players').transaction((cur) => {
          cur = cur || {};
          const taken = Object.keys(cur).some((k) => k !== id && cur[k] && cur[k].avatar === avatar);
          if (taken) return undefined;
          cur[id] = { name, avatar, t: Date.now() };
          return cur;
        });
        return !!(r && r.committed);
      } catch (e) { return true; }
    },
    set(path, value) { if (live) try { ref.child(path).set(value); } catch (e) { /* ignore */ } },
    bump(path, n) { if (live) try { ref.child(path).transaction((v) => (v || 0) + n); } catch (e) { /* ignore */ } },
    push(path, value) { if (live) try { ref.child(path).push(value); } catch (e) { /* ignore */ } },
    async reset() { if (!live) return; try { await ref.remove(); } catch (e) { /* ignore */ } },
    leave() { try { localStorage.removeItem('fc-room'); } catch (e) { /* ignore */ } },
  };
  return api;
})();

function renderLocks() {
  const door = $('#finalDoor'); if (!door) return;
  KEY_ROOMS.forEach((r, i) => { if (S.used[r]) $('.lock' + (i + 1), door)?.classList.add('open'); });
  renderDoorKeys();
}
function renderMates() {
  const box = $('#mates'); if (!box) return;
  const p = Sync.players, ids = Object.keys(p).sort((a, b) => (p[a].t || 0) - (p[b].t || 0));
  box.hidden = !Sync.live;
  if (!Sync.live) return;
  box.innerHTML = `<span class="mates-l">Room <b>${esc(Sync.code)}</b></span>` +
    (ids.length ? ids.map((id) => `<span class="mate${id === me().id ? ' me' : ''}"><span class="mini-av">${artHTML('av_' + p[id].avatar)}</span>${esc(p[id].name)}</span>`).join('')
      : '<span class="mates-l">waiting for your club...</span>') +
    '<button class="mates-reset" id="resetRoom">Reset room</button>';
  $('#resetRoom').addEventListener('click', async () => {
    if (!confirm('Clear this room for a new group? Everyone loses the keys and the fears.')) return;
    await Sync.reset(); Sync.leave(); location.reload();
  });
  /* grey out the shadows other people already took */
  $$('#avatars .av-btn').forEach((b) => {
    const taken = ids.some((id) => id !== me().id && p[id].avatar === b.dataset.av);
    b.classList.toggle('taken', taken);
  });
}
function initRoom() {
  const row = $('#roomRow'); if (!row) return;
  row.hidden = !Sync.able;
  if (!Sync.able) return;
  const input = $('#roomIn'), msg = $('#roomMsg'), btn = $('#roomBtn');
  let saved = '';
  try { saved = new URLSearchParams(location.search).get('room') || localStorage.getItem('fc-room') || ''; } catch (e) { /* ignore */ }
  if (saved) input.value = saved;
  const go = async () => {
    btn.disabled = true; msg.textContent = 'Connecting...';
    const r = await Sync.connect(input.value);
    btn.disabled = false;
    if (r === 'ok') {
      msg.textContent = 'You are in room "' + Sync.code + '". Everyone who types this code plays with you.';
      row.classList.add('joined'); input.disabled = true; btn.hidden = true;
      if (S.me) Sync.claim(S.me.id, S.me.name, S.me.avatar);
    } else if (r === 'bad') { msg.textContent = 'Write a short code: letters or numbers.'; }
    else if (r === 'denied') { msg.textContent = 'The database refused: ' + Sync.error + ' — open Firebase, Realtime Database, Rules, and allow the branch lessons/fear-collector.'; }
    else if (r === 'nosdk') { msg.textContent = 'Firebase did not load. Check the internet connection and try again.'; }
    else { msg.textContent = "Couldn't reach the room: " + (Sync.error || 'unknown error') + '.'; }
  };
  btn.addEventListener('click', go);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  if (saved) go();
}

/* ================= START ================= */
paintArt();
initTopbar(); initGate(); initHall(); initNursery(); initKitchen(); initLibrary(); initMirrors(); initCandles(); initClock(); initDoor();
renderMe(); renderCourage(); renderRooms(); renderKeys(); renderFears(); renderPass();
initRoom();
