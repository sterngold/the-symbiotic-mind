## 1. Repo identity

- **Repo:** `the-symbiotic-mind`
- **Purpose:** Static content site for *The Symbiotic Mind* — AI × HI (Artificial Intelligence × Human Intelligence) framed as a relationship-design problem. Essays, episodes, and author pages published at **symbiotic-mind.com**. A content/marketing site, not an application.
- **Owner:** @sterngold
- **Status:** active — **governed live site** (PR-based; owner approves + deploys).
- **Stack:** Eleventy 3 static-site generator (Node 20, ESM — `eleventy.config.mjs`). Markdown/Nunjucks content under `src/` + `content/`, Pagefind search, Satori + resvg OG-image generation (`scripts/`). Hosted on **Cloudflare Pages** (`functions/` + CF Git-integration build); no backend.

---

## 2. Build, test, lint

Static site — "build" = render the site. There is **no unit-test suite**; correctness is gated by the production build plus `scripts/validate-build.mjs`.

**Setup:** `nvm use && npm ci --ignore-scripts`.

**Blocking pre-PR validation:**

```bash
npm run build
node scripts/validate-build.mjs
git diff --check
```

Local development may use `npm run serve`, `npm run build:no-search`, and `npm run clean`.

**Owner-only publishing** (not a pre-PR gate; has production side effects):

```bash
npm run build:publish
```

`npm run build:publish` already runs the build and sends one IndexNow notification. `npm run publish:indexnow` is the standalone notification command for an already-built current site; never run both sequentially.

**Deploy:** Cloudflare Pages' own Git integration auto-builds every push — `main` → production (apex), PR branches → preview (`<slug>.the-symbiotic-mind.pages.dev`). `.github/workflows/deploy.yml` is a parallel shadow gate (same build chain). **Governed live site: branch + PR only — never push to `main` or trigger a production deploy autonomously.**

**Never commit** secrets, API keys, or the generated `_site/` output.

**Agents:** content lives in `src/` + `content/`; always validate the generated site after building, and never substitute publishing for validation.
