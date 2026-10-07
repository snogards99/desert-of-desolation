---
name: desert-of-desolation-game
description: Run, resume, audit, test, repair, and optimize the self-contained Desert of Desolation tabletop campaign. Use for gameplay, scenes, encounters, party/NPC/creature information, character sheets, node completeness, preload/media/audio behavior, authoritative game time, time-aware imagery, Site presentation, and campaign/runtime maintenance.
---

# Desert of Desolation Game - 1.5.1-alpha.34

Run Desert of Desolation as a mobile-first campaign engine. The plugin owns runtime state, rules, node routing, media lookup/preload, Sound Engine, Art Engine, and UI contracts. The existing ChatGPT Site is the mobile/desktop play surface. GitHub is source, test, media, and release-history authority, but ordinary gameplay must not depend on GitHub availability.

## Runtime rules
1. Use bundled structured data and current manifests as runtime authority. Do not require Desktop, local Node, Developer Mode, Vercel, Railway, ElevenLabs, raw provider URLs, or a separate server during ordinary play.
2. Reuse the existing Site and preserve its access policy.
3. Keep deterministic node, actor, item, audio, and art IDs stable.
4. Resolve ordinary turns from current mutable state plus `NodeKnowledgeEnrichment` and `NodeBundleManifest`; deeper canon/mechanical tables remain authoritative on conflict.
5. Snogard is player-controlled. Never invent Snogard speech, intent, consent, movement, spell choice, target choice, promises, or resource spending.
6. Discovery gates are absolute. Never leak hidden doors, traps, passwords, secret identities, puzzle solutions, teleport destinations, unseen creatures, undiscovered treasure, future encounters, or NPC-private knowledge through text, UI, preload, audio, image, filename, alt text, or metadata.
7. Fail closed on uncertainty. Optional media failure never blocks play.
8. Maintenance, QA, release work, art integration, and media tests never advance campaign state.
9. Track game time only through `WorldState.total_minutes`; derive the solar phase before outdoor presentation.
10. Outdoor/open-sky art uses DAY, DUSK, EVENING, or NIGHT. DAWN/SUNRISE/MORNING reuse DUSK; SUNSET uses EVENING. Wrong-time art is never a fallback.
11. Apply `data/VISUAL_THEME.json`, `data/imagery/NODE_IMAGE_STATE_POLICY.json`, `dod.art-engine` 1.5.0, and `../desert-of-desolation-art-direction/SKILL.md`.
12. The old first-20 pixel-style package is a legacy runtime fallback only until individually approved HD replacements exist.
13. ElevenLabs is authoring-only for missing audio when explicitly needed. It is not used for image generation.
14. The bundled Site source under `site-runtime/` must remain dependency-complete before release approval.

## Turn router
1. Classify intent: gameplay, character sheet, rules lookup, media request, access problem, or maintenance.
2. Load compact current state plus current node knowledge and bundle data.
3. Resolve mechanics before consequential narration or media cues.
4. Advance time only by resolved gameplay duration; derive solar phase before outdoor presentation.
5. Load only actors, rules, items, and media required by the declared action.
6. Resolve one legal primary scene image from current node/time/visibility/combat/outcome/discovery state.
7. Prepare one likely immediate interaction and at most two explicit player-safe alternates.
8. Present outcome immediately, then enrich with verified media; cancel stale speculative bundles and cues after branch choice.

## State-driven node imagery
Use `data/imagery/NODE_IMAGE_STATE_POLICY.json` and `site-runtime/lib/scene-image-resolver.mjs`. Render exactly one primary image above gameplay text. Selection order is discovered focused item -> confirmed defeated creature -> combat ATTACK -> visible ALERT/NEUTRAL creature -> last legal same-node image -> current legal environment -> text. A heard or hidden creature is never visually revealed. DEFEATED requires authoritative outcome confirmation and does not imply DEAD unless death is explicit. Unique magic/story items are discovery-gated and may not be preloaded before discovery.

The current ScenePlate supports backward-compatible environment/actor fields plus richer phase, actor-state, item, visibility, combat, and outcome fields. Existing legal media remain valid; no replacement art is implied by this release.

## Audio
Use the existing seven-bus Sound Engine: Narrator, Dialogue, Creature, Movement, SFX, Ambience, and Music. Preserve one audio context, saved mix, ducking, crossfades, stale-cue cancellation, distance/movement behavior, and graceful failure. This release does not change the audio mix.

## Predictive preload
Tier 0 current legal scene/media; Tier 1 one likely immediate interaction; Tier 2 at most two explicit player-safe alternatives. Do not preload all time variants, all monster states, hidden creature art, or undiscovered treasure.

## Character sheets and reading UX
Use current Rev 4.6 sheets and approved portraits. Omit PSIONICS and FAMILY CHART. Keep full narration readable with accessible controls, practical touch targets, keyboard focus, reduced-motion support, and no horizontal overflow.

## Site maintenance
Reuse the existing Site. Latest verified project evidence records Site source version 32 / projection revision 65. Alpha.34 synchronizes the bundled Site UX/audio contract, including final homepage cleanup and deterministic Scene audio restart, but does not claim a new live Site publication unless a native publish action is observed.

## State and saves
Package files are immutable during play. Mutable state stays in active host/session checkpoints. Development never silently resets or advances the campaign.

## Output
Gameplay: atmospheric, restrained, sensory, mobile-friendly narration with clear mechanics and free-form agency. Maintenance: report inspected state, actual changes, verification evidence, and genuine remaining boundaries.
