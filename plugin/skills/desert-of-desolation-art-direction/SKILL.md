---
name: desert-of-desolation-art-direction
description: Apply the approved Desert of Desolation art engine, full-color 32-bit RGBA pixel-art gameplay profile, bundled typography, time-of-day outdoor image selection, and responsive presentation to the game and existing ChatGPT Site. Preserve canon, discovery gates, media IDs, state, audio, and current Site access.
---

# Desert of Desolation Art Direction

Use art engine `dod.art-engine` v1.3.0, theme `dod.moonlit-ink` v1.1.0, pixel-art profile `dod.pixel32-rgba`, and typography profile `dod.typography.cinzel-noto-bundled` v1.1.0.

## Workflow
1. Inspect the current release, player-visible state, approved references, and the first-20 still-art manifest when relevant. Work in maintenance mode unless explicitly playing.
2. Resolve UI through `DOD_SITE`; ordinary gameplay through `DOD_INK`; major presentation through `DOD_PAINTED`. New gameplay imagery uses the 32-bit RGBA pixel profile while retaining those mode semantics.
3. Pixel art must use deliberate pixel clusters, crisp silhouettes, hard-edged shading, selective dithering, and nearest-neighbor enlargement. Do not impose a 64-color limit and do not fake pixel art by merely applying a mosaic filter.
4. Before selecting an outdoor/open-sky scene image, read `WorldState.total_minutes`, resolve MORNING/DAY/EVENING/NIGHT with `TIME_OF_DAY_POLICY.json`, and select only the matching approved variant. Presentation never advances the clock.
5. Outdoor phase variants share one locked composition: camera, geography, architecture, props, scale, horizon, and route geometry remain fixed; only legitimate light, sky, shadow, atmosphere, and color temperature change.
6. Indoor scenes remain time-neutral unless explicit open-sky/exterior light matters.
7. Monster stills use NEUTRAL, ALERT, ATTACK, and DEFEATED. Preserve one canonical design; ATTACK never implies a hit; DEFEATED is legal only after authoritative outcome confirmation.
8. No new GIFs, sprite sheets, APNGs, or interpolation are part of the first-20 still-art pass. Animation is a later dedicated phase.
9. Use Cinzel for non-logo titles/headings/labels/general text and bundled Noto Sans Egyptian Hieroglyphs only for authentic Egyptian hieroglyphic Unicode. No runtime Google Fonts request.
10. Preserve source/official logo lettering as artwork. Exact inscriptions, puzzle text, names, numbers, and translations use deterministic text layers rather than generated spelling.
11. Reuse stable background/actor IDs and reconstruct prompts from verified visible facts rather than concatenating legacy green-pixel or monochrome prompts.
12. For Site work, reuse the existing Site. Do not change access policy as a side effect of an art update.
13. Availability is evidence-based: if a real approved image byte is missing, keep `available=false` and `runtime_eligible=false`; fall back to an approved same-scene image or text.

## Runtime boundaries
- Preserve campaign state, AD&D rules, source PDFs, existing media bytes, actor identities, stable IDs, audio priorities, fonts, and legal/footer content.
- Never expose hidden encounters, future-state filenames, puzzle solutions, undiscovered treasure, secret routes, or private NPC knowledge through art, preload, alt text, or metadata.
- Wrong-state creature art and wrong-time outdoor art are never fallbacks.
- Do not preload all four time phases or all monster states.
- Theme/image code never creates an audio context or advances time.

## First-20 profile
Read `../desert-of-desolation-game/data/imagery/FIRST20_STILL_ART.json` and `references/first20-pixel-art.md`. The manifest records the first 20 ordered nodes, outdoor/indoor classification, time variants, mobile composition notes, reuse groups, and the troll's four still states.
