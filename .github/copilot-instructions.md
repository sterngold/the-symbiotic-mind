# GitHub Copilot instructions

## Repository contract

- Read the repository-root `AGENTS.md`, `CLAUDE.md`, and `README.md` before changing anything. Treat `AGENTS.md` as the Git/build contract and use only repository-relative context in cloud work.
- `CLAUDE.md` identifies shared editorial guidance that is intentionally outside this repository. Stop when required local-only context is unavailable; do not invent it. For voice-sensitive essays or public copy, request the missing guidance rather than imitating Vlad's voice.
- This is a governed live Cloudflare Pages site. Work only in `src/`, `content/`, `functions/`, `scripts/`, or configuration files needed by the assigned task. Never commit `_site/`, generated OG images, secrets, credentials, analytics data, or private source material.

## Workflow and Git

- Work in an isolated task checkout: use a new worktree for local app work or the provider's isolated sandbox for cloud work. Follow the task-based branch and Conventional Commit formats in `AGENTS.md`; do not use an agent name as the branch prefix.
- Keep the diff narrow, inspect all consumers before changing templates or data shapes, and stage only intended paths.
- Never push directly to `main`, force-push `main`, merge a pull request, invoke `npm run publish:indexnow`, or trigger a production deployment. Use a pull request and wait for the required `ci` check and preview/build evidence.
- Resolve every review thread or explain the evidence for rejecting it. Copilot review is advisory and does not replace CI or owner approval.

## Dependencies and security

- Do not add a top-level dependency or change `package.json`, `package-lock.json`, another manifest, or a lockfile without explicit approval from the owner and a repository-local security rationale in the pull request.
- Use the committed lockfile. Do not introduce unpinned or `latest` specifications or add/enable lifecycle scripts without explicit approval. Never commit secrets or generated build output.

## Repository commands

Use Node 20 from `.nvmrc`. There is no unit-test or separate lint command; the production build and validator are the executable correctness gates. Use `npm ci` for the clean, lockfile-exact agent/CI checkout below; the `npm install` workflow in `AGENTS.md` and `README.md` is for an existing local development checkout.

```bash
nvm use
npm ci
npm run build
node scripts/validate-build.mjs
```

Do not use `npm run build:publish` or `npm run publish:indexnow` in a task sandbox because those commands can notify an external production service. GitHub Actions repeats the safe build and validator in `.github/workflows/deploy.yml`, and its aggregate required check is `ci`.

## Review priorities

Prioritize silent failures, boundary validation, tests, security, unresolved review threads. Also review frontmatter, template/data boundaries, feeds, search, metadata, external side effects, and accessibility.
