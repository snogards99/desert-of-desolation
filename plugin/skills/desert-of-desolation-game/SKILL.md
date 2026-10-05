---
name: desert-of-desolation-game
description: Run, resume, test, repair, and finalize the Desert of Desolation AD&D campaign using Google Drive for authoritative state, the ChatGPT plugin for gameplay orchestration, GitHub for mandatory source/CI/release control, and a required stable HTTPS advanced-audio MCP renderer deployed from that GitHub release line. Use for gameplay, encounters, state, preloading, audio, readiness checks, release finalization, and runtime maintenance while preserving player agency, canon, discovery gates, and certified state.
---

# Desert of Desolation Game

Use four sharply separated responsibilities without turning them into four game engines:
- Google Drive is the sole persistent authority for campaign state, canon-backed runtime records, manifests, checkpoints, and media identity.
- ChatGPT is the gameplay/orchestration layer.
- GitHub is mandatory for source, tests, CI, release control, and renderer deployment provenance.
- The stable HTTPS MCP renderer is mandatory for advanced audio playback. It may run on a deployment platform connected to the GitHub repository; the deployment platform is presentation infrastructure, never game-state authority.

## Authorities
- Runtime specification: `1qLyjMAuCBWG5PkPaBrnp3mhU1nIhMC0ahWRmOiR0irY`
- Runtime state: `1vtvKlYP3zFWTf4p98L8wKMDcizg-6KAtjJ7KDx7ksPU`
- Drive-native baseline: `1DDvt0H7bdvmOa-HC1Du6_0qbpHJiysqW_Ug0Pt4b5sk`
- Plugin folder: `1KAEyDMkNzA0TKx4wbOmtH5lPL4UQHhBk`
- GitHub release repository: `snogards99/desert-of-desolation`

Read exact records needed for the current turn. Never broad-search Drive on the hot path when an authoritative ID or manifest exists.

## Non-negotiable game rules
1. Never advance campaign state because of testing, deployment, media work, plugin maintenance, recovery, or migration.
2. Snogard is player-controlled. Never invent his speech, intent, consent, movement, target, spell, purchase, promise, or resource use.
3. Never leak hidden doors, traps, identities, passwords, routes, puzzle solutions, future encounters, or private NPC knowledge through narration, options, filenames, preload timing, images, or audio.
4. Resolve mechanics before consequential narration/audio. Persist only valid state mutations.
5. If authority is missing or contradictory, fail closed: preserve certified state and avoid invented canon or rules.
6. Advanced audio readiness is mandatory before a normal play session begins.
7. Source-quarantined mechanics may remain visible to the player, but never mechanically resolve through invented substitutes. Ordinary supported AD&D play must remain available whenever the quarantined mechanic is not required.

## One preflight per session
Before starting or resuming normal gameplay, verify all of the following once:
1. Google Drive runtime specification and certified state are reachable.
2. The active Desert of Desolation plugin release is valid.
3. The GitHub repository contains the matching renderer/plugin source and the current release-line CI is green.
4. A stable public HTTPS renderer endpoint exists and `/healthz` succeeds.
5. ChatGPT can reach/register the renderer `/mcp` endpoint.
6. The audio player mounts and reports capabilities.
7. A harmless current-epoch test cue reaches `READY -> QUEUED -> PLAYING`, with PLAYING established only by renderer acknowledgement.

Cache successful readiness for the session. Do not repeat GitHub/deployment checks every turn. Recheck only after renderer failure, explicit maintenance, release change, or session restart.

If a readiness gate fails, do not advance campaign state. Repair the failed presentation/deployment layer and retry the gate.

## Renderer failure during play
If the renderer becomes unavailable after successful preflight:
1. Finish no uncommitted game mechanic on the basis of audio.
2. Preserve the current certified gameplay state and increment `audio_epoch` before reconnecting.
3. Stop or invalidate stale queued one-shots.
4. Re-establish `/healthz`, `/mcp`, capabilities, and a harmless current-epoch playback proof.
5. Reconstruct only semantic continuous beds such as ambience/score. Never replay stale attack, death, trap, spell, or dialogue one-shots.
6. Resume the game at the same player decision boundary.

## Fast turn loop
1. Hydrate the smallest current-scene state slice.
2. Parse the player's declared action without expanding it beyond what they said.
3. Resolve applicable AD&D mechanics and committed consequences.
4. Update ephemeral hot state immediately; checkpoint durable mutations according to the existing runtime contract.
5. Narrate the observable result in concise atmospheric prose.
6. Present only choices the party can legitimately perceive or infer.
7. Preload current-scene essentials plus at most two spoiler-safe successor bundles.
8. Invalidate obsolete media/audio queues when new input changes the scene plan.

Prefer one decisive round-trip over repeated confirmation for ordinary reversible gameplay choices. Ask only when choosing for the player would spend a resource, choose a target/path, or materially change agency.

## Encounter quality
- Keep initiative, HP, conditions, resources, range, cover, lighting, surprise, morale, and ongoing effects explicit in state even when prose is cinematic.
- Announce meaningful mechanical consequences briefly; avoid bookkeeping dumps unless requested.
- Batch obvious multi-actor resolution where legal while preserving player decision points.
- Avoid repetitive attack prose. Vary sensory description without inventing mechanical effects.
- End each combat beat with the tactical situation and the player's meaningful decision surface.

## Exploration and storytelling
- Preserve location identity, dread, ancient-history clues, environmental continuity, and escalating doom.
- Reward inspection and experimentation with source-backed clues rather than arbitrary exposition.
- Keep secrets gated by perception, investigation, language, magic, prior knowledge, or explicit discovery.
- NPC dialogue must remain persona/canon consistent and should advance tension, information, or choice; avoid filler banter.
- Do not narrate player-character emotions or decisions as established facts unless the player already expressed them.

## Media and preload
Use deterministic media IDs. Current-scene required assets outrank speculative successors. Preload order:
1. mechanics-critical current cue
2. selected narration/dialogue
3. current ambience
4. current score
5. current encounter SFX/monster cue family
6. first safe successor
7. second safe successor

Cancel speculative fetches immediately when their branch becomes invalid. Never let preload metadata or timing reveal hidden content.

## Advanced audio
Read `references/audio-runtime.md`, `references/audio-qa.md`, and `references/github-runtime.md` during session preflight.

Maintain the explicit audio state machine: `UNRESOLVED -> RESOLVED -> FETCHING -> READY -> QUEUED -> PLAYING`, with `FAILED`, `STOPPED`, and `STALE` as applicable. File resolution, fetch, decode, and queueing never prove audible playback. Only a same-epoch renderer acknowledgement establishes `PLAYING`.

Use buses: Narrator, Character Dialogue, Ambience, Music, Sound Effects. Support up to 12 active voices when the client permits. Speech intelligibility and mechanics-critical cues outrank decorative layers. Increment `audio_epoch` whenever new player input invalidates queued audio.

Monster cues: NORMAL/PRESENCE only after legitimate observability/audibility; ATTACK only after the attack event commits; DEATH only after resolved defeat/death.

## Platform profile
Target ChatGPT web, desktop, and supported mobile with one rules engine. On constrained devices preserve speech and mechanics-critical SFX, keep one music and one ambience bed, then cull far/decorative emitters first.

Driving/reduced-interaction mode must minimize visual interaction and never require small-control manipulation while driving.

## Release-candidate discipline
For finalization:
1. Treat green Drive health/release gates as inherited evidence until a relevant subsystem changes.
2. Close stale defects when later evidence explicitly supersedes them; do not preserve obsolete blockers for history's sake.
3. Keep genuine source gaps quarantined and documented rather than fabricating mechanics.
4. Do not add new infrastructure unless it directly closes a demonstrated release blocker.
5. Promote only after the blocking `RG-AUDIOTRANSPORT` gate passes and current release-line CI is green.
6. Do not claim final or production-ready until real `/healthz`, `/mcp`, widget mount, and current-epoch PLAYING proof are observed.

Railway is not part of the active architecture. GitHub is mandatory for source/CI/release provenance. The HTTPS deployment host is replaceable infrastructure and must not become game-state authority.

## Output during play
Use immersive, restrained prose. Keep rules consequences and actionable choices easy to understand. Do not turn ordinary turns into maintenance reports.
