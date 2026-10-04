# Audio Runtime Contract

## State machine
Every audio asset has one of these runtime states:
- `UNRESOLVED`: semantic cue selected but no authoritative asset resolved.
- `RESOLVED`: exact Drive-backed media record resolved.
- `FETCHING`: exact Drive asset is being staged for the session.
- `READY`: bytes/stream handle are staged and usable by the renderer.
- `QUEUED`: renderer accepted the command but playback has not started.
- `PLAYING`: renderer explicitly confirmed audible playback start.
- `PAUSED`: renderer explicitly confirmed pause.
- `STOPPED`: renderer explicitly confirmed stop/end.
- `FAILED`: fetch/decode/render failed.
- `STALE`: cue invalidated by new player input, state change, or transition.

Never equate `RESOLVED`, `FETCHING`, `READY`, or `QUEUED` with audible playback.

## Scene audio transaction
For each scene revision:
1. Freeze a semantic scene audio plan against the certified game-state revision.
2. Apply spoiler and mechanics gates before resolving media.
3. Resolve exact Drive IDs/URLs from the manifest.
4. Stage current-node essentials first; successors are speculative and lower priority.
5. Issue renderer commands only for cues still valid against the current scene revision.
6. On player input, increment `audio_epoch`; reject any queued command from an older epoch.
7. Persist only semantic state required for clean resume (score family, ambience family, acoustic profile), not buffer positions.

## Renderer contract
A playback-capable MCP/UI should provide semantic equivalents of:
- `get_audio_capabilities`
- `preload_audio`
- `play_audio`
- `loop_audio`
- `stop_audio`
- `fade_audio`
- `duck_bus`
- `set_bus_gain`
- `set_emitter_position`
- `set_listener_pose`
- `set_reverb_profile`
- `clear_audio_epoch`
- `get_audio_status`

Required acknowledgement data:
- `audio_id`
- `audio_epoch`
- `status`
- `renderer_id`
- `started_at` when playback actually starts
- failure code/message when applicable

The game may say audio is playing only when a renderer response reports `PLAYING` for the current `audio_epoch`.

## Preload priorities
Priority order within a bounded budget:
1. current-scene mechanically required cue
2. current narration/dialogue already selected
3. current ambience bed
4. current score bed
5. current encounter SFX and monster three-state families
6. first spoiler-safe successor
7. second spoiler-safe successor

Do not fetch all variants. Resolve only the exact cue or a small recency-safe pool needed for the current scene.

## Voice budget
Design maximum: 12 simultaneous voices.
Reserve capacity dynamically rather than permanently. Under pressure:
1. retain active speech and mechanically required cues;
2. merge/cull duplicate ambience emitters;
3. drop inaudible/far optional presence cues;
4. collapse decorative tails;
5. retain one music bed and one ambience bed unless the transition intentionally overlaps them.

## Ducking
Use smooth sidechain-style ducking around speech. Avoid hard muting except for intentional effects. Restore bed levels with a release ramp after speech ends. Critical SFX may remain audible at controlled level.

## Spatial rules
- Narrator and non-diegetic score: centered/non-spatial.
- NPC/party dialogue: lightly world-positioned, speech-first intelligibility.
- Creature/hazard/event cues: world emitters with distance, pan, obstruction, movement, and acoustic profile when supported.
- Never spatialize hidden information into existence.

## Transition rules
When environment family changes:
- start successor ambience only after transition is committed;
- crossfade old/new beds when both are valid;
- morph reverb/acoustic profile smoothly;
- do not smear foreground speech through long reverb tails;
- use abrupt cuts only for deliberate story punctuation.

## Fallback ladder
If renderer unavailable: continue with text/state and internally record `AUDIO_RENDERER_UNAVAILABLE`.
If one asset fails: try exact-family approved fallback, otherwise silence.
Never broad-search Drive on the gameplay hot path to repair a missing cue.

## Quality defaults
### Voice allocation
Use adaptive headroom rather than permanently reserving channels. Typical target under normal load:
- 1 active narrator or primary dialogue voice
- 1 secondary dialogue/bark voice when intentional
- 1 music bed
- 1 ambience bed
- up to 4 mechanically relevant/event SFX
- remaining capacity for spatial creature/hazard emitters and transition overlap

When a 13th voice would be needed, prefer culling or merging the lowest-value optional voice before stealing a speech or mechanics-critical voice.

### Gain discipline
Treat manifest/source metadata as starting gain only. Apply runtime gain non-destructively. Avoid automatic destructive normalization. Detect overload at the master bus and use transparent limiting only as a safety net, not as a loudness strategy.

### Speech ducking envelope
Use a fast but non-clicking attack, hold through the intelligible phrase, and a smooth release. Apply more ducking to music than ambience, and more to ambience than mechanics-critical SFX. Do not duck the speaker's own positional room reflections so aggressively that the voice sounds detached from the scene.

### Loop hygiene
For looped ambience/music, prefer authored loop points when present. Otherwise use short crossfades at loop boundaries and reject files whose effective content is mostly silence. Do not restart a continuous ambience family on every turn.

### Recency and repetition
Track exact-file and cue-family recency separately. Optional monster presence cues, barks, creaks, wind gusts, and decorative impacts should respect recency guards. Mechanically required attack, impact, spell, trap, and death cues are exempt when repetition is necessary to represent resolved events.

## Constrained-device profile
When capability or pressure indicates a constrained client:
- lower effective simultaneous voices before lowering speech quality;
- keep one music and one ambience bed;
- merge multiple similar ambience emitters into the bed;
- cull far/offscreen optional creature presence cues first;
- shorten or disable expensive decorative convolution tails while preserving location identity;
- prefer stereo pan + distance attenuation when richer spatial APIs are unavailable;
- keep decoded/staged current-scene essentials pinned and evict speculative successors first.

Never reduce mechanically required cue audibility solely because the device is constrained.

## Cache and latency policy
Maintain separate pressure budgets for compressed transport bytes, decoded audio, and imagery.
- pin current-scene speech/mechanics assets;
- warm current ambience/music and current encounter cue families;
- stage successor bundles only after current essentials are ready;
- dedupe by deterministic media ID and authoritative Drive identity;
- cancel in-flight speculative fetches when the transition candidate becomes invalid;
- prefer a small exact family pool over loading every alternate take;
- record cache hit/miss and request-to-READY latency for tuning.

Do not keep stale decoded buffers merely because they were expensive to fetch. Correctness and memory pressure outrank speculative reuse.

## Save/resume audio reconstruction
Persist only semantic audio resume data that belongs to certified game state:
- environment/acoustic profile
- ambience family and variant policy, not buffer position
- score family/state when narratively appropriate
- current audio epoch seed/revision

On resume, create a new epoch, rebuild continuous beds cleanly, and never replay prior one-shot attack/death/trap/dialogue cues merely because they were active before saving.
