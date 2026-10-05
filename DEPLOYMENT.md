# Production audio deployment

The advanced-audio renderer must be deployed from this GitHub repository to a stable public HTTPS runtime.

## Required routes

- `GET /healthz` -> healthy JSON response
- `POST/GET/DELETE /mcp` -> MCP Streamable HTTP transport

## Preferred deployment

Use a Git-linked Vercel project for `snogards99/desert-of-desolation`. The repository root already contains `vercel.json`, `package.json`, and serverless entrypoints.

Do not deploy campaign state or Drive media masters to the host. Google Drive remains authoritative.

## Promotion test

A deployment is releasable only if:

1. `/healthz` succeeds publicly.
2. MCP initialization succeeds.
3. `get_audio_capabilities` returns the v0.5 renderer contract.
4. The ChatGPT widget mounts.
5. A harmless approved cue reports READY, then PLAY is QUEUED, then the widget callback `report_audio_status` returns accepted=true with PLAYING for the same epoch.
6. Stale epochs are rejected after `clear_audio_epoch`.

Codespaces is development-only. Railway is excluded.
