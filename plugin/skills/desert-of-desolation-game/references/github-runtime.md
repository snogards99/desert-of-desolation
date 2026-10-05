# GitHub-Controlled Advanced Audio Runtime Contract

## Role split
- Google Drive: sole persistent game-state/canon/media-identity authority.
- GitHub repository: mandatory source, versioning, CI, tests, and release provenance.
- Stable HTTPS deployment: required MCP audio process built from the GitHub release line. The hosting vendor is replaceable infrastructure.
- ChatGPT: gameplay/orchestration/UI.

GitHub Pages and GitHub Actions are not persistent MCP servers. Codespaces may be used for development, but normal gameplay must not depend on a user-managed ephemeral Codespace.

## Required public endpoints
The deployed renderer must expose:
- `GET /healthz` returning a healthy release/version signal.
- Streamable HTTP MCP at `/mcp`.

## Stateless playback proof
Server memory must not be required to prove playback. `play_audio` returns `QUEUED`. The widget calls `report_audio_status` with the same `audio_id` and `audio_epoch`; an accepted `PLAYING` acknowledgement is the authoritative proof for that turn. This remains valid across serverless/process restarts.

## Security
Use approved, narrow media delivery. Never expose Drive folder browsing, OAuth secrets, hidden-scene metadata, or undiscovered filenames to the browser. Prefer short-lived/session-scoped media URLs or equivalent approved delivery.

## Required release gate
`RG-AUDIOTRANSPORT` passes only when:
1. current GitHub CI is green;
2. public `/healthz` succeeds;
3. ChatGPT initializes `/mcp` and discovers the required tools;
4. the audio widget mounts and reports capabilities;
5. a harmless current-epoch cue reaches READY, QUEUED, and renderer-acknowledged PLAYING;
6. stale-epoch playback is rejected;
7. campaign state remains unchanged by the test.

Once this gate passes, cache readiness for the session and keep GitHub/deployment checks out of ordinary turn resolution unless renderer health changes.
