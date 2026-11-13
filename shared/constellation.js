/* =====================================================================
   APP. Nothing below needs to change per client.
   ===================================================================== */
const NS = "http://www.w3.org/2000/svg";
const STATUS = { ready: "Ready", progress: "In progress", planning: "Planning" };
const ALL = [HOME, ...SECTIONS];
const SEC = {}, PAGE = {};
ALL.forEach(s => { SEC[s.id] = s; s.subs.forEach(u => PAGE[u.id] = { ...u, sec: s }); });
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
    case "stages": return `${h}<ol class="stages">${b.items.map(i => `<li><b>${i.t}</b><span>${i.d}</span></li>`).join("")}</ol>`;
    case "pending": return `<div class="pending"><h3>${glyph("planning")}${b.heading}</h3><p>${b.text}</p>${b.needs ? `<ul>${b.needs.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}</div>`;
    case "swatches": return `${h}${b.note ? `<p class="swnote">${b.note}</p>` : ""}<div class="swatches">${b.items.map(c => `<div class="sw"><i style="--c:${c.hex}"></i><b>${c.name}</b><span>${c.hex}</span>${c.role ? `<em>${c.role}</em>` : ""}</div>`).join("")}${Array.from({ length: b.empty || 0 }, () => `<div class="sw"><i class="empty"></i><b>To come</b></div>`).join("")}</div>`;
    case "gallery": return `${h}<div class="gallery">${b.tiles.map(t => `<div><span>${t}</span></div>`).join("")}</div>
      <p class="gnote">${b.folder ? `<a href="${b.folder}" target="_blank" rel="noopener">Open the Drive folder</a>` : "Drive folder not linked yet. Thumbnails appear here once it's connected."}</p>`;
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
        if (!d.hook) return `<div class="day empty"><span class="flip"><span class="face front"><span class="day-n">${d.n}</span><span class="day-note">Open</span></span></span></div>`;
        const when = posted[d.n];
        return `<button type="button" class="day${when ? " posted" : ""}" data-n="${d.n}" data-kind="${d.kind || ""}" aria-label="Day ${d.n}${when ? ", posted" : ""}: ${d.hook.replace(/"/g, "&quot;")}">
          <span class="flip">
            <span class="face front"><span class="day-top"><span class="day-n">${d.n}</span><span class="day-kind"><i class="kdot k-${(d.kind || "").toLowerCase()}"></i>${d.kind || ""}</span></span><span class="day-hook">${d.hook}</span>${d.text ? `<span class="day-has">Full script inside</span>` : ""}</span>
            <span class="face back"><span class="day-top"><span class="day-n">${d.n}</span><span class="back-stamp">✓ Posted</span></span><span class="back-hook">${d.hook}</span><span class="back-date">${when ? fmtDate(when) : ""}</span></span>
          </span></button>`;
      };
      return `${h}<div class="cal">${tools}${b.weeks.map(w => `<section class="week"><div class="week-head"><h4>${w.t}</h4>${w.d ? `<p>${w.d}</p>` : ""}</div><div class="days">${w.days.map(day).join("")}</div></section>`).join("")}</div>`;
    }
    case "copy": return `${h}<div class="copies">${b.items.map(c => `<details class="copy"><summary><span class="copy-t">${c.t}</span>${c.meta ? `<span class="copy-meta">${c.meta}</span>` : ""}</summary><div class="copy-body">${c.text.split("\n").filter(Boolean).map(l => `<p>${l}</p>`).join("")}</div><button type="button" class="theme copybtn">Copy text</button></details>`).join("")}</div>`;
    case "pipeline": return `${h}<div class="pipeline">${b.stages.map(s => `<div><b>${s.t}</b><span>${s.d}</span><em>No contacts yet</em></div>`).join("")}</div>`;
    case "moodboard": {
      LIGHTBOX.list = b.images.map((_, i) => `${b.path}${String(i + 1).padStart(2, "0")}.jpg`);
      return `${h}<div class="mood">${b.images.map(([w, ht], i) => `<button type="button" class="pin" data-i="${i}" style="--r:${(((i * 37) % 7) - 3) * 0.3}deg" aria-label="Open image ${i + 1} of ${b.images.length}"><img src="${LIGHTBOX.list[i]}" width="${w}" height="${ht}" loading="lazy" alt=""></button>`).join("")}</div>`;
    }
  }
  return "";
}
/* Full-size viewer for moodboard images */
const LIGHTBOX = { list: [], i: 0, el: null };
function openLightbox(i) {
  if (!LIGHTBOX.el) {
    const el = document.createElement("div"); el.className = "lb"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Image viewer");
    el.innerHTML = `<button type="button" class="theme lb-close">Close</button><button type="button" class="theme lb-prev" aria-label="Previous image">←</button><img alt=""><button type="button" class="theme lb-next" aria-label="Next image">→</button><p class="lb-count"></p>`;
    el.addEventListener("click", e => {
      if (e.target.closest(".lb-prev")) step(-1); else if (e.target.closest(".lb-next")) step(1);
      else if (e.target.closest(".lb-close") || e.target === el) closeLightbox();
    });
    document.body.appendChild(el); LIGHTBOX.el = el;
  }
  LIGHTBOX.i = i; showLightbox(); LIGHTBOX.el.hidden = false; LIGHTBOX.el.querySelector(".lb-close").focus();
}
function showLightbox() { const el = LIGHTBOX.el; el.querySelector("img").src = LIGHTBOX.list[LIGHTBOX.i]; el.querySelector(".lb-count").textContent = `${LIGHTBOX.i + 1} of ${LIGHTBOX.list.length}`; }
function step(d) { LIGHTBOX.i = (LIGHTBOX.i + d + LIGHTBOX.list.length) % LIGHTBOX.list.length; showLightbox(); }
function closeLightbox() { if (LIGHTBOX.el) LIGHTBOX.el.hidden = true; }
document.addEventListener("keydown", e => {
  if (!LIGHTBOX.el || LIGHTBOX.el.hidden) return;
  if (e.key === "Escape") closeLightbox(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
});
document.addEventListener("click", e => { const pin = e.target.closest(".pin"); if (pin) openLightbox(+pin.dataset.i); });

const blocksHTML = blocks => blocks && blocks.length ? `<div class="blocks">${blocks.map(b => `<section class="block">${blockHTML(b)}</section>`).join("")}</div>` : "";

/* ---------- Section view ---------- */
function crumbs(parts, backId) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><a class="back" href="#${backId}"><span aria-hidden="true">←</span> Back</a><a href="#home">${CLIENT.name}</a>${parts.map(p => `<span aria-hidden="true">/</span>${p.id ? `<a href="#${p.id}">${p.label}</a>` : `<span>${p.label}</span>`}`).join("")}</nav>`;
}
function renderSection(s) {
  const conn = s.id === HOME.id ? [] : connectedSections(s.id);
  app.innerHTML = `${crumbs([{ label: s.short }], "home")}
    <div class="layout"><div class="main">
      <h1 class="title">${s.title}</h1><p class="intro">${s.blurb}</p>
      ${s.blocks ? blocksHTML(s.blocks) + '<div style="height:44px"></div>' : ""}
      <div class="cards">${s.subs.map(u => `<a class="card" href="#${u.id}">${glyph(u.s)}<b>${u.title}</b><span>${u.note}</span><span class="st ${u.s}">${STATUS[u.s]}</span></a>`).join("")}</div>
    </div><aside class="side">${sideHTML(conn.length)}${legendHTML()}</aside></div>`;
  const nbs = [{ id: "home", label: "Home", kind: "part" }, ...s.subs.map(u => ({ id: u.id, label: u.short, kind: "sib" })), ...conn.map(c => ({ id: c.id, label: c.short, kind: "rel" }))];
  document.getElementById("ego").appendChild(egoMap(s.short, nbs));
}

/* ---------- Page view ---------- */
function renderPage(p) {
  const s = p.sec, idx = s.subs.findIndex(u => u.id === p.id);
  const prev = s.subs[idx - 1], next = s.subs[idx + 1];
  const rel = linkedPages(p.id).map(id => PAGE[id]);
  app.innerHTML = `${crumbs([{ id: s.id, label: s.short }, { label: p.short }], s.id)}
    <div class="layout${p.wide ? " wide" : ""}"><article class="main">
      <h1 class="title">${p.title}</h1>
      <div class="status">${glyph(p.s)}<span class="st ${p.s}">${STATUS[p.s]}</span></div>
      <p class="intro">${p.note}.</p>
      ${blocksHTML(p.blocks && p.blocks.length ? p.blocks : [{ type: "pending", heading: "Not started yet", text: "This page fills in as the work happens." }])}
      <nav class="pager" aria-label="More in ${s.short}">
        ${prev ? `<a href="#${prev.id}"><small>Previous</small><b>${prev.title}</b></a>` : `<a href="#${s.id}"><small>Back to</small><b>${s.title}</b></a>`}
        ${next ? `<a href="#${next.id}"><small>Next</small><b>${next.title}</b></a>` : ""}
      </nav>
    </article><aside class="side">${sideHTML(rel.length)}</aside></div>`;
  const nbs = [{ id: s.id, label: s.short, kind: "part" }, ...rel.map(r => ({ id: r.id, label: r.short, kind: "rel" })), ...s.subs.filter(u => u.id !== p.id).map(u => ({ id: u.id, label: u.short, kind: "sib" }))];
  document.getElementById("ego").appendChild(egoMap(p.short, nbs));
}

/* ---------- Router ---------- */
function route() {
  const id = location.hash.slice(1) || "home";
  if (SEC[id]) renderSection(SEC[id]);
  else if (PAGE[id]) renderPage(PAGE[id]);
  else renderHome();
  document.getElementById("hint").style.visibility = document.getElementById("orbit") ? "visible" : "hidden";
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
    <div class="cv-top"><span class="day-n">${d.n}</span><span class="day-kind"><i class="kdot k-${(d.kind || "").toLowerCase()}"></i>${d.kind || ""}${d.format ? ` · ${d.format}` : ""}</span><button type="button" class="theme cv-close">Close</button></div>
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
  const card = e.target.closest(".day[data-n]"); if (card) { calOpen(+card.dataset.n); return; }
  const f = e.target.closest(".chip-f");
  if (f) {
    const cal = f.closest(".cal");
    if (f.classList.contains("chip-hide")) f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") === "true" ? "false" : "true");
    else cal.querySelectorAll(".chip-f[data-kind]").forEach(b => b.classList.toggle("on", b === f));
    calRefresh(cal); return;
  }
  const c = e.target.closest(".copy .copybtn"); if (c) copyFrom(c, c.closest(".copy").querySelector(".copy-body"));
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && CAL.el && !CAL.el.hidden) calClose(); });

/* Start */
route();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (document.getElementById("orbit")) renderHome(); else route(); });
