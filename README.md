# Brand Constellation

Kyra Aulani's client brand hubs. Each client gets one folder; the design is shared.

```
shared/                 The Brand Constellation design (Kyra's brand). Same for every client.
  constellation.css     Colors, fonts, layout, light and dark mode
  constellation.js      The orbit map, pages, Back button, image viewer
  kyra-logo.png         Header logo
resonant-living/        One client
  index.html            Page shell (only the <title> changes per client)
  client.js             All of this client's content: sections, pages, statuses
  inspo/                Images for the Inspo board
```

## Edit a client's content

Everything a client sees comes from `client.js`:

- `SECTIONS`: the five orbits around the centre, each with its pages (`subs`).
- Each page has `s` for its status: `ready`, `progress` or `planning`.
- Each page's `blocks` are its content. Block types: `lead`, `text`, `quote`, `quotes`, `list`, `tags`, `facts`, `compare`, `stages`, `pending`, `swatches`, `gallery`, `pipeline`, `section`, `moodboard`.
- `LINKS`: optional rust lines between related pages. Empty for now.

## Add a new client

1. Copy `resonant-living/` to a new folder, such as `new-client/`.
2. Change the `<title>` in its `index.html`.
3. Replace the content in its `client.js`, and swap the images in `inspo/`.
4. Push. The hub is live at `https://founding-kyra.github.io/brand-constellation/new-client/`.

## Hosting

This is on public GitHub Pages for now. Pages ask search engines not to index them (`noindex` and `robots.txt`), but anyone with a link can open them. Before real client use, move it behind a login (planned: Cloudflare Pages + Cloudflare Access).
