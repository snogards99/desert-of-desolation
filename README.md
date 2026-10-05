# Desert of Desolation Game Runtime

Architecture: **Google Drive = authoritative state/media**, **ChatGPT = gameplay/orchestration**, **GitHub = source/CI/Codespaces audio compute**.

This repository intentionally contains no Railway configuration.

## Start the audio renderer in GitHub Codespaces

1. Open this repository in a new GitHub Codespace on `main`.
2. The devcontainer installs dependencies, runs validation, and starts the renderer automatically.
3. In the Codespaces **Ports** panel, make port `8787` Public if ChatGPT cannot reach it.
4. Run:
   ```bash
   bash scripts/codespace-ready.sh
   ```
5. Copy the printed HTTPS `/mcp` endpoint into the ChatGPT MCP/plugin connection.
6. Confirm `/healthz` works before testing game audio.

The Codespace is presentation compute only. Google Drive remains authoritative for campaign state, manifests, checkpoints, and media identity.

See `plugin/skills/desert-of-desolation-game/references/github-runtime.md`.
