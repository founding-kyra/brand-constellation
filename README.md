# Brand Constellation

Kyra Aulani's client brand hubs. Each client gets one folder; the design is shared.

```
shared/                 The Brand Constellation design (Kyra's brand). Same for every client.
  shell.js              The standard sections and pages, with what each one holds
  constellation.css     Colors, fonts, layout, light and dark mode
  constellation.js      The orbit map, pages, search, Back button, image viewer
  kyra-logo.png         Header logo
template/               Blank starting point: copy this for each new client
resonant-living/        One client
  index.html            Page wrapper (only the <title> changes per client)
  content.js            This client's content, filling the pages from shell.js
  inspo/                Images for the Inspo board
```

## The shell

`shared/shell.js` holds the sections every client gets, with plain descriptions:

- **Brand Home** (centre): Origin Story, Ethos & Values, Ethical Framework
- **Brand Core & Identity**: Messaging (positioning, voice, words, stories, objections), Brand Book (logos, typography, color), Art & Photo Direction, Content Library, Inspo
- **Offers & Funnel Architecture**: Freebies & Lead Magnets, Low Ticket, High Ticket, Programs
- **Target Audience**: Audience Research, CRM & Lead Tracker
- **Marketing & Initiatives**: Platforms, 30-Day Ramp-Up (a day-by-day calendar), Paid Advertising
- **Vision**: Big Picture, This Year, Milestones, Capacity & Lifestyle

Change a name or description here and it changes for every client.

## Edit a client's content

Everything specific to a client lives in `content.js`:

- `CLIENT`: the name, and how it breaks onto two lines in the centre circle.
- `CONTENT[pageId]`: `s` for status (`ready`, `progress` or `planning`) and `blocks` for the page's content. Block types: `lead`, `text`, `quote`, `quotes`, `list`, `tags`, `facts`, `compare`, `stages`, `pending`, `swatches`, `gallery`, `pipeline`, `section`, `moodboard`.
- `CONTENT[sectionId]`: `{ blocks }` adds an intro to a section; `{ subs }` replaces that section's pages for this client only.
- `LINKS`: optional rust lines between related pages. Empty for now.

## What clients see

**Write to the client.** Every hub is read by the client, so its copy talks to them: "you" and "your", never "she", "her", "the founder" or their name. The exceptions are scripts and hooks the client says to their own audience, and descriptions of the client's ideal customer ("Who she is").

Client hubs hide anything that doesn't exist yet: pages with no content, empty sections, "to come" placeholders, empty Brand Book and Messaging parts, empty calendar days and "still to do" boxes. Mark a page `draft: true` in `content.js` to keep its content but hide it. The template sets `CLIENT.showEmpty = true`, so it shows every placeholder.

## Add a new client

1. Copy `template/` to a new folder, such as `new-client/`.
2. Change the `<title>` in its `index.html`.
3. Set `CLIENT` in its `content.js` and delete the `showEmpty` line, then fill `CONTENT` page by page (the file lists every page id and block type). Add images to `inspo/`.
4. Push. The hub is live at `https://founding-kyra.github.io/brand-constellation/new-client/`.

## Hosting

This is on public GitHub Pages for now. Pages ask search engines not to index them (`noindex` and `robots.txt`), but anyone with a link can open them. Before real client use, move it behind a login (planned: Cloudflare Pages + Cloudflare Access).

## Client uploads (Add inspo)

The Inspo page has a **+ Add inspo** button. Clients pick a photo or screenshot, add an optional note and enter their passcode once; the image appears under "Saved by you". Tap a saved image, then Remove twice, to delete it.

- Upload service: Cloudflare Pages project `brand-constellation` (functions in `functions/api/`), images in the D1 database `brand-constellation` (table in `schema.sql`).
- Each client's passcode is a Cloudflare secret named after their folder, for example `PASS_RESONANT_LIVING`. `PASS_ADMIN` works on every hub.
- Set a passcode for a new client (run from this folder):
  `npx wrangler pages secret put PASS_NEW_CLIENT --project-name brand-constellation`, then deploy with
  `npx wrangler pages deploy . --project-name brand-constellation --branch main`.
