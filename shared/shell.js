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
      { id: "origin", short: "Origin Story", title: "Origin Story", note: "How the brand began and why it exists" },
      { id: "ethos", short: "Ethos", title: "Ethos & Values", note: "The beliefs behind every decision" },
      { id: "ethics", short: "Ethics", title: "Ethical Framework", note: "What the brand will and won't do" }
    ]
  },
  sections: [
    { id: "brand", short: "Brand Core", title: "Brand Core & Identity", blurb: "How the brand speaks, looks and shows up.", subs: [
      { id: "messaging", short: "Messaging", title: "Messaging", note: "Positioning, voice and key phrases" },
      { id: "identity", short: "Identity", title: "Identity", note: "Brand guidelines and logo files" },
      { id: "art", short: "Art & Photo", title: "Art & Photo Direction", note: "Visual mood, symbols and photo style" },
      { id: "library", short: "Content Library", title: "Content Library", note: "Finished brand assets, ready to use" },
      { id: "inspo", short: "Inspo", title: "Inspo", note: "Reference images and colors", wide: true }
    ] },
    { id: "offers", short: "Offers", title: "Offers & Funnel Architecture", blurb: "Everything the brand sells, from free to premium.", subs: [
      { id: "freebie", short: "Freebies", title: "Freebies & Lead Magnets", note: "Free offers that welcome new people in" },
      { id: "low", short: "Low Ticket", title: "Low Ticket", note: "Small, easy first purchases" },
      { id: "high", short: "High Ticket", title: "High Ticket", note: "Premium offers and signature work" },
      { id: "programs", short: "Programs", title: "Programs", note: "Courses, coaching and group containers" }
    ] },
    { id: "audience", short: "Audience", title: "Target Audience", blurb: "Who the brand serves and where each person is.", subs: [
      { id: "research", short: "Research", title: "Audience Research", note: "Who they are, what they need, in their words" },
      { id: "crm", short: "CRM", title: "CRM & Lead Tracker", note: "Contacts, leads and where each person is" }
    ] },
    { id: "marketing", short: "Marketing", title: "Marketing & Initiatives", blurb: "Where the brand shows up and what goes out when.", subs: [
      { id: "platforms", short: "Platforms", title: "Platforms", note: "Where the brand shows up and why" },
      { id: "plan", short: "Content Plan", title: "Content Plan", note: "Content pillars and the posting calendar" },
      { id: "ads", short: "Paid Ads", title: "Paid Advertising", note: "Ad strategy, budget and results" }
    ] },
    { id: "vision", short: "Vision", title: "Vision", blurb: "Where the business is headed and what it's building toward.", subs: [] }
  ]
};

/* Build the hub from the shell plus this client's CONTENT.
   CONTENT[pageId] = { s, blocks } fills a page. CONTENT[sectionId] = { blocks }
   adds an intro to a section; { subs: [...] } replaces that section's pages. */
function buildFromShell(shell, content) {
  const fill = u => ({ s: "planning", blocks: [], ...u, ...(content[u.id] || {}) });
  const section = sec => {
    const c = content[sec.id] || {};
    return { ...sec, blocks: c.blocks, subs: (c.subs || sec.subs).map(fill) };
  };
  return { home: section(shell.home), sections: shell.sections.map(section) };
}
const BUILT = buildFromShell(SHELL, CONTENT);
const HOME = BUILT.home, SECTIONS = BUILT.sections;
