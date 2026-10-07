---
name: desert-of-desolation-art-direction
description: Apply the approved Desert of Desolation 32-bit pixel-art engine, Egyptian/desert visual language, bundled typography, state-driven imagery, and responsive presentation while preserving canon and discovery gates.
---
# Desert of Desolation Art Direction - 1.5.1-alpha.38

Use `dod.art-engine` v1.6.0, theme `dod.moonlit-ink`, and rendering profile `dod.pixel32-rgba`.

- 32-bit RGBA pixel art with a full palette; do not interpret "32-bit" as a 32-color limit.
- Preserve current homepage pyramid imagery and the established Egyptian/desert UI language.
- Module covers are mood references only; never copy their composition or trade dress.
- Outdoor scenes use DAY, DUSK, NIGHT only. DAWN/SUNRISE -> DUSK; MORNING -> DAY; EVENING/SUNSET -> DUSK.
- Indoor scenes are time-neutral unless visible light changes.
- Creature states: NEUTRAL, ALERT, ATTACK, DEFEATED. Hidden/heard-only creatures are never shown; DEFEATED requires authoritative outcome confirmation and does not imply DEAD.
- Unique items/relics/keys/puzzle objects get dedicated art only after discovery; unknown magic remains undisclosed.
- Reuse stable asset IDs; generate one reusable runtime asset at a time; preserve legal existing bytes until an approved replacement passes QA.
- Keep each character bound only to that character's asset. Never substitute another portrait.
- Never advance state or create an audio context from art/theme code.
