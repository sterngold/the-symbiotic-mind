# AGENTS.md

Conventions for **every** human and AI agent working in this repo.
Model-agnostic by design — read once, applies whether you're Claude Code, Codex, Cursor, Aider, Gemini, Continue, Cline, or a human.

This file is the **single source of truth** for repo conventions.
`CLAUDE.md`, `.cursorrules`, `.aider.conf.yml` are pointers — do not duplicate content into them.

<!-- ASSEMBLY NOTE (updated 2026-08-23). This file was assembled once; it is
     hand-maintained now. EDIT IT DIRECTLY.

     ⛔ Do NOT run assemble-agents.sh. The `anders-dotfiles` repo it lives in was
     archived 2026-08-17 and running its scripts is barred — the command the old
     banner printed here would rebuild this file from a canon that stopped being
     maintained, silently reverting anything written since.

     Source split, for reference only: §1–2 also exist in AGENTS.header.md.
     Nothing reassembles it, so an edit made only there does not reach this file.
     Change this file; mirror into the header by hand if you want them to agree.
     §3–13 live directly here. -->

---

## 1. Repo identity

- **Repo:** `the-symbiotic-mind`
- **Purpose:** Static content site for *The Symbiotic Mind* — AI × HI (Artificial Intelligence × Human Intelligence) framed as a relationship-design problem. Essays, episodes, and author pages published at **symbiotic-mind.com**. A content/marketing site, not an application.
- **Owner:** @sterngold
- **Status:** active — **governed live site** (PR-based; owner approves and merges — merging to `main` auto-deploys via Cloudflare Pages, so a merge IS a production deploy).
- **Stack:** Eleventy 3 static-site generator (Node 20, ESM — `eleventy.config.mjs`). Published Markdown/Nunjucks content under `src/` — Eleventy's input dir is `src` only, so nothing in `content/` is ever built (it holds unbuilt drafts and recording briefs). Pagefind search, Satori + resvg OG-image generation (`scripts/`). Hosted on **Cloudflare Pages** (`functions/` + CF Git-integration build); no backend.

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

⛔ **Some files in `src/posts/` have an upstream source. Check before you edit one.**
Posts 013 and 014 have a source folder in the private prose repo
(`~/claude2/symbiotic-mind/posts/<date>_<working-title>/`) holding `article.md` +
`_deploy-frontmatter.md`. The folder name carries the date and a *working* title, not always the
published slug (014 lives in `2026-08-23_dance-for-two`), so match on the `title:` line of
`_deploy-frontmatter.md`, never on the folder name. The other 12 posts are hand-authored, and
**nothing in any file marks which is which**, so the two kinds are indistinguishable by
inspection — which is how an edit gets lost with no warning. Before editing anything under
`src/posts/`, check whether that piece has a folder there. If it does, the fix belongs in
`article.md` **as well as** here.
⚠ Regime, confirmed 2026-09-02: there is **no generator**. The site file is written by hand from
`article.md` + `_deploy-frontmatter.md`, and the prose repo's `scripts/check-deploy.py` only
asserts that nothing internal (drafting notes, HTML comments, TODOs) travelled — it never writes.
So nothing will overwrite a fix made here; it will silently **diverge** from `article.md` instead.
Crossing into the prose repo to fix something upstream is a second repository — ask first.

**Agents:** published content lives in `src/` ONLY — `content/` is drafts and is never built. Any `.md` added to `src/posts/` publishes on the next build; there is no draft flag and no date filter, so a future-dated file ships immediately. Always validate the generated site after building, and never substitute publishing for validation.

---

## 3. Commit messages — Conventional Commits 1.0

Format: `<type>(<scope>): <subject>`

| Type | When |
|---|---|
| `feat` | New user-facing capability |
| `fix` | Bug fix |
| `refactor` | Code change, no behaviour change |
| `perf` | Performance |
| `docs` | Docs only |
| `test` | Tests only |
| `chore` | Tooling, deps, config |
| `ci` | CI/CD only |
| `build` | Build system, bundler, or packaging change |
| `revert` | Revert prior commit |

**Scope** = ticket ID when available (Linear/Jira/GitHub issue).

✅ `feat(AND-1146): add prompt route normalization`
✅ `fix: handle empty payload in /api/chat`
✅ `chore(deps): bump ruff to 0.6.9`
❌ `update stuff`
❌ `WIP`
❌ `clip: Staff Engineer. (retry)`

Breaking changes: append `!` and add `BREAKING CHANGE:` footer.
`feat(api)!: drop /v1 endpoints`

---

## 4. Branch naming

Format: `<type>/<TICKET>-<kebab-slug>`

`<type>` = **any type from the §3 table above** — deliberately not re-listed here. Two copies of one
set is exactly what let this line drift: it enumerated 7 of the 10 types, silently rejecting `perf`,
`revert`, and (once documented) `build`, while claiming to be "the same as commit types".
`<TICKET>` = ticket ID in UPPER-CASE, or omit if no ticket.
`<kebab-slug>` ≤ 50 chars, lowercase, hyphens.

✅ `feat/AND-1146-prompt-normalize`
✅ `fix/AND-1150-empty-payload-crash`
✅ `chore/bump-ruff`
❌ `vsterngold/and-1146` (no username prefix)
❌ `chore/169ea4-anders-config-env` (no commit hashes)
❌ `codex/foo` (no agent-name prefix — agent identity is in commit trailer, not branch)

**Agent attribution** lives in commit trailers, not branch names:
```
Co-authored-by: Claude <noreply@anthropic.com>
```

---

## 5. Pull requests

- **All changes** to `main` go through a PR. No direct pushes.
- PR title SHOULD follow Conventional Commits. **CI enforcement is per-repo, not universal** — as of 2026-08-12 `ai-context` and `seo-ops` no longer run commitlint / pr-title / signature jobs. Do not assume a gate exists; check the repo's own `ci.yml`.
- PR description MUST fill the template (`.github/pull_request_template.md`).
- **Squash-merge only.** Linear history required.
- Required passing check: `ci` — the aggregate job in `.github/workflows/ci.yml` that gates commit convention, secret scan, and any repo-specific blocking backstops. Python/Node lint+test jobs may be advisory when configured with `continue-on-error: true`; skipped stack-conditional jobs are allowed, and making them blocking requires changing the workflow first.
- Solo flow: 0 required human reviewers. Copilot Review = required reviewer.
- **Review budget (bot findings):** one Codex review pass per PR — never loop `@codex review`
  chasing zero nits. Codex is the budgeted reviewer; the single automatic pass from
  required/always-on reviewer (Copilot) is outside this budget and not
  something to re-trigger. Fix every P1 and any P2 that is a real correctness issue;
  defer the remaining P2s to a follow-up issue and resolve each thread with the pointer
  ("Deferred per Review budget — tracked in `<follow-up>`"). Bot reviews are advisory
  input, not a gate: `ci` is the hard gate, and the absence of a fresh bot re-review is
  never a reason to hold a green PR.

---

## 6. Versioning & releases

- **SemVer 2.0.** `MAJOR.MINOR.PATCH`.
- **No release tooling by default.** release-please was removed from `werkanders-os` on 2026-08-12 (it opened a release PR on every push, staling every other open PR). If a repo still runs it, that is repo-local — this canon does not mandate it.
- Tags: `v<MAJOR>.<MINOR>.<PATCH>` (e.g. `v1.4.2`).
- Pre-1.0 repos: breaking changes allowed in `MINOR` per SemVer §4.

---

## 7. Secrets & sensitive data

- **Never** commit secrets, API keys, tokens, `.env` files, credentials.
- `gitleaks` runs pre-commit AND in CI. Both must pass.
- `.env` is gitignored. Use `.env.example` for templates.
- For vault repos (medical, financial, personal): hybrid pattern — text tracked, blobs in `.gitignore` under `vault/blobs/`.
- If a secret leaks: rotate first, then `git filter-repo` to scrub history, then force-push (one of the few times force-push is allowed — to a non-protected branch).

---

## 8. Signed commits

All commits MUST be signed (SSH or GPG). CI verifies. Setup:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```
Then add the same SSH key as a **Signing Key** in GitHub → Settings → SSH and GPG keys.

---

## 9. Code style

- `.editorconfig` is canonical for indent, EOL, charset, final newline.
- Language-specific formatters configured per repo (ruff/black for Python, prettier for JS/TS, swift-format for Swift).
- Pre-commit runs them. Do not bypass with `--no-verify` unless you are unblocking a hot fix and will follow up with a `chore: re-apply formatter` PR.

---

## 10. Dependencies

- **Python:** `uv` for env + lockfile. `pyproject.toml` is source of truth.
- **JS/TS:** `npm` or `pnpm`. Lockfile committed.
- **Swift:** SwiftPM. `Package.resolved` committed.
- Dependabot runs weekly, groups patch + minor PRs.

---

## 11. Documentation expectations

Repos must contain:
- `README.md` — what it is, how to run it, how to test it
- `AGENTS.md` — this file
- `CHANGELOG.md` — optional; hand-edited where it exists. Nothing auto-maintains it.
- `docs/` — design notes, ADRs (Architecture Decision Records) for non-trivial choices

ADR format: `docs/adr/NNNN-short-title.md`. One per decision. Date + context + decision + consequences.

---

## 12. Working with AI agents in this repo

**For the agent reading this:** these rules apply to YOU.

- Read this file in full before making changes.
- Follow Section 3 (commit format) and Section 4 (branch naming) exactly.
- Run the repository-specific **pre-PR validation** commands declared in Section 2 before opening a PR. Setup/install commands and operations explicitly labeled owner-only, live, preview, deploy, or publish are not pre-PR agent gates; never run them without the required context and approval. Never invent a generic `make` target or substitute a weaker command.
- Never commit secrets. Never bypass pre-commit hooks.
- Sign commits if possible; otherwise note in PR description so the human can amend.
- Add yourself as co-author trailer.
- If this file is unclear or contradicts another instruction, ask in the PR description rather than guessing.

**For the human:** treat AI commits the same as human commits — they pass the same gates or they don't merge.

---

## 13. Anti-patterns (don't do this)

| ❌ | ✅ |
|---|---|
| Force-push to `main` | Open a PR. Force-push only on your own feature branch. |
| `git commit --no-verify` | Fix the hook violation. |
| Direct commit to `main` | PR + squash-merge. |
| `update README` as a commit | `docs: clarify install steps` |
| Branch named after yourself or your tool | Branch named after the work (`feat/AND-1234-…`) |
| Storing secrets in `config.py` "just for now" | `.env` + `python-decouple` / `os.getenv`. |
| Assuming a CI gate exists | Check the repo's `ci.yml`; enforcement is per-repo. |
