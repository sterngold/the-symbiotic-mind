# The Symbiotic Mind

Publishing site for essays about AI × HI, relationship design, and the combined human-machine system.

## Shared editorial canon

For public-facing essays, post drafts, and voice-sensitive writing, use **`/voice`** — the live
Anders2 skill at `~/.claude-anders2/skills/voice/`. It is the voice reference, and it has the
`linkedin` and `voice-check` skills folded into it, so there is nothing else to invoke.

Ported 2026-08-12 (1,463 v1 lines → 307). It supersedes this line's previous pointer at
`~/Code/my-projects/00_SYSTEM/anders-config/voice/VladVoice.md`, which survives read-only in the
archived monorepo and should not be read as current — the two have diverged, and `/voice` is the
one that is maintained.

## Repo-local writing rules

- Keep this file focused on local content structure, build flow, and publishing constraints.
- Do not duplicate shared voice rules here.
- Use repo-local conventions from `README.md` for frontmatter, file placement, author slugs, covers, tags, and build validation.

## Stack

- Eleventy 3 static site
- Markdown posts in `src/posts/`
- Layouts and partials in `src/_includes/`
- Global config in `src/_data/site.js`
- Author profiles in `src/_data/authors.js`
- CSS in `src/css/`
- Images in `src/images/`
- Build output in `_site/`
- Pagefind-powered static search at `/search/`

## Local dev

```bash
nvm use
npm install
npm run serve
```

## Build and deploy

`AGENTS.md` is the single source of truth for the build and publishing contract — read it there,
it is not repeated here.

Two Claude-only notes that are not in it:

⛔ **Never run `npm run build:publish` or `npm run publish:indexnow` in a sandbox or an agent
session.** By default `publish:indexnow` pings IndexNow, a live external side effect on a real
search index that reverting the commit does not undo. `scripts/indexnow-ping.mjs` does exit early
when `SKIP_INDEXNOW` is set — but that is an opt-out you have to remember, so treat the plain
commands as forbidden and use `npm run build` when you just need a build.

⚠ **`.github/workflows/deploy.yml` is not the deploy, despite its name.** The Cloudflare Pages Git
Integration builds and deploys every push; that workflow runs a parallel build as a shadow gate so
branch protection has a required check. Turning it off would not stop a deploy — changing the
Cloudflare project would.
