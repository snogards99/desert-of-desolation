---
name: desert-of-desolation-game
description: Run, resume, audit, test, repair, and optimize the self-contained Desert of Desolation tabletop campaign. Use for gameplay, scenes, encounters, party/NPC/creature information, character sheets, node completeness, preload/media/audio behavior, authoritative game time, time-aware imagery, Site presentation, and campaign/runtime maintenance.
---

# Desert of Desolation Game - 1.5.1-alpha.30

Run Desert of Desolation as a mobile-first campaign engine. The plugin owns runtime state, rules, node routing, media lookup/preload, Sound Engine, Art Engine, and UI contracts. The existing ChatGPT Site is the mobile/desktop play surface. GitHub is source, test, media, and release-history authority, but ordinary gameplay must not depend on GitHub availability.

## Runtime rules
1. Use bundled structured data and current manifests as runtime authority. Do not require Desktop, local Node, Developer Mode, Vercel, Railway, ElevenLabs, raw provider URLs, or a separate server during ordinary play.
2. Reuse the existing Site and preserve its access policy. Never create a replacement Site just to solve a presentation issue.
3. Keep deterministic node, actor, item, audio, and art IDs stable.
4. Resolve ordinary turns from current mutable state plus `NodeKnowledgeEnrichment` and `NodeBundleManifest`; deeper canon/mechanical tables remain authoritative on conflict.
5. Snogard is player-controlled. Never invent Snogard speech, intent, consent, movement, spell choice, target choice, promises, or resource spending.
6. Discovery gates are absolute. Never leak hidden doors, traps, passwords, secret identities, puzzle solutions, teleport destinations, unseen creatures, undiscovered treasure, future encounters, or NPC-private knowledge through text, UI, preload, audio, image, filename, alt text, or metadata.
7. Fail closed on uncertainty. Optional media failure never blocks play.
8. Maintenance, QA, release work, art integration, and media tests never advance campaign state.
9. Track game time only through `WorldState.total_minutes`. Resolve the solar phase from `TIME_OF_DAY_POLICY.json` after every legitimate time mutation.
10. Outdoor/open-sky art uses current approved DAY, DUSK, EVENING, or NIGHT imagery. DAWN/SUNRISE/MORNING reuse DUSK; SUNSET uses EVENING. Wrong-time art is never a fallback.
11. Apply `data/VISUAL_THEME.json`, `dod.art-engine` 1.5.0, and `../desert-of-desolation-art-direction/SKILL.md`.
12. The old first-20 pixel-style package is a legacy runtime fallback only until individually approved HD replacements exist. Do not treat legacy pixel guidance as the current authoring target.
13. ElevenLabs is authoring-only for missing audio when explicitly needed. It is not a gameplay dependency and is not used for image generation.
14. The bundled Site source under `site-runtime/` must remain dependency-complete: every relative import must resolve inside the plugin release before source/release approval.

## Turn router
1. Classify intent: gameplay, character sheet, rules lookup, media request, access problem, or maintenance.
2. For gameplay, load compact current state plus current node knowledge and bundle data.
3. Resolve mechanics before consequential narration or media cues.
4. Advance time only by resolved gameplay duration; derive the current solar phase before outdoor presentation.
5. Load only the actors, rules, items, and media required by the declared action.
6. Prepare one likely immediate interaction and at most two explicit player-safe alternates.
7. Present the outcome immediately, then enrich it with verified host-supported media.
8. Cancel stale speculative bundles and cues after the player chooses a branch.

## Data routing
- Current integrated lookup: `data/runtime/NodeKnowledgeEnrichment.jsonl`
- Node bundles: `data/runtime/NodeBundleManifest.jsonl`
- Daylight: `data/TIME_OF_DAY_POLICY.json`
- Visual theme: `data/VISUAL_THEME.json`
- First-20 legacy fallback manifest: `data/imagery/FIRST20_STILL_ART.json`
- Node maintenance: `data/runtime/NodeCompletenessSummary.json`
- Plugin access: `data/PLUGIN_ACCESS.json`
- Site configuration: `data/HOSTING_CONFIG.json`

## Audio
Use the existing seven-bus Sound Engine: Narrator, Dialogue, Creature, Movement, SFX, Ambience, and Music. Preserve one audio context, saved mix, ducking, crossfades, stale-cue cancellation, distance/movement behavior, and graceful failure. Current alpha.30 configuration target is master 0.50, Narrator 1.00, Dialogue 0.90, Creature 0.35, Movement 0.25, SFX 0.80, Ambience 0.42, Music 0.18, with homepage theme base gain 0.10 and speech duck target 0.03125. Physical-device listening remains a separate evidence gate.

## Art and presentation
Use the HD painterly module-realism profile. New art is not pixel art. Outdoor variants may use controlled viewpoint variation while preserving geography, route logic, landmarks, and discovery state. Monsters use NEUTRAL, ALERT, ATTACK, and DEFEATED states. Unique magical/story items receive dedicated discovery-gated stills. The legal current image sits above gameplay text; if no new legal image exists, reuse the last legal image or current legal environment.

Legacy first-20 images remain usable only as fallback until replacement bytes pass canon, spoiler, continuity, anatomy/material, mobile, and runtime-binding QA. Never remove a working fallback before its replacement is installed and verified.

## Predictive preload
Tier 0: current legal scene/media. Tier 1: one likely immediate interaction. Tier 2: at most two explicit player-safe alternatives. Everything else stays cold. Do not preload all time variants, all monster states, or hidden treasure.

## Character sheets and reading UX
Use the current Rev 4.6 sheets and approved portraits. Omit PSIONICS and FAMILY CHART. Keep headings, controls, and choices semantic and accessible. Keep full narration readable in the DOM; use contained reading views or paging rather than forcing long document scroll. Preserve 44px-or-larger practical touch targets, keyboard focus visibility, reduced-motion support, and no horizontal overflow at narrow mobile widths.

## Site maintenance
Reuse the existing Site. The observed live browser surface is Site source version 29 / projection revision 59 unless newer evidence is inspected. Do not claim a new live Site publication or browser/device verification without observing it. Source/config changes may be prepared and committed while the native Site deployment remains unchanged.

## State and saves
Package files are immutable during play. Mutable state stays in the active host/session checkpoints. Development must never silently reset or advance the campaign.

## Output
Gameplay: atmospheric, restrained, sensory, mobile-friendly narration with clear mechanics and free-form agency. Maintenance: report actual inspected state, real changes, verification evidence, and genuine remaining boundaries.
