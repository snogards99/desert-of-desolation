# GitHub / Codespaces Runtime Contract

## Role split
- Google Drive: authoritative game state and media identity.
- GitHub repository: source, versioning, tests, CI.
- GitHub-hosted runtime: required running MCP audio process for gameplay readiness. Codespaces is the current GitHub-native host when used.
- ChatGPT: gameplay/orchestration/UI.

GitHub Pages and GitHub Actions are not persistent MCP servers. Do not claim otherwise.

## Renderer endpoint
The optional renderer must expose HTTPS `/mcp` and `/healthz`. If the Codespace URL changes, refresh the ChatGPT connection. Do not make Drive media public to stabilize URLs.

## Security
Use short-lived/session-scoped media access when possible. The renderer receives only approved current-scene assets. Never expose folder browsing, secrets, or hidden-scene filenames.

## Required gameplay gate
Normal gameplay readiness is false until a real repository exists, the GitHub-hosted renderer is live, `/healthz` and `/mcp` work, ChatGPT connects, and the renderer confirms current-epoch `PLAYING` on a harmless test cue. If any gate fails, preserve campaign state and repair the renderer before play.
