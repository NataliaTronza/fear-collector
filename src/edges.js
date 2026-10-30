/* =========================================================
   EDGES · silhouette panoramas between the rooms
   viewBox 1440 x 180, ground at y = 168; the middle (400..1040)
   stays visible on phones, the sides show on wider screens
   ========================================================= */
(() => {
  const G = 168;
  let gid = '';
  const glow = (x, y, r, c = '') => `<circle class="eg-glow" cx="${x}" cy="${y}" r="${r}" fill="url(#${gid}${c})"/>`;
  const flame = (x, y, s = 1) => glow(x, y - 4 * s, 14 * s) +
    `<path class="eg-fl" d="M${x} ${y - 11 * s} C${x + 4 * s} ${y - 6 * s} ${x + 4.5 * s} ${y - 2 * s} ${x} ${y + 1 * s} C${x - 4.5 * s} ${y - 2 * s} ${x - 4 * s} ${y - 6 * s} ${x} ${y - 11 * s} Z" fill="#ffd27a"/>`;
  /* place an object: local coords have the ground at y = 0 and go up into negative y */
  const put = (x, inner, k = 1, flip = false, base = G) => `<g transform="translate(${x} ${base}) scale(${flip ? -k : k} ${k})">${inner}</g>`;
  const P = (d) => `<path d="${d}"/>`;

  /* ---------- outdoors ---------- */
  const tree = () => `<g fill="none" stroke="currentColor" stroke-linecap="round">
      <path d="M0 0 C3 -40 -6 -70 2 -100" stroke-width="14"/>
      <path d="M2 -66 C18 -82 30 -98 46 -122" stroke-width="7"/>
      <path d="M0 -82 C-16 -94 -30 -104 -48 -126" stroke-width="6"/>
      <path d="M2 -98 C0 -116 8 -130 4 -152" stroke-width="5"/>
      <path d="M30 -98 L54 -102 M38 -110 L40 -136 M-30 -104 L-54 -98 M-38 -114 L-44 -140 M5 -126 L20 -142 M3 -134 L-10 -148" stroke-width="3"/>
      <path d="M54 -102 L64 -98 M40 -136 L47 -146 M-54 -98 L-64 -102 M-44 -140 L-40 -152 M20 -142 L28 -146 M-10 -148 L-14 -158" stroke-width="1.6"/>
      <path d="M-16 0 C-7 -5 -5 -12 -4 -20 M16 0 C7 -5 5 -12 4 -20" stroke-width="6"/></g>`;
  const graveRound = (w = 34, h = 52) => P(`M${-w / 2} 0 L${-w / 2} ${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h + w / 2} L${w / 2} 0 Z`) +
    `<path d="M${-w / 4} ${-h + w / 2 + 6} L${w / 4} ${-h + w / 2 + 6}" stroke="#2a2234" stroke-width="2"/>`;
  const graveCross = P('M-4 0 L-4 -42 L-17 -42 L-17 -50 L-4 -50 L-4 -64 L4 -64 L4 -50 L17 -50 L17 -42 L4 -42 L4 0 Z M-13 0 L-10 -7 L10 -7 L13 0 Z');
  const obelisk = P('M-9 0 L-7 -74 L0 -86 L7 -74 L9 0 Z M-15 0 L-13 -8 L13 -8 L15 0 Z');
  const fence = (from, to) => {
    let d = '';
    for (let x = from; x <= to; x += 15) d += `M${x - 2.5} 0 L${x - 2.5} -46 L${x} -55 L${x + 2.5} -46 L${x + 2.5} 0 Z `;
    return `<path d="${d}"/><rect x="${from - 4}" y="-40" width="${to - from + 8}" height="3"/><rect x="${from - 4}" y="-12" width="${to - from + 8}" height="3"/>`;
  };
  const gate = () => `${P('M-52 0 L-52 -86 L-44 -86 L-44 0 Z M44 0 L44 -86 L52 -86 L52 0 Z')}
    <circle cx="-48" cy="-92" r="7"/><circle cx="48" cy="-92" r="7"/>
    <path d="M-44 -78 C-30 -104 30 -104 44 -78" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M-44 -70 C-28 -90 28 -90 44 -70" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <path d="M-10 -96 C-4 -106 4 -106 10 -96 M-4 -101 C-6 -110 6 -110 4 -101" fill="none" stroke="currentColor" stroke-width="2.5"/>
    ${(() => { let d = ''; for (let x = -38; x <= 38; x += 9.5) d += `M${x - 1.5} 0 L${x - 1.5} -66 L${x} -72 L${x + 1.5} -66 L${x + 1.5} 0 Z `; return `<path d="${d}"/>`; })()}
    <rect x="-44" y="-30" width="88" height="3"/><rect x="-44" y="-8" width="88" height="3"/>
    <path d="M-2 -30 C-12 -40 -12 -50 -2 -52 M2 -30 C12 -40 12 -50 2 -52" fill="none" stroke="currentColor" stroke-width="2.5"/>`;
  const lamppost = () => `${P('M-10 0 L10 0 L6 -10 L-6 -10 Z')}<rect x="-2.5" y="-112" width="5" height="104"/>
    ${P('M-12 -112 L12 -112 L9 -96 L-9 -96 Z')}
    <path d="M-8 -110 L8 -110 L6 -98 L-6 -98 Z" fill="#ffd27a"/>${glow(0, -104, 30)}
    ${P('M-14 -112 L0 -124 L14 -112 Z')}<circle cx="0" cy="-127" r="3"/>`;
  const pumpkin = (s = 1) => `<g transform="scale(${s})"><ellipse cx="-9" cy="-14" rx="11" ry="14"/><ellipse cx="9" cy="-14" rx="11" ry="14"/><ellipse cx="0" cy="-15" rx="11" ry="15"/>
    ${P('M-2 -28 C-3 -34 0 -38 4 -40 L6 -37 C3 -35 2 -31 2 -28 Z')}
    <path d="M-10 -18 L-6 -24 L-2 -18 Z M2 -18 L6 -24 L10 -18 Z M-9 -10 Q0 -2 9 -10 L5 -9 L3 -6 L0 -8 L-3 -6 L-5 -9 Z" fill="#ffb347"/>${glow(0, -14, 20)}</g>`;
  const cat = () => `${P('M0 0 C-2 -10 -2 -22 4 -32 C2 -38 2 -44 6 -50 L4 -61 L11 -53 C14 -54 17 -54 20 -53 L27 -61 L25 -50 C29 -44 29 -36 26 -30 C34 -22 36 -10 34 0 Z')}
    ${P('M32 -3 C47 -1 53 -14 47 -25 C45 -29 41 -27 42 -23 C46 -15 42 -9 32 -10 Z')}
    <circle cx="11" cy="-45" r="1.8" fill="#c9f27a"/><circle cx="19" cy="-45" r="1.8" fill="#c9f27a"/>`;
  const crow = () => `<g transform="translate(-35 -56)">${P('M10 40 C18 30 30 26 42 28 L50 22 C54 20 60 20 62 24 L70 26 L62 30 C62 38 56 44 46 46 L54 54 L48 54 L42 47 L36 48 L38 56 L33 56 L31 48 C22 48 14 46 10 40 Z')}</g>`;
  const grass = (from, to, h = 10) => { let d = ''; for (let x = from; x < to; x += 7) { const t = h * (0.5 + ((x * 37) % 10) / 20); d += `M${x} 0 L${x + 2} ${-t} L${x + 4} 0 `; } return `<path d="${d}"/>`; };
  const bat = () => P('M0 -6 C-6 -16 -18 -20 -34 -18 C-28 -14 -27 -9 -29 -4 C-22 -6 -16 -4 -15 1 C-10 -3 -5 -2 0 3 C5 -2 10 -3 15 1 C16 -4 22 -6 29 -4 C27 -9 28 -14 34 -18 C18 -20 6 -16 0 -6 Z');

  /* ---------- the hall ---------- */
  const stairs = (n = 7, step = 24, rise = 13) => {
    let d = 'M0 0';
    for (let i = 0; i < n; i++) d += ` L${i * step} ${-(i + 1) * rise} L${(i + 1) * step} ${-(i + 1) * rise}`;
    d += ` L${n * step} 0 Z`;
    let bal = '';
    for (let i = 0; i < n; i++) for (const off of [6, 16]) {
      const x = i * step + off, top = -(i + 1) * rise, railY = -58 - (x / (n * step)) * (n * rise);
      bal += `<rect x="${x - 1.6}" y="${railY}" width="3.2" height="${top - railY}"/><circle cx="${x}" cy="${(top + railY) / 2}" r="2.4"/>`;
    }
    return `<path d="${d}"/>${bal}
      <path d="M-2 -60 L${n * step} ${-58 - n * rise}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <rect x="-9" y="-74" width="16" height="74" rx="2"/><rect x="-11" y="-78" width="20" height="6" rx="2"/><circle cx="-1" cy="-86" r="7"/>`;
  };
  const grandClock = () => `${P('M-22 0 L22 0 L19 -14 L-19 -14 Z')}<rect x="-15" y="-112" width="30" height="100"/>
      ${P('M-20 -112 L20 -112 L20 -150 L-20 -150 Z M-25 -150 L25 -150 L0 -166 Z')}<circle cx="0" cy="-169" r="3.5"/>
      <circle cx="0" cy="-131" r="12.5" fill="#2a2234"/><path d="M0 -131 L0 -140 M0 -131 L6 -128" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <rect x="-7" y="-102" width="14" height="56" rx="7" fill="#2a2234"/>
      <g class="eg-pend"><path d="M0 -100 L0 -60" stroke="currentColor" stroke-width="1.6"/><circle cx="0" cy="-58" r="5"/></g>`;
  const wingChair = () => P('M0 0 L3 -28 L-3 -32 C-7 -60 -4 -86 6 -94 C14 -99 23 -96 25 -87 L27 -40 L60 -40 C66 -40 68 -46 69 -50 C73 -53 78 -49 75 -42 L73 -28 L69 -28 L69 0 L63 0 L61 -24 L12 -24 L10 0 Z');
  const sideTable = () => `${P('M-26 -50 L26 -50 L24 -45 L-24 -45 Z M-20 -45 L-17 0 L-13 0 L-14 -45 Z M20 -45 L17 0 L13 0 L14 -45 Z M-17 -14 L17 -14 L17 -11 L-17 -11 Z')}
      ${P('M-8 -50 L8 -50 L4 -56 L2 -76 L-2 -76 L-4 -56 Z')}
      <path d="M0 -70 C-6 -70 -14 -72 -16 -80 M0 -70 C6 -70 14 -72 16 -80" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="-19" y="-94" width="6" height="14"/><rect x="13" y="-94" width="6" height="14"/><rect x="-3" y="-100" width="6" height="22"/>
      ${flame(-16, -95, 0.8)}${flame(16, -95, 0.8)}${flame(0, -101, 0.9)}`;
  const hatStand = () => `<rect x="-2.5" y="-130" width="5" height="124"/>${P('M-18 0 L18 0 L4 -8 L-4 -8 Z')}
      <path d="M0 -122 L-14 -130 M0 -122 L14 -130 M0 -112 L-12 -118" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      ${P('M-2 -116 C-16 -112 -20 -92 -22 -54 C-16 -50 -10 -52 -6 -56 C-4 -80 -2 -100 2 -110 Z')}
      ${P('M-10 -132 L10 -132 L9 -150 L-9 -150 Z M-16 -132 L16 -132 L16 -129 L-16 -129 Z')}`;
  const fern = () => `${P('M-14 0 L14 0 L18 -24 L-18 -24 Z M-20 -24 L20 -24 L20 -29 L-20 -29 Z')}
      ${P('M0 -28 C-12 -46 -30 -56 -52 -54 C-32 -50 -16 -42 -2 -24 Z')}${P('M0 -28 C12 -46 30 -56 52 -54 C32 -50 16 -42 2 -24 Z')}
      ${P('M0 -28 C-6 -52 -20 -70 -36 -78 C-22 -66 -10 -50 -3 -26 Z')}${P('M0 -28 C6 -52 20 -70 36 -78 C22 -66 10 -50 3 -26 Z')}
      ${P('M0 -28 C-2 -56 2 -76 4 -92 C6 -74 4 -52 2 -26 Z')}`;

  /* ---------- the nursery ---------- */
  const horse = () => `<g transform="translate(-100 -205)">${NURSERY.horse}</g>`;
  const teddy = () => `<g transform="translate(-100 -194)">${NURSERY.teddy.replace(/<g class="det">[\s\S]*?<\/g>/, '')}</g>`;
  const blocks = () => {
    const b = (x, y, s, ch) => `<rect x="${x}" y="${y - s}" width="${s}" height="${s}" rx="2"/><text x="${x + s / 2}" y="${y - s * 0.26}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="${s * 0.7}" fill="#2a2234">${ch}</text>`;
    return b(-34, 0, 30, 'A') + b(0, 0, 30, 'B') + b(-17, -30, 28, 'C') + `<g transform="rotate(12 22 -40)">${b(14, -32, 18, 'D')}</g>`;
  };
  const train = () => `${P('M0 -10 L0 -34 L26 -34 L26 -56 L44 -56 L44 -34 L56 -34 L56 -10 Z M8 -34 L8 -52 L16 -52 L16 -34 Z M5 -56 L19 -56 L16 -52 L8 -52 Z')}
      <rect x="31" y="-52" width="9" height="10" fill="#2a2234"/><circle cx="12" cy="-6" r="7"/><circle cx="44" cy="-6" r="7"/>
      ${P('M60 -10 L60 -30 L100 -30 L100 -10 Z')}<circle cx="70" cy="-6" r="6"/><circle cx="90" cy="-6" r="6"/><rect x="56" y="-18" width="6" height="3"/>
      <g opacity=".45"><circle cx="12" cy="-66" r="6"/><circle cx="20" cy="-78" r="8"/><circle cx="32" cy="-88" r="10"/></g>`;
  const top = () => P('M0 0 L-4 -6 C-22 -14 -24 -30 0 -40 C24 -30 22 -14 4 -6 Z M-2 -40 L-2 -50 L2 -50 L2 -40 Z');
  const dollHouse = () => `${P('M-40 0 L-40 -54 L40 -54 L40 0 Z M-48 -52 L0 -92 L48 -52 Z M22 -78 L22 -94 L30 -94 L30 -70 Z')}
      <rect x="-30" y="-44" width="16" height="14" fill="#ffd27a"/><rect x="14" y="-44" width="16" height="14" fill="#ffd27a"/>
      <path d="M-22 -44 L-22 -30 M14 -37 L30 -37 M-30 -37 L-14 -37 M22 -44 L22 -30" stroke="currentColor" stroke-width="2"/>
      <circle cx="0" cy="-70" r="6" fill="#ffd27a"/>${glow(-22, -37, 18)}${glow(22, -37, 18)}${P('M-7 0 L-7 -20 C-7 -26 7 -26 7 -20 L7 0 Z')}`;
  const duck = () => `${P('M-22 -16 C-26 -30 -10 -36 0 -30 C2 -40 12 -44 18 -38 C22 -36 24 -32 22 -28 L30 -28 L22 -24 C24 -16 18 -8 4 -8 L-14 -8 C-20 -8 -24 -12 -22 -16 Z')}
      <circle cx="-12" cy="-4" r="4"/><circle cx="8" cy="-4" r="4"/><path d="M-22 -12 C-40 -10 -50 -2 -60 0" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
  const ball = () => `<circle cx="0" cy="-14" r="14"/><path d="M-14 -14 C-6 -18 6 -18 14 -14 M0 -28 C-6 -20 -6 -8 0 0" fill="none" stroke="#2a2234" stroke-width="2"/>`;


  /* nursery, redrawn to match the room picture */
  const rockingHorse = () => `
    <path d="M-72 -15 Q0 11 72 -15 L70 -21 Q0 4 -70 -21 Z"/>
    <path d="M-71 -16 C-77 -20 -76 -28 -69 -27 M71 -16 C78 -19 79 -27 72 -28" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M-34 -54 L-49 -17 L-43 -16 L-27 -54 Z M-22 -54 L-25 -12 L-19 -12 L-15 -54 Z M18 -54 L22 -12 L28 -12 L25 -54 Z M30 -54 L46 -17 L52 -19 L37 -54 Z"/>
    <path d="M-42 -62 C-44 -74 -30 -80 -10 -80 L22 -80 C34 -80 42 -74 42 -64 C42 -54 34 -50 24 -50 L-30 -50 C-38 -50 -42 -54 -42 -62 Z"/>
    <path d="M14 -78 C18 -96 26 -112 38 -120 C44 -124 50 -122 54 -116 L67 -100 C70 -96 68 -91 63 -91 L52 -93 C46 -86 40 -74 36 -62 Z"/>
    <path d="M40 -121 L42 -133 L49 -122 Z"/>
    <path d="M37 -121 C29 -123 26 -117 28 -112 C22 -112 19 -106 22 -101 C16 -99 15 -93 18 -89 C12 -87 11 -81 14 -77 L22 -80 C24 -96 30 -110 41 -118 Z"/>
    <path d="M-40 -66 C-55 -66 -63 -54 -65 -37 C-61 -40 -57 -47 -51 -51 C-53 -44 -55 -37 -53 -31 C-47 -43 -43 -53 -38 -58 Z"/>
    <path d="M-16 -80 C-14 -87 6 -87 8 -80 Z"/><rect x="28" y="-104" width="30" height="3.5" rx="1.7"/>
    <circle cx="51" cy="-110" r="2" fill="#2a2234"/>`;
  const sitTeddy = () => `
    <circle cx="-16" cy="-71" r="8.5"/><circle cx="16" cy="-71" r="8.5"/>
    <circle cx="-16" cy="-71" r="4" fill="#2a2234" opacity=".55"/><circle cx="16" cy="-71" r="4" fill="#2a2234" opacity=".55"/>
    <circle cx="0" cy="-57" r="19"/><ellipse cx="0" cy="-50" rx="8" ry="6" fill="#2a2234" opacity=".35"/>
    <ellipse cx="0" cy="-25" rx="22" ry="24"/>
    <ellipse cx="-23" cy="-31" rx="8" ry="15" transform="rotate(28 -23 -31)"/><ellipse cx="23" cy="-31" rx="8" ry="15" transform="rotate(-28 23 -31)"/>
    <ellipse cx="-15" cy="-6" rx="13" ry="8"/><ellipse cx="15" cy="-6" rx="13" ry="8"/>
    <ellipse cx="-15" cy="-6" rx="6" ry="4" fill="#2a2234" opacity=".4"/><ellipse cx="15" cy="-6" rx="6" ry="4" fill="#2a2234" opacity=".4"/>`;
  const lantern = () => `${glow(0, -14, 40)}
    <rect x="-10" y="-3" width="20" height="3"/>
    <path d="M-7 -3 L-7 -23 L7 -23 L7 -3 Z" fill="#ffd27a"/>
    <path d="M0 -18 L1.6 -13.6 L6 -13.6 L2.4 -11 L3.7 -6.6 L0 -9.2 L-3.7 -6.6 L-2.4 -11 L-6 -13.6 L-1.6 -13.6 Z" fill="#c9862a"/>
    <path d="M-7 -23 L-7 -3 M7 -23 L7 -3" stroke="currentColor" stroke-width="1.8"/>
    <path d="M-10 -23 L10 -23 L5 -30 L-5 -30 Z"/><circle cx="0" cy="-33" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
  const ivy = () => {
    let s = `${P('M-15 0 L15 0 L18 -18 L-18 -18 Z')}<rect x="-20" y="-21" width="40" height="5" rx="2"/>`;
    const leaf = (x, y, r, k = 1) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${k})" d="M0 0 C-6 -4 -7 -11 0 -15 C7 -11 6 -4 0 0 Z"/>`;
    s += `<path d="M-14 -20 C-22 -30 -12 -38 -4 -44 M2 -20 C4 -32 14 -36 20 -44 M-16 -14 C-28 -4 -30 14 -26 34 C-24 50 -30 66 -28 84" fill="none" stroke="currentColor" stroke-width="2"/>`;
    [[-6, -42, -10], [18, -42, 20], [-14, -32, -40], [8, -30, 30], [0, -24, 0], [-20, -28, -60], [14, -24, 50]].forEach(([x, y, r]) => { s += leaf(x, y, r); });
    [[-26, -2, -150], [-28, 12, 160], [-25, 28, -140], [-27, 44, 170], [-28, 60, -150], [-28, 76, 160]].forEach(([x, y, r]) => { s += leaf(x, y, r, 0.9); });
    return s;
  };
  const wardrobe = () => {
    let s = `<rect x="-80" y="-136" width="160" height="128" rx="3"/>
      ${P('M-92 -136 L92 -136 L88 -144 L-88 -144 Z M-86 -148 L86 -148 L84 -144 L-84 -144 Z')}
      <rect x="-84" y="-10" width="168" height="6"/><rect x="-78" y="-4" width="10" height="4"/><rect x="68" y="-4" width="10" height="4"/>
      <g fill="none" stroke="#2a2234" stroke-width="2.4"><path d="M0 -134 L0 -12"/>
        <rect x="-70" y="-126" width="58" height="56" rx="2"/><rect x="-70" y="-62" width="58" height="44" rx="2"/>
        <rect x="12" y="-126" width="58" height="56" rx="2"/><rect x="12" y="-62" width="58" height="44" rx="2"/></g>
      <circle cx="-7" cy="-68" r="2.6" fill="#2a2234"/><circle cx="7" cy="-68" r="2.6" fill="#2a2234"/>
      <path d="M-50 -106 L-48 -101 L-43 -101 L-47 -98 L-45 -93 L-50 -96 L-55 -93 L-53 -98 L-57 -101 L-52 -101 Z M38 -96 L39.5 -92 L44 -92 L40.5 -89.5 L42 -85.5 L38 -88 L34 -85.5 L35.5 -89.5 L32 -92 L36.5 -92 Z" fill="#2a2234"/>
      <rect x="-24" y="-154" width="44" height="6" rx="1"/><rect x="-20" y="-160" width="36" height="6" rx="1"/>`;
    s += `<g transform="translate(-60 -148)">${ivy()}</g><g transform="translate(48 -148)">${lantern()}</g>`;
    return s;
  };
  const kidBed = () => `
    <path d="M-114 0 L-114 -94 A15 15 0 0 1 -84 -94 L-84 0 Z"/>
    <path d="M86 0 L86 -80 A14 14 0 0 1 114 -80 L114 0 Z"/>
    <rect x="-86" y="-42" width="174" height="10"/>
    <ellipse cx="-54" cy="-63" rx="26" ry="9"/>
    <path d="M-86 -58 C-40 -62 40 -62 88 -58 L92 -22 C82 -16 72 -22 60 -18 C46 -14 36 -20 22 -16 C6 -12 -10 -18 -26 -14 C-44 -10 -60 -16 -80 -14 Z"/>
    <path d="M60 -60 C70 -50 78 -36 80 -18 C86 -12 92 -18 94 -24 C92 -40 86 -54 76 -62 Z"/>
    <path d="M78 -18 L78 -6 M82 -18 L82 -4 M86 -19 L86 -5 M90 -21 L90 -8" stroke="currentColor" stroke-width="1.6"/>
    <g fill="#2a2234" opacity=".55">
      <path d="M-30 -40 L-28.5 -36 L-24 -36 L-27.5 -33.5 L-26 -29.5 L-30 -32 L-34 -29.5 L-32.5 -33.5 L-36 -36 L-31.5 -36 Z"/>
      <path d="M10 -46 L11.2 -43 L14.5 -43 L11.8 -41.2 L12.8 -38 L10 -40 L7.2 -38 L8.2 -41.2 L5.5 -43 L8.8 -43 Z"/>
      <path d="M40 -32 L41.4 -28.6 L45 -28.6 L42.1 -26.4 L43.2 -23 L40 -25 L36.8 -23 L37.9 -26.4 L35 -28.6 L38.6 -28.6 Z"/></g>
    <g transform="translate(42 -57) scale(.56)">${sitTeddy()}</g>`;
  const toyBasket = () => `
    <circle cx="-7" cy="-50" r="10"/>
    <ellipse cx="-12" cy="-66" rx="3.6" ry="11" transform="rotate(-12 -12 -66)"/><ellipse cx="-2" cy="-67" rx="3.6" ry="11" transform="rotate(10 -2 -67)"/>
    <circle cx="12" cy="-46" r="8"/>
    ${P('M-26 -42 L26 -42 L22 0 L-22 0 Z')}<rect x="-28" y="-46" width="56" height="6" rx="2"/>
    <path d="M-24 -32 L24 -32 M-23 -22 L23 -22 M-22 -12 L22 -12 M-14 -42 L-12 0 M0 -42 L0 0 M14 -42 L12 0" stroke="#2a2234" stroke-width="1.6" opacity=".7"/>`;
  const wallStars = () => {
    let s = '';
    [[90, 40, 5], [230, 22, 4], [470, 34, 5], [560, 70, 3.5], [690, 28, 4.5], [820, 52, 3.5], [1000, 30, 5], [1110, 64, 4], [1250, 26, 4.5], [1380, 50, 5], [140, 96, 3.5], [1300, 100, 3.5]].forEach(([x, y, r], i) => {
      s += `<path class="eg-star" style="animation-delay:-${(i * 0.7).toFixed(1)}s" d="${(() => { let d = ''; for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; d += (k ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; })()}" fill="#ffd27a" opacity=".4"/>`;
    });
    [[360, 48], [930, 88], [1190, 40]].forEach(([x, y], i) => { s += `<path class="eg-star" style="animation-delay:-${i * 1.3}s" d="M${x} ${y - 6} A6 6 0 1 0 ${x + 4} ${y + 5} A4.6 4.6 0 1 1 ${x} ${y - 6} Z" fill="#ffd27a" opacity=".35"/>`; });
    return s;
  };

  /* ---------- the kitchen ---------- */
  const counter = (w) => `<rect x="0" y="-64" width="${w}" height="64"/><rect x="-6" y="-70" width="${w + 12}" height="8" rx="2"/>
      ${(() => { let s = ''; const n = Math.round(w / 90); const cw = w / n; for (let i = 0; i < n; i++) s += `<rect x="${i * cw + 8}" y="-56" width="${cw - 16}" height="48" rx="3" fill="none" stroke="#2a2234" stroke-width="2.5"/><circle cx="${i * cw + cw / 2}" cy="-34" r="2.5" fill="#2a2234"/>`; return s; })()}`;
  const jar = (w = 26, h = 34) => `${P(`M${-w / 2} 0 L${-w / 2} ${-h + 8} C${-w / 2} ${-h + 2} ${-w / 2 + 4} ${-h} ${-w / 2 + 6} ${-h} L${w / 2 - 6} ${-h} C${w / 2 - 4} ${-h} ${w / 2} ${-h + 2} ${w / 2} ${-h + 8} L${w / 2} 0 Z`)}
      <rect x="${-w / 2 - 2}" y="${-h - 7}" width="${w + 4}" height="7" rx="2"/><rect x="${-w / 3}" y="${-h * 0.62}" width="${w * 0.66}" height="${h * 0.3}" rx="1" fill="#2a2234"/>`;
  const bottle = (h = 52) => P(`M-9 0 L-9 ${-h * 0.55} C-9 ${-h * 0.66} -4 ${-h * 0.7} -3 ${-h * 0.76} L-3 ${-h} L3 ${-h} L3 ${-h * 0.76} C4 ${-h * 0.7} 9 ${-h * 0.66} 9 ${-h * 0.55} L9 0 Z`) + `<rect x="-4" y="${-h - 5}" width="8" height="5"/>`;
  const flask = () => P('M-4 -40 L4 -40 L4 -24 L16 -4 C18 -1 16 0 13 0 L-13 0 C-16 0 -18 -1 -16 -4 L-4 -24 Z') + '<rect x="-6" y="-44" width="12" height="4"/><path d="M-12 -6 L12 -6" stroke="#9be22d" stroke-width="3" opacity=".7"/>';
  const kettle = () => `${P('M-22 0 C-26 -10 -24 -26 -14 -32 L14 -32 C24 -26 26 -10 22 0 Z M-6 -32 L-6 -36 L6 -36 L6 -32 Z M22 -22 C32 -24 36 -30 40 -38 L36 -38 C32 -32 28 -28 22 -26 Z')}
      <path d="M-14 -32 C-16 -50 16 -50 14 -32" fill="none" stroke="currentColor" stroke-width="3.5"/>
      <g opacity=".4"><circle cx="44" cy="-48" r="5"/><circle cx="50" cy="-60" r="7"/></g>`;
  const mortar = () => P('M-16 -20 L16 -20 C16 -6 8 0 0 0 C-8 0 -16 -6 -16 -20 Z M-18 -22 L18 -22 L18 -19 L-18 -19 Z M4 -20 L22 -44 L26 -41 L9 -19 Z');
  const bread = () => P('M-26 0 C-30 -14 -18 -24 0 -24 C18 -24 30 -14 26 0 Z') + '<path d="M-12 -20 L-6 -12 M0 -22 L6 -14 M12 -20 L18 -12" stroke="#2a2234" stroke-width="2.5" stroke-linecap="round"/>';
  const herbs = () => `${P('M-11 0 L11 0 L14 -18 L-14 -18 Z')}${P('M0 -18 C-10 -30 -16 -40 -14 -52 C-6 -44 -2 -32 0 -18 Z')}${P('M0 -18 C10 -30 18 -38 18 -50 C8 -44 4 -32 0 -18 Z')}${P('M0 -18 C-2 -34 2 -48 4 -60 C8 -46 4 -32 1 -18 Z')}`;
  const broom = () => `<g transform="rotate(14)">${P('M-2 -150 L2 -150 L2 -48 L-2 -48 Z')}${P('M-6 -50 L6 -50 L8 -40 L-8 -40 Z')}${P('M-8 -40 L8 -40 C14 -26 18 -10 20 0 L-20 0 C-18 -10 -14 -26 -8 -40 Z')}
      <path d="M-12 -2 L-6 -38 M0 -2 L0 -38 M12 -2 L6 -38" stroke="#2a2234" stroke-width="1.5"/></g>`;
  const basket = () => `<circle cx="-10" cy="-26" r="9"/><circle cx="6" cy="-28" r="10"/><circle cx="-1" cy="-34" r="8"/>
      ${P('M-26 -22 L26 -22 L20 0 L-20 0 Z')}<path d="M-24 -22 C-22 -50 22 -50 24 -22" fill="none" stroke="currentColor" stroke-width="3.5"/>
      <path d="M-22 -14 L22 -14 M-21 -7 L21 -7" stroke="#2a2234" stroke-width="2"/>`;
  const stool = () => P('M-22 -46 L22 -46 L22 -40 L-22 -40 Z M-16 -40 L-20 0 L-15 0 L-11 -40 Z M16 -40 L20 0 L15 0 L11 -40 Z M-17 -16 L17 -16 L17 -13 L-17 -13 Z');

  /* ---------- the library ---------- */
  const bookcase = (w = 220) => {
    let s = `<rect x="0" y="-108" width="${w}" height="108"/><rect x="-6" y="-114" width="${w + 12}" height="8" rx="2"/>`;
    let seed = 5; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (const [top, bot] of [[-102, -56], [-50, -6]]) {
      s += `<rect x="6" y="${top}" width="${w - 12}" height="${bot - top}" fill="#1c1622"/>`;
      let x = 9;
      while (x < w - 18) {
        const bw = 6 + Math.floor(rnd() * 7), bh = (bot - top) * (0.62 + rnd() * 0.36);
        const lean = rnd() > 0.9 ? ` transform="rotate(-14 ${x + bw} ${bot})"` : '';
        s += `<rect x="${x}" y="${bot - bh}" width="${bw}" height="${bh}"${lean}/>`;
        x += bw + 1 + (rnd() > 0.85 ? 8 : 0);
      }
    }
    return s;
  };
  const ladder = () => `<g transform="rotate(16)">${P('M-16 0 L-12 0 L-12 -150 L-16 -150 Z M12 0 L16 0 L16 -150 L12 -150 Z')}
      ${(() => { let d = ''; for (let y = -16; y > -150; y -= 20) d += `M-14 ${y} L14 ${y} L14 ${y - 3} L-14 ${y - 3} Z `; return P(d); })()}</g>`;
  const globe = () => `${P('M-16 0 L16 0 L4 -6 L-4 -6 Z')}<rect x="-2" y="-28" width="4" height="24"/>
      <circle cx="0" cy="-52" r="22"/><path d="M-26 -52 A26 26 0 0 0 26 -52" fill="none" stroke="currentColor" stroke-width="3"/>
      <path d="M-12 -64 C-4 -60 -8 -52 -2 -48 C4 -44 8 -50 12 -46 M6 -70 C10 -66 14 -66 16 -62" fill="none" stroke="#2a2234" stroke-width="3"/>`;
  const bookStack = (ws = [44, 38, 48, 34]) => { let y = 0, s = ''; ws.forEach((w, i) => { const h = 8 + (i % 2) * 3; s += `<rect x="${-w / 2 + (i % 2 ? 3 : -2)}" y="${y - h}" width="${w}" height="${h}" rx="1.5"/>`; y -= h + 0.6; }); return s; };
  const lampOnBooks = () => `${bookStack([46, 40, 50])}<g transform="translate(0 -30)">${P('M-10 0 L10 0 L4 -4 L-4 -4 Z')}<rect x="-1.6" y="-34" width="3.2" height="30"/>
      ${glow(0, -26, 34, 'g')}${P('M-18 -30 C-18 -42 18 -42 18 -30 Z')}<path d="M-16 -31 C-14 -38 14 -38 16 -31" fill="#b8f3a0" opacity=".55"/></g>`;
  const owlOnBooks = () => `${bookStack([40, 34, 42, 30])}<g transform="translate(0 -40)">${P('M-12 0 C-15 -12 -14 -26 -9 -32 L-11 -40 L-4 -35 C-2 -36 2 -36 4 -35 L11 -40 L9 -32 C14 -26 15 -12 12 0 Z')}
      <circle cx="-4.5" cy="-27" r="3.4" fill="#ffd27a"/><circle cx="4.5" cy="-27" r="3.4" fill="#ffd27a"/><circle cx="-4.5" cy="-27" r="1.4"/><circle cx="4.5" cy="-27" r="1.4"/></g>`;
  const candleOn = (h = 26) => `<rect x="-4" y="${-h}" width="8" height="${h}"/>${P(`M-9 0 L9 0 L6 -3 L-6 -3 Z`)}${flame(0, -h - 2, 0.75)}`;

  /* ---------- the hall of mirrors ---------- */
  const ovalMirror = () => `${P('M0 -142 C10 -142 14 -136 13 -130 C28 -126 40 -110 42 -90 C48 -82 48 -70 44 -64 C48 -46 42 -24 30 -12 C30 -4 22 2 14 0 L-14 0 C-22 2 -30 -4 -30 -12 C-42 -24 -48 -46 -44 -64 C-48 -70 -48 -82 -42 -90 C-40 -110 -28 -126 -13 -130 C-14 -136 -10 -142 0 -142 Z')}
      <ellipse cx="0" cy="-68" rx="30" ry="50" fill="#b9a8f0" opacity=".16"/><path d="M-20 -96 L-6 -110 M-24 -80 L-2 -102" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>`;
  const tallMirror = () => `${P('M-30 0 L-30 -118 C-30 -140 30 -140 30 -118 L30 0 Z M-8 -136 C-6 -150 6 -150 8 -136 Z')}<circle cx="0" cy="-150" r="5"/>
      <path d="M-22 -6 L-22 -116 C-22 -132 22 -132 22 -116 L22 -6 Z" fill="#b9a8f0" opacity=".14"/><path d="M-14 -100 L0 -118" stroke="#fff" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>`;
  const chaise = () => P('M0 0 L4 -10 L-2 -14 C-6 -34 -2 -58 10 -62 C20 -64 22 -52 18 -40 L20 -30 L110 -30 C118 -30 120 -24 118 -18 L114 -10 L110 -10 L108 0 L102 0 L100 -10 L14 -10 L12 0 Z');
  const candelabra = () => `${P('M-14 0 L14 0 L6 -8 L3 -70 L-3 -70 L-6 -8 Z')}
      <path d="M0 -60 C-14 -60 -26 -66 -28 -80 M0 -60 C14 -60 26 -66 28 -80 M0 -66 C-8 -68 -12 -74 -12 -82 M0 -66 C8 -68 12 -74 12 -82" fill="none" stroke="currentColor" stroke-width="3"/>
      <rect x="-31" y="-96" width="6" height="16"/><rect x="25" y="-96" width="6" height="16"/><rect x="-15" y="-98" width="6" height="16"/><rect x="9" y="-98" width="6" height="16"/><rect x="-3" y="-104" width="6" height="34"/>
      ${flame(-28, -97, 0.75)}${flame(28, -97, 0.75)}${flame(-12, -99, 0.75)}${flame(12, -99, 0.75)}${flame(0, -105, 0.85)}`;
  const roses = () => `${P('M-10 0 C-16 -10 -14 -26 -6 -32 L-8 -40 L8 -40 L6 -32 C14 -26 16 -10 10 0 Z')}
      <path d="M0 -40 C-4 -60 -14 -72 -26 -74 M0 -40 C2 -62 8 -78 14 -86 M0 -40 C6 -54 18 -60 28 -58" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="-27" cy="-72" r="6"/><circle cx="15" cy="-88" r="6.5"/><circle cx="29" cy="-56" r="5.5"/>
      ${P('M-16 -60 C-22 -62 -24 -56 -18 -54 Z M8 -70 C14 -74 18 -70 12 -66 Z')}<circle cx="-12" cy="-2" r="2.5"/><circle cx="20" cy="-1" r="2"/>`;

  /* ---------- the candle room ---------- */
  const tallCandle = (h, x = 0) => `<rect x="${x - 6}" y="${-h}" width="12" height="${h}"/>${P(`M${x - 6} ${-h + 2} C${x - 8} ${-h + 10} ${x - 5} ${-h + 14} ${x - 6} ${-h + 20} L${x - 6} ${-h} Z M${x + 6} ${-h + 2} C${x + 8} ${-h + 8} ${x + 5} ${-h + 10} ${x + 6} ${-h + 16} L${x + 6} ${-h} Z`)}${flame(x, -h - 2, 1)}`;
  const candleCluster = () => `${tallCandle(60, -22)}${tallCandle(92, 0)}${tallCandle(46, 20)}${tallCandle(30, 38)}${P('M-44 0 L56 0 L50 -4 L-38 -4 Z')}`;
  const dishCandle = () => `${P('M-22 0 C-20 -6 20 -6 22 0 Z')}${P('M-8 -4 L-8 -18 C-6 -24 6 -24 8 -18 L8 -4 Z')}<path d="M8 -4 C14 -4 16 -2 18 0" fill="none" stroke="currentColor" stroke-width="2"/>${flame(0, -24, 0.8)}`;

  /* ---------- the clock room ---------- */
  const gear = (r, teeth = 12) => { let d = ''; for (let i = 0; i < teeth; i++) { const a = (i / teeth) * 360; d += `<rect x="-${r * 0.13}" y="${-r - r * 0.22}" width="${r * 0.26}" height="${r * 0.3}" transform="rotate(${a})"/>`; } return `<g class="eg-gear">${d}<circle r="${r}"/><circle r="${r * 0.42}" fill="#2a2234"/><circle r="${r * 0.16}"/></g>`; };
  const hourglass = () => `${P('M-20 0 L20 0 L20 -6 L-20 -6 Z M-20 -64 L20 -64 L20 -70 L-20 -70 Z M-17 -6 L-15 -64 L-13 -64 L-15 -6 Z M15 -6 L13 -64 L15 -64 L17 -6 Z')}
      <path d="M-12 -62 C-12 -46 -2 -40 -2 -35 C-2 -30 -12 -24 -12 -8 L12 -8 C12 -24 2 -30 2 -35 C2 -40 12 -46 12 -62 Z" fill="#f2b544" opacity=".22"/>
      ${P('M-10 -8 L10 -8 C8 -16 4 -18 0 -20 C-4 -18 -8 -16 -10 -8 Z')}<path d="M0 -36 L0 -20" stroke="#f2b544" stroke-width="1.2" opacity=".7"/>`;
  const cuckoo = () => `${P('M-26 -92 L0 -124 L26 -92 Z M-20 -92 L20 -92 L20 -40 L-20 -40 Z')}<circle cx="0" cy="-70" r="12" fill="#2a2234"/>
      <path d="M0 -70 L0 -78 M0 -70 L5 -68" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="-5" y="-108" width="10" height="9" fill="#2a2234"/>
      <path d="M-8 -40 L-8 -12 M8 -40 L8 -20" stroke="currentColor" stroke-width="1.5"/>${P('M-12 -12 L-4 -12 L-5 0 L-11 0 Z M4 -20 L12 -20 L11 -8 L5 -8 Z')}`;
  const pocketWatch = () => `<circle cx="0" cy="-16" r="16"/><circle cx="0" cy="-16" r="11" fill="#2a2234"/><rect x="-3" y="-36" width="6" height="5"/><circle cx="0" cy="-38" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M0 -16 L0 -23 M0 -16 L5 -14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M3 -40 C14 -50 30 -40 40 -20 C46 -8 52 -2 60 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 2"/>`;

  /* ---------- dawn ---------- */
  const leafyTree = (s = 1) => `<g transform="scale(${s})"><path d="M-3 0 L-4 -40 L4 -40 L3 0 Z"/><circle cx="0" cy="-62" r="26"/><circle cx="-18" cy="-48" r="18"/><circle cx="18" cy="-50" r="19"/><circle cx="-6" cy="-80" r="17"/><circle cx="12" cy="-76" r="16"/></g>`;
  const posts = (from, to) => { let s = ''; for (let x = from; x <= to; x += 34) s += `<rect x="${x - 2.5}" y="-30" width="5" height="30"/>`; return s + `<path d="M${from} -22 L${to} -24 M${from} -10 L${to} -11" stroke="currentColor" stroke-width="2.5"/>`; };
  const flowers = (from, to) => { let s = ''; for (let x = from; x < to; x += 19) { const h = 10 + ((x * 13) % 12); s += `<path d="M${x} 0 L${x + 1} ${-h}" stroke="currentColor" stroke-width="1.5"/><circle cx="${x + 1}" cy="${-h - 2}" r="3"/>`; } return s; };

  /* ---------- the ground line ---------- */
  const ground = (y = G) => `<path d="M0 ${y + 2} C240 ${y - 4} 480 ${y + 4} 720 ${y} C960 ${y - 4} 1200 ${y + 4} 1440 ${y} L1440 180 L0 180 Z"/>`;
  const back = (inner) => `<g opacity=".42">${inner}<path d="M0 158 C300 150 520 160 760 154 C1000 148 1200 158 1440 152 L1440 170 L0 170 Z"/></g>`;

  const SCENES = {
    forest: () => back(put(140, tree(), 0.62, false, 158) + put(1300, tree(), 0.7, true, 158) + put(330, graveRound(30, 44), 0.8, false, 158) + put(1110, obelisk, 0.8, false, 158) + put(860, graveCross, 0.7, false, 158)) +
      ground() + put(720, gate()) + put(552, fence(0, 112)) + put(778, fence(0, 112)) + put(500, lamppost()) + put(940, lamppost()) +
      put(200, tree(), 0.95) + put(1260, tree(), 1.05, true) + put(400, graveRound()) + put(440, graveCross, 0.9) + put(1010, graveRound(30, 46)) + put(1060, obelisk, 0.95) +
      put(612, pumpkin(1.05)) + put(842, pumpkin(0.9)) + put(870, pumpkin(0.6)) + put(1010, crow(), 0.55, true, G - 46) + put(658, cat(), 0.75, false, G - 55) +
      grass(0, 1440, 9) + put(300, bat(), 0.55, false, 62) + put(1160, bat(), 0.4, true, 48),
    hall: () => back(put(380, wingChair(), 0.7, true, 156) + put(1180, fern(), 0.75, false, 156)) +
      ground() + put(820, stairs(9, 26, 12)) + put(560, grandClock()) + put(430, wingChair(), 1, false) + put(660, sideTable()) + put(1120, hatStand()) + put(260, fern()) + put(1320, sideTable(), 0.9),
    nursery: () => wallStars() + back(put(250, dollHouse(), 0.75, false, 156) + put(1190, ivy(), 1.1, false, 156) + put(780, rockingHorse(), 0.45, true, 156)) +
      ground() + put(110, toyBasket()) + put(330, wardrobe(), 0.92) + put(600, rockingHorse()) + put(700, ball(), 0.55) + put(770, blocks(), 0.95) + put(960, kidBed()) +
      put(1180, bookStack([52, 46, 56, 42])) + put(1180, lantern(), 1.15, false, G - 39) + put(1320, toyBasket(), 0.85, true),
    kitchen: () => back(put(220, stool(), 0.8, false, 156) + put(1260, basket(), 0.8, false, 156)) +
      ground() + put(440, counter(560)) + put(470, jar(26, 30), 1, false, G - 70) + put(504, jar(20, 40), 1, false, G - 70) + put(560, bottle(54), 1, false, G - 70) + put(584, flask(), 1, false, G - 70) + put(640, kettle(), 1, false, G - 70) +
      put(740, cat(), 0.9, true, G - 70) + put(820, bread(), 1, false, G - 70) + put(890, mortar(), 1, false, G - 70) + put(950, herbs(), 1, false, G - 70) + put(980, bottle(40), 1, false, G - 70) +
      put(360, broom()) + put(300, basket()) + put(1110, stool()) + put(1190, pumpkin(1.1)) + put(1110, pumpkin(0.8), 1, false, G - 46) + put(140, jar(30, 44)),
    library: () => back(put(240, globe(), 0.8, false, 156) + put(1220, bookcase(160), 0.7, false, 156)) +
      ground() + put(560, bookcase(240)) + put(528, ladder()) + put(470, globe()) + put(870, lampOnBooks()) + put(960, owlOnBooks()) + put(1040, wingChair(), 1, true) + put(380, bookStack([50, 44, 54, 40, 46])) + put(380, candleOn(24), 1, false, G - 52) + put(1180, bookStack([40, 46, 36])) + put(1180, candleOn(30), 1, false, G - 30) + put(180, owlOnBooks(), 0.9),
    mirrors: () => back(put(260, tallMirror(), 0.7, false, 156) + put(1200, ovalMirror(), 0.7, false, 156)) +
      ground() + put(580, ovalMirror()) + put(700, roses()) + put(800, chaise(), 1) + put(1000, tallMirror()) + put(450, candelabra()) + put(1110, candelabra(), 0.85) + put(330, roses(), 0.9) + put(1290, ovalMirror(), 0.8),
    candles: () => back(put(260, candleCluster(), 0.7, false, 156) + put(1200, candleCluster(), 0.7, true, 156)) +
      ground() + put(520, bookStack([60, 54, 64])) + put(520, candleCluster(), 0.9, false, G - 31) + put(720, candelabra(), 1.1) + put(900, bookStack([56, 62, 50, 58])) + put(900, tallCandle(48), 1, false, G - 44) +
      put(620, dishCandle()) + put(1010, dishCandle(), 0.9) + put(400, tallCandle(70)) + put(1080, tallCandle(56)) + put(1180, candleCluster(), 0.9) + put(230, dishCandle()),
    clock: () => back(put(300, gear(40), 1, false, 150) + put(1180, gear(52, 14), 1, false, 150)) +
      ground() + put(520, gear(46, 14), 1, false, G + 10) + put(590, gear(24, 10), 1, false, G - 30) + put(700, grandClock(), 0.95) + put(800, hourglass()) + put(900, cuckoo()) + put(990, pocketWatch()) + put(1100, gear(34), 1, false, G + 4) + put(400, hourglass(), 0.8) + put(1250, grandClock(), 0.8),
    dawn: () => `<path d="M0 150 C180 120 360 138 540 132 C720 126 900 110 1100 124 C1260 134 1360 128 1440 120 L1440 180 L0 180 Z" opacity=".4"/>` +
      put(1180, leafyTree(0.9), 1, false, 130) + put(240, leafyTree(0.7), 1, false, 140) +
      `<path d="M0 170 C220 150 420 162 640 156 C860 150 1080 164 1440 152 L1440 180 L0 180 Z"/>` + put(470, leafyTree(1.1), 1, false, 160) + put(980, leafyTree(0.95), 1, false, 158) + put(600, posts(0, 300), 1, false, 158) + put(0, flowers(0, 1440), 1, false, 166) +
      put(700, `<g transform="translate(-30 -18) scale(.6)">${birdG('currentColor')}</g>`, 1, false, 70) + put(780, `<g transform="translate(-30 -18) scale(.42)">${birdG('currentColor')}</g>`, 1, false, 52),
  };
  window.edgeScene = (kind) => {
    gid = 'eg' + Math.random().toString(36).slice(2, 7);
    const defs = `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid}g"><stop offset="0" stop-color="#c8f5a8" stop-opacity=".5"/><stop offset="1" stop-color="#c8f5a8" stop-opacity="0"/></radialGradient></defs>`;
    return defs + `<g fill="currentColor">${(SCENES[kind] || SCENES.forest)()}</g>`;
  };
  /* a border picture you sent (built into the file) replaces the drawn one */
  const PICTURE_EDGES = {
    nursery: { h: 260, glows: [[404.8, 53.6], [1077.2, 194.8]], stars: [[60, 40, 5], [180, 80, 4], [500, 34, 5], [600, 80, 3.5], [700, 28, 4.5], [860, 52, 3.5], [1000, 30, 5], [1110, 74, 4], [1250, 26, 4.5], [1395, 60, 5], [770, 120, 3.5], [960, 130, 3.5]] },
    forest: {"fit": "meet", "h": 434, "glows": [[637.5, 239.5, 81.6], [449.0, 241.5, 54.4], [792.5, 263.0, 78.4]], "w": 1024},
    hall: {"h": 260, "glows": [[452.0, 98.4, 74.6], [1255.2, 121.3, 39.8], [1262.2, 144.6, 26]]},
    kitchen: {"h": 260, "glows": []},
    library: {"h": 260, "glows": []},
    mirrors: {"h": 260, "glows": []},
    candles: {"h": 260, "glows": [[592.9, 86.8, 26], [606.0, 90.9, 26], [579.8, 91.3, 26], [564.4, 98.0, 26], [622.0, 97.7, 26]]},
  };
  const starD = (x, y, r) => { let d = ''; for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; d += (k ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; };
  const pictureEdge = (kind) => {
    const pic = typeof EMBEDDED !== 'undefined' && EMBEDDED['edge_' + kind], cfg = PICTURE_EDGES[kind];
    if (!pic || !cfg) return null;
    gid = 'eg' + Math.random().toString(36).slice(2, 7);
    const defs = `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#ffd27a" stop-opacity=".6"/><stop offset=".5" stop-color="#ffb347" stop-opacity=".18"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient><linearGradient id="${gid}f"><stop offset="0" stop-color="#000"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="${gid}m"><rect width="${cfg.w || 1440}" height="${cfg.h}" fill="url(#${gid}f)"/></mask></defs>`;
    const stars = (cfg.stars || []).map(([x, y, r], i) => `<path class="eg-star" style="animation-delay:-${(i * 0.7).toFixed(1)}s" d="${starD(x, y, r)}" fill="#ffd27a" opacity=".4"/>`).join('');
    const glowHTML = cfg.glows.map(([x, y, r]) => `<circle class="eg-glow" cx="${x}" cy="${y}" r="${Math.max(40, (r || 46) * 0.9)}" fill="url(#${gid})"/>`).join('');
    const w = cfg.w || 1440;
    return SV(`0 0 ${w} ${cfg.h}`, `${defs}${stars}<image href="${pic}" x="0" y="0" width="${w}" height="${cfg.h}" preserveAspectRatio="none"${cfg.fit === 'meet' ? ` mask="url(#${gid}m)"` : ''}/>${glowHTML}`, 'edge-svg', cfg.fit === 'meet' ? 'xMidYMax meet' : 'xMidYMax slice');
  };
  ART.edge = (kind) => pictureEdge(kind) || SV('0 0 1440 180', edgeScene(kind), 'edge-svg', 'xMidYMax slice');
})();
