# The Symbiotic Mind

**AI × HI** — Artificial Intelligence × Human Intelligence is not a tool usage question. It is a relationship design problem.

The unit of value is the combined AI × HI system — and it belongs to neither alone.

> AI × HI is not about using AI better. It is about designing how we think and act with it.

Published at [symbiotic-mind.com](https://symbiotic-mind.com).

---

## Stack

Static site built with **[Eleventy 3](https://www.11ty.dev/)**.

- Markdown posts in `src/posts/` with frontmatter (title, date, author slug, description, tags, optional cover and video retell).
- Layouts and partials in `src/_includes/`.
- Global config in `src/_data/site.js`; author profiles in `src/_data/authors.js`.
- CSS in `src/css/` (the original `style.css`, unchanged).
- Images in `src/images/`.
- Build outputs to `_site/`.
- **Pagefind** indexes the built site for client-side, fully static search at `/search/`.

## Local dev

```bash
nvm use            # Node 20
npm install
npm run serve      # http://localhost:8080
```

## Build

```bash
npm run build
node scripts/validate-build.mjs   # also runs in CI
```

## What this build produces

| Output | Purpose |
|---|---|
| `_site/index.html`, `/posts/`, `/about/` | Pages, same look as before |
| `/posts/<slug>/` | Each post, with OG + Twitter + JSON-LD `Article` schema |
| `/authors/vlad/`, `/authors/milena/` | Author profile pages |
| `/tags/<tag>/`, `/tags/` | Tag pages and index |
| `/search/` | Static, JS-free crawl, Pagefind-powered search UI |
| `/feed.xml` | RSS 2.0 with **full** `<content:encoded>` for every item |
| `/feed.json` | JSON Feed 1.1 with full `content_html` |
| `/feed/vlad.xml`, `/feed/milena.xml` | Per-author feeds |
| `/sitemap.xml` | Real XML sitemap |
| `/robots.txt` | Plain text with `Sitemap:` directive |
| `/llms.txt` | [llms.txt](https://llmstxt.org/) for AI crawlers |
| `/_headers`, `/_redirects` | Cloudflare Pages config |

## Writing a new post

Create `src/posts/NNN-slug.md` (NNN is the next sequence number):

```markdown
---
title: "Post title"
date: 2026-06-01T07:30:00+02:00
author: vlad   # or milena
description: "One-sentence summary used in OG, RSS, and post lists."
tags:
  - relationship-design
cover:                     # optional
  src: "/images/NNN-cover.png"
  alt: "Alt text."
ogImage: "/images/NNN-cover.png"  # optional, defaults to /images/og-default.png
videoRetell:                # optional
  url: "https://www.canva.com/design/.../view?embed"
---

Body in markdown.
```

Open a PR → CI builds, validates, deploys on merge.

## Newsletter

Two providers are wired in. Edit `src/_data/site.js`:

```js
newsletter: {
  provider: "both", // "buttondown" | "listmonk" | "both"
  buttondown: { username: "symbioticmind", embedUrl: "..." },
  listmonk: { formActionUrl: "https://lists.example.com/subscription/form", listUuid: "..." }
}
```

- **Buttondown** (SaaS, free under 100 subs, RSS-to-email built in).
- **listmonk** (self-hosted, free, no ceiling). When you stand it up, fill in the `formActionUrl` and `listUuid` — both forms will then render on the home page and at the end of each post.

## Comments

Existing Giscus config in `src/_data/site.js`. No change needed — the partial renders on every post.

## Deploy

CI/CD: `.github/workflows/deploy.yml` builds, validates, and deploys to **Cloudflare Pages**. Add two repo secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Project name on Cloudflare: `symbiotic-mind`.
