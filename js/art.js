/* Offline product illustrations — generated inline SVG, no remote images. */
(function () {
  function shade(hex, amt) {
    let c = hex.replace('#', '');
    let n = parseInt(c, 16);
    let r = Math.min(255, Math.max(0, (n >> 16) + amt));
    let g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
    let b = Math.min(255, Math.max(0, (n & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const shapes = {
    phone: (c, l, d) => `
      <rect x="70" y="25" width="60" height="120" rx="10" fill="${d}"/>
      <rect x="74" y="31" width="52" height="108" rx="7" fill="url(#__ID__)"/>
      <rect x="92" y="34" width="16" height="4" rx="2" fill="${d}"/>
      <circle cx="100" cy="85" r="14" fill="#fff" opacity=".25"/>`,
    laptop: (c, l, d) => `
      <rect x="45" y="40" width="110" height="72" rx="6" fill="${d}"/>
      <rect x="50" y="45" width="100" height="62" rx="3" fill="url(#__ID__)"/>
      <path d="M30 116 h140 l-10 14 h-120 z" fill="${l}"/>
      <rect x="88" y="116" width="24" height="4" rx="2" fill="${d}"/>`,
    tablet: (c, l, d) => `
      <rect x="55" y="30" width="90" height="115" rx="10" fill="${d}"/>
      <rect x="61" y="36" width="78" height="103" rx="5" fill="url(#__ID__)"/>
      <rect x="70" y="50" width="28" height="22" rx="3" fill="#fff" opacity=".3"/>
      <rect x="102" y="50" width="28" height="22" rx="3" fill="#fff" opacity=".2"/>
      <rect x="70" y="78" width="60" height="6" rx="3" fill="#fff" opacity=".3"/>`,
    headphone: (c, l, d) => `
      <path d="M55 105 v-20 a45 45 0 0 1 90 0 v20" fill="none" stroke="${d}" stroke-width="10" stroke-linecap="round"/>
      <rect x="42" y="95" width="30" height="45" rx="12" fill="${c}"/>
      <rect x="128" y="95" width="30" height="45" rx="12" fill="${c}"/>
      <rect x="50" y="103" width="14" height="29" rx="6" fill="${l}"/>
      <rect x="136" y="103" width="14" height="29" rx="6" fill="${l}"/>`,
    watch: (c, l, d) => `
      <rect x="82" y="20" width="36" height="40" rx="6" fill="${d}"/>
      <rect x="82" y="115" width="36" height="40" rx="6" fill="${d}"/>
      <rect x="68" y="52" width="64" height="70" rx="16" fill="${d}"/>
      <rect x="74" y="58" width="52" height="58" rx="12" fill="url(#__ID__)"/>
      <circle cx="100" cy="87" r="16" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>
      <path d="M100 87 v-10 M100 87 h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <rect x="132" y="78" width="5" height="14" rx="2" fill="${c}"/>`,
    accessory: (c, l, d) => `
      <rect x="60" y="55" width="80" height="70" rx="14" fill="${c}"/>
      <rect x="60" y="55" width="80" height="20" rx="10" fill="${l}" opacity=".6"/>
      <path d="M100 75 l-12 22 h10 l-4 18 l16 -26 h-10 l4 -14 z" fill="#fff"/>
      <path d="M100 125 v15 q0 12 20 12 h20" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/>`
  };
  let uid = 0;
  window.productArt = function (category, color) {
    const l = shade(color, 60), d = shade(color, -50);
    const draw = shapes[category] || shapes.accessory;
    const gid = 'g' + (++uid);
    return `<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${l}"/><stop offset="1" stop-color="${color}"/>
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="158" rx="60" ry="6" fill="#000" opacity=".08"/>
      ${draw(color, l, d).replace(/__ID__/g, gid)}
    </svg>`;
  };
  // Small line icons for UI / categories
  const icons = {
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    laptop: '<rect x="4" y="4" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
    tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>',
    headphone: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
    watch: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/>',
    accessory: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    truck: '<path d="M1 4h14v12H1zM15 9h4l3 3v4h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    star: '<path d="m12 2 3 7 7 .6-5.4 4.7 1.7 7.2L12 17.8 5.7 21.5l1.7-7.2L2 9.6 9 9z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    back: '<path d="M15 18 9 12l6-6"/>'
  };
  window.icon = function (name, cls) {
    return `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
  };
})();
