# Desert of Desolation

## Required runtime

Normal gameplay requires all three layers:

**Google Drive** — authoritative campaign state, canon, manifests, checkpoints, and media identity.

**Desert of Desolation ChatGPT plugin** — gameplay orchestration, AD&D resolution, narration, state mutation, preload planning, and session control.

**GitHub-hosted advanced audio renderer** — required playback layer for music, ambience, narration/dialogue, SFX, spatial audio, ducking, and playback-state confirmation.

Railway is not used.

## One-time GitHub audio activation

Create one GitHub Codespace from this repository on `main`.

The devcontainer then:
1. installs and validates the audio renderer;
2. starts the renderer on port 8787;
3. verifies local `/healthz`;
4. attempts to make port 8787 reachable;
5. writes the live endpoint to `runtime/codespace-endpoint.json`.

After that, ChatGPT can discover the renderer endpoint from the repository without asking you to copy URLs.

The optional `bootstrap-codespace` workflow can create the Codespace only when repository secret `CODESPACE_PAT` contains a user token with **Codespaces: write**. The ordinary GitHub Actions token cannot create Codespaces.

## Readiness gate

Before starting or resuming normal play, verify once per session:

1. Drive runtime specification and certified state are reachable.
2. Active plugin release is valid.
3. GitHub renderer source and CI are valid.
4. A live HTTPS renderer exists and `/healthz` succeeds.
5. ChatGPT can reach/register the renderer `/mcp` endpoint.
6. The audio player mounts and reports capabilities.
7. A harmless test cue reaches `READY -> QUEUED -> PLAYING` for the current audio epoch.

If a gate fails, preserve campaign state and repair the failed layer before play. After readiness succeeds, do not repeat GitHub deployment checks every turn unless renderer health changes.

## Source layout

- `plugin/` — active plugin/skill source
- `audio-renderer/` — required MCP audio renderer
- `.github/workflows/` — renderer/plugin CI
- `.devcontainer/` — GitHub Codespaces runtime configuration
- `scripts/` — Codespaces bootstrap and endpoint publication

Google Drive remains the only persistent gameplay authority. GitHub must never become a second campaign database.
