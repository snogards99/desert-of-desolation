# Desert of Desolation Site

Existing ChatGPT Site: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`, slug `desert-of-desolation`.

The inherited observation is public/active Site v32, projection 65. These values are not a fresh native deployment readback. This directory is not a full Site export: native server routes, dependency lockfiles, build configuration, persistence and deployment metadata are missing.

Alpha.37 maintenance source is canonical under `plugin/skills/desert-of-desolation-game/site-runtime/`. It contains scene-bound audio recovery, corrected pause/stop ownership and a visibility-aware read-only save poller. Earlier alpha.36 microphone source is retained. These changes are not claimed live until the existing Site is exported, reconciled, built, saved and published through native Sites tools.

Before integration, preserve the live save and current source; compare the full Site with the pinned runtime rather than overwriting either. Test in isolated fixtures, not the player campaign. Verify write authorization, retry/idempotency and the supported resolver before a coordinated gameplay release. Keep public viewing separate from permission to mutate saves.

GitHub is source/test/history authority, not a replacement host. Site saves and ChatGPT checkpoints are still separate; no automatic state bridge is established here. See the current repository checkpoint for actual plugin/commit/deployment IDs and remaining gates.
