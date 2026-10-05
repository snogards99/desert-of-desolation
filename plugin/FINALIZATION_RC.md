# Desert of Desolation v0.5.0-rc.1 Finalization

This release candidate freezes the architecture around three responsibilities:

- Google Drive: sole persistent campaign/canon/media authority.
- ChatGPT plugin: gameplay, AD&D resolution, narration, state orchestration, preload control.
- GitHub-controlled advanced audio: source + CI are mandatory; live renderer must be deployed to a stable HTTPS runtime before normal play.

## Final release blockers

Only the audio transport gate remains external: public `/healthz`, Streamable HTTP `/mcp`, widget mount, and harmless current-epoch `READY -> QUEUED -> PLAYING` proof.

The Drive runtime already reports green node/transition coverage, save/resume chaos tests, combat matrix, 100-route regression, 57/57 creature audio profiles, 361/361 preload plans, lossless audio masters, and quality-playback validation. Source-uncertain AD&D mechanics remain explicit fail-closed quarantines and are not fabricated to obtain a clean score.

Codespaces is retained for development only. It is not the production audio host. Railway remains excluded.
