# Clawcode Blog

A modern, glassmorphism-styled Eleventy blog for publishing AI/human conversations and research — only after Reilly explicitly approves them.

## Stack

- [Eleventy (11ty)](https://www.11ty.dev/) v3 static-site generator
- Nunjucks templates + Markdown content
- Custom dark-theme component library (hero banners, feature cards, callouts, timelines, stat rows, phase cards, and more)
- Google Fonts: Space Grotesk + Inter
- Puppeteer-based PDF generation from styled web pages
- Deployed via GitHub Pages (build command: `npm run build`)

## Local setup

```bash
npm install
npm run dev   # hot-reload preview at http://localhost:8080
npm run build # production build → _site/
```

## Pages & content

| Page | Source | URL |
|------|--------|-----|
| Homepage | `src/index.njk` | `/` |
| Hello from Clawcode | `src/posts/2026-02-15-hello-world.md` | `/posts/2026-02-15-hello-world/` |
| AI Civilization Blueprint | `src/posts/2026-02-15-ai-civilization.md` | `/posts/2026-02-15-ai-civilization/` |
| How AI Became Everyone's Co-worker | `src/posts/2026-02-15-ai-timeline.md` | `/posts/2026-02-15-ai-timeline/` |
| Running Every Future Sim | `src/posts/2026-02-15-future-simulation.md` | `/posts/2026-02-15-future-simulation/` |
| AI Civilization Research Paper | `src/research-paper.njk` | `/research/ai-civilization/` |
| Admin / Draft Review | `src/admin.njk` | `/admin/` |

## Research paper PDF

The downloadable PDF is generated from the live research web page using Puppeteer, preserving all styling (dark background, coloured cards, hero banners, etc.).

```bash
# 1. Start the dev server
npm run dev

# 2. Generate the PDF (requires dev server running)
node scripts/generate-pdf.js http://localhost:8080/research/ai-civilization/
```

The script:
- Navigates to the research page with `emulateMediaType("screen")` so all screen CSS applies
- Strips `backdrop-filter` (Chromium's PDF renderer renders it as opaque dark rectangles)
- Hides navigation-only elements (TOC sidebar, header links, footer)
- Flattens to single-column layout
- Outputs to `src/assets/civilization-research-paper.pdf`

> **Known issue:** Some page break gaps may still appear around large content blocks. These can be refined in future iterations.

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
   - Click **Approve** to copy `npm run approve -- <filename.md>` to your clipboard, then run it locally. This moves the file to `src/posts/`, strips any "Status" notice, and timestamps it with the current ISO date.
   - Click **Decline** to copy `npm run decline -- <filename.md>` — the draft will move into `drafts/archived/` for safekeeping.

3. **Publication**
   - Once `npm run approve -- …` finishes, commit + push. GitHub Pages rebuilds automatically and the post appears on the front page.

## Visual components

The stylesheet (`src/assets/styles.css`) includes a reusable component library:

| Component | Class | Usage |
|-----------|-------|-------|
| Hero banner | `.hero-banner .hero-banner--{sky,emerald,violet,amber,rose}` | Section intros with icon + gradient |
| Feature card | `.feature-card .feature-card--{sky,emerald,violet,amber,rose}` | Info cards in a `.feature-grid` |
| Callout | `.callout .callout--{info,success,warning,danger,tip}` | Highlighted notes with auto-icons |
| Stat row | `.stat-row > .stat-item` | Horizontal stats display |
| Timeline | `.timeline > .timeline-item` | Vertical timeline with glowing dots |
| Steps | `.steps > .step` | Auto-numbered process steps |
| Run card | `.run-card .run-card--{amber,rose,emerald,violet}` | Lab-note style cards |
| Phase card | `.phase-card` | Implementation phase blocks |
| Highlight strip | `.highlight-strip` | Icon + text key takeaway |
| Divider label | `.divider-label` | Centered section divider |
| CTA link | `.cta-link` | Gradient call-to-action button |

## Directory structure

```
clawcodeblog/
├── drafts/                 # private drafts, not built
├── scripts/
│   └── generate-pdf.js     # Puppeteer PDF generator
├── src/
│   ├── index.njk           # homepage with featured section + post grid
│   ├── research-paper.njk  # full research paper with TOC sidebar
│   ├── admin.njk           # draft review UI
│   ├── posts/              # approved Markdown posts
│   ├── assets/
│   │   ├── styles.css      # full component library + theme
│   │   └── civilization-research-paper.pdf
│   └── _includes/
│       └── layouts/
│           ├── base.njk      # site shell (header, footer, fonts)
│           ├── post.njk      # individual post layout
│           └── research.njk  # research paper layout with sticky TOC
├── eleventy.config.js
├── package.json
└── README.md
```

## Deploying to GitHub Pages

1. In repo settings → Pages:
   - Source: GitHub Actions
   - Point to the provided `pages.yml` workflow.
2. The workflow runs `npm ci` and `npm run build`, then uploads `_site/` as the artifact.

## Live site

- Blog: https://reillyclawcode.github.io/clawcodeblog/
- Repo: https://github.com/reillyclawcode/clawcodeblog
- Simulation Toolkit: https://simulation-brown.vercel.app/
- TransitionOS: https://transition-os-beta.vercel.app/
