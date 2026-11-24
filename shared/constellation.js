/* =====================================================================
   APP. Nothing below needs to change per client.
   ===================================================================== */
const NS = "http://www.w3.org/2000/svg";
const STATUS = { ready: "Ready", progress: "In progress", planning: "Planning" };
const ALL = [HOME, ...SECTIONS];
const SEC = {}, PAGE = {};
ALL.forEach(s => { SEC[s.id] = s; s.subs.forEach(u => { PAGE[u.id] = { ...u, sec: s }; (u.children || []).forEach(c => PAGE[c.id] = { ...c, sec: s, parent: u }); }); });
const app = document.getElementById("app");

function mk(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function glyph(s) {
  if (s === "ready") return '<svg viewBox="-8 -8 16 16" aria-hidden="true"><circle r="6" fill="currentColor"/></svg>';
  if (s === "progress") return '<svg viewBox="-8 -8 16 16" aria-hidden="true"><circle r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M0 -6 A6 6 0 0 0 0 6Z" fill="currentColor"/></svg>';
  return '<svg viewBox="-8 -8 16 16" aria-hidden="true"><circle r="6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 2.4"/></svg>';
}
function glyphSVG(g, s, x, y, r) {
  if (s === "ready") return mk("circle", { cx: x, cy: y, r, class: "st-fill" }, g);
  if (s === "progress") { mk("circle", { cx: x, cy: y, r, class: "st-hollow" }, g); return mk("path", { d: `M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r}Z`, class: "st-fill" }, g); }
  return mk("circle", { cx: x, cy: y, r, class: "st-dash" }, g);
}
const legendHTML = () => `<div class="legend">${Object.entries(STATUS).map(([k, v]) => `<span>${glyph(k)}${v}</span>`).join("")}</div>`;
const go = id => { location.hash = id; };
function linkedPages(pid) { const out = []; LINKS.forEach(([a, b]) => { if (a === pid) out.push(b); if (b === pid) out.push(a); }); return out.filter(id => PAGE[id]); }
function connectedSections(secId) {
  const sec = SEC[secId], out = new Map();
  sec.subs.forEach(u => linkedPages(u.id).forEach(o => { const os = PAGE[o].sec; if (os.id !== secId) out.set(os.id, os); }));
  return [...out.values()];
}
function bindKeys(g, fn) { g.addEventListener("click", fn); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } }); }

/* ---------- Orbit map (home) ---------- */
function layout(compact) {
  const W = compact ? 760 : 1440, H = compact ? 760 : 1120, cx = W / 2, cy = H / 2;
  const Rp = compact ? 220 : 270, Rs = compact ? 318 : 425;
  const planets = {}, subs = {};
  /* Each section gets a slice of the circle sized to its page count, so groups never crowd each other. */
  const total = SECTIONS.reduce((n, s) => n + s.subs.length, 0);
  const stepDeg = Math.min(compact ? 15 : 19, 320 / total), pad = (360 - stepDeg * total) / SECTIONS.length;
  let cursor = -90 - (SECTIONS[0].subs.length * stepDeg + pad) / 2;
  SECTIONS.forEach((s, i) => {
    const slice = s.subs.length * stepDeg + pad;
    const a = (cursor + slice / 2) * Math.PI / 180; cursor += slice;
    planets[s.id] = { x: cx + Rp * Math.cos(a), y: cy + Rp * Math.sin(a), a };
    const n = s.subs.length, step = stepDeg * Math.PI / 180;
    s.subs.forEach((u, j) => {
      const a2 = a + (j - (n - 1) / 2) * step;
      const r2 = Rs + (n >= 3 && j % 2 ? (compact ? 32 : 64) : 0);
      subs[u.id] = { x: cx + r2 * Math.cos(a2), y: cy + r2 * Math.sin(a2), a: a2 };
    });
  });
  return { W, H, cx, cy, Rp, Rs, planets, subs };
}
function renderOrbit(svg, compact, onHover) {
  svg.innerHTML = "";
  const L = layout(compact);
  svg.setAttribute("viewBox", `0 0 ${L.W} ${L.H}`);
  svg.classList.toggle("compact", compact);
  const back = mk("g", {}, svg), links = mk("g", {}, svg), spokes = mk("g", {}, svg), nodes = mk("g", {}, svg);
  const fs = compact ? { sub: 24, pill: 25, pillH: 56, sun: 17, sunR: 82 } : { sub: 26, pill: 21, pillH: 50, sun: 17, sunR: 98 };
  starfield(mk("g", { class: "stars", "aria-hidden": "true" }, back), L, compact, fs.sunR);
  mk("circle", { cx: L.cx, cy: L.cy, r: L.Rp, class: "ring" }, back);
  mk("circle", { cx: L.cx, cy: L.cy, r: L.Rs - 34, class: "ring dash" }, back);
  mk("circle", { cx: L.cx, cy: L.cy, r: fs.sunR + 18, class: "ring" }, back);
  LINKS.forEach(([a, b]) => {
    const p = L.subs[a], q = L.subs[b]; if (!p || !q) return;
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, k = .18;
    mk("path", { d: `M${p.x} ${p.y} Q${mx + (L.cx - mx) * k} ${my + (L.cy - my) * k} ${q.x} ${q.y}`, class: "link", "data-k": `l:${a}-${b}` }, links);
  });
  SECTIONS.forEach(s => {
    const P = L.planets[s.id];
    mk("line", { x1: L.cx, y1: L.cy, x2: P.x, y2: P.y, class: "spoke", "data-k": `p:${s.id}` }, spokes);
    s.subs.forEach(u => { const Q = L.subs[u.id]; mk("line", { x1: P.x, y1: P.y, x2: Q.x, y2: Q.y, class: "spoke2", "data-k": `s:${u.id}` }, spokes); });
  });
  SECTIONS.forEach(s => s.subs.forEach(u => {
    const Q = L.subs[u.id];
    const g = mk("g", { class: "node", "data-k": `s:${u.id}`, tabindex: compact ? -1 : 0, role: "link", "aria-label": `${u.title}, ${STATUS[u.s]}` }, nodes);
    mk("circle", { cx: Q.x, cy: Q.y, r: 22, fill: "transparent" }, g);
    glyphSVG(g, u.s, Q.x, Q.y, compact ? 8 : 6.5);
    /* Pages inside this page: small moons just outside it. */
    (u.children || []).forEach((c, k, arr) => {
      const n = arr.length, spread = compact ? 0.11 : 0.08, a3 = Q.a + (k - (n - 1) / 2) * spread, rr = compact ? 30 : 26;
      const cx2 = Q.x + rr * Math.cos(a3) - (compact ? 0 : 0), cy2 = Q.y + rr * Math.sin(a3);
      mk("line", { x1: Q.x, y1: Q.y, x2: cx2, y2: cy2, class: "spoke2" }, g);
      mk("circle", { cx: cx2, cy: cy2, r: compact ? 4.5 : 3.5, class: c.s === "planning" ? "st-dash moon" : "st-fill moon" }, g);
    });
    if (!compact) {
      const c = Math.cos(Q.a), sn = Math.sin(Q.a), off = 18;
      const t = mk("text", { x: Q.x + c * off, y: Q.y + sn * off, class: "halo", "font-size": fs.sub,
        "text-anchor": c > .3 ? "start" : c < -.3 ? "end" : "middle", dy: sn > .5 ? ".9em" : sn < -.5 ? "-.25em" : ".35em" }, g);
      t.textContent = u.short;
    }
    bindKeys(g, () => go(u.id));
    g.addEventListener("mouseenter", () => onHover(s.id)); g.addEventListener("mouseleave", () => onHover(null));
    g.addEventListener("focus", () => onHover(s.id));
  }));
  SECTIONS.forEach(s => {
    const P = L.planets[s.id];
    const g = mk("g", { class: "node planet", "data-k": `p:${s.id}`, "data-sec": s.id, tabindex: 0, role: "link", "aria-label": s.title }, nodes);
    const rect = mk("rect", { class: "pill-bg", height: fs.pillH, rx: fs.pillH / 2 }, g);
    const t = mk("text", { x: P.x, y: P.y, "text-anchor": "middle", dy: ".36em", "font-size": fs.pill, class: "pill-text" }, g);
    t.textContent = s.short.toUpperCase();
    let w = 0; try { w = t.getBBox().width; } catch (e) {}
    if (!w) w = s.short.length * fs.pill * .66;
    const pw = w + fs.pill * 2.2;
    rect.setAttribute("x", P.x - pw / 2); rect.setAttribute("y", P.y - fs.pillH / 2); rect.setAttribute("width", pw);
    bindKeys(g, () => go(s.id));
    g.addEventListener("mouseenter", () => onHover(s.id)); g.addEventListener("mouseleave", () => onHover(null));
    g.addEventListener("focus", () => onHover(s.id));
  });
  const sun = mk("g", { class: "node", "data-k": "c", tabindex: 0, role: "link", "aria-label": `${CLIENT.name}, brand home` }, nodes);
  mk("circle", { cx: L.cx, cy: L.cy, r: fs.sunR, class: "sun-disc" }, sun);
  CLIENT.sunLines.forEach((line, i) => {
    const t = mk("text", { x: L.cx, y: L.cy + (i - (CLIENT.sunLines.length - 1) / 2) * fs.sun * 1.6, dy: ".36em", "text-anchor": "middle", "font-size": fs.sun, class: "sun-text" }, sun);
    t.textContent = line;
  });
  bindKeys(sun, () => go(HOME.id));
  sun.addEventListener("mouseenter", () => onHover(null)); sun.addEventListener("focus", () => onHover(null));
}
/* A quiet field of stars behind the map. Seeded, so it never jumps between visits;
   stars keep clear of the sun, the section pills and the page labels. */
function starfield(g, L, compact, sunR) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const busy = [{ x: L.cx, y: L.cy, r: sunR + 40 }];
  Object.values(L.planets).forEach(P => busy.push({ x: P.x, y: P.y, r: compact ? 90 : 120 }));
  Object.values(L.subs).forEach(Q => busy.push({ x: Q.x, y: Q.y, r: compact ? 34 : 70 }, { x: Q.x + Math.cos(Q.a) * 90, y: Q.y + Math.sin(Q.a) * 30, r: compact ? 0 : 75 }));
  const free = (x, y, pad = 0) => busy.every(b => Math.hypot(x - b.x, y - b.y) > b.r + pad);
  const pick = pad => { for (let i = 0; i < 60; i++) { const x = rnd() * L.W, y = rnd() * L.H; if (free(x, y, pad)) return { x, y }; } return null; };
  const twinkle = el => { el.style.setProperty("--d", (rnd() * 6).toFixed(2) + "s"); el.style.setProperty("--t", (3 + rnd() * 4).toFixed(2) + "s"); };
  /* Dust: many tiny points */
  for (let i = 0; i < (compact ? 70 : 150); i++) {
    const p = pick(0); if (!p) continue;
    const r = rnd() < .85 ? .9 + rnd() * .9 : 1.8 + rnd() * .9;
    const c = mk("circle", { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: r.toFixed(2), class: "dust" + (rnd() < .25 ? " tw" : "") }, g);
    c.style.opacity = (.25 + rnd() * .55).toFixed(2); twinkle(c);
  }
  /* Sparkles: four-point stars, a few in rust */
  const spark = (x, y, R, cls) => {
    const r = R * .22;
    const d = `M${x} ${y - R} Q${x + r} ${y - r} ${x + R} ${y} Q${x + r} ${y + r} ${x} ${y + R} Q${x - r} ${y + r} ${x - R} ${y} Q${x - r} ${y - r} ${x} ${y - R}Z`;
    const el = mk("path", { d, class: "spark " + cls }, g); twinkle(el); return el;
  };
  for (let i = 0; i < (compact ? 7 : 12); i++) {
    const p = pick(10); if (!p) continue;
    spark(p.x, p.y, (compact ? 7 : 8) + rnd() * (compact ? 6 : 9), rnd() < .4 ? "rust" : "ink");
  }
  /* Two small constellations drawn with hairlines */
  for (let k = 0; k < 2; k++) {
    const a = pick(70); if (!a) continue;
    let pts = [a], ang = rnd() * Math.PI * 2;
    for (let j = 0; j < 3 + Math.floor(rnd() * 2); j++) {
      const last = pts[pts.length - 1]; ang += (rnd() - .5) * 1.6;
      const len = (compact ? 30 : 42) + rnd() * 34, q = { x: last.x + Math.cos(ang) * len, y: last.y + Math.sin(ang) * len };
      if (q.x < 10 || q.y < 10 || q.x > L.W - 10 || q.y > L.H - 10 || !free(q.x, q.y)) break;
      pts.push(q);
    }
    if (pts.length < 3) continue;
    mk("polyline", { points: pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "), class: "cline" }, g);
    pts.forEach((p, j) => mk("circle", { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: j === 0 ? 2.6 : 1.8, class: "cstar" }, g));
  }
}
function focusOrbit(svg, secId) {
  svg.classList.toggle("focusing", !!secId);
  svg.querySelectorAll(".planet").forEach(p => p.classList.toggle("sel", p.dataset.sec === secId));
  if (!secId) return;
  const sec = SEC[secId], on = new Set(["c", `p:${secId}`]);
  sec.subs.forEach(u => { on.add(`s:${u.id}`); linkedPages(u.id).forEach(o => on.add(`s:${o}`)); });
  LINKS.forEach(([a, b]) => { if (sec.subs.some(u => u.id === a || u.id === b)) on.add(`l:${a}-${b}`); });
  svg.querySelectorAll("[data-k]").forEach(e => e.classList.toggle("on", on.has(e.dataset.k)));
}
const rowsHTML = items => `<ul class="rows">${items.map(u => `<li><a href="#${u.id}">${glyph(u.s)}<b>${u.title}</b><span class="st ${u.s}">${STATUS[u.s]}</span><span class="note">${u.note}</span></a></li>`).join("")}</ul>`;
function panelHTML(secId) {
  if (!secId) return `<h2>${CLIENT.name}</h2><p class="blurb">${HOME.blurb}</p>
    ${rowsHTML(HOME.subs)}<a class="open" href="#${HOME.id}">Open Brand Home</a>
    <p class="hint">Hover a section to preview it. Click to open.</p>`;
  const s = SEC[secId];
  return `<h2>${s.title}</h2><p class="blurb">${s.blurb}</p>${rowsHTML(s.subs)}<a class="open" href="#${s.id}">Open ${s.short}</a>`;
}

let compactNow = null;
function renderHome() {
  app.innerHTML = `<section class="home"><svg class="map" id="orbit" role="img" aria-label="${CLIENT.name} brand constellation"></svg>${legendHTML()}</section>`;
  const svg = document.getElementById("orbit");
  let last;
  const hover = id => { if (id === last) return; last = id; focusOrbit(svg, id); };
  compactNow = svg.getBoundingClientRect().width < 620;
  renderOrbit(svg, compactNow, hover);
  hover(null);
}

/* ---------- Ego map ("connected to") ---------- */
function egoMap(centerLabel, neighbors) {
  const W = 580, H = 340, cx = W / 2, cy = H / 2, R = 104;
  const svg = mk("svg", { class: "map ego", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${centerLabel} and what it connects to` });
  const lines = mk("g", {}, svg), nodes = mk("g", {}, svg);
  const n = neighbors.length;
  neighbors.forEach((nb, i) => {
    const a = (-90 + i * 360 / n) * Math.PI / 180, x = cx + R * Math.cos(a), y = cy + R * 0.88 * Math.sin(a);
    mk("line", { x1: cx, y1: cy, x2: x, y2: y, class: `e-${nb.kind}` }, lines);
    const g = mk("g", { class: "node", tabindex: 0, role: "link", "aria-label": nb.label }, nodes);
    mk("circle", { cx: x, cy: y, r: 20, fill: "transparent" }, g);
    mk("circle", { cx: x, cy: y, r: nb.kind === "part" ? 7 : 6.5, class: `d-${nb.kind}` }, g);
    const c = Math.cos(a), s = Math.sin(a);
    const t = mk("text", { x: x + c * 16, y: y + s * 16, "font-size": 22, class: `halo t-${nb.kind}`,
      "text-anchor": c > .3 ? "start" : c < -.3 ? "end" : "middle", dy: s > .5 ? ".9em" : s < -.5 ? "-.3em" : ".35em" }, g);
    t.textContent = nb.label;
    bindKeys(g, () => go(nb.id));
  });
  const me = mk("g", {}, nodes);
  const rect = mk("rect", { class: "me", height: 44, rx: 22 }, me);
  const t = mk("text", { x: cx, y: cy, dy: ".36em", "text-anchor": "middle", "font-size": 17, class: "me-text" }, me);
  t.textContent = centerLabel.toUpperCase();
  requestAnimationFrame(() => {
    let w = 0; try { w = t.getBBox().width; } catch (e) {}
    if (!w) w = centerLabel.length * 11;
    rect.setAttribute("x", cx - (w + 40) / 2); rect.setAttribute("y", cy - 22); rect.setAttribute("width", w + 40);
  });
  return svg;
}
function sideHTML(hasRel) {
  return `<h3>Connected to</h3><div id="ego"></div>
    <div class="key"><span><i></i>Part of</span>${hasRel ? '<span><i class="rel"></i>Related</span>' : ""}</div>`;
}

/* ---------- Blocks ---------- */
function blockHTML(b) {
  const h = b.heading ? `<h3>${b.heading}</h3>` : "";
  switch (b.type) {
    case "lead": return `<p class="lead">${b.text}</p>`;
    case "text": return `${h}${b.body.map(p => `<p>${p}</p>`).join("")}`;
    case "quote": return `<figure class="quote"><blockquote>${b.text}</blockquote>${b.by ? `<figcaption>${b.by}</figcaption>` : ""}</figure>`;
    case "quotes": return `${h}<div class="quotes">${b.items.map(q => `<p>“${q}”</p>`).join("")}</div>`;
    case "list": return `${h}<ul class="items">${b.items.map(i => `<li><b>${i.t}</b><span>${i.d}</span></li>`).join("")}</ul>`;
    case "tags": return `${h}<div class="tags">${b.items.map(t => `<span>${t}</span>`).join("")}</div>`;
    /* Downloads: items: [{ t, d, href, size }]. Files on R2 (/m/…) download through ?dl=1. */
    case "download": return `${h}<div class="dlx">${b.items.map(f => { const href = /\/m\//.test(f.href) ? `${f.href}${f.href.includes("?") ? "&" : "?"}dl=1` : f.href; return `<a class="bb-pack dlx-item" href="${href}" download><b>${f.t}</b> <span>${[f.d, f.size].filter(Boolean).join(" · ")}</span></a>`; }).join("")}</div>`;
    /* ---- Outreach visuals (reusable) ---- */
    /* People sky: one dot per person, in rings around the client. { text, photo, you, rings: [{ t, n, d, c }], note } */
    case "sky": {
      const R = [72, 124, 168, 206], C = 230;
      const dots = b.rings.map((r, k) => `<g class="sky-ring" data-ring="${k}" style="--c:${r.c}"><circle class="sky-orbit" cx="${C}" cy="${C}" r="${R[k]}"/>${Array.from({ length: r.n }, (_, i) => { const a = (i / r.n) * Math.PI * 2 + k * .4; return `<circle class="sky-dot" style="--d:${((i * 7 + k * 5) % 23) * 160}ms" cx="${(C + R[k] * Math.cos(a)).toFixed(1)}" cy="${(C + R[k] * Math.sin(a)).toFixed(1)}" r="${[5.2, 4.4, 5.4, 5.4][k]}"/>`; }).join("")}</g>`).join("");
      return `<div class="sky"><i class="vis-photo" style="background-image:url('${b.photo}')" aria-hidden="true"></i><div class="sky-copy"><p class="sky-lead">${b.text}</p><div class="sky-keys">${b.rings.map((r, k) => `<button type="button" class="sky-key" data-ring="${k}" aria-pressed="false" style="--c:${r.c}"><b>${r.n}</b><span><strong>${r.t}</strong>${r.d}</span></button>`).join("")}</div>${b.note ? `<p class="sky-note">${b.note}</p>` : ""}</div>
        <svg class="sky-map" viewBox="0 0 460 460" role="img" aria-label="${b.rings.map(r => `${r.n} ${r.t}`).join(", ")}">${dots}<circle class="sky-you" cx="${C}" cy="${C}" r="36"/><text x="${C}" y="${C + 5}" text-anchor="middle">${b.you}</text></svg></div>`;
    }
    /* Proportional circles: items: [{ n, t }], note */
    case "flow": return `${h}<ol class="flow">${b.items.map((x, i) => `<li class="rise" style="--s:${Math.sqrt(x.n / b.items[0].n).toFixed(3)};--d:${i * 110}ms"><span class="flow-c">${x.n}</span><b>${x.t}</b></li>`).join("")}</ol>${b.note ? `<p class="flow-note">${b.note}</p>` : ""}`;
    /* A week at a glance: days: [{ t, dots, tag, note }], foot */
    case "week": return `${h}<ol class="wk">${b.days.map(d => `<li class="${d.tag ? "wk-on" : ""}${d.dots ? "" : " wk-rest"}"><b>${d.t}</b><span class="wk-dots" aria-hidden="true">${"<i></i>".repeat(d.dots || 0)}</span><span class="wk-n">${d.note}</span>${d.tag ? `<em>${d.tag}</em>` : ""}</li>`).join("")}</ol>${b.foot ? `<p class="wk-foot">${b.foot}</p>` : ""}`;
    /* Winding path with photo medallions: items: [{ date, t, d, img, goal }] */
    case "journey": return `${h}<ol class="jy">${b.items.map((x, i) => `<li><span class="jy-pic" style="background-image:url('${x.img}')"><i>${i + 1}</i></span><div class="jy-tx"><time>${x.date}</time><b>${x.t}</b><p>${x.d}</p>${x.goal ? `<em>${x.goal}</em>` : ""}</div></li>`).join("")}</ol>`;
    /* Messages as bubbles: items: [{ t, meta, text }]; [brackets] are highlighted as blanks to fill */
    case "bubbles": return `${h}${b.note ? `<p class="bu-note">${b.note}</p>` : ""}<div class="bu">${b.items.map((x, i) => `<article class="copy bu-i rise" style="--d:${(i % 3) * 90}ms"><header><span class="bu-k">${i + 1}</span><div><b>${x.t}</b><small>${x.meta}</small></div></header><div class="copy-body bu-b">${x.text.split("\n").filter(Boolean).map(l => `<p>${l.replace(/\[[^\]]+\]/g, m => `<mark>${m}</mark>`)}</p>`).join("")}</div><button type="button" class="theme copybtn">Copy text</button></article>`).join("")}</div>`;
    /* Color-block posts, as they'd look when posted: { note, items: [{ text, c }] } */
    case "postblocks": return `${h}${b.note ? `<p class="bu-note">${b.note}</p>` : ""}<div class="pb">${b.items.map((x, i) => `<article class="copy pb-i rise" style="--c:${x.c};--d:${i * 110}ms"><div class="copy-body"><p>${x.text}</p></div><button type="button" class="theme copybtn">Copy text</button></article>`).join("")}</div>`;
    /* Two panels: yes / no lists */
    case "panels": return `${h}<div class="pn"><section class="pn-yes"><h4>${b.cols[0]}</h4><ul>${b.yes.map(x => `<li>${x}</li>`).join("")}</ul></section><section class="pn-no"><h4>${b.cols[1]}</h4><ul>${b.no.map(x => `<li>${x}</li>`).join("")}</ul></section></div>`;
    /* Stages moving toward the centre: items: [{ t, d }] */
    case "inward": { const N = b.items.length; return `${h}<ol class="inw">${b.items.map((x, i) => `<li class="rise" style="--d:${i * 80}ms"><svg viewBox="0 0 100 100" aria-hidden="true">${Array.from({ length: N }, (_, k) => `<circle cx="50" cy="50" r="${(46 - k * (46 / N)).toFixed(1)}" class="${k <= i ? "on" : ""}"/>`).join("")}</svg><b>${x.t}</b><span>${x.d}</span></li>`).join("")}</ol>`; }
    /* A check-in date with if / then cards: { date, t, items: [{ if, then }] } */
    case "checkin": return `<div class="ck"><div class="ck-date"><span>${b.t}</span><b>${b.date}</b></div>${b.items.map(x => `<div class="ck-c"><small>If</small><p>${x.if}</p><small>Then</small><p><b>${x.then}</b></p></div>`).join("")}</div>`;
    /* Open questions: items: [{ t, d }] */
    case "open": return `${h}<div class="opn">${b.items.map(x => `<div><i aria-hidden="true">?</i><b>${x.t}</b><span>${x.d}</span></div>`).join("")}</div>`;
    /* ---- Offers section visuals. Offer details come from each offer page, so they stay in step. ---- */
    /* Three arched doorways, growing: items: [{ id, n, img }], after: { t, d, price } */
    case "portals": {
      const of = id => ((PAGE[id] || {}).blocks || []).find(x => x.type === "offer") || {};
      return `<div class="po">${b.items.map((x, i) => { const o = of(x.id), K = OFFER_KIND[o.kind] || OFFER_KIND.freebie, pr = o.price || {};
        return `<a class="po-i po-${i + 1}" href="#${x.id}"><span class="po-arch"><i class="vis-photo" style="background-image:url('${x.img}')" aria-hidden="true"></i><span class="po-n">${x.n}</span></span><span class="po-tx"><em>${K.role}</em><b>${o.name || ""}</b><strong>${pr.short || pr.text || pr.funnel || ""}</strong></span><span class="po-dots" aria-hidden="true">${"<i></i>".repeat(x.n)}</span></a>`; }).join("")}</div>${b.after ? `<div class="po-after"><span>Then, for as long as she likes</span><b>${b.after.t}</b><p>${b.after.d}</p><strong>${b.after.price}</strong></div>` : ""}`;
    }
    /* What each offer solves and the door it opens: items: [{ id, n }] */
    case "doors": {
      const of = id => ((PAGE[id] || {}).blocks || []).find(x => x.type === "offer") || {};
      return `${h}<ol class="dr">${b.items.map((x, i) => { const o = of(x.id); return `<li class="rise"><span class="dr-n" aria-hidden="true">${x.n}</span><div class="dr-a"><a href="#${x.id}">${o.name}</a><p>${o.promise || ""}</p><ul>${[o.format, o.time].filter(Boolean).map(t => `<li>${t}</li>`).join("")}</ul></div><div class="dr-b"><small>It solves</small><p>${o.solves || ""}</p></div><div class="dr-c"><small>Then she sees</small><p>${o.reveals || ""}</p></div></li>`; }).join("")}</ol>`;
    }
    /* The funnel as a rail: items: [{ t, d, go, tag }] */
    case "rail": return `${h}<ol class="rl">${b.items.map((x, i) => `<li class="rise" style="--d:${i * 90}ms"><i aria-hidden="true"></i><b>${x.go ? `<a href="#${x.go}">${x.t}</a>` : x.t}</b><p>${x.d}</p>${x.tag ? `<em>${x.tag}</em>` : ""}</li>`).join("")}</ol>${b.note ? `<p class="flow-note">${b.note}</p>` : ""}`;
    /* Search terms: groups: [{ t, d, c, items }]; tapping a term copies it */
    case "terms": return `${h}${b.note ? `<p class="bu-note">${b.note}</p>` : ""}<div class="tm">${b.groups.map(g => `<section style="--c:${g.c}"><h4>${g.t}</h4><p>${g.d}</p><div>${g.items.map(t => `<button type="button" class="tm-b" data-copy="${t.replace(/"/g, "&quot;")}">${t}</button>`).join("")}</div></section>`).join("")}</div>`;
    /* Profile cards, the reverse of the page (dark on light, white on dark): { id, note, groups: [{ t, items: [{ at, name, url, n, d, sells, sellUrl, c, start }] }] } */
    case "accounts": return `${h}<div class="ac-all"${b.id ? ` id="${b.id}"` : ""}>${b.note ? `<p class="bu-note">${b.note}</p>` : ""}${b.groups.map(g => `<h4 class="ac-h">${g.t}</h4><div class="ac">${g.items.map((x, i) => `<article class="rise" style="--c:${x.c};--d:${(i % 3) * 80}ms"><div class="ac-ban">${x.start ? "<span>Start here</span>" : ""}</div><i class="ac-av" aria-hidden="true">${x.name.replace(/[^a-z]/gi, "")[0].toUpperCase()}</i><b class="ac-name">${x.name}</b><span class="ac-at">@${x.at}</span><p>${x.d}</p><div class="ac-n"><b>${x.n}</b> followers</div>${x.sells ? `<ul>${x.sells.map(t => `<li>${t}</li>`).join("")}</ul>` : ""}<div class="ac-go"><a href="${x.url}" target="_blank" rel="noopener">View on TikTok ↗</a>${x.sellUrl ? `<a class="ac-2" href="${x.sellUrl}" target="_blank" rel="noopener">See their offers ↗</a>` : ""}</div></article>`).join("")}</div>`).join("")}</div>`;
    /* Numbered questions: items: [text] */
    case "asks": return `${h}${b.note ? `<p class="bu-note">${b.note}</p>` : ""}<ol class="ak">${b.items.map((t, i) => `<li class="rise" style="--d:${(i % 2) * 80}ms"><i aria-hidden="true">${i + 1}</i><span>${t}</span></li>`).join("")}</ol>`;
    /* ---- Planner: one next step stands out; the rest of the week sits beside it. Goals are dots to fill in. Saved in this browser only.
       { id, by, weeks: [{ from, to, label, t, lead, tasks: [{ t, d, time, tool, go, copy }] }], goals: [{ t, n }] } */
    case "planner": {
      const st = planState(b.id), now = new Date(), iso = new Date(now.getTime() - now.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
      let cur = b.weeks.findIndex(w => iso <= w.to); if (cur < 0) cur = b.weeks.length - 1;
      return `<div class="pl" data-plan="${b.id}">
        <div class="pl-tabs" role="tablist" aria-label="Weeks">${b.weeks.map((w, i) => `<button type="button" role="tab" id="pl-t${i}" aria-controls="pl-p${i}" aria-selected="${i === cur}"${i === cur ? "" : ' tabindex="-1"'}>Week ${i + 1}<span>${w.label}</span></button>`).join("")}</div>
        <div class="pl-weeks">${b.weeks.map((w, i) => `<section role="tabpanel" id="pl-p${i}" aria-labelledby="pl-t${i}" ${i === cur ? "" : "hidden"}><h2>${w.t}</h2><p class="pl-lead">${w.lead}</p><div class="pl-cards">${w.tasks.map((x, k) => { const id = `w${i}t${k}`; return `<article class="pl-c" data-n="${k + 1}"><div class="pl-top"><span class="pl-k">${k + 1}</span><span class="pl-now">Your next step</span>${x.time ? `<em>${x.time}</em>` : ""}</div><b>${x.t}</b><p>${x.d}</p><div class="pl-act">${x.tool ? `<button type="button" class="theme copybtn" data-tool="${x.tool}">Open ${x.toolName}</button>` : ""}${x.go ? `<a class="theme copybtn" href="#${x.go}">Open ${x.goName}</a>` : ""}${x.copy ? `<button type="button" class="theme copybtn tm-c" data-copy="${x.copy.replace(/"/g, "&quot;")}" data-label="${x.copyName}">${x.copyName}</button>` : ""}<label><input type="checkbox" data-task="${id}"${st.done[id] ? " checked" : ""}><span class="pl-box" aria-hidden="true"></span><span class="pl-dn">Done</span></label></div></article>`; }).join("")}</div><p class="pl-all" hidden>That's the week. Rest, or look ahead.</p></section>`).join("")}</div>
        <div class="pl-goals"><h3>What you're gathering by ${b.by}</h3>${b.goals.map((g, i) => { const v = Math.min(st.n[i] || 0, g.n); return `<div class="pl-g" data-goal="${i}" data-max="${g.n}"><div class="pl-gt"><b>${g.t}</b><span><span class="pl-v">${v}</span> of ${g.n}</span></div><div class="pl-dots" aria-hidden="true">${Array.from({ length: g.n }, (_, k) => `<i data-dot="${k + 1}" class="${k < v ? "on" : ""}"></i>`).join("")}</div><div class="pl-pm"><button type="button" data-step="-1" aria-label="One fewer: ${g.t}">–</button><button type="button" data-step="1" aria-label="One more: ${g.t}">+</button></div></div>`; }).join("")}<p>Tap the dots as you go. Saved on this device.</p></div></div>`;
    }
    /* Toolkit: one tab open at a time, each holding other blocks: tabs: [{ id, t, d, blocks }] */
    case "toolkit": return `${h}<div class="tk" id="toolkit"><div class="tk-tabs" style="--n:${b.tabs.length}" role="tablist" aria-label="${b.heading || "Tools"}">${b.tabs.map((t, i) => `<button type="button" role="tab" id="tk-t-${t.id}" aria-controls="tk-p-${t.id}" data-tk="${t.id}" aria-selected="${!i}"${i ? ' tabindex="-1"' : ""}><b>${t.t}</b><span>${t.d}</span></button>`).join("")}</div>${b.tabs.map((t, i) => `<div class="tk-p" role="tabpanel" id="tk-p-${t.id}" aria-labelledby="tk-t-${t.id}" ${i ? "hidden" : ""}>${t.blocks.map(x => `<div class="tk-b">${blockHTML(x)}</div>`).join("")}</div>`).join("")}</div>`;
    /* Portrait: who she is at a glance: { photo, quote, by, gap, words } */
    case "portrait": return `${h}<div class="pt"><figure><i class="vis-photo" style="background-image:url('${b.photo}')" aria-hidden="true"></i><blockquote>${b.quote}</blockquote></figure><div><p class="pt-who">${b.who}</p><p>${b.gap}</p><ul>${b.traits.map(x => `<li>${x}</li>`).join("")}</ul></div></div>`;
    /* Folds: reference kept out of the way: items: [{ t, d, blocks }] */
    case "folds": return `${h}<div class="fd">${b.items.map(x => `<details><summary><b>${x.t}</b><span>${x.d}</span></summary><div>${x.blocks.map(y => `<div class="tk-b">${blockHTML(y)}</div>`).join("")}</div></details>`).join("")}</div>`;
    /* Embed: a live design or page in a frame. { src, ratio: height ÷ width (1.294 for US Letter), link, linkText } */
    case "embed": return `${h}<div class="embed" style="--ratio:${b.ratio || 0.5625}"><iframe src="${b.src}" loading="lazy" allow="fullscreen" allowfullscreen title="${b.heading || "Embedded design"}"></iframe></div>${b.link ? `<p class="embed-link"><a class="open" href="${b.link}" target="_blank" rel="noopener">${b.linkText || "Open ↗"}</a></p>` : ""}`;
    case "facts": return `${h}<dl class="facts">${b.items.map(f => `<div><dt>${f.k}</dt><dd>${f.v}</dd></div>`).join("")}</dl>`;
    case "compare": {
      const labelled = b.rows[0].length > b.cols.length;
      const cols = labelled ? `minmax(0, .8fr) repeat(${b.cols.length}, minmax(0, 1fr))` : `repeat(${b.cols.length}, minmax(0, 1fr))`;
      const head = `<div class="row head">${labelled ? "<span></span>" : ""}${b.cols.map(c => `<span>${c}</span>`).join("")}</div>`;
      const rows = b.rows.map(r => {
        const cells = labelled ? r.slice(1) : r;
        return `<div class="row">${labelled ? `<span class="lab">${r[0]}</span>` : ""}${cells.map((c, i) => `<span class="cell${i === 0 && cells.length > 1 ? " soft" : ""}" data-col="${b.cols[i]}">${c}</span>`).join("")}</div>`;
      }).join("");
      return `${h}<div class="compare" style="--cols:${cols}">${head}${rows}</div>`;
    }
    /* A step can carry a fold-open prompt with a Copy button: copy: { t, meta, text } */
    case "stages": return `${h}<ol class="stages">${b.items.map(i => `<li><b>${i.t}</b><span>${i.d}</span>${i.copy ? copyCard(i.copy) : ""}</li>`).join("")}</ol>`;
    case "pending": return `<div class="pending"><h3>${glyph("planning")}${b.heading}</h3><p>${b.text}</p>${b.needs ? `<ul>${b.needs.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}</div>`;
    case "swatches": return `${h}${b.note ? `<p class="swnote">${b.note}</p>` : ""}<div class="swatches">${b.items.map(c => `<div class="sw"><i style="--c:${c.hex}"></i><b>${c.name}</b><span>${c.hex}</span>${c.role ? `<em>${c.role}</em>` : ""}</div>`).join("")}${Array.from({ length: b.empty || 0 }, () => `<div class="sw"><i class="empty"></i><b>To come</b></div>`).join("")}</div>`;
    case "gallery": return `${h}<div class="gallery">${b.tiles.map(t => `<div><span>${t}</span></div>`).join("")}</div>
      <p class="gnote">${b.folder ? `<a href="${b.folder}" target="_blank" rel="noopener">Open the Drive folder</a>` : "Drive folder not linked yet. Thumbnails appear here once it's connected."}</p>`;
    /* Photo Library: albums of web-sized photos. path + count builds path01.jpg … with path01-sm.jpg thumbnails;
       or list images: ["photos/album/name.jpg", …]. zip adds a "Download the album" button. */
    case "photos": {
      const album = a => {
        const imgs = a.images || Array.from({ length: a.count || 0 }, (_, i) => `${a.path}${String(i + 1).padStart(2, "0")}.jpg`);
        const sm = src => src.replace(/\.jpg$/, "-sm.jpg");
        return `<section class="ph-album"><div class="ph-head"><h3>${a.t}</h3><span class="ph-count">${imgs.length} photos</span>${a.d ? `<p>${a.d}</p>` : ""}${a.zip ? `<a class="ph-zip" href="${a.zip}" download>Download the album</a>` : ""}</div><div class="ph-grid">${imgs.map((src, i) => `<figure class="ph-item"><a href="${src}" target="_blank" rel="noopener"><img src="${a.thumbs === false ? src : sm(src)}" alt="${a.t}, photo ${i + 1}" loading="lazy"></a><a class="ph-dl" href="${src}" download aria-label="Download ${a.t} photo ${i + 1}">↓</a></figure>`).join("")}</div></section>`;
      };
      /* Video albums: videos: [{ t, d, items: [{ src, dl, poster, t, wide, alt: { label: "16:9", src }, transcript: "text" }] }]
         src plays in the page (a light copy); dl, when given, is the full-size file the ↓ button downloads.
         Library videos served from R2 (/m/…) download through ?dl=1, since the download attribute doesn't work across sites. */
      const dlHref = src => /\/m\//.test(src) ? `${src}${src.includes("?") ? "&" : "?"}dl=1` : src;
      const trHTML = t => `<details class="ph-tr"><summary>Transcript</summary><div>${String(t).replace(/\[\d\d:\d\d:\d\d\]\s*/g, "").trim().split(/\n+/).map(x => `<p>${x.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</p>`).join("")}</div></details>`;
      const vAlbum = a => `<section class="ph-album"><div class="ph-head"><h3>${a.t}</h3><span class="ph-count">${a.items.length} video${a.items.length === 1 ? "" : "s"}</span>${a.d ? `<p>${a.d}</p>` : ""}</div><div class="ph-vgrid">${a.items.map((v, i) => `<figure class="ph-item ph-vid${v.wide ? " wide" : ""}"><video controls playsinline preload="none"${v.poster ? ` poster="${v.poster}"` : ""} src="${v.src}" aria-label="${v.t || `${a.t} video ${i + 1}`}"></video>${v.t || v.alt || v.transcript ? `<figcaption>${v.t ? `<b>${v.t}</b>` : ""}${v.alt ? `<a class="ph-alt" href="${dlHref(v.alt.src)}" download>↓ ${v.alt.label || "Other size"}</a>` : ""}${v.transcript ? trHTML(v.transcript) : ""}</figcaption>` : ""}<a class="ph-dl" href="${dlHref(v.dl || v.src)}" download aria-label="Download ${v.t || `video ${i + 1}`}${v.dl ? ", full size" : ""}" title="${v.dl ? "Download full size" : "Download"}">↓</a></figure>`).join("")}</div></section>`;
      const photos = `<div class="ph">${(b.albums || []).map(album).join("")}</div>`;
      const vids = b.videos || [];
      const nV = vids.reduce((n, a) => n + a.items.length, 0), nP = (b.albums || []).reduce((n, a) => n + (a.images ? a.images.length : a.count || 0), 0);
      return `${h}<div class="ph-tabs" role="tablist" aria-label="Photo and Video"><button type="button" role="tab" class="ph-tab on" aria-selected="true" aria-controls="ph-photos" id="ph-tab-photos">Photos <span class="ph-n">${nP}</span></button><button type="button" role="tab" class="ph-tab" aria-selected="false" aria-controls="ph-videos" id="ph-tab-videos" tabindex="-1">Videos <span class="ph-n">${nV}</span></button></div>
        <div class="ph-panel" id="ph-photos" role="tabpanel" aria-labelledby="ph-tab-photos">${photos}</div>
        <div class="ph-panel" id="ph-videos" role="tabpanel" aria-labelledby="ph-tab-videos" hidden><div class="ph">${vids.map(vAlbum).join("")}</div></div>`;
    }
    /* Site map as a flow chart: nodes: [{ t, url, note, tag, children: [...] }]. The first node is the home page;
       its children are the main navigation, their children the pages they lead to. tag: "hidden" | "off-nav" | "external" | "new" | "broken". */
    case "sitemap": {
      const node = n => `<li class="sm-n${n.tag ? ` sm-${n.tag}` : ""}"><div class="sm-card">${n.url ? `<a href="${n.url}" target="_blank" rel="noopener"><b>${n.t}</b></a>` : `<b>${n.t}</b>`}${n.path ? `<code>${n.path}</code>` : ""}${n.note ? `<span>${n.note}</span>` : ""}${n.tag ? `<em>${({ hidden: "Not in menu", "off-nav": "Not in sitemap", external: "Off-site", new: "New", broken: "Not found" })[n.tag] || n.tag}</em>` : ""}</div>${(n.children || []).length ? `<ul>${n.children.map(node).join("")}</ul>` : ""}</li>`;
      return `${h}<div class="sm-wrap"><ul class="sm">${b.nodes.map(node).join("")}</ul></div>${b.legend ? `<p class="sm-legend">${b.legend}</p>` : ""}`;
    }
    case "section": return `<h2 class="subhead">${b.heading}</h2>`;
    case "board": return `${h}<div class="board">${b.frames.map((f, i) => `<div class="frame f${i % 6}"><span>${f}</span></div>`).join("")}</div>
      <p class="gnote">${b.link ? `<a class="open" href="${b.link}" target="_blank" rel="noopener">Open the whiteboard</a>` : "Inspiration images will appear here once they’re added."}</p>`;
    case "calendar": {
      const kinds = [...new Set(b.weeks.flatMap(w => w.days.map(d => d.kind)).filter(Boolean))];
      const all = b.weeks.flatMap(w => w.days).filter(d => d.hook);
      all.forEach(d => { CAL.days[d.n] = d; });
      const posted = calPosted();
      const tools = all.length ? `<div class="cal-tools">
        <div class="cal-progress"><span class="cal-count"><b>${all.filter(d => posted[d.n]).length}</b> of ${all.length} posted</span><span class="cal-bar"><i style="width:${Math.round(all.filter(d => posted[d.n]).length / all.length * 100)}%"></i></span></div>
        <div class="cal-filters" role="group" aria-label="Filter posts"><button type="button" class="chip-f on" data-kind="">All</button>${kinds.map(k => `<button type="button" class="chip-f" data-kind="${k}"><i class="kdot k-${k.toLowerCase()}"></i>${k}</button>`).join("")}<button type="button" class="chip-f chip-hide" aria-pressed="false">Hide posted</button></div></div>` : "";
      const day = d => {
        if (!d.hook) return `<div class="day empty"><span class="flip"><span class="face front"><span class="day-n">${d.label || d.n}</span><span class="day-note">Open</span></span></span></div>`;
        const when = posted[d.n];
        return `<button type="button" class="day${when ? " posted" : ""}" data-n="${d.n}" data-kind="${d.kind || ""}" aria-label="${d.aria || "Day " + d.n}${when ? ", posted" : ""}: ${d.hook.replace(/"/g, "&quot;")}">
          <span class="flip">
            <span class="face front"><span class="day-top"><span class="day-n">${d.label || d.n}</span><span class="day-kind"><i class="kdot k-${(d.kind || "").toLowerCase()}"></i>${d.kind || ""}</span></span><span class="day-hook">${d.hook}</span>${d.text ? `<span class="day-has">Full script inside</span>` : ""}</span>
            <span class="face back"><span class="day-top"><span class="day-n">${d.label || d.n}</span><span class="back-stamp">✓ Posted</span></span><span class="back-hook">${d.hook}</span><span class="back-date">${when ? fmtDate(when) : ""}</span></span>
          </span></button>`;
      };
      return `${h}<div class="cal">${tools}${b.weeks.map(w => `<section class="week"><div class="week-head"><h4>${w.t}</h4>${w.d ? `<p>${w.d}</p>` : ""}</div><div class="days">${w.days.map(day).join("")}</div></section>`).join("")}</div>`;
    }
    case "brandbook": {
      const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const idOf = (g, i) => `bb-${slug(g.t)}-${slug(i.t)}`;
      const HINT = {
        logo: "Clear space, minimum size, approved backgrounds and what not to do.",
        type: "Where it's used, sizes, case and spacing, and what it pairs with.",
        color: "When to use each color, and which pairings to avoid."
      };
      /* Downloads: a tile with files: "brand/files/cat/name-orange" (no extension) or { png: "path", svg: "path" }
         gets a Download menu. The item's formats list sets which ones (default png, jpg, svg, pdf). */
      const FMT = {
        png: ["PNG", "Transparent background. Websites, social posts, Canva."],
        jpg: ["JPG", "Solid background. Email and quick sharing."],
        svg: ["SVG", "Vector, sharp at any size. Websites, Canva, Cricut."],
        pdf: ["PDF", "Vector. Printers, stickers, signage."],
        eps: ["EPS", "Vector. For professional designers and printers."]
      };
      const dl = (x, formats) => {
        if (!x.files) return "";
        const list = typeof x.files === "string" ? (formats || ["png", "jpg", "svg", "pdf"]).map(f => [f, `${x.files}.${f}`]) : Object.entries(x.files);
        return `<details class="bb-dl"><summary>Download</summary><div class="bb-dl-menu">${list.filter(([f]) => FMT[f]).map(([f, href]) => `<a href="${href}" download><b>${FMT[f][0]}</b><span>${FMT[f][1]}</span></a>`).join("")}</div></details>`;
      };
      const tile = (x, big, formats) => x.img
        ? `<figure class="bb-tile${big ? " big" : ""}" style="--tbg:${x.bg || "var(--surface)"}"><span class="bb-img"><img src="${x.img}" alt="${x.label || ""}" loading="lazy"></span>${x.label ? `<figcaption>${x.label}</figcaption>` : ""}${dl(x, formats)}</figure>`
        : `<figure class="bb-tile empty${big ? " big" : ""}"${x.bg ? ` style="--tbg:${x.bg}"` : ""}><span class="bb-img"></span><figcaption>${x.label || "To come"}</figcaption></figure>`;
      const tiles = (list, defaults, formats) => (list && list.length) || !b.hideEmpty ? `<div class="bb-tiles">${(list && list.length ? list : defaults.map(l => ({ label: l }))).map(x => tile(x, false, formats)).join("")}</div>` : "";
      const rules = (list, kind) => list && list.length
        ? `<ul class="bb-rules">${list.map(r => `<li>${r}</li>`).join("")}</ul>`
        : b.hideEmpty ? "" : `<p class="bb-hint">${HINT[kind]}</p>`;
      const part = (title, inner) => inner ? `<div class="bb-part"><h4>${title}</h4>${inner}</div>` : "";
      const H = !!b.hideEmpty;
      const item = (g, i) => {
        const kind = g.kind || "logo";
        let body = "";
        if (kind === "logo") body = (i.img ? tile({ img: i.img, bg: i.bg, label: "", files: i.files }, true, i.formats) : "") + part("Rules", rules(i.rules, kind)) + part("Color variations", tiles(i.variations, ["On light", "On dark", "One color", "Reversed"], i.formats)) + part("Applications", tiles(i.applications, ["Website", "Social", "Print", "Email"]));
        if (kind === "type") body = `${i.font ? `<p class="bb-font">${i.font}</p>` : H ? "" : `<p class="bb-font empty">Font to come</p>`}${i.role ? `<p class="bb-role">${i.role}</p>` : ""}` + (i.img ? tile({ img: i.img, bg: i.bg, label: "" }, true) : H ? "" : tile({ label: "Specimen to come" }, true)) + part("Rules", rules(i.rules, kind));
        if (kind === "color") body = `<div class="swatches">${(i.swatches && i.swatches.length ? i.swatches : H ? [] : [1, 2, 3, 4, 5].map(() => null)).map(c => c ? `<div class="sw"><i style="--c:${c.hex}"></i><b>${c.name}</b><span>${c.hex}</span>${c.role ? `<em>${c.role}</em>` : ""}</div>` : `<div class="sw"><i class="empty"></i><b>To come</b></div>`).join("")}</div>` + part("Rules", rules(i.rules, kind));
        return `<section class="bb-item" id="${idOf(g, i)}"><h3>${i.t}</h3>${i.note ? `<p class="bb-note">${i.note}</p>` : ""}${body}</section>`;
      };
      const toc = b.groups.map(g => `<div class="bb-g"><b>${g.t}</b>${g.items.map(i => `<button type="button" class="bb-link" data-target="${idOf(g, i)}">${i.t}</button>`).join("")}</div>`).join("");
      return `${h}<div class="bb"><nav class="bb-toc" aria-label="Brand book contents">${toc}</nav><div class="bb-body">${b.groups.map(g => `<div class="bb-group"><h2 class="subhead">${g.t}</h2>${g.pack ? `<a class="bb-pack" href="${g.pack.href || g.pack}" download><b>${g.pack.label || "Download all logos"}</b> <span>${g.pack.note || "Every logo below, in every format, in one .zip file"}</span></a>` : ""}${g.items.map(i => item(g, i)).join("")}</div>`).join("")}</div></div>`;
    }
    case "voicebook": {
      /* Messaging guide. Each item has a kind that sets its look. Empty items
         (template only) draw the same layout as soft placeholder bars. */
      const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const idOf = (p, i) => `vb-${slug(p.t)}-${slug(i.t)}`;
      const g = (x, w = "70%") => x ? x : `<i class="gb" style="width:${w}"></i>`;
      const n = k => String(k + 1).padStart(2, "0");
      const cols = (list, d) => { const c = (list && list.length) || d; return `style="--cols:${c === 4 ? 2 : Math.min(c, 3)}"`; };
      const fill = (list, count) => list && list.length ? list : Array.from({ length: count }, () => ({}));
      const TONE = [{ t: "Public", where: "Social, ads, homepage, press" }, { t: "Personal", where: "Email, DMs, community, support" }, { t: "Product", where: "Programs, onboarding, packaging" }];
      const W = ["46%", "62%", "38%", "54%", "70%", "42%"];
      const KIND = {
        archetype: i => `<div class="vb-arch"><div class="vb-arch-cell"><span class="vb-lab">Archetype</span><b>${g(i.archetype, "60%")}</b></div><div class="vb-arch-cell"><span class="vb-lab">Role in their life</span><b>${g(i.role, "50%")}</b></div></div>${i.d ? `<p class="vb-d">${i.d}</p>` : ""}`,
        promise: i => `<blockquote class="vb-promise">${i.text || `${g("", "90%")}${g("", "60%")}`}</blockquote>`,
        beliefs: i => `<div class="vb-beliefs"><div class="vb-believe"><span class="vb-lab">We believe</span><p>${i.believe || `${g("", "92%")}${g("", "80%")}${g("", "55%")}`}</p></div><div class="vb-against"><span class="vb-lab">We stand against</span><ul>${fill(i.against, 3).map((a, k) => `<li>${g(typeof a === "string" ? a : "", W[k])}</li>`).join("")}</ul></div></div>`,
        cards: i => `<div class="vb-cards" ${cols(i.items, 3)}>${fill(i.items, 3).map((c, k) => `<div class="vb-card"><span class="vb-num">${n(k)}</span><b>${g(c.t, "55%")}</b><p>${c.d || (c.t ? "" : `${g("", "90%")}${g("", "65%")}`)}</p></div>`).join("")}</div>`,
        pillars: i => `<div class="vb-pillars" ${cols(i.items, 4)}>${fill(i.items, 4).map(c => `<div class="vb-pillar"><b>${g(c.t, "50%")}</b><p>${c.d || (c.t ? "" : `${g("", "88%")}${g("", "60%")}`)}</p>${c.sounds ? `<q>${c.sounds}</q>` : c.t ? "" : `<q>${g("", "75%")}</q>`}</div>`).join("")}</div>`,
        spectrum: i => `<div class="vb-spec">${fill(i.items, 3).map((r, k) => `<div class="vb-row"><b>${g(r.is, "60%")}</b><span class="vb-track" style="--at:${[18, 26, 14, 22, 30][k % 5]}%"><i></i></span><span class="vb-not">${r.not ? `but we're never ${r.not}` : g("", "60%")}</span>${r.d ? `<p>${r.d}</p>` : ""}</div>`).join("")}</div>`,
        tone: i => `<div class="vb-tone">${(i.items && i.items.length ? i.items : TONE).map((c, k) => `<div class="vb-set"><span class="vb-vol" aria-hidden="true">${[1, 2, 3].map(d => `<i class="${d <= (c.level || 3 - k) ? "on" : ""}"></i>`).join("")}</span><b>${c.t}</b><span class="vb-where">${c.where || (TONE[k] || {}).where || ""}</span><p>${c.d || `${g("", "90%")}${g("", "70%")}`}</p>${c.ex ? `<q>${c.ex}</q>` : c.d ? "" : `<q>${g("", "80%")}</q>`}</div>`).join("")}</div>`,
        glossary: i => `<dl class="vb-gloss">${fill(i.items, 3).map((c, k) => `<div><dt>${g(c.t, W[k])}</dt><dd>${c.d || `${g("", "85%")}`}${c.use ? `<span class="vb-use">${c.use}</span>` : ""}</dd></div>`).join("")}</dl>`,
        avoid: i => `<ul class="vb-avoid">${fill(i.items, 6).map((w, k) => `<li>${typeof w === "string" ? w : `<i class="gb" style="width:${50 + (k * 23) % 50}px"></i>`}</li>`).join("")}</ul>`,
        swap: i => `<div class="vb-swap"><div class="vb-swap-h"><span class="vb-lab">Instead of</span><span></span><span class="vb-lab">Say</span></div>${fill(i.items, 3).map((r, k) => `<div class="vb-swap-r"><s>${g(r.not, W[k])}</s><span class="vb-arrow" aria-hidden="true">→</span><b>${g(r.say, W[k + 1])}</b></div>`).join("")}</div>`,
        bank: i => `<ul class="vb-bank">${fill(i.items, 12).map((w, k) => `<li class="z${k % 4}">${typeof w === "string" ? w : `<i class="gb" style="width:${40 + (k * 29) % 70}px"></i>`}</li>`).join("")}</ul>`,
        metaphors: i => `<div class="vb-meta">${fill(i.items, 2).map(c => `<div class="vb-metaphor"><b>${g(c.t, "45%")}</b><p>${c.d || `${g("", "90%")}${g("", "60%")}`}</p></div>`).join("")}</div>`,
        positioning: i => {
          const started = i.who || i.solution || i.want || i.line;
          const slot = (lab, v, w) => `<span class="ps-slot"><em>${lab}</em><b>${v || (started ? '<span class="ps-tbd">to decide</span>' : g("", w))}</b></span>`;
          const parts = [i.who && `I help ${i.who}`, i.solution && `with ${i.solution}`, i.want && `so they can ${i.want}`, i.avoid && `without ${i.avoid}`].filter(Boolean);
          const line = i.line || (parts.length ? parts.join(" ") + "." : "");
          const M = ["Too vague: it names exactly who you help and with what", "Too clever: a stranger gets it in a second and could repeat it", "Tied to one platform: it still works if the platform changes"];
          const mk2 = (t, k) => { const o = (i.checks || [])[k]; const v = o && typeof o === "object" ? o : { ok: o }; return `<li class="${v.ok === true ? "ok" : v.ok === false ? "no" : ""}"><i aria-hidden="true">${v.ok === true ? "✓" : v.ok === false ? "!" : ""}</i><div><b>${t}</b>${v.ok === false ? ` <span class="of-flag">Needs work</span>` : ""}${v.d ? `<span>${v.d}</span>` : ""}</div></li>`; };
          return `<div class="ps"><p class="ps-formula">${slot("I help", i.who, "70px")}${slot("with", i.solution, "90px")}${slot("so they can", i.want, "80px")}${slot("without", i.avoid, "80px")}</p><blockquote class="vb-promise ps-line">${line || `${g("", "90%")}${g("", "55%")}`}</blockquote><div><span class="vb-lab">Check it against the three ways it goes wrong</span><ul class="of-works">${M.map(mk2).join("")}</ul></div></div>`;
        },
        objection: i => `<div class="vb-obj${!i.q && i.a ? " solo" : ""}">${!i.q && i.a ? "" : `<div class="vb-obj-q"><span class="vb-lab">They might think</span><q>${i.q || g("", "80%")}</q></div>`}<div class="vb-obj-a"><span class="vb-lab">How we answer</span><p>${i.a || `${g("", "92%")}${g("", "75%")}${g("", "50%")}`}</p>${(i.points || []).length ? `<ul>${i.points.map(p => `<li>${p}</li>`).join("")}</ul>` : ""}</div></div>`
      };
      const VB_EMPTY = i => !["who", "solution", "want", "avoid", "line", "archetype", "role", "d", "text", "believe", "against", "items", "q", "a", "points"].some(k => Array.isArray(i[k]) ? i[k].length : i[k]);
      const item = (p, i) => {
        const empty = VB_EMPTY(i);
        return `<section class="bb-item vb-item${empty ? " ghost" : ""}" id="${idOf(p, i)}"><h3>${i.t}</h3>${i.note || (empty && i.hint) ? `<p class="bb-note">${i.note || i.hint}</p>` : ""}${(KIND[i.kind] || KIND.cards)(i)}</section>`;
      };
      const toc = b.parts.map(p => `<div class="bb-g"><b>${p.t}</b>${p.items.map(i => `<button type="button" class="bb-link" data-target="${idOf(p, i)}">${i.t}</button>`).join("")}</div>`).join("");
      return `${h}<div class="bb vb"><nav class="bb-toc" aria-label="Messaging contents">${toc}</nav><div class="bb-body">${b.parts.map(p => `<div class="bb-group"><h2 class="subhead">${p.t}</h2>${p.items.map(i => item(p, i)).join("")}</div>`).join("")}</div></div>`;
    }
    case "offer": return offerHTML(b, h);
    case "herostory": {
      const STEPS = [["You, the hero", "Who you were when it started"], ["The problem", "What you faced, and why it mattered enough to solve"], ["What helped", "The person, practice or discovery that showed up"], ["The moment you decided", "When you chose to do something about it"], ["What you did", "The actions you took, or are taking now"], ["What changed", "The results. Small wins count"], ["Life now", "How your life and work are different"]];
      const H = !!b.hideEmpty, st = b.steps || [];
      const items = STEPS.map(([t, hint], k) => { const v = st[k] || {}; const body = (v.body || []).map(x => `<p>${x}</p>`).join("") + (v.q ? `<blockquote class="hs-q">“${v.q}”</blockquote>` : ""); if (!body && H) return ""; return `<li class="hs-step${body ? "" : " ghost"}"><span class="hs-n">${k + 1}</span><div><h4>${t}</h4>${body || `<p class="hs-hint">${hint}</p>${OG("", "80%")}${OG("", "55%")}`}</div></li>`; }).join("");
      return `${h}<div class="hs">${b.lead ? `<p class="hs-lead">${b.lead}</p>` : ""}<ol class="hs-list">${items}</ol><p class="hs-foot">Your story isn't about you. It shows the women watching that there's a way out, because you found one.</p></div>`;
    }
    case "bio": {
      const H = !!b.hideEmpty, L = b.lines || {};
      const ROWS = [["follow", "Follow to…", "Reach a goal, escape a pain or get something back. Never “follow for tips.”"], ["authority", "Why you", "One step ahead, “I was you”, or a result you can point to."], ["pillars", "Your pillars", "As benefits, not topics: “Quiet the doubt | Take action”, not “Mindset | Habits.”"], ["cta", "The call to action", "Your freebie, once it's live."]];
      const phone = `<div class="bio-phone"><span class="bio-av" aria-hidden="true"></span><b class="bio-name">${b.name || OG("", "60%")}</b>${ROWS.map(([k]) => L[k] ? `<span class="bio-line">${L[k]}</span>` : H ? "" : `<span class="bio-line">${OG("", "85%")}</span>`).join("")}</div>`;
      const guide = `<ol class="bio-guide"><li><b>Display name</b><span>Your first name + a phrase people search for (“Jordan | Online Business Coach”). Type phrases into TikTok search and use the ones it suggests.</span>${(b.nameOptions || []).length ? `<span class="bio-opts">${b.nameOptions.map(o => `<em>${o}</em>`).join("")}</span>` : ""}</li>${ROWS.map(([k, t, hint]) => `<li><b>${t}</b><span>${hint}</span></li>`).join("")}</ol>`;
      return `${h}<div class="bio">${phone}${guide}</div>${b.note ? `<p class="of-note">${b.note}</p>` : ""}`;
    }
    case "copy": return `${h}<div class="copies">${b.items.map(copyCard).join("")}</div>`;
    /* Post cards: items: [{ img, url, date, type, comments, likes, caption }]. The caption shows exactly as written,
       with a Copy caption button. Long captions fold after a few lines. */
    case "postcards": {
      const esc = t => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      return `${h}<div class="pc">${b.items.map((x, i) => `<article class="pc-card" style="--tilt:${[-2.2, 1.6, -1.2, 2.4, -1.8][i % 5]}deg">
        <a class="pc-pic" href="${x.url}" target="_blank" rel="noopener" aria-label="Open post ${i + 1} on Instagram"><span class="pc-rank">${i + 1}</span><img src="${x.img}" alt="" loading="lazy"><span class="pc-type">${x.type}</span></a>
        <div class="pc-body">
          <div class="pc-meta"><b>${x.date}</b>${x.comments != null ? `<span>${x.comments.toLocaleString()} comments</span>` : ""}${x.likes ? `<span>${x.likes.toLocaleString()} likes</span>` : ""}</div>
          <div class="pc-cap">${esc(x.caption)}</div>
          <textarea class="pc-raw" hidden>${esc(x.caption)}</textarea>
          <div class="pc-actions"><button type="button" class="pc-more">Show full caption</button><button type="button" class="theme pc-copy">Copy caption</button><a class="pc-open" href="${x.url}" target="_blank" rel="noopener">Open on Instagram ↗</a></div>
        </div></article>`).join("")}</div>`;
    }
    /* Timeline: a long vertical line with cards alternating left and right.
       items: [{ date, t, d, when: "past" | "now" | "next", tag }]. A "now" item gets the You are here marker. */
    case "timeline": {
      let side = 0;
      return `${h}<div class="tl">${b.items.map(x => {
        if (x.era) return `<div class="tl-era"><span>${x.era}</span></div>`;
        const s = side++ % 2 ? "r" : "l";
        return `<div class="tl-row tl-${s} tl-${x.when || "past"}${x.n != null ? " tl-num" : ""}"><span class="tl-dot" aria-hidden="true">${x.n != null ? x.n : ""}</span><article class="tl-card">${x.when === "now" ? `<span class="tl-here">You are here</span>` : ""}<time>${x.date}</time><h4>${x.t}</h4>${x.d ? `<p>${x.d}</p>` : ""}${x.tag ? `<em>${x.tag}</em>` : ""}</article></div>`;
      }).join("")}</div>`;
    }
    /* Big quote: a large pull quote that rises in. { text, by } */
    case "bigquote": return `<figure class="bq rise"><blockquote>${b.text}</blockquote>${b.by ? `<figcaption>${b.by}</figcaption>` : ""}</figure>`;
    /* Vision cards: a staggered two-column set that rises in. items: [{ kicker, t, d, tag }] */
    case "vcards": return `${h}<div class="vc">${b.items.map((x, i) => `<article class="vc-card rise" style="--d:${(i % 2) * 80}ms"><span class="vc-n">${String(i + 1).padStart(2, "0")}</span>${x.kicker ? `<span class="vc-k">${x.kicker}</span>` : ""}<h4>${x.t}</h4>${x.d ? `<p>${x.d}</p>` : ""}${x.tag ? `<em>${x.tag}</em>` : ""}</article>`).join("")}</div>`;
    case "pipeline": return `${h}<div class="pipeline">${b.stages.map(s => `<div><b>${s.t}</b><span>${s.d}</span><em>No contacts yet</em></div>`).join("")}</div>`;
    case "moodboard": {
      LIGHTBOX.mood = b.images.map((_, i) => `${b.path}${String(i + 1).padStart(2, "0")}.jpg`);
      return `${h}<div class="mood">${b.images.map(([w, ht], i) => `<button type="button" class="pin" data-i="${i}" style="--r:${(((i * 37) % 7) - 3) * 0.3}deg" aria-label="Open image ${i + 1} of ${b.images.length}"><img src="${LIGHTBOX.mood[i]}" width="${w}" height="${ht}" loading="lazy" alt=""></button>`).join("")}</div>`;
    }
  }
  return "";
}

/* ---------- Offers: one path from free to signature ---------- */
const OFFER_KIND = {
  freebie: {
    role: "The quick win",
    works: ["Something they really want", "A quick win in 5 minutes or less", "Solves one problem and points to the next", "Matches your starter and signature offers", "A simple format, ideally a PDF"],
    funnel: ["Capture page", "Thank-you page", "Delivery email", "Delivery page", "PDF hosted", "Automation on", "Tested 3 to 5 times"],
    targets: [["Opt-in rate", "30–50% (average is 20%)"], ["Link-in-bio clicks", "60% or more"]]
  },
  starter: {
    role: "The first yes",
    works: ["The obvious next step after the freebie", "Under 60 minutes from start to finish", "Solves one problem and reveals the next", "A stepping stone, never required for the signature offer", "Feels like a steal at its price"],
    funnel: ["Sales page with timer", "Sales video, 12–14 min", "Checkout page", "Thank-you page", "Confirmation and login emails", "Follow-up emails, 6 days", "Linked into the freebie funnel", "Tested"],
    targets: [["Leads who buy", "8–12%"], ["Checkout completion", "50–60%"]]
  },
  signature: {
    role: "The transformation",
    works: ["One clear promise", "Modules that follow your framework, step by step", "5–7 bonuses that each remove an objection", "Support while they do it", "Everything they need, nothing they don't"],
    funnel: ["Sales page", "Checkout with payment plan", "Thank-you page", "Confirmation emails", "Webinar sign-up page", "Webinar watch and replay pages", "Webinar emails", "Tested"],
    targets: [["Webinar viewers who stay", "90%+ with an end-of-webinar gift"], ["Payment plan", "From $197 and up"]]
  }
};
const OG = (x, w = "70%") => x ? x : `<i class="gb" style="width:${w}"></i>`;
const oList = l => (l || []).map(x => typeof x === "string" ? { t: x } : x);
function offerHTML(b, h) {
  const K = OFFER_KIND[b.kind] || OFFER_KIND.freebie, H = !!b.hideEmpty;
  const part = (title, inner, cls = "") => inner ? `<section class="of-part ${cls}"><h3 class="of-h">${title}</h3>${inner}</section>` : "";
  const pr = b.price || {};
  const chips = [b.format, b.time, pr.chip || pr.funnel || pr.text].filter(Boolean);
  const hero = `<div class="of-hero"><span class="of-role">${K.role}</span><h2 class="of-name">${OG(b.name, "40%")}</h2><p class="of-promise">${b.promise || (H ? "" : `${OG("", "92%")}${OG("", "60%")}`)}</p>${b.hook && (b.hook.title || b.hook.line) ? `<p class="of-hook"><b>${b.hook.title || ""}</b>${b.hook.line ? ` ${b.hook.line}` : ""}</p>` : ""}${chips.length ? `<div class="of-chips">${chips.map(c => `<span>${c}</span>`).join("")}</div>` : H ? "" : `<div class="of-chips"><span>${OG("", "60px")}</span><span>${OG("", "50px")}</span><span>${OG("", "40px")}</span></div>`}</div>`;
  const path = b.for || b.solves || b.reveals || !H ? `<div class="of-path"><div><span class="vb-lab">Who it's for</span><p>${b.for || OG("", "80%")}</p></div><div><span class="vb-lab">It solves</span><p>${b.solves || OG("", "75%")}</p></div><div class="of-next"><span class="vb-lab">And reveals next</span><p>${b.reveals || OG("", "70%")}</p></div></div>` : "";
  const inside = b.inside || {};
  const col = (t, l) => (l && l.length) || !H ? `<div><span class="vb-lab">${t}</span>${l && l.length ? `<ul>${oList(l).map(i => `<li><b>${i.t}</b>${i.d ? `<span>${i.d}</span>` : ""}</li>`).join("")}</ul>` : `<ul><li>${OG("", "70%")}</li><li>${OG("", "50%")}</li></ul>`}</div>` : "";
  const insideHTML = [col("Core", inside.core), col("Resources", inside.resources), col("Bonuses", inside.bonuses)].join("");
  const priceRows = [["In the funnel", pr.funnel], ["Public", pr.public], ["Guarantee", pr.guarantee], ["Payment plan", pr.plan]].filter(r => r[1] || (!H && r[0] !== "Payment plan"));
  const priceHTML = pr.text && !pr.funnel ? `<p class="of-price-note">${pr.text}</p>` : "";
  const facts = priceRows.length ? `<dl class="facts">${priceRows.map(([k, v]) => `<div><dt>${k}</dt><dd>${OG(v, "60%")}</dd></div>`).join("")}</dl>` : "";
  const support = (b.support || []).length ? `<ol class="of-tiers">${b.support.map((s, i) => `<li><span class="vb-num">${String(i + 1).padStart(2, "0")}</span><b>${s.t}</b>${s.d ? `<p>${s.d}</p>` : ""}</li>`).join("")}</ol>${b.supportNote ? `<p class="of-note">${b.supportNote}</p>` : ""}` : "";
  const web = b.webinar && (b.webinar.title || b.webinar.promise || b.webinar.status) ? `<div class="of-web">${b.webinar.title ? `<b>${b.webinar.title}</b>` : ""}${b.webinar.promise ? `<p>${b.webinar.promise}</p>` : ""}${b.webinar.status ? `<span class="of-status">${b.webinar.status}</span>` : ""}</div>` : (b.kind === "signature" && !H ? `<div class="of-web"><b>${OG("", "50%")}</b><p>${OG("", "85%")}</p></div>` : "");
  const works = K.works.map((t, i) => { const o = (b.works || [])[i]; const v = o && typeof o === "object" ? o : { ok: o }; return { t: v.t || t, ok: v.ok, d: v.d }; });
  const worksHTML = `<ul class="of-works">${works.map(w => `<li class="${w.ok === true ? "ok" : w.ok === false ? "no" : ""}"><i aria-hidden="true">${w.ok === true ? "✓" : w.ok === false ? "!" : ""}</i><div><b>${w.t}</b>${w.ok === false ? ` <span class="of-flag">Needs work</span>` : ""}${w.d ? `<span>${w.d}</span>` : ""}</div></li>`).join("")}</ul>`;
  const fun = K.funnel.map((t, i) => { const o = (b.funnel || [])[i]; return { t, done: o === true || (o && o.done) }; });
  const funHTML = `<p class="of-count"><b>${fun.filter(f => f.done).length}</b> of ${fun.length} built</p><ol class="of-funnel">${fun.map(f => `<li class="${f.done ? "done" : ""}"><i aria-hidden="true">${f.done ? "✓" : ""}</i>${f.t}</li>`).join("")}</ol>`;
  const targets = `<dl class="facts">${(b.targets || K.targets).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  /* quiet: { reps, line, ways: [{ t, d }], pdf: { src, ratio, link, linkText }, door: { quote, go, goName } }: a spare page that
     pulls the best parts forward and folds the rest. */
  if (b.quiet) {
    const q = b.quiet, fold = (t, d, inner) => inner ? `<details><summary><b>${t}</b><span>${d}</span></summary><div>${inner}</div></details>` : "";
    return `${h}<div class="qt">
      <header class="qt-hero"><span class="qt-reps qt-r${q.reps || 1}" aria-hidden="true">${"<i></i>".repeat(q.reps || 1)}</span><h2>${b.name || ""}</h2><p>${q.line || b.promise || ""}</p><span class="qt-meta">${chips.map(c => `<span>${c}</span>`).join("")}</span></header>
      ${q.ways ? `<section class="qt-ways">${q.ways.map(w => `<div class="rise"><b>${w.t}</b><p>${w.d}</p></div>`).join("")}</section>` : ""}
      ${q.pdf ? `<section class="qt-pdf"><div class="embed" style="--ratio:${q.pdf.ratio || 1.2941}"><iframe src="${q.pdf.src}" loading="lazy" allow="fullscreen" allowfullscreen title="${b.name}"></iframe></div><a href="${q.pdf.link}" target="_blank" rel="noopener">${q.pdf.linkText || "Open in Canva ↗"}</a></section>` : ""}
      ${q.rhythm ? `<section class="qt-rhythm rise"><div aria-hidden="true">${Array.from({ length: q.rhythm.n * 2 - 1 }, (_, i) => `<i class="${i % 2 ? "rest" : ""}"></i>`).join("")}</div><p>${q.rhythm.t}</p></section>` : ""}
      ${q.steps ? `<ol class="qt-steps">${q.steps.map((x, i) => `<li class="rise"><i aria-hidden="true">${i + 1}</i><b>${x.t}</b><p>${x.d}</p></li>`).join("")}</ol>` : ""}
      ${q.words ? `<section class="qt-words rise"><p>${q.words.t}</p><div>${q.words.items.map(w => `<span>${w}</span>`).join("")}</div></section>` : ""}
      ${q.price ? `<section class="qt-price rise"><b>${q.price.n}</b><p>${q.price.t}</p></section>` : ""}
      ${q.door ? `<section class="qt-door rise"><p>${q.door.quote}</p><a href="#${q.door.go}">${q.door.goName} <span aria-hidden="true">→</span></a></section>` : ""}
      <div class="fd qt-fd">${fold("Who it's for", "And what it solves", path)}${b.hook && b.kind !== "freebie" ? fold("Still to decide", "One open question", `<p>${b.hook.line.charAt(0).toUpperCase() + b.hook.line.slice(1)}</p>`) : ""}${b.kind === "freebie" ? "" : fold("Price", "The details", (facts || priceHTML) ? facts + priceHTML : "")}${fold("What's inside", "Every piece", b.kind === "freebie" || !insideHTML ? "" : `<div class="of"><div class="of-inside">${insideHTML}</div></div>`)}${b.supportNote ? fold("How sessions run", "Group and one-to-one", `<p>${b.supportNote}</p>`) : ""}${web ? fold("The webinar", "That sells it, later", `<div class="of">${web}</div>`) : ""}${fold("What's left to build", `${fun.filter(f => f.done).length} of ${fun.length} built`, `<div class="of">${funHTML}</div>`)}${fold("Why it works", "The checklist", `<div class="of">${worksHTML}</div>`)}${fold("How you'll know it's working", "Numbers to watch", targets)}</div></div>`;
  }
  return `${h}<div class="of">${hero}${path}${part("What's inside", insideHTML ? `<div class="of-inside">${insideHTML}</div>` : "")}${part("Price", facts + priceHTML)}${part("Support while they do it", support)}${part("The webinar that sells it", web)}${part("What makes it work", worksHTML)}${part("The funnel behind it", funHTML)}${part("How you'll know it's working", targets)}</div>`;
}
function ladderHTML(s) {
  const steps = s.subs.map(u => { const b = (u.blocks || []).find(x => x.type === "offer"); return b ? { u, b } : u.kind ? { u, b: { kind: u.kind } } : null; }).filter(Boolean);
  if (!steps.length) return "";
  const bump = (CONTENT[s.id] || {}).bumper;
  const card = ({ u, b }) => { const K = OFFER_KIND[b.kind] || OFFER_KIND.freebie, pr = b.price || {}; return `<a class="ld-step" href="#${u.id}"><span class="of-role">${K.role}</span><b class="ld-name">${b.name || u.title}</b><span class="ld-price">${pr.short || pr.funnel || pr.text || ""}</span>${b.solves ? `<span class="ld-line"><em>Solves</em> ${b.solves}</span>` : ""}${b.reveals ? `<span class="ld-line"><em>Reveals</em> ${b.reveals}</span>` : ""}</a>`; };
  return `<div class="ld">${bump ? `<p class="ld-bump"><span class="vb-lab">Every offer answers to</span>${bump}</p>` : CLIENT.showEmpty ? `<p class="ld-bump"><span class="vb-lab">Every offer answers to</span>${OG("", "60%")}</p>` : ""}<div class="ld-steps">${steps.map(card).join('<span class="ld-arrow" aria-hidden="true">→</span>')}</div><div class="ld-arrive"><span class="vb-lab">How people arrive</span><span class="ld-route">Your content <i>→</i> the freebie</span><span class="ld-route">Your webinar <i>→</i> the signature offer</span></div></div>`;
}

/* Full-size viewer for moodboard images */
const LIGHTBOX = { list: [], i: 0, el: null };
function openLightbox(i) {
  if (!LIGHTBOX.el) {
    const el = document.createElement("div"); el.className = "lb"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Image viewer");
    el.innerHTML = `<button type="button" class="theme lb-close">Close</button><button type="button" class="theme lb-prev" aria-label="Previous image">←</button><img alt=""><button type="button" class="theme lb-next" aria-label="Next image">→</button><p class="lb-count"></p><button type="button" class="theme lb-remove" hidden>Remove</button>`;
    el.addEventListener("click", e => {
      if (e.target.closest(".lb-remove")) { upRemove(e.target.closest(".lb-remove")); return; }
      if (e.target.closest(".lb-prev")) step(-1); else if (e.target.closest(".lb-next")) step(1);
      else if (e.target.closest(".lb-close") || e.target === el) closeLightbox();
    });
    document.body.appendChild(el); LIGHTBOX.el = el;
  }
  LIGHTBOX.i = i; showLightbox(); LIGHTBOX.el.hidden = false; LIGHTBOX.el.querySelector(".lb-close").focus();
}
function showLightbox() {
  const el = LIGHTBOX.el; el.querySelector("img").src = LIGHTBOX.list[LIGHTBOX.i];
  const up = LIGHTBOX.group === "up" ? UP.items[LIGHTBOX.i] : null;
  el.querySelector(".lb-count").textContent = up && up.note ? up.note : `${LIGHTBOX.i + 1} of ${LIGHTBOX.list.length}`;
  const rm = el.querySelector(".lb-remove"); rm.hidden = !up; rm.textContent = "Remove"; rm.dataset.armed = "";
}
function step(d) { LIGHTBOX.i = (LIGHTBOX.i + d + LIGHTBOX.list.length) % LIGHTBOX.list.length; showLightbox(); }
function closeLightbox() { if (LIGHTBOX.el) LIGHTBOX.el.hidden = true; }
document.addEventListener("keydown", e => {
  if (!LIGHTBOX.el || LIGHTBOX.el.hidden) return;
  if (e.key === "Escape") closeLightbox(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
});
document.addEventListener("click", e => {
  const pin = e.target.closest(".pin"); if (!pin) return;
  LIGHTBOX.group = pin.dataset.group || "mood";
  LIGHTBOX.list = LIGHTBOX.group === "up" ? UP.items.map(upSrc) : LIGHTBOX.mood;
  openLightbox(+pin.dataset.i);
});

/* A fold-open text card with a Copy text button (copy blocks, and prompts inside steps). */
const copyCard = c => `<details class="copy"><summary><span class="copy-t">${c.t}</span>${c.meta ? `<span class="copy-meta">${c.meta}</span>` : ""}<button type="button" class="theme copybtn">Copy text</button></summary><div class="copy-body">${c.text.split("\n").filter(Boolean).map(l => `<p>${l}</p>`).join("")}</div><button type="button" class="theme copybtn">Copy text</button></details>`;
/* card: true on any block sets it inside its own card. */
const blocksHTML = blocks => blocks && blocks.length ? `<div class="blocks">${blocks.map(b => `<section class="block${b.card ? " boxed" : ""}">${blockHTML(b)}</section>`).join("")}</div>` : "";

/* ---------- Section view ---------- */
function crumbs(parts, backId) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="#${backId}"><span aria-hidden="true">←</span> Back</a><a href="#home">${CLIENT.name}</a>${parts.map(p => `<span aria-hidden="true">/</span>${p.id ? `<a href="#${p.id}">${p.label}</a>` : `<span>${p.label}</span>`}`).join("")}</nav>`;
}
function renderSection(s) {
  const conn = s.id === HOME.id ? [] : connectedSections(s.id);
  /* art: true in content.js gives a section its own full-width visual page, in place of the ladder and cards. */
  if ((CONTENT[s.id] || {}).art && s.blocks) {
    app.innerHTML = `${crumbs([{ label: s.short }], "home")}<div class="layout wide"><div class="main"><h1 class="title">${s.title}</h1><p class="intro">${s.blurb}</p>${blocksHTML(s.blocks)}</div></div>`;
    return;
  }
  app.innerHTML = `${crumbs([{ label: s.short }], "home")}
    <div class="layout"><div class="main">
      <h1 class="title">${s.title}</h1><p class="intro">${s.blurb}</p>
      ${s.ladder ? ladderHTML(s) : ""}
      ${s.blocks ? blocksHTML(s.blocks) + '<div style="height:44px"></div>' : ""}
      <div class="cards">${s.subs.map(u => `<a class="card" href="#${u.id}">${glyph(u.s)}<b>${u.title}</b><span>${u.note}</span><span class="st ${u.s}">${STATUS[u.s]}</span></a>`).join("")}</div>
    </div><aside class="side">${sideHTML(conn.length)}${legendHTML()}</aside></div>`;
  const nbs = [{ id: "home", label: "Home", kind: "part" }, ...s.subs.map(u => ({ id: u.id, label: u.short, kind: "sib" })), ...conn.map(c => ({ id: c.id, label: c.short, kind: "rel" }))];
  document.getElementById("ego").appendChild(egoMap(s.short, nbs));
}

/* ---------- Page view ---------- */
function renderPage(p) {
  const s = p.sec, up = p.parent || null, list = up ? up.children : s.subs, idx = list.findIndex(u => u.id === p.id);
  const prev = list[idx - 1], next = list[idx + 1];
  const rel = linkedPages(p.id).map(id => PAGE[id]);
  const kids = p.children || [];
  const trail = up ? [{ id: s.id, label: s.short }, { id: up.id, label: up.short }, { label: p.short }] : [{ id: s.id, label: s.short }, { label: p.short }];
  const kidCards = kids.length ? `<div class="cards">${kids.map(u => `<a class="card" href="#${u.id}">${glyph(u.s)}<b>${u.title}</b><span>${u.note}</span><span class="st ${u.s}">${STATUS[u.s]}</span></a>`).join("")}</div>` : "";
  const body = p.blocks && p.blocks.length ? blocksHTML(p.blocks) : p.keep ? '<div class="blocks"></div>' : kids.length ? "" : blocksHTML([{ type: "pending", heading: "Not started yet", text: "This page fills in as the work happens." }]);
  const home = up || s;
  app.innerHTML = `${crumbs(trail, home.id)}
    <div class="layout${p.wide ? " wide" : ""}"><article class="main">
      <h1 class="title">${p.title}</h1>
      <div class="status">${glyph(p.s)}<span class="st ${p.s}">${STATUS[p.s]}</span></div>
      <p class="intro">${p.note}.</p>
      ${kidCards}${kidCards && body ? '<div style="height:44px"></div>' : ""}${body}
      <nav class="pager" aria-label="More in ${home.short}">
        ${prev ? `<a href="#${prev.id}"><small>Previous</small><b>${prev.title}</b></a>` : `<a href="#${home.id}"><small>Back to</small><b>${home.title}</b></a>`}
        ${next ? `<a href="#${next.id}"><small>Next</small><b>${next.title}</b></a>` : ""}
      </nav>
    </article><aside class="side">${sideHTML(rel.length)}</aside></div>`;
  const nbs = [{ id: home.id, label: home.short, kind: "part" }, ...kids.map(u => ({ id: u.id, label: u.short, kind: "sib" })), ...rel.map(r => ({ id: r.id, label: r.short, kind: "rel" })), ...list.filter(u => u.id !== p.id).map(u => ({ id: u.id, label: u.short, kind: "sib" }))];
  document.getElementById("ego").appendChild(egoMap(p.short, nbs));
}

/* ---------- Router ---------- */
function route() {
  const id = location.hash.slice(1) || "home";
  if (SEC[id]) renderSection(SEC[id]);
  else if (PAGE[id]) renderPage(PAGE[id]);
  else renderHome();
  document.getElementById("hint").style.visibility = document.getElementById("orbit") ? "visible" : "hidden";
  bbInit();
  planNext();
  upInit();
  document.title = id === "home" || !(SEC[id] || PAGE[id]) ? `${CLIENT.name} · Brand Constellation` : `${(SEC[id] || PAGE[id]).title} · ${CLIENT.name}`;
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
window.addEventListener("resize", () => {
  const svg = document.getElementById("orbit"); if (!svg) return;
  const c = svg.getBoundingClientRect().width < 620; if (c !== compactNow) renderHome();
});

/* Theme toggle: follows the system until clicked */
const themeBtn = document.getElementById("themeBtn");
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
/* Kyra's logo: cropped to its edges, plus a cream version of the dark lettering for dark mode */
const LOGO_SRC = "../shared/kyra-logo.png";
const logoEl = document.getElementById("logo"), LOGO = {};
(function () {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    const out = document.createElement("canvas"); out.width = w; out.height = h;
    const o = out.getContext("2d"); o.drawImage(c, x0, y0, w, h, 0, 0, w, h);
    LOGO.light = out.toDataURL();
    const px = o.getImageData(0, 0, w, h);
    for (let i = 0; i < px.data.length; i += 4) {
      const r = px.data[i], g = px.data[i + 1];
      if (px.data[i + 3] && r < 150 && g < 100 && !(r > 110 && g > 50)) { px.data[i] = 238; px.data[i + 1] = 232; px.data[i + 2] = 222; }
    }
    o.putImageData(px, 0, 0); LOGO.dark = out.toDataURL();
    logoEl.width = w; logoEl.height = h;
    syncTheme();
  };
  img.src = LOGO_SRC;
})();
const syncTheme = () => {
  themeBtn.textContent = isDark() ? "Light mode" : "Dark mode";
  if (LOGO.light) logoEl.src = isDark() ? LOGO.dark : LOGO.light;
};
themeBtn.addEventListener("click", () => { document.documentElement.dataset.theme = isDark() ? "light" : "dark"; syncTheme(); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTheme);
syncTheme();


/* ---------- Search ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function collectText(v, out) {
  if (typeof v === "string") out.push(v.replace(/<[^>]+>/g, ""));
  else if (Array.isArray(v)) v.forEach(x => collectText(x, out));
  else if (v && typeof v === "object") for (const k in v) if (!["type", "s", "id", "path", "images", "folder", "link", "hex", "empty", "wide"].includes(k)) collectText(v[k], out);
}
const SEARCH_INDEX = [];
ALL.forEach(s => {
  const t = []; collectText([s.blurb, s.blocks], t);
  SEARCH_INDEX.push({ id: s.id, title: s.title, where: s.id === HOME.id ? CLIENT.name : "Section", text: t.join(" · ") });
  s.subs.forEach(u => {
    const t2 = []; collectText([u.note, u.blocks], t2);
    SEARCH_INDEX.push({ id: u.id, title: u.title, where: s.short, text: t2.join(" · ") });
    (u.children || []).forEach(c => { const t3 = []; collectText([c.note, c.blocks], t3); SEARCH_INDEX.push({ id: c.id, title: c.title, where: `${s.short} / ${u.short}`, text: t3.join(" · ") }); });
  });
});
function searchPages(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return SEARCH_INDEX.map(e => {
    const title = e.title.toLowerCase(), text = e.text.toLowerCase();
    let score = 0;
    for (const t of terms) {
      const inTitle = title.includes(t), n = text.split(t).length - 1;
      if (!inTitle && !n) return null;
      score += (inTitle ? 20 : 0) + Math.min(n, 5);
    }
    return { e, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12).map(r => r.e);
}
function snippet(text, terms) {
  const low = text.toLowerCase(); let at = -1;
  for (const t of terms) { at = low.indexOf(t); if (at >= 0) break; }
  if (at < 0) return esc(text.slice(0, 110)) + (text.length > 110 ? "…" : "");
  const start = Math.max(0, at - 50), end = Math.min(text.length, at + 80);
  return (start ? "…" : "") + mark(text.slice(start, end), terms) + (end < text.length ? "…" : "");
}
function mark(str, terms) {
  let out = esc(str);
  terms.forEach(t => { out = out.replace(new RegExp(`(${esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>"); });
  return out;
}

const SEARCH = { el: null, active: 0 };
(function mountSearch() {
  const top = document.querySelector(".top"), logo = document.getElementById("logo");
  const right = document.createElement("div"); right.className = "top-right";
  right.innerHTML = `<button type="button" class="searchbtn" id="searchBtn" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Search</span></button>`;
  top.appendChild(right); right.appendChild(logo);
  const el = document.createElement("div"); el.className = "search"; el.hidden = true;
  el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Search");
  el.innerHTML = `<div class="search-panel">
    <div class="search-bar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="searchInput" type="search" autocomplete="off" spellcheck="false" placeholder="Search ${esc(CLIENT.name)}" aria-label="Search">
      <button type="button" class="theme" id="searchClose">Close</button></div>
    <ul class="results" id="searchResults" role="listbox"></ul></div>`;
  document.body.appendChild(el); SEARCH.el = el;
  const input = el.querySelector("#searchInput"), list = el.querySelector("#searchResults");
  const render = () => {
    const q = input.value.trim(), terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!q) { list.innerHTML = `<li class="empty">Search every section, page and note.</li>`; return; }
    const hits = searchPages(q); SEARCH.active = 0;
    list.innerHTML = hits.length ? hits.map((h, i) => `<li><a href="#${h.id}" class="hit${i === 0 ? " on" : ""}" role="option"><span class="hit-top"><b>${mark(h.title, terms)}</b><em>${esc(h.where)}</em></span><span class="hit-text">${snippet(h.text, terms)}</span></a></li>`).join("")
      : `<li class="empty">No matches for “${esc(q)}”.</li>`;
  };
  const move = d => {
    const hits = [...list.querySelectorAll(".hit")]; if (!hits.length) return;
    hits[SEARCH.active].classList.remove("on");
    SEARCH.active = (SEARCH.active + d + hits.length) % hits.length;
    hits[SEARCH.active].classList.add("on"); hits[SEARCH.active].scrollIntoView({ block: "nearest" });
  };
  input.addEventListener("input", render);
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { const h = list.querySelectorAll(".hit")[SEARCH.active]; if (h) { e.preventDefault(); closeSearch(); location.hash = h.getAttribute("href").slice(1); } }
  });
  list.addEventListener("click", e => { if (e.target.closest(".hit")) closeSearch(); });
  el.addEventListener("click", e => { if (e.target === el || e.target.closest("#searchClose")) closeSearch(); });
  document.getElementById("searchBtn").addEventListener("click", openSearch);
  render();
})();
function openSearch() { SEARCH.el.hidden = false; document.body.classList.add("noscroll"); const i = SEARCH.el.querySelector("#searchInput"); i.focus(); i.select(); }
function closeSearch() { SEARCH.el.hidden = true; document.body.classList.remove("noscroll"); }
document.addEventListener("keydown", e => {
  const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
  if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); openSearch(); }
  else if (e.key === "Escape" && !SEARCH.el.hidden) closeSearch();
});

/* ---------- Calendar: cards, card view, posted ---------- */
const CAL = { days: {}, el: null, open: null };
const calKey = () => `bc:${CLIENT.name}:posted`;
function calPosted() { try { return JSON.parse(localStorage.getItem(calKey()) || "{}"); } catch (e) { return {}; } }
function calSave(map) { try { localStorage.setItem(calKey(), JSON.stringify(map)); } catch (e) {} }
const fmtDate = iso => { const d = new Date(iso); return isNaN(d) ? "" : "Posted " + d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); };
function calRefresh(cal) {
  const days = [...cal.querySelectorAll(".day[data-n]")], posted = calPosted();
  const done = days.filter(d => posted[d.dataset.n]).length;
  const count = cal.querySelector(".cal-count"), bar = cal.querySelector(".cal-bar i");
  if (count) count.innerHTML = `<b>${done}</b> of ${days.length} posted`;
  if (bar) bar.style.width = `${days.length ? Math.round(done / days.length * 100) : 0}%`;
  const kind = (cal.querySelector(".chip-f.on[data-kind]") || {}).dataset?.kind || "";
  const hide = cal.querySelector(".chip-hide")?.getAttribute("aria-pressed") === "true";
  days.forEach(d => { d.hidden = (!!kind && d.dataset.kind !== kind) || (hide && d.classList.contains("posted")); });
  cal.querySelectorAll(".day.empty").forEach(d => { d.hidden = !!kind || hide; });
  cal.querySelectorAll(".week").forEach(w => { w.hidden = !w.querySelector(".day:not([hidden])"); });
}
function calOpen(n) {
  const d = CAL.days[n]; if (!d) return;
  if (!CAL.el) {
    const el = document.createElement("div"); el.className = "cardview"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Post");
    el.addEventListener("click", e => {
      if (e.target === el || e.target.closest(".cv-close")) calClose();
      const cb = e.target.closest(".copybtn"); if (cb) copyFrom(cb, el.querySelector(".cv-script"));
    });
    el.addEventListener("change", e => { if (e.target.matches(".cv-posted input")) calMark(CAL.open, e.target.checked); });
    document.body.appendChild(el); CAL.el = el;
  }
  CAL.open = n;
  const when = calPosted()[n];
  CAL.el.innerHTML = `<article class="cv-card">
    <div class="cv-top"><span class="day-n">${d.label || d.n}</span><span class="day-kind"><i class="kdot k-${(d.kind || "").toLowerCase()}"></i>${d.kind || ""}${d.format ? ` · ${d.format}` : ""}</span><button type="button" class="theme cv-close">Close</button></div>
    <h3 class="cv-hook">${d.hook}</h3>
    ${d.note ? `<p class="cv-note">${d.note}</p>` : ""}
    ${d.cta ? `<p class="day-cta"><b>CTA</b>${d.cta}</p>` : ""}
    ${d.text ? `<div class="cv-script">${d.text.split("\n").filter(Boolean).map(l => `<p>${l}</p>`).join("")}</div><button type="button" class="theme copybtn">Copy text</button>` : ""}
    <label class="cv-posted"><input type="checkbox" ${when ? "checked" : ""}><span class="box" aria-hidden="true"></span><span>Posted?</span>${when ? `<em>${fmtDate(when)}</em>` : ""}</label>
  </article>`;
  CAL.el.hidden = false; document.body.classList.add("noscroll");
  CAL.el.querySelector(".cv-close").focus();
}
function calClose() { if (CAL.el) { CAL.el.hidden = true; document.body.classList.remove("noscroll"); const c = document.querySelector(`.day[data-n="${CAL.open}"]`); if (c) c.focus({ preventScroll: true }); } }
function calMark(n, on) {
  const map = calPosted();
  if (on) map[n] = new Date().toISOString(); else delete map[n];
  calSave(map);
  setTimeout(() => {
    calClose();
    const card = document.querySelector(`.day[data-n="${n}"]`);
    if (card) {
      card.classList.toggle("posted", on);
      card.querySelector(".back-date").textContent = on ? fmtDate(map[n]) : "";
      setTimeout(() => calRefresh(card.closest(".cal")), on ? 700 : 0);
    }
  }, on ? 260 : 0);
}
function copyFrom(btn, body) {
  const text = [...body.querySelectorAll("p")].map(p => p.textContent).join("\n\n");
  const done = () => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = "Copy text"; }, 1600); };
  const fallback = () => { const r = document.createRange(); r.selectNodeContents(body); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); btn.textContent = "Selected, press copy"; };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
}
document.addEventListener("click", e => {
  const tb = e.target.closest(".tm-b, .tm-c"); if (tb) { if (navigator.clipboard) navigator.clipboard.writeText(tb.dataset.copy).then(() => { tb.classList.add("done"); tb.textContent = "Copied"; setTimeout(() => { tb.textContent = tb.dataset.label || tb.dataset.copy; tb.classList.remove("done"); }, 1100); }); return; }
  const k = e.target.closest(".sky-key"); if (k) {
    const sky = k.closest(".sky"), on = k.getAttribute("aria-pressed") !== "true";
    sky.querySelectorAll(".sky-key").forEach(x => x.setAttribute("aria-pressed", String(on && x === k)));
    sky.querySelector(".sky-map").classList.toggle("focus", on);
    sky.querySelectorAll(".sky-ring").forEach(r => r.classList.toggle("on", on && r.dataset.ring === k.dataset.ring));
    return;
  }
  const card = e.target.closest(".day[data-n]"); if (card) { calOpen(+card.dataset.n); return; }
  const f = e.target.closest(".chip-f");
  if (f) {
    const cal = f.closest(".cal");
    if (f.classList.contains("chip-hide")) f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") === "true" ? "false" : "true");
    else cal.querySelectorAll(".chip-f[data-kind]").forEach(b => b.classList.toggle("on", b === f));
    calRefresh(cal); return;
  }
  const c = e.target.closest(".copy .copybtn"); if (c) { if (c.closest("summary")) e.preventDefault(); copyFrom(c, c.closest(".copy").querySelector(".copy-body")); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && CAL.el && !CAL.el.hidden) calClose(); });

/* ---------- Planner and toolkit ---------- */
function planKey(id) { return `bc-plan:${location.pathname}:${id}`; }
function planState(id) { let s = {}; try { s = JSON.parse(localStorage.getItem(planKey(id))) || {}; } catch (e) {} return { done: s.done || {}, n: s.n || {} }; }
function planSave(id, s) { try { localStorage.setItem(planKey(id), JSON.stringify(s)); } catch (e) {} }
/* The first task not yet done becomes the big one. */
function planNext() {
  document.querySelectorAll(".pl-cards").forEach(w => {
    const cards = [...w.children], open = cards.filter(c => !c.querySelector("[data-task]").checked);
    cards.forEach(c => { c.classList.toggle("is-done", !open.includes(c)); c.classList.toggle("is-next", c === open[0]); });
    w.classList.toggle("all", !open.length); w.parentElement.querySelector(".pl-all").hidden = !!open.length;
  });
}
function tabPick(list, btn, panel) {
  list.querySelectorAll('[role="tab"]').forEach(t => { const on = t === btn; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
  [...panel.parentElement.querySelectorAll(':scope > [role="tabpanel"]')].forEach(p => { p.hidden = p !== panel; });
}
const tabOpen = btn => tabPick(btn.closest('[role="tablist"]'), btn, document.getElementById(btn.getAttribute("aria-controls")));
document.addEventListener("change", e => {
  const c = e.target.closest("[data-task]"); if (!c) return;
  const id = c.closest(".pl").dataset.plan, s = planState(id); s.done[c.dataset.task] = c.checked; planSave(id, s); planNext();
});
document.addEventListener("click", e => {
  const t = e.target.closest('.pl-tabs [role="tab"], .tk-tabs [role="tab"]'); if (t) { tabOpen(t); return; }
  const go = e.target.closest("[data-tool]"); if (go) { const b = document.getElementById("tk-t-" + go.dataset.tool); const own = !b && document.getElementById(go.dataset.tool); if (own) own.closest(".block").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); if (b) { tabOpen(b); document.getElementById("toolkit").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); b.focus({ preventScroll: true }); } return; }
  const st = e.target.closest("[data-step], [data-dot]"); if (st) {
    const g = st.closest(".pl-g"), id = st.closest(".pl").dataset.plan, s = planState(id), k = g.dataset.goal, max = +g.dataset.max, was = s.n[k] || 0;
    const v = st.dataset.dot ? (+st.dataset.dot === was ? was - 1 : +st.dataset.dot) : was + +st.dataset.step;
    s.n[k] = Math.max(0, Math.min(max, v)); planSave(id, s);
    g.querySelector(".pl-v").textContent = s.n[k]; g.querySelectorAll(".pl-dots i").forEach((d, i) => d.classList.toggle("on", i < s.n[k]));
  }
});
document.addEventListener("keydown", e => {
  const t = e.target.closest && e.target.closest('.pl-tabs [role="tab"], .tk-tabs [role="tab"]'); if (!t || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const all = [...t.parentElement.children], n = all[(all.indexOf(t) + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length]; e.preventDefault(); tabOpen(n); n.focus();
});

/* ---------- Brand book: contents links and active section ---------- */
let BB_OBS = null;
function bbInit() {
  if (BB_OBS) { BB_OBS.disconnect(); BB_OBS = null; }
  const book = document.querySelector(".bb"); if (!book || !("IntersectionObserver" in window)) return;
  const links = [...book.querySelectorAll(".bb-link")];
  BB_OBS = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle("on", l.dataset.target === e.target.id));
      const on = book.querySelector(".bb-link.on");
      if (on && matchMedia("(max-width: 900px)").matches) on.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  book.querySelectorAll(".bb-item").forEach(s => BB_OBS.observe(s));
}
document.addEventListener("click", e => {
  const l = e.target.closest(".bb-link"); if (!l) return;
  const t = document.getElementById(l.dataset.target);
  if (t) t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});

/* ---------- Client uploads: the Inspo board and the Photo Library ---------- */
const API = location.hostname.endsWith("brand-constellation.pages.dev") || ["8788", "8789"].includes(location.port) ? "/api" : "https://brand-constellation.pages.dev/api";
const HUB_ID = CLIENT.id || location.pathname.split("/").filter(Boolean).pop();
/* One uploader, two boards. max = longest side in px, bytes = size cap per image (the API allows 1.5 MB / 1.9 MB). */
const BOARDS = {
  inspo: { bar: "Love something you saw? Save it here.", add: "+ Add inspo", title: "Add inspo", pick: "Choose a photo or screenshot",
    noteLabel: "A note (optional)", notePh: "What do you love about it?", send: "Add to the board", saved: "Saved by you", max: 1400, bytes: 1_400_000, multi: false },
  photos: { bar: "Have brand photos of your own? Add them here.", add: "+ Upload photos", title: "Upload photos", pick: "Choose one photo or several",
    noteLabel: "A caption (optional)", notePh: "Where or when it was taken", send: "Add to your photos", saved: "Added by you", max: 2400, bytes: 1_800_000, multi: true }
};
const UP = { items: [], el: null, files: [], board: "inspo" };
const upSrc = it => `${API}/inspo/img?id=${encodeURIComponent(it.id)}`;
const upKey = { get() { try { return localStorage.getItem(`bc:${HUB_ID}:key`) || ""; } catch (e) { return ""; } },
  set(v) { try { v ? localStorage.setItem(`bc:${HUB_ID}:key`, v) : localStorage.removeItem(`bc:${HUB_ID}:key`); } catch (e) {} } };
const upEsc = t => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function upInit() {
  const page = document.querySelector('.main .blocks'), board = location.hash.slice(1); if (!page || !BOARDS[board]) return;
  const cfg = BOARDS[board]; UP.board = board;
  const box = document.createElement("section"); box.className = `block up-area up-${board}`;
  const saved = board === "photos"
    ? `<section class="ph-album up-saved" hidden><div class="ph-head"><h3>${cfg.saved}</h3><span class="ph-count"></span></div><div class="ph-grid up-grid"></div></section>`
    : `<div class="up-saved" hidden><h3>${cfg.saved}</h3><div class="mood up-grid"></div></div>`;
  box.innerHTML = `<div class="up-bar"><p>${cfg.bar}</p><button type="button" class="open up-add">${cfg.add}</button></div>${saved}`;
  if (board === "photos" && !page.querySelector("#ph-photos")) {
    const shell = document.createElement("section"); shell.className = "block";
    shell.innerHTML = blockHTML({ type: "photos", albums: [] });
    const lead0 = [...page.children].find(c => c.classList.contains("lead") || c.querySelector(".lead"));
    if (lead0) lead0.after(shell); else page.prepend(shell);
  }
  if (board === "photos") vidInit(page);
  const panel = board === "photos" && page.querySelector("#ph-photos");
  const lead = board === "photos" && [...page.children].find(c => c.classList.contains("lead") || c.querySelector(".lead"));
  if (panel) panel.prepend(box); else if (lead) lead.after(box); else page.prepend(box);
  box.querySelector(".up-add").addEventListener("click", upOpen);
  if (board === "photos") box.querySelector(".up-grid").addEventListener("click", e => { const b = e.target.closest(".ph-rm"); if (b) upRemovePhoto(b); });
  upLoad();
}
async function upLoad() {
  const board = UP.board;
  try {
    const r = await fetch(`${API}/inspo?client=${encodeURIComponent(HUB_ID)}&board=${board}`); if (!r.ok) return;
    UP.items = (await r.json()).items || [];
  } catch (e) { return; }
  const wrap = document.querySelector(".up-saved"); if (!wrap) return;
  wrap.hidden = !UP.items.length;
  if (board === "photos") {
    wrap.querySelector(".ph-count").textContent = `${UP.items.length} photo${UP.items.length === 1 ? "" : "s"}`;
    wrap.querySelector(".up-grid").innerHTML = UP.items.map((it, i) => `<figure class="ph-item"><a href="${upSrc(it)}" target="_blank" rel="noopener"><img src="${upSrc(it)}" ${it.w && it.h ? `width="${it.w}" height="${it.h}"` : ""} loading="lazy" alt="${upEsc(it.note) || `Your photo ${i + 1}`}"></a>${it.note ? `<figcaption>${upEsc(it.note)}</figcaption>` : ""}<a class="ph-dl" href="${upSrc(it)}&dl=1" aria-label="Download photo ${i + 1}">↓</a><button type="button" class="ph-rm" data-id="${upEsc(it.id)}" aria-label="Remove photo ${i + 1}">×</button></figure>`).join("");
    return;
  }
  wrap.querySelector(".up-grid").innerHTML = UP.items.map((it, i) => `<button type="button" class="pin" data-group="up" data-i="${i}" style="--r:${(((i * 37) % 7) - 3) * 0.3}deg" aria-label="Open saved image ${i + 1}"><img src="${upSrc(it)}" ${it.w && it.h ? `width="${it.w}" height="${it.h}"` : ""} loading="lazy" alt="${upEsc(it.note)}"></button>`).join("");
}
function upOpen() {
  const cfg = BOARDS[UP.board];
  if (!UP.el) {
    const el = document.createElement("div"); el.className = "cardview"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.addEventListener("click", e => { if (e.target === el || e.target.closest(".cv-close")) upClose(); });
    document.body.appendChild(el); UP.el = el;
  }
  UP.el.setAttribute("aria-label", cfg.title);
  UP.files = [];
  UP.el.innerHTML = `<form class="cv-card up-form" novalidate>
    <div class="cv-top"><h3 class="cv-hook">${cfg.title}</h3><button type="button" class="theme cv-close">Close</button></div>
    <label class="up-drop"><input type="file" id="upFile" accept="image/*"${cfg.multi ? " multiple" : ""}><span class="up-preview"><span>${cfg.pick}</span></span></label>
    <label class="up-field"><span>${cfg.noteLabel}</span><input type="text" id="upNote" maxlength="280" placeholder="${cfg.notePh}"></label>
    ${upKey.get() ? "" : `<label class="up-field"><span>Passcode</span><input type="password" id="upPass" autocomplete="current-password" placeholder="The passcode Kyra gave you"></label>`}
    <p class="up-msg" role="status"></p>
    <button type="submit" class="open up-send">${cfg.send}</button>
  </form>`;
  const form = UP.el.querySelector("form");
  form.querySelector("#upFile").addEventListener("change", e => {
    UP.files = [...e.target.files];
    const pv = form.querySelector(".up-preview");
    pv.classList.toggle("many", UP.files.length > 1);
    pv.innerHTML = UP.files.length ? UP.files.slice(0, 12).map(f => `<img src="${URL.createObjectURL(f)}" alt="">`).join("") + (UP.files.length > 12 ? `<span class="up-more">+${UP.files.length - 12} more</span>` : "") : `<span>${cfg.pick}</span>`;
  });
  form.addEventListener("submit", upSend);
  UP.el.hidden = false; document.body.classList.add("noscroll");
}
function upClose() { if (UP.el) { UP.el.hidden = true; document.body.classList.remove("noscroll"); } }
/* Resize in the browser, then step the JPEG quality down until it fits under the size cap. */
function upShrink(file, max, cap) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      let q = 0.88, data = c.toDataURL("image/jpeg", q).split(",")[1];
      while (data.length * 0.75 > cap && q > 0.5) { q -= 0.08; data = c.toDataURL("image/jpeg", q).split(",")[1]; }
      resolve({ data, w: c.width, h: c.height });
    };
    img.onerror = () => reject(new Error(`${file.name || "That file"} isn't an image this browser can read.`));
    img.src = URL.createObjectURL(file);
  });
}
async function upSend(e) {
  e.preventDefault();
  const cfg = BOARDS[UP.board], form = e.target, msg = form.querySelector(".up-msg"), btn = form.querySelector(".up-send");
  const passEl = form.querySelector("#upPass"), key = passEl ? passEl.value.trim() : upKey.get();
  if (!UP.files.length) { msg.textContent = "Choose a photo first."; return; }
  if (!key) { msg.textContent = "Enter the passcode Kyra gave you."; passEl && passEl.focus(); return; }
  btn.disabled = true; msg.textContent = "";
  const note = form.querySelector("#upNote").value.trim(), failed = [];
  for (let n = 0; n < UP.files.length; n++) {
    btn.textContent = UP.files.length > 1 ? `Adding ${n + 1} of ${UP.files.length}…` : "Adding…";
    try {
      const img = await upShrink(UP.files[n], cfg.max, cfg.bytes);
      const r = await fetch(`${API}/inspo`, { method: "POST", headers: { "Content-Type": "application/json", "X-Hub-Key": key },
        body: JSON.stringify({ client: HUB_ID, board: UP.board, note, mime: "image/jpeg", ...img }) });
      const out = await r.json().catch(() => ({}));
      if (r.status === 401) {
        upKey.set("");
        if (!passEl) { upOpen(); UP.el.querySelector(".up-msg").textContent = out.error; return; }
        msg.textContent = out.error; btn.disabled = false; btn.textContent = cfg.send; return;
      }
      if (!r.ok) failed.push(`${UP.files[n].name}: ${out.error || "didn't save"}`);
    } catch (err) { failed.push(err.message || `${UP.files[n].name} didn't save`); }
  }
  upKey.set(key); await upLoad();
  if (failed.length) { msg.textContent = failed.join(" "); btn.disabled = false; btn.textContent = cfg.send; return; }
  upClose();
  document.querySelector(".up-saved")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
async function upRemove(btn) {
  const it = UP.items[LIGHTBOX.i]; if (!it) return;
  if (!btn.dataset.armed) { btn.dataset.armed = "1"; btn.textContent = "Tap again to remove"; return; }
  const key = upKey.get();
  if (!key) { btn.textContent = "Add something first to unlock removing"; return; }
  btn.textContent = "Removing…";
  const r = await fetch(`${API}/inspo?client=${encodeURIComponent(HUB_ID)}&id=${encodeURIComponent(it.id)}`, { method: "DELETE", headers: { "X-Hub-Key": key } }).catch(() => null);
  if (!r || !r.ok) { btn.textContent = "Couldn't remove it"; return; }
  closeLightbox(); await upLoad();
}
async function upRemovePhoto(btn) {
  if (!btn.dataset.armed) { btn.dataset.armed = "1"; btn.classList.add("armed"); btn.textContent = "Remove?"; return; }
  const key = upKey.get();
  if (!key) { btn.textContent = "Upload a photo first to unlock removing"; return; }
  btn.textContent = "Removing…";
  const r = await fetch(`${API}/inspo?client=${encodeURIComponent(HUB_ID)}&id=${encodeURIComponent(btn.dataset.id)}`, { method: "DELETE", headers: { "X-Hub-Key": key } }).catch(() => null);
  if (!r || !r.ok) { btn.textContent = "Couldn't remove it"; return; }
  await upLoad();
}

/* Start */
route();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (document.getElementById("orbit")) renderHome(); else route(); });

/* Brand book downloads: one open menu at a time, closed by clicking elsewhere or Escape */
document.addEventListener("click", e => { document.querySelectorAll("details.bb-dl[open]").forEach(d => { if (!d.contains(e.target)) d.open = false; }); });
document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll("details.bb-dl[open]").forEach(d => { d.open = false; d.querySelector("summary").focus(); }); });

/* Photo Library tabs: Photos / Videos (arrow keys move between tabs) */
function phTab(btn) {
  const tabs = [...btn.parentElement.querySelectorAll(".ph-tab")];
  tabs.forEach(t => { const on = t === btn; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; document.getElementById(t.getAttribute("aria-controls")).hidden = !on; });
  document.querySelectorAll("#ph-photos video, #ph-videos video").forEach(v => { if (v.closest("[hidden]")) v.pause(); });
}
document.addEventListener("click", e => { const t = e.target.closest(".ph-tab"); if (t) phTab(t); });
document.addEventListener("keydown", e => {
  const t = e.target.closest && e.target.closest(".ph-tab"); if (!t || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const tabs = [...t.parentElement.querySelectorAll(".ph-tab")], n = tabs[(tabs.indexOf(t) + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
  phTab(n); n.focus();
});

/* ---------- Client video uploads (Photo Library > Videos). Files go to R2 through /api/media. ---------- */
const VID = { items: [], files: [] };
const vidSrc = it => `${API}/media/file?id=${encodeURIComponent(it.id)}`;
function vidInit(page) {
  const panel = page.querySelector("#ph-videos"); if (!panel || panel.querySelector(".up-videos")) return;
  const box = document.createElement("section"); box.className = "block up-area up-videos";
  box.innerHTML = `<div class="up-bar"><p>Have videos of your own? Add them here.</p><button type="button" class="open up-add">+ Upload videos</button></div>
    <section class="ph-album up-vsaved" hidden><div class="ph-head"><h3>Added by you</h3><span class="ph-count"></span></div><div class="ph-vgrid up-vgrid"></div></section>`;
  panel.prepend(box);
  box.querySelector(".up-add").addEventListener("click", vidOpen);
  box.querySelector(".up-vgrid").addEventListener("click", e => { const b = e.target.closest(".ph-rm"); if (b) vidRemove(b); });
  vidLoad();
}
async function vidLoad() {
  try { const r = await fetch(`${API}/media?client=${encodeURIComponent(HUB_ID)}`); if (!r.ok) return; VID.items = (await r.json()).items || []; } catch (e) { return; }
  const wrap = document.querySelector(".up-vsaved"); if (!wrap) return;
  wrap.hidden = !VID.items.length;
  wrap.querySelector(".ph-count").textContent = `${VID.items.length} video${VID.items.length === 1 ? "" : "s"}`;
  wrap.querySelector(".up-vgrid").innerHTML = VID.items.map((it, i) => `<figure class="ph-item ph-vid"><video controls playsinline preload="metadata" src="${vidSrc(it)}#t=0.1" aria-label="${upEsc(it.note) || `Your video ${i + 1}`}"></video>${it.note ? `<figcaption>${upEsc(it.note)}</figcaption>` : ""}<a class="ph-dl" href="${vidSrc(it)}&dl=1" aria-label="Download video ${i + 1}">↓</a><button type="button" class="ph-rm" data-id="${upEsc(it.id)}" aria-label="Remove video ${i + 1}">×</button></figure>`).join("");
  const tab = document.querySelector("#ph-tab-videos .ph-n");
  if (tab) tab.textContent = document.querySelectorAll("#ph-videos video").length;
}
function vidOpen() {
  if (!UP.el) {
    const el = document.createElement("div"); el.className = "cardview"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.addEventListener("click", e => { if (e.target === el || e.target.closest(".cv-close")) upClose(); });
    document.body.appendChild(el); UP.el = el;
  }
  UP.el.setAttribute("aria-label", "Upload videos");
  VID.files = [];
  UP.el.innerHTML = `<form class="cv-card up-form" novalidate>
    <div class="cv-top"><h3 class="cv-hook">Upload videos</h3><button type="button" class="theme cv-close">Close</button></div>
    <label class="up-drop"><input type="file" id="vidFile" accept="video/mp4,video/quicktime,video/webm,video/x-m4v" multiple><span class="up-preview"><span>Choose one video or several (up to 95 MB each)</span></span></label>
    <label class="up-field"><span>A caption (optional)</span><input type="text" id="vidNote" maxlength="280" placeholder="Where or when it was filmed"></label>
    ${upKey.get() ? "" : `<label class="up-field"><span>Passcode</span><input type="password" id="vidPass" autocomplete="current-password" placeholder="The passcode Kyra gave you"></label>`}
    <div class="up-progress" hidden><i></i></div>
    <p class="up-msg" role="status"></p>
    <button type="submit" class="open up-send">Add to your videos</button>
  </form>`;
  const form = UP.el.querySelector("form");
  form.querySelector("#vidFile").addEventListener("change", e => {
    VID.files = [...e.target.files];
    const pv = form.querySelector(".up-preview"); pv.classList.toggle("many", VID.files.length > 1);
    pv.innerHTML = VID.files.length ? VID.files.map(f => `<video src="${URL.createObjectURL(f)}#t=0.1" muted playsinline preload="metadata"></video>`).join("") : `<span>Choose one video or several (up to 95 MB each)</span>`;
  });
  form.addEventListener("submit", vidSend);
  UP.el.hidden = false; document.body.classList.add("noscroll");
}
function vidPut(file, key, note, onProgress) {
  return new Promise(resolve => {
    const x = new XMLHttpRequest();
    x.open("POST", `${API}/media?client=${encodeURIComponent(HUB_ID)}&note=${encodeURIComponent(note)}&name=${encodeURIComponent(file.name)}`);
    x.setRequestHeader("X-Hub-Key", key);
    x.setRequestHeader("Content-Type", file.type || "video/mp4");
    x.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total);
    x.onload = () => { let out = {}; try { out = JSON.parse(x.responseText); } catch (e) {} resolve({ status: x.status, ok: x.status < 300, out }); };
    x.onerror = () => resolve({ status: 0, ok: false, out: { error: "The upload stopped. Check your connection and try again." } });
    x.send(file);
  });
}
async function vidSend(e) {
  e.preventDefault();
  const form = e.target, msg = form.querySelector(".up-msg"), btn = form.querySelector(".up-send"), bar = form.querySelector(".up-progress");
  const passEl = form.querySelector("#vidPass"), key = passEl ? passEl.value.trim() : upKey.get();
  if (!VID.files.length) { msg.textContent = "Choose a video first."; return; }
  if (!key) { msg.textContent = "Enter the passcode Kyra gave you."; passEl && passEl.focus(); return; }
  const big = VID.files.find(f => f.size > 95 * 1024 * 1024);
  if (big) { msg.textContent = `${big.name} is over 95 MB. Send that one to Kyra instead.`; return; }
  btn.disabled = true; msg.textContent = ""; bar.hidden = false;
  const note = form.querySelector("#vidNote").value.trim(), failed = [];
  for (let n = 0; n < VID.files.length; n++) {
    const label = VID.files.length > 1 ? `Uploading ${n + 1} of ${VID.files.length}` : "Uploading";
    const r = await vidPut(VID.files[n], key, note, k => { bar.firstElementChild.style.width = `${Math.round(k * 100)}%`; btn.textContent = `${label}… ${Math.round(k * 100)}%`; });
    if (r.status === 401) { upKey.set(""); msg.textContent = r.out.error; btn.disabled = false; btn.textContent = "Add to your videos"; bar.hidden = true; if (!passEl) { vidOpen(); UP.el.querySelector(".up-msg").textContent = r.out.error; } return; }
    if (!r.ok) failed.push(`${VID.files[n].name}: ${r.out.error || "didn't save"}`);
  }
  upKey.set(key); await vidLoad();
  if (failed.length) { msg.textContent = failed.join(" "); btn.disabled = false; btn.textContent = "Add to your videos"; bar.hidden = true; return; }
  upClose();
  document.querySelector(".up-vsaved")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
async function vidRemove(btn) {
  if (!btn.dataset.armed) { btn.dataset.armed = "1"; btn.classList.add("armed"); btn.textContent = "Remove?"; return; }
  const key = upKey.get();
  if (!key) { btn.textContent = "Upload something first to unlock removing"; return; }
  btn.textContent = "Removing…";
  const r = await fetch(`${API}/media?client=${encodeURIComponent(HUB_ID)}&id=${encodeURIComponent(btn.dataset.id)}`, { method: "DELETE", headers: { "X-Hub-Key": key } }).catch(() => null);
  if (!r || !r.ok) { btn.textContent = "Couldn't remove it"; return; }
  await vidLoad();
}

/* Post cards: copy the exact caption; unfold long captions */
document.addEventListener("click", e => {
  const c = e.target.closest(".pc-copy");
  if (c) {
    const card = c.closest(".pc-card"), text = card.querySelector(".pc-raw").value;
    const done = () => { c.textContent = "Copied ✓"; setTimeout(() => { c.textContent = "Copy caption"; }, 1600); };
    const fallback = () => { const t = card.querySelector(".pc-raw"); t.hidden = false; t.select(); try { document.execCommand("copy"); done(); } catch (err) {} t.hidden = true; };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    return;
  }
  const m = e.target.closest(".pc-more");
  if (m) { const card = m.closest(".pc-card"); const open = card.classList.toggle("open"); m.textContent = open ? "Fold caption" : "Show full caption"; }
});
/* Hide "Show full caption" where the caption already fits */
function pcFit() { document.querySelectorAll(".pc-card").forEach(c => { const cap = c.querySelector(".pc-cap"); const btn = c.querySelector(".pc-more"); if (cap && btn && !c.classList.contains("open")) { const fits = cap.scrollHeight <= cap.clientHeight + 4; btn.hidden = fits; c.classList.toggle("fits", fits); } }); }
new MutationObserver(() => requestAnimationFrame(pcFit)).observe(document.body, { childList: true, subtree: true });

/* Timeline cards rise in as they scroll into view */
(function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  const watch = () => document.querySelectorAll(".tl-row:not(.seen), .rise:not(.seen)").forEach(r => { r.classList.add("seen"); io.observe(r); });
  new MutationObserver(watch).observe(document.body, { childList: true, subtree: true }); watch();
})();
