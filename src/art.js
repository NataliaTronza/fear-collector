/* =========================================================
   ART · original silhouette illustrations, no files needed
   Any of these can be swapped for your own picture in MY_IMAGES
   ========================================================= */
const SIL = '#0a0810';
const GOLD = '#f2b544';
const SV = (vb, inner, cls = '', par = '') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="${cls}" ${par ? `preserveAspectRatio="${par}"` : ''} aria-hidden="true" focusable="false">${inner}</svg>`;
let UID = 0;
const uid = (p) => p + (++UID);

/* ---------- small pieces ---------- */
function batG(c = SIL) {
  return `<path d="M50 30 C44 18 30 10 8 12 C16 18 18 26 14 34 C24 30 32 34 34 42 C40 36 46 38 50 46 C54 38 60 36 66 42 C68 34 76 30 86 34 C82 26 84 18 92 12 C70 10 56 18 50 30 Z" fill="${c}"/>
    <path d="M45 26 L44 18 L49 23 L51 23 L56 18 L55 26 Z" fill="${c}"/>`;
}
function crowG(c = SIL) {
  return `<path d="M10 40 C18 30 30 26 42 28 L50 22 C54 20 60 20 62 24 L70 26 L62 30 C62 38 56 44 46 46 L54 54 L48 54 L42 47 L36 48 L38 56 L33 56 L31 48 C22 48 14 46 10 40 Z" fill="${c}"/>`;
}
function birdG(c = SIL) {
  return `<path d="M0 18 C10 8 20 8 30 18 C40 8 50 8 60 18 C50 14 40 16 30 24 C20 16 10 14 0 18 Z" fill="${c}"/>`;
}
function mothG(c = '#f6ecd9') {
  return `<path d="M30 30 C20 12 4 10 2 20 C0 30 14 34 26 32 C12 38 8 50 16 52 C24 54 28 42 30 34 C32 42 36 54 44 52 C52 50 48 38 34 32 C46 34 60 30 58 20 C56 10 40 12 30 30 Z" fill="${c}"/>
    <path d="M30 26 L30 46" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
    <path d="M30 26 C28 20 24 16 22 14 M30 26 C32 20 36 16 38 14" stroke="${c}" stroke-width="1.5" fill="none"/>`;
}
function keyG(fill = GOLD, stroke = '#5a3a10') {
  return `<path d="M30 8 C40 8 48 16 48 25 C48 34 40 42 30 42 C20 42 12 34 12 25 C12 16 20 8 30 8 Z M30 17 C25.5 17 22 20.6 22 25 C22 29.4 25.5 33 30 33 C34.5 33 38 29.4 38 25 C38 20.6 34.5 17 30 17 Z" fill-rule="evenodd" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
    <path d="M6 25 C6 18 10 14 13 14 L13 36 C10 36 6 32 6 25 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M47 21 L112 21 L112 29 L104 29 L104 42 L96 42 L96 29 L90 29 L90 38 L82 38 L82 29 L47 29 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="30" cy="25" r="3" fill="${stroke}" opacity=".5"/>`;
}
function candleG() {
  return `<ellipse class="glow" cx="40" cy="26" rx="30" ry="30" fill="url(#cglow)"/>
    <path class="flame" d="M40 8 C47 18 49 26 40 34 C31 26 33 18 40 8 Z" fill="#ffd27a"/>
    <path class="flame" d="M40 18 C43 23 43 27 40 31 C37 27 37 23 40 18 Z" fill="#fff4d0"/>
    <rect x="32" y="34" width="16" height="50" fill="${SIL}"/>
    <path d="M32 40 C36 44 38 38 40 46 L40 34 L32 34 Z" fill="${SIL}"/>
    <path d="M18 84 L62 84 L56 92 L24 92 Z" fill="${SIL}"/>`;
}

/* ---------- the mansion on the hill ---------- */
function mansionG() {
  const win = (cls, d) => `<path class="win ${cls}" d="${d}"/>`;
  const rectWin = (cls, x, y, w, h) => win(cls, `M${x} ${y + h} L${x} ${y + 8} Q${x + w / 2} ${y - 6} ${x + w} ${y + 8} L${x + w} ${y + h} Z`);
  let s = `<defs>
      <radialGradient id="mglow"><stop offset="0" stop-color="#fff2cf" stop-opacity=".9"/><stop offset=".45" stop-color="#ffe3a3" stop-opacity=".25"/><stop offset="1" stop-color="#ffe3a3" stop-opacity="0"/></radialGradient>
      <radialGradient id="wglow"><stop offset="0" stop-color="#ffc861" stop-opacity=".7"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient>
    </defs>
    <circle class="moon-glow" cx="610" cy="120" r="170" fill="url(#mglow)"/>
    <circle class="moon" cx="610" cy="120" r="74" fill="#f6e7c6"/>
    <circle cx="585" cy="100" r="12" fill="#e9d6ac" opacity=".7"/><circle cx="630" cy="150" r="16" fill="#e9d6ac" opacity=".6"/><circle cx="640" cy="95" r="7" fill="#e9d6ac" opacity=".7"/>
    <path d="M0 400 C120 360 220 370 330 380 C460 392 560 360 800 372 L800 500 L0 500 Z" fill="#160d26" opacity=".85"/>`;
  /* house */
  s += `<g fill="${SIL}">
      <path d="M252 440 L252 158 L268 112 L284 158 L284 440 Z"/>
      <path d="M244 160 L268 70 L292 160 Z"/><rect x="266" y="44" width="4" height="30"/>
      <path d="M520 440 L520 178 L556 178 L556 440 Z"/>
      <path d="M512 180 L538 96 L564 180 Z"/><rect x="536" y="72" width="4" height="28"/>
      <path d="M278 440 L278 236 L300 204 L506 204 L526 236 L526 440 Z"/>
      <path d="M334 236 L400 140 L466 236 Z"/>
      <rect x="316" y="168" width="16" height="40"/><rect x="474" y="160" width="16" height="48"/>
      <rect x="312" y="164" width="24" height="7"/><rect x="470" y="156" width="24" height="7"/>
      <path d="M350 330 L450 330 L450 340 L350 340 Z"/>
      <path d="M356 340 L356 360 M372 340 L372 360 M388 340 L388 360 M412 340 L412 360 M428 340 L428 360 M444 340 L444 360" stroke="${SIL}" stroke-width="4"/>
    </g>
    <path d="M380 440 L380 392 C380 374 420 374 420 392 L420 440 Z" fill="#1d1526"/>
    <path d="M380 440 L380 392 C380 374 420 374 420 392 L420 440" fill="none" stroke="${GOLD}" stroke-opacity=".55" stroke-width="2"/>`;
  s += rectWin('win-nursery', 258, 188, 20, 40) + rectWin('win-candles', 258, 300, 20, 40) + rectWin('win-door', 528, 212, 20, 40) + rectWin('win-clock', 528, 290, 20, 40) +
    rectWin('win-library', 300, 252, 32, 46) + rectWin('win-mirrors', 470, 252, 32, 46) +
    rectWin('win-hall', 300, 360, 32, 46) + rectWin('win-kitchen', 470, 360, 32, 46);
  s += `<circle cx="400" cy="196" r="17" fill="#8fe0d0" class="cwin"/>
    <path d="M393 213 L393 201 C393 196 407 196 407 201 L407 213 Z M394 196 L394 186 L406 186 L406 196 Z M390 196 L410 196 L410 199 L390 199 Z" fill="${SIL}"/>
    <path d="M300 299 L332 299 M470 299 L502 299 M300 407 L332 407 M470 407 L502 407" stroke="${SIL}" stroke-width="5"/>`;
  /* trees */
  const tree = (x, flip) => {
    const k = flip ? -1 : 1;
    const P = (px, py) => `${x + px * k} ${py}`;
    return `<g fill="none" stroke="${SIL}" stroke-linecap="round">
      <path d="M${P(0, 450)} C${P(4, 380)} ${P(-10, 330)} ${P(6, 260)}" stroke-width="20"/>
      <path d="M${P(4, 300)} C${P(30, 280)} ${P(50, 250)} ${P(60, 210)}" stroke-width="10"/>
      <path d="M${P(2, 330)} C${P(-30, 300)} ${P(-50, 290)} ${P(-70, 250)}" stroke-width="9"/>
      <path d="M${P(6, 262)} C${P(0, 230)} ${P(14, 200)} ${P(8, 170)}" stroke-width="8"/>
      <path d="M${P(48, 236)} L${P(80, 226)} M${P(56, 222)} L${P(62, 190)} M${P(-56, 270)} L${P(-90, 272)} M${P(-62, 262)} L${P(-76, 228)} M${P(10, 200)} L${P(32, 182)} M${P(8, 210)} L${P(-14, 186)}" stroke-width="4"/>
      <path d="M${P(80, 226)} L${P(96, 228)} M${P(62, 190)} L${P(70, 176)} M${P(-90, 272)} L${P(-104, 266)} M${P(-76, 228)} L${P(-82, 214)} M${P(32, 182)} L${P(44, 178)}" stroke-width="2"/>
    </g>`;
  };
  s += tree(110, false) + tree(706, true);
  s += `<g transform="translate(150 196) scale(.55)">${crowG()}</g><g transform="translate(676 208) scale(-.5 .5)">${crowG()}</g>`;
  /* ground + fence */
  s += `<path d="M0 452 C140 436 250 440 400 446 C560 452 680 436 800 444 L800 500 L0 500 Z" fill="${SIL}"/>`;
  let f = '';
  for (let x = 6; x < 800; x += 18) { if (x > 356 && x < 444) continue; f += `<path d="M${x} 470 L${x} 438 L${x + 3} 430 L${x + 6} 438 L${x + 6} 470 Z"/>`; }
  s += `<g fill="${SIL}">${f}<rect x="0" y="446" width="356" height="5"/><rect x="444" y="446" width="356" height="5"/></g>`;
  return s;
}

/* ---------- shadow avatars ---------- */
function avatarG(id) {
  const bg = { raven: ['#5a3f8a', '#2a1f4d'], cat: ['#e8643c', '#7a2431'], owl: ['#2c6e6a', '#12343b'], moth: ['#c45a7a', '#5a2a4e'],
    fox: ['#f2a541', '#b4521f'], bat: ['#57c4b8', '#1f4f5a'], hare: ['#e07a8f', '#7a3a5a'], spider: ['#8a7fd6', '#2f2a5e'] }[id];
  const g = uid('av');
  let s = `<defs><radialGradient id="${g}" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#${g})"/><circle cx="50" cy="50" r="46.5" fill="none" stroke="#f6ecd9" stroke-opacity=".35" stroke-width="1.5"/>`;
  const eye = (x, y, r = 2.6, c = '#ffd27a') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  if (id === 'cat') s += `<path d="M34 86 C30 70 34 56 42 50 L40 34 L47 41 C49 40 53 40 55 41 L62 34 L60 50 C68 56 72 70 66 86 Z" fill="${SIL}"/>
      <path d="M64 84 C78 84 82 74 78 64 C76 60 72 62 74 66 C77 74 72 80 64 80 Z" fill="${SIL}"/>` + eye(46, 47, 2.2, '#c9f27a') + eye(54, 47, 2.2, '#c9f27a');
  if (id === 'raven') s += `<path d="M22 60 C30 48 44 44 54 46 L62 38 C66 34 74 34 76 40 L84 42 L76 46 C76 56 70 64 58 66 L66 80 L60 80 L52 68 L44 68 L46 82 L40 82 L38 68 C30 68 24 66 22 60 Z" fill="${SIL}"/>` + eye(68, 40, 2);
  if (id === 'owl') s += `<path d="M30 84 C26 66 28 46 36 34 L34 22 L44 30 C48 29 52 29 56 30 L66 22 L64 34 C72 46 74 66 70 84 Z" fill="${SIL}"/>
      <circle cx="42" cy="44" r="8" fill="#ffd27a"/><circle cx="58" cy="44" r="8" fill="#ffd27a"/><circle cx="42" cy="44" r="3.4" fill="${SIL}"/><circle cx="58" cy="44" r="3.4" fill="${SIL}"/>
      <path d="M47 52 L50 58 L53 52 Z" fill="#ffd27a"/>`;
  if (id === 'moth') s += `<g transform="translate(20 22)">${mothG(SIL)}</g>` + eye(47, 47, 1.6) + eye(53, 47, 1.6);
  if (id === 'fox') s += `<path d="M34 86 C30 72 34 60 40 54 L34 40 L36 26 L46 38 L54 38 L64 26 L66 40 L60 54 C66 60 70 72 66 86 Z" fill="${SIL}"/>
      <path d="M62 84 C80 86 88 72 84 56 C80 64 72 70 64 72 Z" fill="${SIL}"/>` + eye(45, 47, 2) + eye(55, 47, 2);
  if (id === 'bat') s += `<g transform="translate(4 24)">${batG(SIL)}</g>` + eye(47, 46, 1.8, '#ff8a6a') + eye(53, 46, 1.8, '#ff8a6a');
  if (id === 'hare') s += `<path d="M36 86 C30 70 34 58 42 52 C38 40 34 22 38 12 C44 18 46 34 46 48 C48 47 52 47 54 48 C54 34 56 18 62 12 C66 22 62 40 58 52 C66 58 70 70 64 86 Z" fill="${SIL}"/>` + eye(45, 58, 2) + eye(55, 58, 2);
  if (id === 'spider') s += `<path d="M50 4 L50 40" stroke="#f6ecd9" stroke-opacity=".7" stroke-width="1.5"/>
      <g stroke="${SIL}" stroke-width="3.5" fill="none" stroke-linecap="round">
        <path d="M44 50 L28 38 L20 46 M44 54 L24 52 L16 62 M44 58 L26 66 L22 78 M46 62 L32 76 L32 88"/>
        <path d="M56 50 L72 38 L80 46 M56 54 L76 52 L84 62 M56 58 L74 66 L78 78 M54 62 L68 76 L68 88"/></g>
      <ellipse cx="50" cy="56" rx="10" ry="12" fill="${SIL}"/><circle cx="50" cy="42" r="7" fill="${SIL}"/>` + eye(47, 42, 1.6, '#ff8a6a') + eye(53, 42, 1.6, '#ff8a6a');
  return s;
}

/* ---------- the Collector ---------- */
function collectorG() {
  return `<defs><radialGradient id="jglow"><stop offset="0" stop-color="#8fe0d0" stop-opacity=".6"/><stop offset="1" stop-color="#8fe0d0" stop-opacity="0"/></radialGradient></defs>
    <g fill="${SIL}">
      <path d="M38 96 C44 88 52 86 60 86 C68 86 76 88 82 96 L88 150 L94 292 L66 292 L62 232 L58 232 L54 292 L26 292 L32 150 Z"/>
      <path d="M38 98 C30 120 27 160 29 204 L38 204 C38 168 40 130 45 110 Z"/>
      <path d="M80 100 C93 116 99 140 99 166 L91 168 C89 146 85 126 76 112 Z"/>
      <path d="M47 90 L51 72 L60 84 L69 72 L73 90 Z"/>
      <ellipse cx="60" cy="68" rx="12" ry="14"/>
      <rect x="36" y="51" width="48" height="6" rx="3"/>
      <path d="M46 54 L48 16 L72 16 L74 54 Z"/>
      <path d="M22 292 L58 292 L58 298 L20 298 Z M62 292 L98 292 L100 298 L62 298 Z"/>
    </g>
    <rect x="47" y="40" width="26" height="6" fill="#3a2a40"/>
    <g transform="translate(86 168)">
      <circle cx="10" cy="22" r="28" fill="url(#jglow)"/>
      <path d="M10 -2 L10 6" stroke="${SIL}" stroke-width="2"/>
      <rect x="0" y="4" width="20" height="5" rx="1.5" fill="${SIL}"/>
      <path d="M1 9 L19 9 C23 14 23 34 19 38 L1 38 C-3 34 -3 14 1 9 Z" fill="#8fe0d0" fill-opacity=".55" stroke="${SIL}" stroke-width="2"/>
      <path d="M6 32 C4 26 8 20 10 17 C12 21 16 26 14 32 Z" fill="${SIL}"/><circle cx="8.5" cy="24" r="1" fill="#ffd27a"/><circle cx="11.5" cy="24" r="1" fill="#ffd27a"/></g>`;
}

/* ---------- fear jars ---------- */
function jarG(label = 'The dark', tint = '#8fe0d0') {
  const g = uid('jg');
  return `<defs>
      <radialGradient id="${g}" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="${tint}" stop-opacity=".35"/><stop offset="1" stop-color="${tint}" stop-opacity=".05"/></radialGradient>
    </defs>
    <ellipse cx="80" cy="196" rx="58" ry="8" fill="#000" opacity=".35"/>
    <path d="M34 44 L126 44 L126 56 C146 70 148 96 148 120 L148 172 C148 186 138 194 124 194 L36 194 C22 194 12 186 12 172 L12 120 C12 96 14 70 34 56 Z" fill="url(#${g})"/>
    <g class="jar-shadow">
      <path d="M52 176 C44 150 50 118 64 104 C70 98 74 86 80 84 C86 86 90 98 96 104 C110 118 116 150 108 176 C100 170 94 178 88 172 C84 178 76 178 72 172 C66 178 60 170 52 176 Z" fill="${SIL}"/>
      <ellipse class="jar-eye" cx="71" cy="126" rx="5" ry="6" fill="#ffd27a"/><ellipse class="jar-eye" cx="89" cy="126" rx="5" ry="6" fill="#ffd27a"/>
    </g>
    <path d="M34 44 L126 44 L126 56 C146 70 148 96 148 120 L148 172 C148 186 138 194 124 194 L36 194 C22 194 12 186 12 172 L12 120 C12 96 14 70 34 56 Z" fill="none" stroke="#e9e1d1" stroke-width="4"/>
    <path d="M24 100 C24 86 30 72 40 64" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M26 118 L26 160" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>
    <rect x="40" y="136" width="80" height="30" rx="4" fill="#f6ecd9" transform="rotate(-3 80 151)"/>
    <text x="80" y="157" text-anchor="middle" transform="rotate(-3 80 151)" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="13" fill="${SIL}">${label}</text>
    <g class="jar-lid"><rect x="28" y="24" width="104" height="22" rx="5" fill="#2a2230" stroke="#e9e1d1" stroke-width="3"/>
      <path d="M40 30 L40 40 M56 30 L56 40 M72 30 L72 40 M88 30 L88 40 M104 30 L104 40 M120 30 L120 40" stroke="#e9e1d1" stroke-opacity=".4" stroke-width="2"/></g>`;
}

/* ---------- the front door with five locks ---------- */
function doorG() {
  const lock = (n, x, y) => `<g class="lock lock${n}" transform="translate(${x} ${y})"><g class="lock-in">
      <rect x="-24" y="-32" width="48" height="58" fill="transparent"/>
      <path d="M-11 -6 L-11 -14 C-11 -26 11 -26 11 -14 L11 -6" class="shackle" fill="none" stroke="#8a7a66" stroke-width="5" stroke-linecap="round"/>
      <rect x="-16" y="-8" width="32" height="28" rx="5" class="lock-body" fill="#4a3e33" stroke="#120c10" stroke-width="2.5"/>
      <circle cx="0" cy="3" r="4" fill="#120c10"/><path d="M-2 4 L2 4 L3 13 L-3 13 Z" fill="#120c10"/></g></g>`;
  return `<path d="M20 420 L20 150 C20 60 100 16 150 16 C200 16 280 60 280 150 L280 420 Z" fill="#120c10"/>
    <path class="door-light" d="M34 420 L34 152 C34 82 96 30 150 30 C204 30 266 82 266 152 L266 420 Z" fill="#ffe7b0" opacity="0"/>
    <g class="door-l"><path d="M34 420 L34 152 C34 82 96 32 148 30 L148 420 Z" fill="#2a1d22"/>
      <path d="M54 400 L54 250 L128 250 L128 400 Z M54 230 L54 160 C56 118 92 72 128 66 L128 230 Z" fill="#33242a" stroke="#120c10" stroke-width="3"/>
      <circle cx="132" cy="300" r="6" fill="#8a7a66"/></g>
    <g class="door-r"><path d="M152 420 L152 30 C204 32 266 82 266 152 L266 420 Z" fill="#2a1d22"/>
      <path d="M172 400 L172 250 L246 250 L246 400 Z M172 230 L172 66 C208 72 244 118 246 160 L246 230 Z" fill="#33242a" stroke="#120c10" stroke-width="3"/>
      <circle cx="168" cy="300" r="6" fill="#8a7a66"/></g>
    <path d="M150 30 L150 420" stroke="#120c10" stroke-width="4"/>
    ${lock(1, 110, 170)}${lock(2, 190, 170)}${lock(3, 110, 340)}${lock(4, 190, 340)}${lock(5, 150, 255)}`;
}

/* ---------- nursery: things that cast shadows ---------- */
const NURSERY = {
  coat: `<path d="M40 190 L40 120 L48 120 L48 182 L152 182 L152 120 L160 120 L160 190 Z"/>
    <path d="M44 118 L44 40 C44 30 52 26 60 26 L140 26 C148 26 156 30 156 40 L156 118 Z"/>
    <path d="M68 30 C64 60 58 100 52 150 C70 160 86 156 100 150 C114 156 130 160 148 150 C142 100 136 60 132 30 C120 22 112 34 100 34 C88 34 80 22 68 30 Z"/>
    <path d="M74 32 C80 40 90 46 100 46 C110 46 120 40 126 32 C118 24 110 30 100 30 C90 30 82 24 74 32 Z"/>
    <path d="M52 150 C40 158 36 172 40 180 L60 176 Z M148 150 C160 158 164 172 160 180 L140 176 Z"/>`,
  teddy: `<circle cx="70" cy="40" r="16"/><circle cx="130" cy="40" r="16"/><circle cx="100" cy="64" r="36"/>
    <ellipse cx="100" cy="132" rx="46" ry="50"/><ellipse cx="52" cy="118" rx="18" ry="26" transform="rotate(30 52 118)"/>
    <ellipse cx="148" cy="118" rx="18" ry="26" transform="rotate(-30 148 118)"/><ellipse cx="70" cy="178" rx="24" ry="16"/><ellipse cx="130" cy="178" rx="24" ry="16"/>
    <g class="det"><circle cx="88" cy="58" r="4"/><circle cx="112" cy="58" r="4"/><ellipse cx="100" cy="74" rx="9" ry="6"/></g>`,
  plant: `<path d="M70 196 L62 150 L138 150 L130 196 Z"/><rect x="56" y="140" width="88" height="14" rx="3"/>
    <path d="M98 142 C94 110 70 80 40 60 C64 70 88 92 100 120 Z"/><path d="M102 142 C108 104 128 66 162 40 C140 62 120 96 110 128 Z"/>
    <path d="M100 140 C96 100 98 50 104 14 C108 50 108 100 104 140 Z"/><path d="M96 140 C80 120 50 110 22 112 C50 102 80 110 98 126 Z"/>
    <path d="M104 140 C124 120 156 112 182 118 C156 104 124 110 104 126 Z"/>`,
  gown: `<rect x="96" y="6" width="8" height="18"/><path d="M84 18 L116 18 L112 28 L88 28 Z"/>
    <path d="M100 26 C82 26 70 36 64 50 L40 120 L58 126 L70 92 L62 196 L138 196 L130 92 L142 126 L160 120 L136 50 C130 36 118 26 100 26 Z"/>
    <path d="M70 140 L130 136 L130 146 L70 150 Z" class="det"/>`,
  horse: `<path d="M20 186 C60 200 140 200 180 186 L184 192 C140 208 60 208 16 192 Z"/>
    <path d="M52 190 L64 128 L72 130 L62 190 Z M148 190 L136 128 L128 130 L138 190 Z M84 190 L90 132 L98 132 L94 190 Z M116 190 L110 132 L102 132 L106 190 Z"/>
    <path d="M56 136 C60 116 80 106 110 108 C126 108 136 104 142 92 L150 60 C148 48 154 36 164 30 L170 20 L176 32 C186 38 192 50 190 60 L196 72 L186 76 L174 70 C170 84 164 100 154 116 C146 130 130 140 100 140 C80 140 64 140 56 136 Z"/>
    <path d="M150 60 C140 58 132 70 130 84 C138 76 144 70 150 72 Z"/>
    <path d="M56 130 C44 128 36 136 30 150 C42 144 50 140 58 140 Z"/>`,
};
function nurseryG(id) { return `<g fill="currentColor">${NURSERY[id]}</g>`; }
function lampG() {
  return `<path d="M24 20 L76 20 L88 64 L12 64 Z" fill="#f6d9a0"/><path d="M24 20 L76 20 L88 64 L12 64 Z" fill="none" stroke="${SIL}" stroke-width="3"/>
    <rect x="46" y="64" width="8" height="56" fill="${SIL}"/><path d="M26 128 C26 118 74 118 74 128 Z" fill="${SIL}"/>`;
}

/* ---------- kitchen ---------- */
function cauldronG() {
  return `<defs><radialGradient id="fglow" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset="1" stop-color="#ff6a2a" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="130" cy="232" rx="120" ry="40" fill="url(#fglow)" class="fire-glow"/>
    <g class="fire"><path d="M80 246 Q90 200 112 224 Q120 184 132 214 Q146 180 156 220 Q174 196 186 246 Z" fill="#ff7a2a"/>
      <path d="M104 246 Q112 218 124 232 Q131 208 141 230 Q151 214 158 246 Z" fill="#ffd27a"/></g>
    <path d="M60 240 L200 240 L206 250 L54 250 Z" fill="${SIL}"/>
    <path d="M76 206 L62 244 L72 244 L86 212 Z M184 206 L198 244 L188 244 L174 212 Z" fill="${SIL}"/>
    <path d="M36 96 C30 156 62 216 130 216 C198 216 230 156 224 96 Z" fill="${SIL}"/>
    <path d="M190 96 L232 16" stroke="${SIL}" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="130" cy="96" rx="102" ry="22" fill="${SIL}"/>
    <ellipse class="potion-top" cx="130" cy="98" rx="88" ry="14"/>
    <g class="bubbles"><circle class="bb b1" cx="96" cy="94" r="8"/><circle class="bb b2" cx="142" cy="90" r="6"/><circle class="bb b3" cx="170" cy="96" r="7"/><circle class="bb b4" cx="118" cy="98" r="5"/></g>
    <g class="steam" fill="none" stroke="#f6ecd9" stroke-opacity=".35" stroke-width="5" stroke-linecap="round">
      <path class="st s1" d="M100 70 C90 56 110 46 100 30"/><path class="st s2" d="M140 66 C130 50 150 40 140 22"/><path class="st s3" d="M170 72 C162 60 178 52 170 40"/></g>`;
}
function bottleG(shape, color) {
  const shapes = {
    round: 'M30 8 L42 8 L42 30 C58 36 66 50 66 64 C66 84 52 96 36 96 C20 96 6 84 6 64 C6 50 14 36 30 30 Z',
    tall: 'M28 6 L44 6 L44 28 C52 32 56 40 56 50 L56 90 C56 94 52 96 48 96 L24 96 C20 96 16 94 16 90 L16 50 C16 40 20 32 28 28 Z',
    flask: 'M28 6 L44 6 L44 36 L66 86 C68 92 64 96 58 96 L14 96 C8 96 4 92 6 86 L28 36 Z',
    square: 'M26 8 L46 8 L46 24 L60 30 L60 92 C60 94 58 96 56 96 L16 96 C14 96 12 94 12 92 L12 30 L26 24 Z',
  };
  const d = shapes[shape] || shapes.round, c = uid('bc');
  return `<defs><clipPath id="${c}"><path d="${d}"/></clipPath></defs>
    <ellipse cx="36" cy="60" rx="34" ry="34" fill="${color}" opacity=".25" class="b-glow"/>
    <path d="${d}" fill="#1a1420" fill-opacity=".85"/>
    <g clip-path="url(#${c})"><rect x="0" y="52" width="72" height="50" fill="${color}"/><circle cx="24" cy="70" r="3" fill="#fff" opacity=".6"/><circle cx="44" cy="82" r="2.5" fill="#fff" opacity=".6"/></g>
    <path d="${d}" fill="none" stroke="#e9e1d1" stroke-width="3" stroke-linejoin="round"/>
    <rect x="24" y="2" width="24" height="9" rx="2" fill="#7a5a3a" stroke="${SIL}" stroke-width="2"/>
    <path d="M20 46 L20 60" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`;
}

/* ---------- library ---------- */
function shelfG() {
  let s = `<rect x="10" y="10" width="220" height="250" rx="4" fill="${SIL}"/>`;
  let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const tones = ['#2a1a20', '#3a2228', '#241a2c', '#30202a'];
  [[24, 84], [100, 160], [176, 236]].forEach(([top, bot], row) => {
    s += `<rect x="20" y="${top - 4}" width="200" height="${bot - top + 4}" fill="#1a1016"/>`;
    let x = 24;
    while (x < 210) {
      const w = 9 + Math.floor(rnd() * 9), h = 36 + Math.floor(rnd() * 20);
      if (x + w > 214) break;
      const lean = rnd() > 0.9 ? ` transform="rotate(-12 ${x + w / 2} ${bot})"` : '';
      s += `<rect x="${x}" y="${bot - h}" width="${w}" height="${h}" fill="${tones[Math.floor(rnd() * 4)]}"${lean}/>`;
      if (rnd() > 0.6) s += `<rect x="${x + 2}" y="${bot - h + 6}" width="${w - 4}" height="2" fill="${GOLD}" opacity=".45"/>`;
      x += w + 1;
    }
    s += `<rect x="16" y="${bot}" width="208" height="8" fill="${SIL}"/>`;
  });
  s += `<g class="glow-book"><rect x="150" y="104" width="14" height="56" fill="#7a2431"/><rect x="152" y="112" width="10" height="3" fill="${GOLD}"/><rect x="152" y="148" width="10" height="3" fill="${GOLD}"/></g>`;
  s += `<g transform="translate(176 -12) scale(.6)">${candleG()}</g>`;
  return s;
}

/* ---------- mirrors ---------- */
function mirrorG() {
  const c = uid('mc'), g = uid('mg');
  return `<defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9dbe8"/><stop offset=".5" stop-color="#9aa0bd"/><stop offset="1" stop-color="#5b5f80"/></linearGradient>
      <clipPath id="${c}"><ellipse cx="100" cy="130" rx="62" ry="88"/></clipPath>
    </defs>
    <path d="M100 8 C120 8 130 20 128 30 C150 34 172 56 176 84 C186 96 186 112 180 122 C188 150 182 190 164 212 C168 230 156 246 140 246 C130 256 112 258 100 252 C88 258 70 256 60 246 C44 246 32 230 36 212 C18 190 12 150 20 122 C14 112 14 96 24 84 C28 56 50 34 72 30 C70 20 80 8 100 8 Z" fill="${SIL}"/>
    <circle cx="100" cy="20" r="8" fill="${SIL}"/>
    <ellipse cx="100" cy="130" rx="66" ry="92" fill="#1a1420"/>
    <g clip-path="url(#${c})">
      <rect x="30" y="38" width="140" height="190" fill="url(#${g})" class="m-glass"/>
      <g class="m-figure"><circle cx="100" cy="112" r="20" fill="#2a2440"/><path d="M60 230 C62 180 76 150 100 146 C124 150 138 180 140 230 Z" fill="#2a2440"/></g>
      <rect class="m-light" x="30" y="38" width="140" height="190" fill="#ffd27a" opacity="0"/>
      <path d="M44 60 L80 40 M40 90 L96 50" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
      <g class="m-crack" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0">
        <path d="M100 120 L70 60 M100 120 L138 70 M100 120 L150 140 M100 120 L132 200 M100 120 L84 210 M100 120 L54 168 M100 120 L52 110"/>
        <path d="M84 88 L96 80 L108 92 L124 90 M70 140 L84 150 L80 170 M120 160 L136 150 L144 166 M76 108 L66 120"/>
      </g>
    </g>`;
}

/* ---------- clock ---------- */
function clockG() {
  let s = `<circle cx="150" cy="150" r="146" fill="${SIL}"/>
    <circle cx="150" cy="150" r="128" fill="#f1e4c8"/>
    <circle cx="150" cy="150" r="128" fill="none" stroke="#c9b48c" stroke-width="3"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = 150 + Math.cos(a) * 104, y = 150 + Math.sin(a) * 104;
    s += `<g class="cnum" data-n="${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="transparent"/>
      <text x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="21" fill="${SIL}">${i}</text></g>`;
  }
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 122 : 116;
    s += `<line x1="${(150 + Math.cos(a) * r1).toFixed(1)}" y1="${(150 + Math.sin(a) * r1).toFixed(1)}" x2="${(150 + Math.cos(a) * 127).toFixed(1)}" y2="${(150 + Math.sin(a) * 127).toFixed(1)}" stroke="${SIL}" stroke-width="${i % 5 ? 1.5 : 3}"/>`;
  }
  s += `<g class="clock-hand"><path d="M146 156 L148 52 L150 36 L152 52 L154 156 Z" fill="${SIL}"/><path d="M144 160 L156 160 L152 196 L148 196 Z" fill="${SIL}"/></g>
    <circle cx="150" cy="150" r="10" fill="${SIL}"/><circle cx="150" cy="150" r="4" fill="${GOLD}"/>`;
  return s;
}

/* ---------- the dark nursery (torch search) ---------- */
function nurseryRoomG() {
  let s = `<defs>
      <linearGradient id="nrWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2c33"/><stop offset="1" stop-color="#24404a"/></linearGradient>
      <linearGradient id="nrGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c3150"/><stop offset="1" stop-color="#36557a"/></linearGradient>
      <linearGradient id="nrBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0f0" stop-opacity=".16"/><stop offset="1" stop-color="#cfe0f0" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#nrWall)"/>`;
  for (let x = 0; x < 800; x += 46) s += `<rect x="${x}" y="0" width="18" height="470" fill="#ffffff" opacity=".025"/>`;
  for (let x = 23; x < 800; x += 46) for (let y = 30; y < 460; y += 60) s += `<circle cx="${x}" cy="${y + ((x / 46) % 2) * 30}" r="3" fill="#ffffff" opacity=".05"/>`;
  /* floor */
  s += `<rect x="0" y="470" width="800" height="130" fill="#15242a"/>
    <rect x="0" y="462" width="800" height="12" fill="#0e1a1e"/>
    <path d="M0 505 L800 505 M0 545 L800 545 M0 585 L800 585" stroke="#0e1a1e" stroke-width="3"/>
    <path d="M120 470 L110 505 M340 505 L330 545 M560 470 L555 505 M690 545 L684 585 M220 545 L214 585 M450 545 L446 585" stroke="#0e1a1e" stroke-width="3"/>
    <ellipse cx="420" cy="540" rx="230" ry="38" fill="#2e2436"/>
    <ellipse cx="420" cy="540" rx="200" ry="28" fill="none" stroke="#45364f" stroke-width="5"/>`;
  /* window with moon + curtains + moonlight on the floor */
  s += `<path d="M300 470 L470 470 L560 600 L250 600 Z" fill="url(#nrBeam)"/>
    <rect x="296" y="86" width="188" height="226" rx="6" fill="#0b1417"/>
    <rect x="306" y="96" width="168" height="206" fill="url(#nrGlass)"/>
    <circle cx="430" cy="140" r="26" fill="#f6e7c6"/><circle cx="440" cy="134" r="22" fill="url(#nrGlass)" opacity=".0"/>
    <circle cx="336" cy="128" r="2" fill="#fff"/><circle cx="368" cy="200" r="1.6" fill="#fff"/><circle cx="452" cy="232" r="2" fill="#fff"/><circle cx="330" cy="262" r="1.6" fill="#fff"/>
    <path d="M306 240 C330 226 350 236 372 226 C396 214 420 230 474 218 L474 302 L306 302 Z" fill="#14252c" opacity=".9"/>
    <rect x="386" y="96" width="8" height="206" fill="#0b1417"/><rect x="306" y="196" width="168" height="8" fill="#0b1417"/>
    <rect x="286" y="306" width="208" height="14" rx="3" fill="#0e1a1e"/>
    <rect x="270" y="66" width="240" height="10" rx="5" fill="#0b1417"/>
    <path d="M276 70 L330 70 C326 140 318 220 300 300 C296 330 300 360 312 380 L268 380 C262 300 266 180 276 70 Z" fill="#2b4a48"/>
    <path d="M504 70 L450 70 C454 140 462 220 480 300 C484 330 480 360 468 380 L512 380 C518 300 514 180 504 70 Z" fill="#2b4a48"/>
    <path d="M290 80 C292 170 288 260 282 370 M304 80 C306 170 300 260 296 372 M490 80 C488 170 492 260 498 370 M476 80 C474 170 480 260 484 372" stroke="#203a39" stroke-width="5" fill="none"/>
    <rect x="270" y="296" width="44" height="10" rx="5" fill="#c9a46a" opacity=".6"/><rect x="466" y="296" width="44" height="10" rx="5" fill="#c9a46a" opacity=".6"/>`;
  /* wardrobe, slightly open */
  s += `<rect x="40" y="130" width="190" height="340" rx="6" fill="#2a2018"/>
    <path d="M30 130 L240 130 L232 112 L38 112 Z" fill="#1f1812"/>
    <rect x="52" y="146" width="80" height="300" rx="3" fill="#33281e"/>
    <path d="M140 146 L216 152 L216 440 L140 446 Z" fill="#33281e"/>
    <path d="M132 146 L140 146 L140 446 L132 446 Z" fill="#060708"/>
    <rect x="64" y="160" width="56" height="120" rx="3" fill="none" stroke="#261d15" stroke-width="4"/><rect x="64" y="300" width="56" height="130" rx="3" fill="none" stroke="#261d15" stroke-width="4"/>
    <path d="M152 166 L204 170 L204 280 L152 282 Z M152 302 L204 302 L204 426 L152 430 Z" fill="none" stroke="#261d15" stroke-width="4"/>
    <circle cx="124" cy="300" r="5" fill="#8a7a66"/><circle cx="148" cy="300" r="5" fill="#8a7a66"/>
    <rect x="50" y="470" width="14" height="12" fill="#1f1812"/><rect x="206" y="470" width="14" height="12" fill="#1f1812"/>`;
  /* picture above the bed + mobile */
  s += `<rect x="580" y="150" width="110" height="84" rx="4" fill="#5a4a30"/><rect x="590" y="160" width="90" height="64" fill="#cbbf9a" opacity=".55"/>
    <circle cx="620" cy="186" r="12" fill="#e8a33c" opacity=".7"/><path d="M596 216 L626 196 L646 210 L662 198 L676 216 Z" fill="#5a7a5a" opacity=".7"/>
    <path d="M650 0 L650 40 M612 40 L688 40 M612 40 L612 86 M650 40 L650 106 M688 40 L688 76" stroke="#8a7a66" stroke-width="2"/>
    <path d="${starPath(612, 96, 12)}" fill="#c9b48c"/><path d="M640 112 C640 98 660 98 660 112 C654 104 646 104 640 112 Z" fill="#c9b48c"/><circle cx="688" cy="86" r="10" fill="#c9b48c"/>`;
  /* bed with teddy */
  s += `<path d="M520 470 L520 300 C520 280 536 272 552 272 L560 272 C576 272 586 284 586 300 L586 330 L740 330 L740 290 C740 276 752 268 764 268 C776 268 786 276 786 290 L786 470 Z" fill="#3a2a20"/>
    <rect x="528" y="360" width="252" height="70" rx="12" fill="#2f4a64"/>
    <path d="M540 360 L770 360 L780 452 C700 470 610 470 530 452 Z" fill="#3b5a74"/>
    <path d="M560 372 L560 456 M600 370 L600 462 M640 370 L640 464 M680 370 L680 464 M720 370 L720 462 M760 372 L760 456" stroke="#33506a" stroke-width="6"/>
    <ellipse cx="596" cy="352" rx="44" ry="18" fill="#b8b2a2"/>
    <circle cx="676" cy="328" r="10" fill="#6b4a32"/><circle cx="700" cy="328" r="10" fill="#6b4a32"/><circle cx="688" cy="342" r="18" fill="#6b4a32"/><ellipse cx="688" cy="372" rx="22" ry="20" fill="#6b4a32"/>
    <circle cx="682" cy="340" r="2.4" fill="#1a1410"/><circle cx="694" cy="340" r="2.4" fill="#1a1410"/><ellipse cx="688" cy="348" rx="5" ry="3.5" fill="#8a6a4a"/>
    <rect x="524" y="470" width="16" height="22" fill="#2a1e16"/><rect x="766" y="470" width="16" height="22" fill="#2a1e16"/>
    <path d="M544 452 C620 470 700 470 778 452 L778 470 L544 470 Z" fill="#0a1114" opacity=".7"/>`;
  /* rocking horse + blocks */
  s += `<g transform="translate(222 360) scale(.62)" fill="#5a3a28">${NURSERY.horse}</g>
    <g><rect x="420" y="430" width="40" height="40" rx="3" fill="#7a3a3a"/><rect x="466" y="440" width="32" height="30" rx="3" fill="#3a5a7a"/><rect x="438" y="396" width="34" height="34" rx="3" fill="#6a6a2a"/>
      <text x="440" y="458" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="22" fill="#d9c3a0" opacity=".8">A</text>
      <text x="482" y="463" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="18" fill="#d9c3a0" opacity=".8">B</text>
      <text x="455" y="421" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="18" fill="#d9c3a0" opacity=".8">C</text></g>`;
  return s;
}
function starPath(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' '; }
  return d + 'Z';
}

/* ---------- candles for the candle room ---------- */
function roomCandleG(h = 70, wax = '#efe3c8', drip = '#fff8e6') {
  const top = 150 - h;
  return `<ellipse class="c-glow" cx="40" cy="${top - 10}" rx="38" ry="44" fill="url(#rcglow)"/>
    <g class="c-flame"><path d="M40 ${top - 34} C49 ${top - 22} 51 ${top - 12} 40 ${top - 2} C29 ${top - 12} 31 ${top - 22} 40 ${top - 34} Z" fill="#ffd27a"/>
      <path d="M40 ${top - 22} C44 ${top - 16} 44 ${top - 10} 40 ${top - 5} C36 ${top - 10} 36 ${top - 16} 40 ${top - 22} Z" fill="#fff4d0"/></g>
    <path class="c-smoke" d="M40 ${top - 4} C34 ${top - 16} 46 ${top - 26} 38 ${top - 40}" fill="none" stroke="#f6ecd9" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="${top}" x2="40" y2="${top - 6}" stroke="#1a1410" stroke-width="2.5"/>
    <rect x="28" y="${top}" width="24" height="${h}" rx="3" fill="${wax}"/>
    <path d="M28 ${top + 4} C32 ${top + 14} 36 ${top + 2} 38 ${top + 18} C40 ${top + 8} 44 ${top + 12} 46 ${top + 4} L52 ${top + 4} L52 ${top} L28 ${top} Z" fill="${drip}"/>
    <rect x="28" y="${top}" width="7" height="${h}" fill="#000" opacity=".08"/>
    <path d="M14 150 L66 150 L60 160 L20 160 Z" fill="${SIL}"/>`;
}

/* ---------- registry: key → svg ---------- */
const ART = {
  mansion: () => SV('0 0 800 500', mansionG(), 'mansion-svg'),
  collector: () => SV('0 0 120 300', collectorG()),
  jar: (label, tint) => SV('0 0 160 204', jarG(label, tint), 'jar-svg'),
  door: () => SV('0 0 300 420', doorG(), 'door-svg'),
  doorLocks: () => SV('0 0 300 420', doorG(), 'door-svg'),
  lamp: () => SV('0 0 100 130', lampG()),
  cauldron: () => SV('0 0 260 256', cauldronG(), 'cauldron-svg'),
  shelf: () => SV('0 0 240 270', `<defs><radialGradient id="cglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>${shelfG()}`),
  mirror: () => SV('0 0 200 260', mirrorG(), 'mirror-svg'),
  clock: () => SV('0 0 300 300', clockG(), 'clock-svg'),
  candle: () => SV('0 0 80 96', `<defs><radialGradient id="cglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>${candleG()}`),
  av_raven: () => SV('0 0 100 100', avatarG('raven')), av_cat: () => SV('0 0 100 100', avatarG('cat')),
  av_owl: () => SV('0 0 100 100', avatarG('owl')), av_moth: () => SV('0 0 100 100', avatarG('moth')),
  av_fox: () => SV('0 0 100 100', avatarG('fox')), av_bat: () => SV('0 0 100 100', avatarG('bat')),
  av_hare: () => SV('0 0 100 100', avatarG('hare')), av_spider: () => SV('0 0 100 100', avatarG('spider')),
  /* small things used by the code */
  bat: () => SV('0 0 100 56', batG()),
  bird: () => SV('0 0 60 26', birdG()),
  moth: () => SV('0 0 60 56', mothG()),
  key: () => SV('0 0 120 50', keyG()),
  keyEmpty: () => SV('0 0 120 50', keyG('none', '#f6ecd9')),
  nursery: (id) => SV('0 0 200 200', nurseryG(id)),
  nurseryRoom: () => SV('0 0 800 600', nurseryRoomG(), 'nroom-svg', 'xMidYMid slice'),
  roomCandle: (h, wax, drip) => SV('0 0 80 160', `<defs><radialGradient id="rcglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>${roomCandleG(h, wax, drip)}`, 'rcandle-svg'),
  bottle: (shape, color) => SV('0 0 72 100', bottleG(shape, color)),
};
