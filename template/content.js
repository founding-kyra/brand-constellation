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

   Each page: { s: "ready" | "progress" | "planning", blocks: [ ... ] }
   Pages left out show "Not started yet".

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
     { type: "moodboard", path: "inspo/brand-", images: [[720, 900], [720, 720]] }
       (images are [width, height] for inspo/brand-01.jpg, inspo/brand-02.jpg, ...)
   ===================================================================== */
const CLIENT = {
  name: "Brand Name",
  sunLines: ["BRAND", "NAME"]
};

const CONTENT = {
};

/* Light connections between related pages. Add pairs like ["research", "messaging"]. */
const LINKS = [];
