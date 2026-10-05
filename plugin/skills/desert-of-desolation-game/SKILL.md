---
name: desert-of-desolation-game
description: Run, resume, audit, test, repair, and optimize the self-contained Desert of Desolation tabletop campaign. Use for gameplay, scenes, encounters, party/NPC/creature information, stats or character-sheet requests, node completeness, integrated node knowledge, preload/media/audio behavior, ChatGPT Sites presentation, pre-rendered GIF presentation, mobile-friendly play, and campaign/runtime maintenance.
---

# Desert of Desolation Game - Runtime v1.4.2

Run Desert of Desolation as a mobile-first ChatGPT game engine.

## Non-negotiable runtime rules
1. Use bundled structured data and manifests as authority. Ordinary gameplay must not require Desktop, local Node, Developer Mode, Drive, GitHub, Vercel, Railway, ElevenLabs, provider URLs, or an external content database.
2. ChatGPT Sites is the only authorized hosted presentation target. Site-primary media requires `data/SITE_CUTOVER_CHECKLIST.json` approval; preserve bundled media rollback until then.
3. Keep deterministic media IDs stable. Nodes never depend on raw Site URLs.
4. Resolve every ordinary turn through current mutable state, current `NodeKnowledgeEnrichment`, and `NodeBundleManifest`; deeper canonical/mechanical/state tables remain authoritative on conflict.
5. Snogard is player-controlled. Never invent Snogard speech, intent, consent, movement, spell choice, target choice, promises, or resource spending.
6. Discovery gates are absolute. Never leak hidden doors, traps, passwords, secret identities, puzzle solutions, teleport destinations, unseen creatures, undiscovered treasure, future encounters, or NPC-private knowledge through narration, UI, preload, audio, images, filenames, or metadata.
7. Fail closed on uncertainty. Optional media failure never blocks play.
8. Maintenance, hosting migration, preload tests, art integration and media QA never advance campaign state.
9. Consult `data/runtime/ArchitectureSupersession.jsonl` before treating legacy deployment/audio blockers as active.
10. Apply `data/VISUAL_THEME.json`, `dod.art-engine` 1.1.0, and `references/art-direction.md`. TITLE_SPLASH/HOME use DOD_SITE with bundled responsive masters; ordinary play uses DOD_INK; chapter/major discovery/climax uses DOD_PAINTED.
11. Title/home master screenshots are noninteractive poster/reference assets. Continue Adventure, New Game, navigation, audio controls and legal text must be real semantic controls using existing handlers; never use invisible image hotspots.

## Turn router
1. Classify intent: gameplay action, character sheet, rules lookup, media request, or maintenance.
2. Load compact current state plus current `NodeKnowledgeEnrichment` and `NodeBundleManifest`; load a scene capsule when applicable.
3. Load only actors/mechanics needed by the declared action.
4. Prepare one likely immediate interaction and at most two explicit player-safe alternates/successors.
5. Resolve mechanics before consequential narration/media cues.
6. Present outcome immediately; enrich only with verified host-supported media.
7. Promote the chosen branch and cancel stale speculative bundles/cues.

## Data routing
Use `references/data-layout.md`. `data/runtime/NodeKnowledgeEnrichment.jsonl` is the first compact integrated lookup; then hydrate deeper authority only when needed. For node maintenance use `references/node-completeness.md` and `data/runtime/NodeCompletenessSummary.json`. For media use deterministic IDs from `assets/audio/manifest.json`, `assets/gifs/manifest.json`, and `assets/ui/manifest.json`. For Sites read `references/sites-hosting.md`, `references/site-optimization.md`, `data/HOSTING_CONFIG.json`, `data/SITES_MEDIA_TRANSFER.json`, `data/SITE_RUNTIME_QA.json`, and `data/SITE_CUTOVER_CHECKLIST.json`.

## Node knowledge/completeness
The master inventory is 361 nodes. `NodeKnowledgeEnrichment` is additive and reference-driven; it never replaces canon, mechanics, NPC/creature/treasure dossiers, media manifests, or mutable state. Do not force every deeper table to 361 rows. Classify missing relationships `NOT_APPLICABLE`, `SOURCE_GAP`, or `REPAIR_REQUIRED`; never invent source-bound data to normalize counts.

## Audio/media
Use MP3 for active packaged audio. Preserve buses: Narrator; Character/NPC Dialogue; Creature Presence; Movement; Event/SFX; Ambience; Music. Before Site cutover, bundled media remains rollback-safe authority while Site assets are used for verified tests. After approval, resolve Site first then bundled fallback. Preserve ducking, fades/crossfades, loop continuity, distance/movement behavior, speech priority and discovery-safe timing.

## QA evidence
Decode success != playback success. Automated/headless simulation != real browser user-gesture proof. Mobile emulation != physical iPhone listening. Record evidence in `data/SITE_RUNTIME_QA.json`; never promote a stronger status by inference.

## Predictive preload
Follow `references/preload-strategy.md`: Tier 0 current scene; exactly one likely Tier 1 interaction; at most two explicit player-safe Tier 2 alternatives; everything else cold. `NodeKnowledgeEnrichment.preload` may summarize these references but never makes hidden content eligible. Cancel stale media immediately after commitment.

## Character sheet
Follow `references/character-sheet.md`. Trigger on `stats`, `statistics`, `show my character sheet`, `character sheet`, or standalone `sheet`; not `spreadsheet`.

## Visual output
Read `../desert-of-desolation-art-direction/SKILL.md`. Use DOD_SITE for title/home, DOD_INK for normal gameplay, and DOD_PAINTED for major presentation. Keep the approved eye silhouette and real semantic controls. Prompt/specimen/planned paths are not generated runtime art; missing node imagery remains unavailable and falls back safely.

## Sites maintenance
Never claim Site deployment, theme integration, playback, authenticated connection or physical-device QA unless verified by actual operations. Reuse the existing private Site. The final art engine/title-home assets are bundled but live Site theme integration remains pending a native Site-editing session. Do not repeat media migration unless reconciliation fails.

## State and saves
Follow `references/state-and-save.md`. Package files are immutable during play; conversation/host runtime carries mutable state/checkpoints. Never silently reintroduce Drive as runtime persistence.

## Output style
During play use atmospheric, restrained, sensory, mobile-friendly narration with clear mechanics and free-form agency. During maintenance report actual inspected state, changes, verification evidence, and real remaining boundaries.
