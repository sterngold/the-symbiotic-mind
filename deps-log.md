# Dependency Log

## Entries

### Codex Cloud uv setup shim (2026-07-05)

- Change: added a dependency-free root `pyproject.toml` with empty `mcp` and
  `dev` extras so Codex Cloud setup can run the shared command
  `uv sync --extra mcp --extra dev`.
- Reason: the `sterngold/the-symbiotic-mind` Codex Cloud environment uses the
  same setup shape as Anderson, but this Eleventy site had no root
  `pyproject.toml`; `uv sync` failed with exit code 2 before review work could
  start.
- Supply-chain: no new top-level dependency and no runtime package-manager
  migration. The website build remains owned by `package.json` and
  `package-lock.json`.
- Verification: `uv lock --check` green; throwaway-env
  `UV_PROJECT_ENVIRONMENT=/tmp/.../.venv uv sync --extra mcp --extra dev`
  green.
