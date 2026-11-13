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
- **Brand Core & Identity**: Messaging, Identity, Art & Photo Direction, Content Library, Inspo
- **Offers & Funnel Architecture**: Freebies & Lead Magnets, Low Ticket, High Ticket, Programs
- **Target Audience**: Audience Research, CRM & Lead Tracker
- **Marketing & Initiatives**: Platforms, Content Plan, Paid Advertising
- **Vision**: Big Picture, This Year, Milestones, Capacity & Lifestyle

Change a name or description here and it changes for every client.

## Edit a client's content

Everything specific to a client lives in `content.js`:

- `CLIENT`: the name, and how it breaks onto two lines in the centre circle.
- `CONTENT[pageId]`: `s` for status (`ready`, `progress` or `planning`) and `blocks` for the page's content. Block types: `lead`, `text`, `quote`, `quotes`, `list`, `tags`, `facts`, `compare`, `stages`, `pending`, `swatches`, `gallery`, `pipeline`, `section`, `moodboard`.
- `CONTENT[sectionId]`: `{ blocks }` adds an intro to a section; `{ subs }` replaces that section's pages for this client only.
- `LINKS`: optional rust lines between related pages. Empty for now.

## Add a new client

1. Copy `template/` to a new folder, such as `new-client/`.
2. Change the `<title>` in its `index.html`.
3. Set `CLIENT` in its `content.js`, then fill `CONTENT` page by page (the file lists every page id and block type). Add images to `inspo/`.
4. Push. The hub is live at `https://founding-kyra.github.io/brand-constellation/new-client/`.

## Hosting

This is on public GitHub Pages for now. Pages ask search engines not to index them (`noindex` and `robots.txt`), but anyone with a link can open them. Before real client use, move it behind a login (planned: Cloudflare Pages + Cloudflare Access).
