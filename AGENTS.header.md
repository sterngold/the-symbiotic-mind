## 1. Repo identity

- **Repo:** `the-symbiotic-mind`
- **Purpose:** Static content site for *The Symbiotic Mind* — AI × HI (Artificial Intelligence × Human Intelligence) framed as a relationship-design problem. Essays, episodes, and author pages published at **symbiotic-mind.com**. A content/marketing site, not an application.
- **Owner:** @sterngold
- **Status:** active — **governed live site** (PR-based; owner approves + deploys).
- **Stack:** Eleventy 3 static-site generator (Node 20, ESM — `eleventy.config.mjs`). Markdown/Nunjucks content under `src/` + `content/`, Pagefind search, Satori + resvg OG-image generation (`scripts/`). Hosted on **Cloudflare Pages** (`functions/` + CF Git-integration build); no backend.

---

## 2. Build, test, lint

Static site — "build" = render the site. There is **no unit-test suite**; correctness is gated by the production build plus `scripts/validate-build.mjs`.

```bash
nvm use                       # Node 20 (.nvmrc)
npm install                   # devDependencies (Eleventy, Pagefind, Satori, …)
npm run serve                 # local dev server on :8080 (OG images + live reload)
npm run build                 # production build: OG images -> Eleventy -> Pagefind -> IndexNow ping
npm run build:no-search       # faster build, skips the Pagefind index
npm run clean                 # remove _site + generated OG images

# Verify this repo's AGENTS.md is in sync with its header + the shared canon
bash ~/anders-dotfiles/context-sync/assemble-agents.sh --check .   # 0 ok · 1 stale · 2 error
```

**Deploy:** Cloudflare Pages' own Git integration auto-builds every push — `main` → production (apex), PR branches → preview (`<slug>.the-symbiotic-mind.pages.dev`). `.github/workflows/deploy.yml` is a parallel shadow gate (same build chain). **Governed live site: branch + PR only — never push to `main` or trigger a production deploy autonomously.**

**Never commit** secrets, API keys, or the generated `_site/` output.

**Agents:** content lives in `src/` + `content/`; the build is defined by `package.json` scripts + `eleventy.config.mjs`.
