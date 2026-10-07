# Desert of Desolation - 1.5.1-alpha.24

## Current architecture

Desert of Desolation is a self-contained ChatGPT campaign project.

- **Desert plugin/app** owns runtime state, AD&D rules, node routing, asset lookup/preload, Sound Engine, Art Engine, and gameplay UI contracts.
- **ChatGPT Site** is the existing mobile/desktop play surface.
- **GitHub** is the unified source, test, media, release-history, and checkpoint repository.
- **ElevenLabs** is authoring-only for genuinely missing audio when explicitly needed. It is not a gameplay dependency and is not used for imagery.
- **Vercel, Railway, an external MCP audio renderer, Desktop, and local Node are not ordinary-play dependencies.**

Normal play must continue when optional media is unavailable. Discovery gates, stable IDs, campaign state, save/resume behavior, and text fallbacks are authoritative.

## Release

Current source target: `1.5.1-alpha.24`.
Plugin ID: `Plugin_3352cc65ee508191abeb37ffa759294d`.
Existing Site project: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`.

Alpha.24 is a ten-pass maintenance release: architecture cleanup, policy/version synchronization, HD-art direction consistency, audio-default reconciliation, reader/mobile UX hardening, bounded preload review, evidence cleanup, and removal of obsolete hosted-renderer source.

## Validation

Run:

```sh
npm run verify
```

Validation is source consistency only; it does not fabricate live Site, audible playback, or physical-device QA.

See `DEPLOYMENT.md`, `UNIFIED_SYNC_POLICY.md`, and the newest checkpoint under `checkpoints/`.
