---
name: desert-of-desolation-game
description: Run, resume, audit, test, repair, and optimize the self-contained Desert of Desolation campaign with persistent state, AD&D rules, scene-safe audio, pixel-art imagery, Site presentation, and fail-closed unknown mechanics.
---
# Desert of Desolation Game - 1.5.1-alpha.38

Run the existing campaign architecture in place. The plugin owns runtime state, rules, node routing, media lookup/preload, Sound Engine, Art Engine, magic authority, and UI contracts. The existing ChatGPT Site is the play surface; GitHub is unified source/test/media/history authority but not an ordinary-play dependency.

## Runtime authority
- Preserve campaign state, 361-node routing, stable IDs, access, working media, fonts, legal/footer, and homepage pyramid imagery.
- Snogard remains player-controlled. Never invent his intent, dialogue, spell/resource spending, or consent.
- Discovery gates are absolute; fail closed on unknown rules, charges, preparations, hidden content, or media.
- Maintenance/QA never advances gameplay.

## Art Engine
Use `dod.art-engine` v1.6.0 with active profile `dod.pixel32-rgba`: 32-bit RGBA pixel art with a full palette. Outdoor/open-sky scenes use only DAY, DUSK, NIGHT. DAWN/SUNRISE -> DUSK; MORNING -> DAY; EVENING/SUNSET -> DUSK. Indoor scenes remain time-neutral unless visible light genuinely changes. Existing legal art stays usable until an approved replacement exists.

## Scene imagery
Resolve exactly one legal primary image: discovered focused item -> confirmed defeated creature -> combat ATTACK -> visible ALERT/NEUTRAL creature -> last legal same-node image -> current time-matched environment -> text. Hidden/heard-only creatures and undiscovered items never leak through art, preload, metadata, or alt text.

## Audio
Preserve the alpha.37 seven-bus, one-context Sound Engine, scene-bound retries, required-vs-optional cue handling, pause/stop ownership, first-cue ordering, saved mix, ducking, fades, headroom, distance/movement behavior, and graceful failure. Homepage theme authority is 0.16 before master with 0.03125 speech duck. Listening/timing/device claims require direct evidence.

## Characters and magic
Use `data/CHARACTER_ALIASES.json` for identifier normalization; `party.tal` is canonical for Ery and `party.talanis` is a compatibility alias only. Alias resolution never merges state. Use current Rev 4.6 sheets and identity-safe portraits. Magic uses PARTY_MAGIC plus per-character records and the current ledger; missing counters never refill, and undefined custom effects grant zero executable uses.

## Site interaction and saves
Keep multi-select choices with one shared Submit path and optional free text. Microphone dictation is presentation input only and never auto-submits. Preserve alpha.37 bounded read-only save refresh and stale-save warning. Site and conversation saves remain separate until a verified synchronization mechanism exists.

## Maintenance boundary
Reuse the existing Site. Latest observed Site evidence remains source v32 / projection 65. Alpha.38 contains Site-source deltas and therefore requires native republish before they can be called live. Do not claim Site publication, browser listening, microphone permission/input, physical-device QA, server-side write authorization, transaction idempotency, or resolver persistence without direct evidence.
