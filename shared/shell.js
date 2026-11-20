/* =====================================================================
   THE SHELL. The same sections and pages for every client, with plain
   descriptions of what each one holds. A client's content.js fills the
   pages in; it never needs to rename or describe them.
   ===================================================================== */
const SHELL = {
  home: {
    id: "about", short: "Brand Home", title: "Brand Home",
    blurb: "Where the brand comes from and what it stands for.",
    subs: [
      { id: "origin", short: "Origin Story", title: "Origin Story", note: "How the brand began and why it exists, told as your hero story",
        placeholder: [{ type: "herostory" }] },
      { id: "ethos", short: "Ethos", title: "Ethos & Values", note: "The beliefs behind every decision" },
      { id: "ethics", short: "Ethics", title: "Ethical Framework", note: "What the brand will and won't do" }
    ]
  },
  sections: [
    { id: "brand", short: "Brand Core", title: "Brand Core & Identity", blurb: "How the brand speaks, looks and shows up.", subs: [
      { id: "messaging", short: "Messaging", title: "Messaging", note: "Positioning, voice, words and stories", wide: true,
        placeholder: [{ type: "voicebook", parts: [
          { t: "Positioning", items: [
            { t: "Positioning Line", kind: "positioning", hint: "One sentence: who you help, with what, toward what, and without what." },
            { t: "Archetype", kind: "archetype", hint: "The brand's character, and the role it plays in the customer's life." },
            { t: "Brand Promise", kind: "promise", hint: "One sentence: what the brand delivers or stands for." },
            { t: "Beliefs", kind: "beliefs", hint: "What the brand believes is true, and the habits or norms it stands against." },
            { t: "Core Tenets", kind: "cards", hint: "Three to five principles the brand works by." }] },
          { t: "Voice", items: [
            { t: "Voice Pillars", kind: "pillars", hint: "Four or five personality traits, and how each one sounds." },
            { t: "We Are… But We're Never…", kind: "spectrum", hint: "Guardrails that keep the voice from drifting too far." },
            { t: "Tone by Setting", kind: "tone", hint: "How the voice shifts between public, personal and product moments." }] },
          { t: "Words", items: [
            { t: "Signature Terms", kind: "glossary", hint: "The brand's own names and phrases, and what each one means." },
            { t: "Words We Don't Use", kind: "avoid", hint: "Clichés and off-brand phrases to leave out." },
            { t: "Say This, Not That", kind: "swap", hint: "Common industry words, and the brand's own words for them." },
            { t: "Sensory Word Bank", kind: "bank", hint: "Textures, verbs and images that build the brand's world." }] },
          { t: "Stories", items: [
            { t: "Content Pillars", kind: "cards", hint: "The themes the brand returns to again and again." },
            { t: "Signature Metaphors", kind: "metaphors", hint: "Two or three images that make the big ideas easy to grasp." }] },
          { t: "Objections", items: [
            { t: "Price", kind: "objection", hint: "How the brand talks about value without discounting or apologizing." },
            { t: "Why Change", kind: "objection", hint: "What staying the same is really costing them." },
            { t: "Proof", kind: "objection", hint: "Why they can trust it: results, track record, reputation." },
            { t: "Boundaries & Policies", kind: "objection", hint: "How limits, policies and refunds are explained with care." }] }] }] },
      { id: "identity", short: "Brand Book", title: "Brand Book", note: "Logos, typography and color, with the rules for each", wide: true,
        placeholder: [{ type: "brandbook", groups: [
          { t: "Logos", kind: "logo", items: ["Primary Logo", "Secondary Logo", "Type-Only Logo", "Badge", "Icons", "Favicon", "Watermark", "Graphics"].map(t => ({ t })) },
          { t: "Typography", kind: "type", items: ["Primary", "Secondary", "Body"].map(t => ({ t })) },
          { t: "Color", kind: "color", items: [{ t: "Palette" }] }] }] },
      { id: "art", short: "Art & Photo", title: "Art & Photo Direction", note: "Visual mood, symbols and photo style" },
      { id: "library", short: "Content Library", title: "Content Library", note: "Finished brand assets, ready to use" },
      { id: "inspo", short: "Inspo", title: "Inspo", note: "Reference images for the brand's look and feel", wide: true, keep: true,
        /* Rule: once the Pinterest board is uploaded, Inspo is marked Ready (finished). */
        readyWhen: blocks => blocks.some(b => b.type === "moodboard" && (b.images || []).length),
        placeholder: [{ type: "board", frames: ["Image", "Image", "Image", "Image", "Image", "Image"] }] }
    ] },
    { id: "offers", short: "Offers", title: "Offers & Funnel Architecture", blurb: "Everything you sell, as one path: a free quick win, a first yes, then the full transformation.", ladder: true, subs: [
      { id: "freebie", short: "Freebie", title: "Freebie", note: "The free quick win that welcomes new people in", kind: "freebie", wide: true, placeholder: [{ type: "offer", kind: "freebie" }] },
      { id: "low", short: "Starter Offer", title: "Starter Offer", note: "The small first purchase, offered right after the freebie", kind: "starter", wide: true, placeholder: [{ type: "offer", kind: "starter" }] },
      { id: "high", short: "Signature Offer", title: "Signature Offer", note: "The full transformation, with the support around it", kind: "signature", wide: true, placeholder: [{ type: "offer", kind: "signature" }] }
    ] },
    { id: "audience", short: "Audience", title: "Target Audience", blurb: "Who the brand serves and where each person is.", subs: [
      { id: "research", short: "Research", title: "Audience Research", note: "Who they are, what they need, in their words",
        placeholder: [{ type: "compare", heading: "Before and after", cols: ["Before", "After"], rows: [["What they have", "", ""], ["How they feel", "", ""], ["Their average day", "", ""], ["How they see themselves", "", ""], ["How others see them", "", ""]] }],
        /* Built into every Research page: the awareness levels and the audience survey. */
        extra: [
          { type: "stages", heading: "The 5 levels of awareness", items: [
            { t: "Unaware", d: "They don't know they have a problem. Not worth marketing to yet." },
            { t: "Problem aware", d: "They know the problem, not the solutions. Your ideal client starts here." },
            { t: "Solution aware", d: "They know solutions exist but haven't chosen one. Your freebie brings them here." },
            { t: "Product aware", d: "They know your offer and wonder if it will work for them. Your starter offer's sales page moves them through this." },
            { t: "Most aware", d: "They're ready and need the specifics: price, what's inside, the guarantee." }] },
          { type: "list", heading: "Ask your audience", items: [
            { t: "What's the hardest part of this for you right now?", d: "Get the problem in their words." },
            { t: "Why is that a problem for you?", d: "The reason under the reason." },
            { t: "If it were solved, what would your life look like?", d: "The after, in their words." }] },
          { type: "text", heading: "How to run the survey", body: ["Send it once to your whole list and post it in your stories and community. Even five answers are worth it.", "Lift their exact phrases into your sales pages, emails and hooks. If they say they hate something, use \"hate\", not your softer word."] }
        ] },
      { id: "crm", short: "CRM", title: "CRM & Lead Tracker", note: "Contacts, leads and where each person is" }
    ] },
    { id: "marketing", short: "Marketing", title: "Marketing & Initiatives", blurb: "Where the brand shows up and what goes out when.", subs: [
      { id: "social", short: "Social Media", title: "Social Media", note: "Where you show up, and the plans for each platform", children: [
        { id: "platforms", short: "Platforms", title: "Platforms", note: "Where the brand shows up, and how your profile reads", placeholder: [{ type: "bio" }] },
        { id: "plan", short: "30-Day Ramp-Up", title: "30-Day Ramp-Up", note: "The first month of content, day by day", wide: true,
          placeholder: [{ type: "calendar", weeks: [
            { t: "Week 1", days: [1, 2, 3, 4, 5, 6, 7].map(n => ({ n })) },
            { t: "Week 2", days: [8, 9, 10, 11, 12, 13, 14].map(n => ({ n })) },
            { t: "Week 3", days: [15, 16, 17, 18, 19, 20, 21].map(n => ({ n })) },
            { t: "Week 4", days: [22, 23, 24, 25, 26, 27, 28].map(n => ({ n })) },
            { t: "Days 29–30", days: [29, 30].map(n => ({ n })) }] }] }
      ] },
      { id: "email", short: "Email", title: "Email", note: "Your list: the welcome, weekly nurture and sales emails" },
      { id: "ads", short: "Paid Ads", title: "Paid Advertising", note: "Ad strategy, budget and results" }
    ] },
    { id: "vision", short: "Vision", title: "Vision", blurb: "Where the business is headed, from the long view to the next step.", subs: [
      { id: "big-picture", short: "Big Picture", title: "Big Picture", note: "The three-to-five-year dream for the business" },
      { id: "this-year", short: "This Year", title: "This Year", note: "Revenue, client and launch targets for the year" },
      { id: "milestones", short: "Milestones", title: "Milestones", note: "The quarter-by-quarter roadmap and next steps" },
      { id: "capacity", short: "Capacity", title: "Capacity & Lifestyle", note: "Hours, pace and what the business fits around" }
    ] }
  ]
};

/* Build the hub from the shell plus this client's CONTENT.
   CONTENT[pageId] = { s, blocks } fills a page. CONTENT[sectionId] = { blocks }
   adds an intro to a section; { subs: [...] } replaces that section's pages. */
function buildFromShell(shell, content) {
  const fill = u => {
    const own = content[u.id] && ((content[u.id].blocks || []).length || content[u.id].subs);
    const page = { s: "planning", blocks: u.placeholder || [], ...u, ...(content[u.id] || {}), filled: !!own };
    if (u.readyWhen && u.readyWhen(page.blocks || [])) page.s = "ready";
    if (u.children) page.children = u.children.map(fill);
    if (u.extra) page.blocks = [...(page.blocks || []), ...u.extra];
    return page;
  };
  const place = (list, page) => { const i = list.findIndex(x => x.id === page.after); list.splice(i < 0 ? list.length : i + 1, 0, page); };
  const section = sec => {
    const c = content[sec.id] || {};
    const subs = (c.subs || sec.subs).map(u => c.subs ? { ...fill(u), filled: !!(u.blocks || []).length } : fill(u));
    /* CONTENT[sectionId].add = [{ id, short, title, note, after, parent?, s, blocks }] adds client-only pages,
       placed after the page named in "after" (inside the page named in "parent", when given). */
    (c.add || []).forEach(u => {
      const page = { s: "planning", ...u, filled: !!(u.blocks || []).length };
      const host = u.parent && subs.find(x => x.id === u.parent && x.children);
      place(host ? host.children : subs, page);
    });
    subs.forEach(rollUp);
    return { ...sec, blocks: c.blocks, subs };
  };
  return { home: section(shell.home), sections: shell.sections.map(section) };
}
/* A page that holds other pages takes its status from them unless content.js sets one. */
function rollUp(u) {
  if (!u.children || !u.children.length || (CONTENT[u.id] && CONTENT[u.id].s)) return u;
  const ss = u.children.map(c => c.s);
  u.s = ss.every(x => x === "ready") ? "ready" : ss.some(x => x !== "planning") ? "progress" : "planning";
  return u;
}

/* CLIENT VIEW: anything that doesn't exist yet is hidden from the client.
   A page marked draft: true in content.js keeps its content but stays hidden.
   Set CLIENT.showEmpty = true (the template does) to see every placeholder. */
const BRAND_HAS = i => !!(i.img || (i.variations || []).length || (i.applications || []).length || (i.rules || []).length || i.font || (i.swatches || []).length);
function clientBlocks(blocks) {
  return (blocks || []).map(b => {
    switch (b.type) {
      case "pending": case "board": return null;
      case "gallery": return b.folder ? b : null;
      case "swatches": return (b.items || []).length ? { ...b, empty: 0 } : null;
      case "calendar": {
        const weeks = b.weeks.map(w => ({ ...w, days: w.days.filter(d => d.hook) })).filter(w => w.days.length);
        return weeks.length ? { ...b, weeks } : null;
      }
      case "brandbook": {
        const groups = b.groups.map(g => ({ ...g, items: g.items.filter(BRAND_HAS) })).filter(g => g.items.length);
        return groups.length ? { ...b, groups, hideEmpty: true } : null;
      }
      case "voicebook": {
        const has = i => ["who", "solution", "want", "avoid", "line", "archetype", "role", "d", "text", "believe", "against", "items", "q", "a", "points"].some(k => Array.isArray(i[k]) ? i[k].length : i[k]);
        const parts = b.parts.map(p => ({ ...p, items: p.items.filter(has) })).filter(p => p.items.length);
        return parts.length ? { ...b, parts } : null;
      }
      case "offer": case "herostory": case "bio": return { ...b, hideEmpty: true };
      case "text": return (b.body || []).join("").trim() && !/^to come\.?$/i.test((b.body || []).join(" ").trim()) ? b : null;
      default: return b;
    }
  }).filter(Boolean);
}
function clientView(built) {
  const page = u => {
    if (u.draft) return null;
    if (u.children) {
      const kids = u.children.map(page).filter(Boolean);
      const blocks = u.filled ? clientBlocks(u.blocks) : [];
      return kids.length || blocks.length ? rollUp({ ...u, children: kids, blocks }) : null;
    }
    if (u.keep) return { ...u, blocks: u.filled ? clientBlocks(u.blocks) : [] };  /* Inspo always shows, so clients can add their own */
    if (!u.filled) return null;
    const blocks = clientBlocks(u.blocks);
    return blocks.length ? { ...u, blocks } : null;
  };
  const section = sec => ({ ...sec, blocks: sec.blocks ? clientBlocks(sec.blocks) : sec.blocks, subs: sec.subs.map(page).filter(Boolean) });
  return { home: section(built.home), sections: built.sections.map(section).filter(sec => sec.subs.length) };
}
const BUILT = (CLIENT.showEmpty ? x => x : clientView)(buildFromShell(SHELL, CONTENT));
const HOME = BUILT.home, SECTIONS = BUILT.sections;
