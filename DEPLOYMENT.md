# Production deployment

The Desert of Desolation hosted runtime is intentionally thin.

## Architecture

- Google Drive is authoritative for campaign state, manifests, media IDs, audio masters, checkpoints, and recovery.
- GitHub is source/CI/version authority for the hosted adapter.
- Vercel hosts the public HTTPS MCP/audio adapter.
- Railway is excluded.
- Live ElevenLabs is excluded from gameplay runtime.

## Required public routes

- `GET /healthz` -> healthy JSON response with the release version
- `GET/POST/DELETE /mcp` -> MCP Streamable HTTP transport
- `OPTIONS /mcp` -> CORS preflight

## Deployment target

Repository: `snogards99/desert-of-desolation`
Production branch: `main`
Current release candidate: `0.5.0-rc.2`

Use a Git-linked Vercel project. Do not upload Drive campaign data or media masters into the Vercel project.

## Account prerequisite

The Vercel team must have a GitHub Login Connection capable of accessing `snogards99/desert-of-desolation`. ChatGPT/Vercel connector authorization alone does not establish this Git provider link.

If project creation reports:

`You need to add a Login Connection to your GitHub account first`

add GitHub under the Vercel account login/connections settings, grant repository access, then retry Git project creation.

## Promotion gates

A preview is promotable only when all of these pass:

1. GitHub validation workflow is green.
2. `/healthz` returns `ok:true` and version `0.5.0-rc.2`.
3. MCP initialization succeeds.
4. `get_audio_capabilities` reports the 12-voice v0.5 contract.
5. The ChatGPT widget mounts.
6. A harmless approved cue preloads to READY.
7. PLAY remains QUEUED until the widget confirms PLAYING for the same epoch.
8. `clear_audio_epoch` invalidates stale cues.
9. Audio failure does not block text/gameplay fallback.
10. Real-device QA passes in this order: iPhone + headphones, iPhone speaker, desktop + headphones.

Promote the already-tested preview artifact rather than rebuilding production.
