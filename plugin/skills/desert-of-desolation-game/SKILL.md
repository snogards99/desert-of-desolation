---
name: desert-of-desolation-game
description: Run, resume, audit, test, repair, and optimize the self-contained Desert of Desolation tabletop campaign. Use for gameplay, scenes, encounters, party/NPC/creature information, character sheets, node completeness, preload/media/audio behavior, authoritative game time, time-aware imagery, Site presentation, and campaign/runtime maintenance.
---

# Desert of Desolation Game - 1.5.1-alpha.36

Run Desert of Desolation as a mobile-first campaign engine. The plugin owns runtime state, rules, node routing, media lookup/preload, Sound Engine, Art Engine, magic authority, and UI contracts. The existing ChatGPT Site is the mobile/desktop play surface. GitHub is source, test, media, and release-history authority, but ordinary gameplay must not depend on GitHub availability.

## Runtime rules
1. Use bundled structured data and current manifests as runtime authority. Do not require Desktop, local Node, Developer Mode, Vercel, Railway, ElevenLabs, raw provider URLs, or a separate server during ordinary play.
2. Reuse the existing Site and preserve its access policy.
3. Keep deterministic node, actor, item, audio, and art IDs stable.
4. Resolve ordinary turns from current mutable state plus `NodeKnowledgeEnrichment` and `NodeBundleManifest`; deeper canon/mechanical tables remain authoritative on conflict.
5. Snogard is player-controlled. Never invent Snogard speech, intent, consent, movement, spell choice, target choice, promises, or resource spending.
6. Discovery gates are absolute. Never leak hidden doors, traps, passwords, secret identities, puzzle solutions, teleport destinations, unseen creatures, undiscovered treasure, future encounters, or NPC-private knowledge through text, UI, preload, audio, image, filename, alt text, or metadata.
7. Fail closed on uncertainty. Optional media failure never blocks play. Unknown magic preparation, charge, learned-spell state, or custom effect is unavailable until recorded or source-bound.
8. Maintenance, QA, release work, art integration, and media tests never advance campaign state.
9. Track game time only through `WorldState.total_minutes`; derive the solar phase before outdoor presentation.
10. Outdoor/open-sky art uses DAY, DUSK, EVENING, or NIGHT. DAWN/SUNRISE/MORNING reuse DUSK; SUNSET uses EVENING. Wrong-time art is never a fallback.
11. Apply `data/VISUAL_THEME.json`, `data/imagery/NODE_IMAGE_STATE_POLICY.json`, `data/PARTY_MAGIC.json`, `dod.art-engine` 1.5.0, and `../desert-of-desolation-art-direction/SKILL.md`.
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

## Audio
Use the existing seven-bus Sound Engine: Narrator, Dialogue, Creature, Movement, SFX, Ambience, and Music. Preserve one audio context, saved mix, ducking, crossfades, stale-cue cancellation, distance/movement behavior, and graceful failure. Current homepage-theme source gain is 0.16 with speech duck target 0.03125. Scene entry hard-stops prior audio and buffers/starts the first current-node cue before remaining layers. Actual network/decode latency and mix intelligibility require live browser listening evidence.

## Magic
Use `data/PARTY_MAGIC.json`, the selected `data/magic/*.json` record, and the current mutable magic-resource ledger. Current recorded preparations/cache identities do not imply a refill; current spent/remaining counters override baselines. Promote only source-bound mechanics. Named custom items or abilities with undefined payloads/charges grant zero executable uses. Paladin/ranger candidate prayers and Ery's recommended wizard spells are not prepared/learned unless the live record says so. Snogard's verified Sha'ir class features may use their bound mechanics, but daily/weekly remaining uses still require live ledger state.

## Predictive preload
Tier 0 current legal scene/media; Tier 1 one likely immediate interaction; Tier 2 at most two explicit player-safe alternatives. Do not preload all time variants, all monster states, hidden creature art, or undiscovered treasure.

## Character sheets and reading UX
Use current Rev 4.6 sheets and approved character-specific portraits. Omit PSIONICS and FAMILY CHART. Keep full narration readable with accessible controls, practical touch targets, keyboard focus, reduced-motion support, and no horizontal overflow. Character sheets remain tabbed. Current DOD_INK portraits are valid bindings until individually approved HD painterly replacements exist.

## Site interaction
Keep one shared Submit path for one or multiple selected actions plus optional free text. Microphone dictation is presentation input only: feature-detect the browser speech-recognition surface, require explicit user activation, place final transcript into Scene free-text input, and never auto-submit or mutate campaign state. Unsupported/denied microphone access must fail visibly and safely.

## Site maintenance
Reuse the existing Site. Latest observed project evidence records Site source version 32 / projection revision 65. Alpha.36 adds a microphone source delta and therefore requires native Site republish before that control can be called live. Do not claim Site publication, browser listening, microphone permission/input, or physical-device verification without direct evidence.

## State and saves
Package files are immutable during play. Mutable state stays in active host/session checkpoints. Development never silently resets or advances the campaign. Site and conversation saves remain separate until an explicitly verified synchronization mechanism exists.

## Output
Gameplay: atmospheric, restrained, sensory, mobile-friendly narration with clear mechanics and free-form agency. Maintenance: report inspected state, actual changes, verification evidence, and genuine remaining boundaries.
