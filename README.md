# Desert of Desolation

## Release candidate architecture

Normal gameplay requires all three layers:

**Google Drive** — sole persistent authority for campaign state, canon, manifests, checkpoints, and media identity.

**Desert of Desolation ChatGPT plugin** — gameplay orchestration, AD&D resolution, narration, state mutation, preload planning, and session control.

**GitHub-controlled advanced audio** — GitHub is mandatory for renderer source, CI, release history, and rollback. The renderer itself must run on a stable public HTTPS application host.

Railway is not used. GitHub Codespaces remains useful for development, but it is no longer treated as the production audio host.

## Current release candidate

- Plugin: `v0.5.0-rc.1`
- Renderer: `v0.5.0-rc.1`
- Audio source: this repository
- Stable-host adapter: `api/mcp.js`, `api/healthz.js`, `vercel.json`
- Drive authority: unchanged

## Final readiness gate

Before normal play:

1. Drive specification and certified state are reachable.
2. Active plugin release is valid.
3. GitHub CI is green for the current renderer commit.
4. Stable public `/healthz` returns healthy.
5. Stable public `/mcp` initializes through Streamable HTTP.
6. ChatGPT mounts the audio widget and reports renderer capabilities.
7. A harmless current-epoch cue reaches `READY -> QUEUED -> PLAYING` and the widget's `report_audio_status` acknowledgement is accepted.

Only after these checks pass should the RC be promoted to final.

## Why the architecture stays simple

Drive never becomes a web server. GitHub never becomes a campaign database. The application host never owns game state. The audio host only renders approved current-scene assets and reports playback state.

## Source layout

- `plugin/` — plugin/skill source
- `audio-renderer/` — audio engine + MCP App widget
- `api/` — stable hosted MCP and health endpoints
- `.github/workflows/` — release validation
- `.devcontainer/` — development-only Codespaces environment
