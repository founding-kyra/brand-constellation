/* =====================================================================
   CLIENT CONTENT: BLANK TEMPLATE. Copy this whole folder for a new client.
   Section and page names come from shared/shell.js. Fill pages here by id:

   Page ids
     Brand Home      origin, ethos, ethics
     Brand Core      messaging, identity, art, library, inspo
     Offers          freebie, low, high, programs
     Audience        research, crm
     Marketing       platforms, plan, ads
     Vision          big-picture, this-year, milestones, capacity

   Write every word TO the client ("you", "your"), never about them ("she", "the founder", their name).
   Exceptions: scripts the client says to their audience, and descriptions of their ideal customer.

   Each page: { s: "ready" | "progress" | "planning", blocks: [ ... ] }  (add draft: true to hide it from the client)
   Pages left out show "Not started yet".
   Extra client-only page in a section: CONTENT.marketing = { add: [{ id: "tiktok-launch", short: "TikTok Launch",
     title: "14-Day TikTok Launch", note: "One line", after: "plan", wide: true, s: "progress", blocks: [ ... ] }] }
   Calendar posts can carry label: "1A" (shown instead of n) and aria: "Day 1, post 1"; keep every n unique.

   Block examples
     { type: "lead", text: "One strong opening sentence." }
     { type: "text", heading: "Heading", body: ["Paragraph one.", "Paragraph two."] }
     { type: "quote", text: "A line in their words.", by: "Who said it" }
     { type: "quotes", heading: "In their words", items: ["Quote one", "Quote two"] }
     { type: "list", heading: "Heading", items: [{ t: "Title", d: "Description" }] }
     { type: "tags", heading: "Heading", items: ["Word", "Phrase"] }
     { type: "facts", items: [{ k: "Price", v: "$27" }, { k: "Format", v: "PDF" }] }
     { type: "compare", heading: "Heading", cols: ["Before", "After"], rows: [["Label", "this", "that"]] }
     { type: "stages", heading: "Heading", items: [{ t: "Step", d: "What happens" }] }
     { type: "pending", heading: "Waiting on", text: "Why it's not done.", needs: ["Item", "Item"] }
     { type: "swatches", heading: "Colors", items: [{ name: "Name", hex: "#000000" }], empty: 2 }
     { type: "gallery", heading: "Photos", folder: "https://drive.google.com/...", tiles: ["Label", "Label"] }
     { type: "section", heading: "A divider inside a long page" }
     { type: "calendar", weeks: [{ t: "Week 1 · Theme", d: "Goal", days: [{ n: 1, kind: "Profile", format: "Long-form", hook: "Post hook", note: "What it covers", cta: "Call to action", text: "Optional full script\nshown when the card opens" }] }] }
     { type: "copy", heading: "Copy-ready posts", items: [{ t: "Post title", meta: "Day 1", text: "Line one\nLine two" }] }
     { type: "brandbook", groups: [
         { t: "Logos", kind: "logo", items: [{ t: "Primary Logo", img: "brand/primary.png", bg: "#E6E0D6", rules: ["Rule"],
           variations: [{ label: "On ivory", img: "brand/primary-ivory.png", bg: "#E6E0D6" }], applications: [{ label: "Website", img: "brand/web.png" }] }] },
         { t: "Typography", kind: "type", items: [{ t: "Primary", font: "Font name", role: "Headlines", img: "brand/type-primary.png", rules: ["Rule"] }] },
         { t: "Color", kind: "color", items: [{ t: "Palette", swatches: [{ name: "Ivory", hex: "#E6E0D6", role: "Backgrounds" }], rules: ["Rule"] }] }] }
     { type: "voicebook", parts: [   (the Messaging page; copy the part and item titles from shared/shell.js)
         { t: "Positioning", items: [
           { t: "Archetype", kind: "archetype", archetype: "The Creator", role: "Sanctuary", d: "One line on why" },
           { t: "Brand Promise", kind: "promise", text: "One sentence." },
           { t: "Beliefs", kind: "beliefs", believe: "What the brand believes.", against: ["Norm it opposes"] },
           { t: "Core Tenets", kind: "cards", items: [{ t: "Tenet", d: "What it means" }] }] },
         { t: "Voice", items: [
           { t: "Voice Pillars", kind: "pillars", items: [{ t: "Grounded", d: "How it sounds", sounds: "An example line" }] },
           { t: "We Are… But We're Never…", kind: "spectrum", items: [{ is: "Direct", not: "abrasive" }] },
           { t: "Tone by Setting", kind: "tone", items: [{ t: "Public", where: "Social, ads", d: "How it shifts", ex: "Example", level: 2 }] }] },
         { t: "Words", items: [
           { t: "Signature Terms", kind: "glossary", items: [{ t: "Term", d: "Meaning", use: "Usage note" }] },
           { t: "Words We Don't Use", kind: "avoid", items: ["Word"] },
           { t: "Say This, Not That", kind: "swap", items: [{ not: "Industry word", say: "Brand word" }] },
           { t: "Sensory Word Bank", kind: "bank", items: ["Word"] }] },
         { t: "Stories", items: [
           { t: "Content Pillars", kind: "cards", items: [{ t: "Pillar", d: "What it covers" }] },
           { t: "Signature Metaphors", kind: "metaphors", items: [{ t: "The metaphor", d: "What it makes clear" }] }] },
         { t: "Objections", items: [
           { t: "Price", kind: "objection", q: "What they might think", a: "How we answer", points: ["Point"] }] }] }
       (items left out or empty are hidden from the client)
     { type: "moodboard", path: "inspo/brand-", images: [[720, 900], [720, 720]] }
       (images are [width, height] for inspo/brand-01.jpg, inspo/brand-02.jpg, ...)
   ===================================================================== */
const CLIENT = {
  name: "Brand Name",
  sunLines: ["BRAND", "NAME"],
  showEmpty: true   /* the template shows every placeholder; client hubs hide what isn't made yet */
};

const CONTENT = {
};

/* Light connections between related pages. Add pairs like ["research", "messaging"]. */
const LINKS = [];
