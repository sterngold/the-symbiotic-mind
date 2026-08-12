# The Symbiotic Mind

Publishing site for essays about AI × HI, relationship design, and the combined human-machine system.

## Shared editorial canon

For public-facing essays, post drafts, and voice-sensitive writing, use the canonical shared writing layer in `~/Code/my-projects/00_SYSTEM/anders-config/voice/VladVoice.md`. That file exists and is still the voice reference.

**Not yet ported to Anders2** (checked 2026-08-12). It lives in the retired `anders-config` tree — read it, don't edit it, until `/port` brings `VladVoice` across.

This line also used to name two task skills, `skills/writing-essay.md` and `skills/research-to-draft.md`. **Neither exists** anywhere in `anders-config`; the pointer was already dead in v1. Don't go looking for them.

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
