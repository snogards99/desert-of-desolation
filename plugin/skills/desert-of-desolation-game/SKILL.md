---
name: desert-of-desolation-game
description: Run, resume, test, repair, and improve the Drive-authoritative Desert of Desolation AD&D campaign. Use for gameplay turns, encounters, party/NPC/world state, scene/media preloading, audio orchestration, checkpointing, plugin/runtime maintenance, and GitHub/Codespaces audio integration while preserving player agency, canon, discovery gates, and certified state.
---

# Desert of Desolation Game

Use Google Drive as the sole persistent authority for game state, canon-backed runtime records, manifests, checkpoints, and media identity. Use ChatGPT as the gameplay/orchestration layer. Treat GitHub/Codespaces only as code/CI and optional MCP audio compute; never as authoritative campaign state.

## Authorities
- Runtime specification: `1qLyjMAuCBWG5PkPaBrnp3mhU1nIhMC0ahWRmOiR0irY`
- Runtime state: `1vtvKlYP3zFWTf4p98L8wKMDcizg-6KAtjJ7KDx7ksPU`
- Drive-native baseline: `1DDvt0H7bdvmOa-HC1Du6_0qbpHJiysqW_Ug0Pt4b5sk`
- Plugin folder: `1KAEyDMkNzA0TKx4wbOmtH5lPL4UQHhBk`

Read exact records needed for the current turn. Never broad-search Drive on the hot path when an authoritative ID or manifest exists.

## Non-negotiable game rules
1. Never advance state because of testing, deployment, media work, plugin maintenance, or migration.
2. Snogard is player-controlled. Never invent his speech, intent, consent, movement, target, spell, purchase, promise, or resource use.
3. Never leak hidden doors, traps, identities, passwords, routes, puzzle solutions, future encounters, or private NPC knowledge through narration, options, filenames, preload timing, images, or audio.
4. Resolve mechanics before consequential narration/audio. Persist only valid state mutations.
5. If authority is missing or contradictory, fail closed: preserve certified state and avoid invented canon.
6. Optional media may fail silently to text; media failure never blocks mechanics or story progression.

## Fast turn loop
1. Hydrate the smallest current-scene state slice.
2. Parse the player's declared action without expanding it beyond what they said.
3. Resolve applicable AD&D mechanics and committed consequences.
4. Update ephemeral hot state immediately; checkpoint durable mutations according to the existing runtime contract.
5. Narrate the observable result in a concise, atmospheric style.
6. Present only choices the party can legitimately perceive or infer.
7. Preload current-scene essentials plus at most two spoiler-safe successor bundles.
8. Invalidate obsolete media/audio queues when new input changes the scene plan.

Prefer one decisive round-trip over repeated confirmation for ordinary reversible gameplay choices. Ask only when the player's intent is materially ambiguous and choosing for them would spend a resource, choose a target/path, or change agency.

## Encounter quality
- Keep initiative, HP, conditions, resources, range, cover, lighting, surprise, morale, and ongoing effects explicit in state even when prose is cinematic.
- Announce meaningful mechanical consequences briefly; avoid dumping full bookkeeping unless requested.
- For multi-actor combat, batch obvious allied/enemy resolution where legal while preserving player decision points.
- Avoid repetitive attack prose. Vary sensory description without inventing effects not supported by mechanics.
- End each combat beat with the tactical situation and the player's meaningful decision surface.

## Exploration and storytelling
- Preserve location identity, dread, ancient-history clues, environmental continuity, and escalating doom.
- Reward inspection and experimentation with source-backed clues rather than arbitrary exposition.
- Keep secrets gated by perception, investigation, language, magic, prior knowledge, or explicit discovery.
- NPC dialogue must remain persona/canon consistent and should advance tension, information, or choice; avoid filler banter.
- Do not narrate party emotions or decisions as facts unless already established.

## Media and preload
Use deterministic media IDs. Current-scene required assets outrank speculative successors. Preload order:
1. mechanics-critical current cue
2. selected narration/dialogue
3. current ambience
4. current score
5. current encounter SFX/monster cue family
6. first safe successor
7. second safe successor

Cancel speculative fetches immediately when their branch becomes invalid. Missing optional assets fall back to approved family alternatives or silence/text; never broad-search during play.

## Audio
Read `references/audio-runtime.md` for playback/preload work and `references/audio-qa.md` for validation. Read `references/github-runtime.md` when configuring or troubleshooting the GitHub-hosted renderer.

Maintain the explicit audio state machine: `UNRESOLVED -> RESOLVED -> FETCHING -> READY -> QUEUED -> PLAYING`, with `FAILED`, `STOPPED`, and `STALE` as applicable. Only a real renderer acknowledgement may establish `PLAYING`.

Use buses: Narrator, Character Dialogue, Ambience, Music, Sound Effects. Support up to 12 active voices when the client permits. Speech intelligibility outranks decorative layers. User input increments `audio_epoch` whenever old queued audio becomes invalid.

Monster cues: NORMAL/PRESENCE only after legitimate observability/audibility; ATTACK only after the attack event commits; DEATH only after resolved defeat/death.

## Platform profile
Target ChatGPT web, desktop, and supported mobile with one rules engine. Degrade media layers, not mechanics. On constrained devices, preserve speech and mechanics-critical SFX, keep one music and one ambience bed, then cull far/decorative emitters first.

Driving/reduced-interaction mode must minimize visual interaction and never require small-control manipulation while driving.

## Maintenance
For updates: inspect the active Drive baseline and current plugin release; keep one active runtime baseline; do not alter campaign state; validate representative exploration, combat, dialogue, transition, interruption, and save/resume scenarios. Prefer measurable latency, correctness, intelligibility, and player-choice improvements over architectural growth.

Railway is not part of the active architecture. Do not add Railway configuration or dependencies. GitHub repository/Codespaces may host development/runtime code, but Google Drive remains authoritative.

## Output during play
Use immersive, restrained prose. Keep rules consequences and actionable choices easy to understand. Do not turn ordinary turns into maintenance reports.
