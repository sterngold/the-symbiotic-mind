# Dependency Log

## Entries

### Codex Cloud shim Python minor portability (2026-07-05)

- Change: widened the dependency-free root `pyproject.toml` shim from
  `>=3.12,<3.13` to `>=3.12`, explicitly disabled setuptools package/module
  discovery, and refreshed `uv.lock`.
- Reason: Cloudflare Pages currently detects Python 3.13 for this branch and
  auto-runs `pip install .`; the previous minor upper bound made the hosted
  setup fail even though the shim has no Python runtime dependencies. Explicit
  empty discovery keeps flat-layout site directories from being treated as a
  Python distribution.
- Supply-chain: no new top-level dependency and no runtime package-manager
  migration. This remains a compatibility shim for Codex/hosted setup only.
- Verification: Python 3.13 `uv lock --check`, throwaway-env
  `uv sync --extra mcp --extra dev`, and `pip install .` pass.

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
