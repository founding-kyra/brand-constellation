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
      { id: "identity", short: "Brand Book", title: "Brand Book", note: "Logos, typography and color, with the rules for each", wide: true,
        placeholder: [{ type: "brandbook", groups: [
          { t: "Logos", kind: "logo", items: ["Primary Logo", "Secondary Logo", "Type-Only Logo", "Badge", "Icons", "Favicon", "Watermark", "Graphics"].map(t => ({ t })) },
          { t: "Typography", kind: "type", items: ["Primary", "Secondary", "Body"].map(t => ({ t })) },
          { t: "Color", kind: "color", items: [{ t: "Palette" }] }] }] },
      { id: "art", short: "Art & Photo", title: "Art & Photo Direction", note: "Visual mood, symbols and photo style" },
      { id: "library", short: "Content Library", title: "Content Library", note: "Finished brand assets, ready to use" },
      { id: "inspo", short: "Inspo", title: "Inspo", note: "Reference images for the brand's look and feel", wide: true,
        placeholder: [{ type: "board", frames: ["Image", "Image", "Image", "Image", "Image", "Image"] }] }
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
      { id: "plan", short: "30-Day Ramp-Up", title: "30-Day Ramp-Up", note: "The first month of content, day by day", wide: true,
        placeholder: [{ type: "calendar", weeks: [
          { t: "Week 1", days: [1, 2, 3, 4, 5, 6, 7].map(n => ({ n })) },
          { t: "Week 2", days: [8, 9, 10, 11, 12, 13, 14].map(n => ({ n })) },
          { t: "Week 3", days: [15, 16, 17, 18, 19, 20, 21].map(n => ({ n })) },
          { t: "Week 4", days: [22, 23, 24, 25, 26, 27, 28].map(n => ({ n })) },
          { t: "Days 29–30", days: [29, 30].map(n => ({ n })) }] }] },
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
  const fill = u => ({ s: "planning", blocks: u.placeholder || [], ...u, ...(content[u.id] || {}) });
  const section = sec => {
    const c = content[sec.id] || {};
    return { ...sec, blocks: c.blocks, subs: (c.subs || sec.subs).map(fill) };
  };
  return { home: section(shell.home), sections: shell.sections.map(section) };
}
const BUILT = buildFromShell(SHELL, CONTENT);
const HOME = BUILT.home, SECTIONS = BUILT.sections;
