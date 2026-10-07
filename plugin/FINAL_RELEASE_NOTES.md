# Desert of Desolation 1.5.1-alpha.37

Scoped maintenance release from the approved Edition 2 assessment and accepted audio candidate. This is not a declaration of Alpha 2 readiness or a live Site deployment.

Scene audio stays bound to the current cue plan. Required narration failures are separate from optional failures; finished cues are not reported missing; duplicate voice keys and unsupported buses are rejected. First-cue order, spatial options, pause/resume watchers and stale-session cancellation are covered by executable tests. Campfire playback is bounded from its earliest possible voice, and one unavailable file does not silence its whole bus.

The Site source no longer restarts audio merely because Pause or Stop changes playback state. Homepage pause retains its separate audio ownership. Read-only save refresh stops scheduling while hidden, avoids overlapping polls, backs off after failures and exposes a stale-save warning until a successful current-save read.

Top-level audio, session, listening, media-policy and sound-settings entry points now re-export canonical lib implementations. Historical QA and art policies keep their original versions and byte hashes instead of being relabeled as new evidence. RELEASE_COMPONENTS.json pins runtime and inherited inputs; CI rejects drift.

No campaign API writes, resource changes, pending-action execution, migrations, access changes, image/audio generation, binary replacement, saved-mix changes or hosting changes were made. Theme gain and visual-policy discrepancies remain disclosed in the component manifest, not silently approved.

Repository tests and simulated Web Audio are separate from a full native Site build, browser QA, real decoding, physical iPhone checks and listening. State authorization/idempotency/resolver work still requires the missing native Site persistence source and supported authentication boundary. Complete plugin-binary/media synchronization is not certified.
