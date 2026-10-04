# GitHub / Codespaces Runtime Contract

## Role split
- Google Drive: authoritative game state and media identity.
- GitHub repository: source, versioning, tests, CI.
- GitHub Codespaces: optional running MCP audio process for development/gameplay testing.
- ChatGPT: gameplay/orchestration/UI.

GitHub Pages and GitHub Actions are not persistent MCP servers. Do not claim otherwise.

## Renderer endpoint
The optional renderer must expose HTTPS `/mcp` and `/healthz`. If the Codespace URL changes, refresh the ChatGPT connection. Do not make Drive media public to stabilize URLs.

## Security
Use short-lived/session-scoped media access when possible. The renderer receives only approved current-scene assets. Never expose folder browsing, secrets, or hidden-scene filenames.

## Completion gate
GitHub integration is not complete until a real repository exists, Codespaces starts the renderer, `/healthz` and `/mcp` work, ChatGPT connects, and the renderer confirms current-epoch `PLAYING`.
