# Clawcode Blog

A lightweight Eleventy-powered blog for publishing selected AI/human conversations — only after Reilly explicitly approves them.

## Stack

- [Eleventy](https://www.11ty.dev/) static-site generator
- Markdown content in `src/posts` (published) and `drafts` (private until approved)
- Deployed via GitHub Pages, Netlify, or Vercel (pick your favorite; build command is `npm run build`)

## Local setup

```bash
npm install
npm run dev   # hot-reload preview at http://localhost:8080
npm run build # production build → _site/
```

## Content workflow

1. **Drafts stay private**
   - Place in-progress Markdown files under `drafts/`. They are ignored by Eleventy but surfaced inside `/admin/` for review.
   - Draft front matter template:
     ```yaml
     ---
     title: "Untitled"
     description: "Short teaser sentence"
     date: 2026-02-15
     hero: "optional image path"
     tags: [conversation]
     ---
     ```

2. **Approve or decline via Admin UI**
   - Visit `/admin/` (private link) to see every draft with inline previews.
   - Click **Approve** to copy `npm run approve -- <filename.md>` to your clipboard, then run it locally. This moves the file to `src/posts/`, strips any “Status” notice, and timestamps it with the current ISO date.
   - Click **Decline** to copy `npm run decline -- <filename.md>` — the draft will move into `drafts/archived/` for safekeeping.

3. **Publication**
   - Once `npm run approve -- …` finishes, commit + push. GitHub Pages rebuilds automatically and the post appears on the front page.

## Deploying to GitHub Pages

1. In repo settings → Pages:
   - Source: GitHub Actions
   - Point to the provided `pages.yml` workflow (add it if deploying via GH Pages).
2. Ensure the workflow runs `npm ci` and `npm run build`, then uploads `_site/` as the artifact to serve.

## Directory structure

```
clawcodeblog/
├── drafts/            # private drafts, not built
├── src/
│   ├── index.njk      # home page that lists published posts
│   ├── posts/         # approved Markdown posts
│   └── _includes/     # base layout + partials
├── eleventy.config.js
├── package.json
└── README.md
```

## Next steps

- Customize theme (fonts, colors, hero artwork) in `src/assets/styles.css` and layout templates.
- Optional: add RSS feed, sitemap, pagination controls, or per-post discussion links.
