# Desert of Desolation — v0.5.0-rc.2

## Release-candidate architecture

**Google Drive** is the sole authoritative store for campaign state, canon, manifests, checkpoints, and media identity.

**ChatGPT Desert of Desolation plugin** runs gameplay, AD&D resolution, narration, state orchestration, preload decisions, and session control.

**GitHub** is mandatory for source, CI, tests, release provenance, and deployment of the advanced-audio renderer.

**Stable HTTPS MCP renderer** is mandatory for normal-play audio readiness. It is built from this GitHub release line. The hosting vendor is replaceable presentation infrastructure and is never a game-state authority.

Railway is not used.

## Renderer endpoints

The release deployment must expose:

- `GET /healthz`
- Streamable HTTP MCP at `/mcp`

The repository includes a hosted/serverless adapter in `api/`, a `vercel.json` deployment configuration, and a standalone development renderer under `audio-renderer/`.

Codespaces/devcontainers remain useful for development and local smoke testing, but normal gameplay does not depend on an ephemeral Codespace.

## Session readiness gate

Before normal play begins, verify once per session:

1. Drive authority is reachable.
2. Active plugin release matches the release candidate.
3. GitHub release-line CI is green.
4. Public `/healthz` succeeds.
5. ChatGPT initializes `/mcp` and discovers renderer tools.
6. The audio widget mounts and reports capabilities.
7. A harmless same-epoch cue reaches READY -> QUEUED -> renderer-acknowledged PLAYING.

After that, cache readiness for the session. Do not put GitHub/deployment checks on every turn.

## Game maturity

The authoritative Drive runtime already records green structural evidence for the campaign graph, combat, save/resume, preload planning, monster audio coverage, lossless masters, and campaign regression testing. Remaining source-uncertain AD&D/custom mechanics stay explicitly fail-closed instead of being invented.

The final release blocker is `RG-AUDIOTRANSPORT`: prove the stable public renderer end-to-end without mutating campaign state.
