# Audio QA and Promotion Gates

Run these checks without advancing certified gameplay state.

## Functional gates
1. Drive manifest resolves exact IDs for required current-scene audio.
2. Current-node required audio reaches `READY` before speculative successors when bandwidth is constrained.
3. Renderer acknowledgements distinguish `READY`, `QUEUED`, and `PLAYING`.
4. New player input increments `audio_epoch` and prevents stale queued playback.
5. Monster NORMAL/ATTACK/DEATH gates cannot leak hidden creatures or predict mechanics.
6. Narration/dialogue ducking preserves intelligibility without clipping.
7. Environment transitions crossfade/morph cleanly.
8. Missing optional audio does not delay or block mechanics/story.
9. Save/resume reconstructs semantic audio state without replaying stale one-shots.
10. Constrained-device mode stays within effective voice/memory budget.

## Reference scenes
- quiet tomb exploration
- open desert travel
- NPC conversation over ambience/music
- heavy combat with 12-voice stress
- spell cast with source/travel/impact staging
- room-to-room acoustic transition
- cinematic narration interrupted by player input
- resume from checkpoint

## Measurements
Record when measurable:
- exact-ID resolve latency
- Drive fetch latency
- decode/stage latency
- request-to-READY latency
- request-to-PLAYING latency
- preload hit rate
- stale cue count
- underrun/gap count
- renderer failures
- active voice peak
- clipped/overload events
- cache memory pressure
- transition discontinuity count

## Promotion rule
Do not describe audio as production-ready unless a real renderer has passed the functional gates on at least one desktop/web client and one mobile client. Skills-only validation is not audio-playback validation.

## Listening criteria
- speech remains intelligible at normal listening volume without making beds vanish unnaturally
- loops do not click, pump, or expose obvious restart points
- repeated optional cues do not become fatiguing
- spatial movement is continuous rather than jumping between pan positions
- reverb supports scale/location without washing out dialogue
- music supports tension but remains subordinate to narration and player decisions
- silence is preferred over clutter when no cue materially improves the scene

## Device matrix
Minimum real-device promotion matrix:
1. iPhone + headphones
2. iPhone speaker
3. desktop/web + headphones

For each, verify:
- first scene audio starts only after a user gesture if the platform requires autoplay permission;
- master/speech/music/ambience/SFX controls remain usable;
- interruption stops stale narration quickly;
- no duplicate loop starts after resume or rerender;
- constrained mode sheds optional layers without losing mechanics-critical cues.

## Release blocker conditions
Block audio-ready promotion if any of these are true:
- no renderer is registered/connected;
- renderer cannot produce a current-epoch `PLAYING` acknowledgement;
- private asset delivery requires making Drive files publicly accessible;
- current-scene required cues lose priority to speculative successor preloads;
- stale cues play after new player input;
- hidden information can be inferred from preloads, filenames, timing, or sound;
- save/resume replays stale one-shots;
- sustained overload/clipping occurs in the 12-voice stress scene.
