# The Symbiotic Mind

Publishing site for essays about AI × HI, relationship design, and the combined human-machine system.

## Shared editorial canon

For public-facing essays, post drafts, and voice-sensitive writing, use the canonical shared writing layer in `~/Code/my-projects/00_SYSTEM/anders-config/voice/VladVoice.md` plus the task skills in `~/Code/my-projects/00_SYSTEM/anders-config/skills/writing-essay.md` and `~/Code/my-projects/00_SYSTEM/anders-config/skills/research-to-draft.md`.

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
