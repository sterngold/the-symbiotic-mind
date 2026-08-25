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
- CSS in `src/css/style.css`.
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

`npm run build` is intentionally side-effect-free. Production uses `npm run build:publish`,
which builds **and** sends one IndexNow ping — never run `publish:indexnow` after it, or the
ping goes twice.

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

**Start the session here, not in the prose repo.** The drafting repo is `~/claude2/symbiotic-mind`;
publishing happens from a session whose working directory is *this* one. That is not a preference:
the publish gate's `review=ok` marker keys to the repo of the session's working directory, so a
review run from the drafting repo can never satisfy the gate here, and `cd` does not persist
between tool calls. Learned publishing 014, 2026-08-25.

```bash
git fetch origin && git checkout -b <branch> origin/main
```

Branch from a **freshly fetched** `origin/main`. A stale local `main` makes a reviewer diff against
a baseline the PR never touched — on 014 that produced a review of workflow files the PR did not
contain.

Then write `src/posts/NNN-slug.md` (NNN is the next sequence number) by hand, from the piece's
`article.md` and `_deploy-frontmatter.md` in the drafting repo. Those two files plus the cover and
the image prompts are the only things that cross between the repos.

### Frontmatter

Counts are against the 14 live posts, checked 2026-08-25 — this block used to document
`videoRetell`, which **no post has ever used**, while omitting four fields that every post carries.

```markdown
---
title: "Post title"                       # 14/14
theme: "relationship"                     # 14/14  relationship | identity | memory — drives /themes/
seoTitle: "The query this page bids on"   # 14/14  the search-facing title; may differ from `title`
date: 2026-06-01T07:30:00+02:00           # 14/14
author: vlad                              # 14/14  vlad | milena
description: "One sentence. OG, RSS, and printed UNBOUNDED into the post cards on / and /posts/,
  so an over-long one visibly stretches its card. Corpus median ~274 chars; Google cuts ~155, so
  put the payoff first."                  # 14/14
subscribeCta: "One line under the post."  # 14/14
related:                                  # 14/14  cross-strand is normal — 12 of 12 do it
  - "011-the-asymmetry-of-creation"
concepts:                                 # 12/14  what the essay TOUCHES, not where it shelves
  - "relationship-design"
tags:                                     # 14/14
  - relationship-design
deck: ""                                  # 13/14  standfirst under the title; usually empty
cover:
  src: "/images/NNN-cover.png"
  alt: "Written against the RENDERED image, never the prompt. Corpus median ~376 chars."
ogImage: "/images/NNN-cover.png"          # defaults to /images/og-default.png
youtubeId: "abc123"                       # 13/14  the video retell
videoPending: true                        #  1/14  use INSTEAD of youtubeId when the video is not
                                          #        ready; renders the placeholder. Swap it promptly
                                          #        — post 009 sat on this flag for 3.5 weeks.
---

Body in markdown.
```

### Before opening the PR

```bash
python3 ~/claude2/symbiotic-mind/scripts/check-deploy.py src/posts/NNN-slug.md
npm run build && node scripts/validate-build.mjs && git diff --check
```

`check-deploy.py` asserts the drafting notes did not travel from the piece folder, rather than
leaving it to the eye — post 010 nearly shipped with its internal comment attached. `0` clean ·
`1` something internal would ship · `2` could-not-run, **which is never a pass**.

Open a PR → GitHub Actions builds and validates (the `ci` check); Cloudflare Pages builds a
preview. **Merging to `main` triggers the production Cloudflare build** — CI does not deploy.

⚠ Any `.md` in `src/posts/` publishes on the next build. There is no draft flag and no date
filter, so a future-dated file ships immediately. Keep unfinished work in `content/posts/`.
**Nothing here relies on `date:` to hold a post back.**

⚠ Verify against **production**, not the merge. On 014 the live URL took three polls after the
merge before it served the new state.

## Newsletter

The live provider is **Substack** — <https://thesymbioticmind.substack.com> — set since
2026-06-11. Three providers are wired; `newsletter.provider` in `src/_data/site.js` selects one,
and `src/_includes/partials/newsletter.njk` renders whichever is named.

```js
newsletter: {
  provider: "substack", // "substack" | "buttondown" | "listmonk" | "both"
  substack: { publicationUrl: "https://thesymbioticmind.substack.com" },
  ...
}
```

Substack was chosen for the network effects — recommendations, Notes, restacks. **Buttondown**
(handle `sterngold`, 0 subscribers, nothing migrated) and **listmonk** are retained as dormant
config for a future sovereign move. See `docs/newsletter.md`.

## Comments

Existing Giscus config in `src/_data/site.js`. No change needed — the partial renders on every post.

## Deploy

CI/CD: `.github/workflows/deploy.yml` builds and validates the site as a GitHub
check. Cloudflare Pages owns production and preview deploys through its Git
integration. Use `npm run build:publish && node scripts/validate-build.mjs` as
the production Cloudflare build command when IndexNow pings should run.

Project name on Cloudflare: `the-symbiotic-mind` — the project that serves
`the-symbiotic-mind.pages.dev`, the same hostname `functions/_middleware.js:19` hardcodes.
(This line read `symbiotic-mind` until 2026-08-13; it was the only place in the repo naming
the project wrongly.)
