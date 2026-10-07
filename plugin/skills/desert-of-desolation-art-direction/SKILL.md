---
name: desert-of-desolation-art-direction
description: Apply the approved Desert of Desolation high-definition painted art engine, classic module-cover visual language, bundled typography, state-driven imagery, and responsive presentation to the game and existing ChatGPT Site. Preserve canon, discovery gates, media IDs, state, audio, and Site access.
---

# Desert of Desolation Art Direction - 1.5.1-alpha.24

Use art engine `dod.art-engine` v1.5.0, theme `dod.moonlit-ink` v1.4.0, rendering profile `dod.hd-painted-module-realism`, and bundled Cinzel/Noto typography.

## Visual authority
- Primary painted reference: supplied I3 `Pharaoh` cover.
- Supporting references: supplied I4 `Oasis of the White Palm` and I5 `Lost Tomb of Martek` covers.
- Reproduce broad visual characteristics, never exact cover compositions or trade dress: classic TSR-era hand-painted fantasy illustration, naturalistic anatomy, tactile materials, rich desert light, deep atmospheric shadow, strong silhouettes, restrained supernatural light, and visible painterly texture.
- Prefer believable imperfection and purposeful asymmetry over glossy AI-fantasy polish.
- Do not use pixel art, indexed palettes, nearest-neighbor enlargement, anime/cel shading, fake text, pseudo-hieroglyphs, plastic CGI surfaces, or generic modern concept-art gloss.

## Workflow
1. Inspect current release, player-visible state, approved sources, current node description, sound/ambience profile, creature bindings, discovery state, and game time before authoring art.
2. Resolve UI through `DOD_SITE`; ordinary gameplay through `DOD_ILLUSTRATED`; major presentation through `DOD_PAINTED_HD`.
3. Indoor/enclosed scenes are time-neutral unless open-sky light materially affects what is visible.
4. Outdoor/open-sky scenes use DAY, DUSK, EVENING, and NIGHT. DAWN/SUNRISE/MORNING reuse DUSK; SUNSET uses EVENING.
5. Outdoor variants may use controlled camera variety: slight left/right approach, modest elevation, ground level, or slightly closer/farther framing. Preserve canonical geography, landmarks, architecture, scale, route logic, and discovery state.
6. Monster stills use NEUTRAL, ALERT, ATTACK, and DEFEATED with one canonical design. ATTACK never confirms a hit; DEFEATED requires authoritative resolution.
7. Unique magic/story items, relics, keys, puzzle objects, and distinctive treasure receive dedicated images only when legally discovered. Unidentified properties remain visually undisclosed.
8. Generate and review one runtime asset at a time. Contact sheets, collages, concept boards, and atlases are reference-only and never runtime-eligible.
9. Reuse stable background, actor, and item IDs. Never invent unsupported props, creatures, routes, treasure, or iconography.
10. Availability is evidence-based. Only exact existing bytes that pass QA may be marked available/runtime-eligible.

## Runtime image sequence
Display the legal current image above gameplay text:
1. environment on entry;
2. NEUTRAL/ALERT when a creature is visible;
3. ATTACK during ordinary combat rounds;
4. DEFEATED after confirmed resolution;
5. item/treasure image when discovered;
6. return to the legal environment when context moves on.

If no new legal image exists, reuse the last legal image or current legal environment. Never use wrong-time, wrong-state, future-state, or spoiler art as fallback.

## Quality rejects
Reject malformed anatomy, duplicated limbs/props, repeated faces, inconsistent equipment, melted ornament, impossible perspective, floating/fused objects, fake inscriptions, inconsistent lighting, excessive symmetry, meaningless clutter, oversharpened CGI surfaces, and unsupported fantasy motifs.

## Site and mobile
Keep imagery readable on iPhone and desktop. Protect text and control safe areas, avoid horizontal overflow, preserve semantic controls, respect reduced motion, and keep title/scene art from pushing the first actionable text excessively below the fold.

## Runtime boundaries
- Preserve campaign state, AD&D rules, source PDFs, actor identities, stable IDs, audio priorities, fonts, legal/footer content, and access policy.
- Never leak hidden encounters, doors, traps, puzzle solutions, identities, treasure, powers, destinations, or future outcomes through art, filename, alt text, preload, or metadata.
- Theme/image code never creates an audio context and never advances time.
- ElevenLabs is not an image-authoring path for this project; use it only for missing audio when explicitly needed.

## Legacy first-20 assets
`data/imagery/FIRST20_STILL_ART.json` and existing first-20 bytes remain a rollback-safe legacy runtime fallback until HD replacements exist and pass QA. `references/first20-pixel-art.md` is retained only as a tombstone for historical lookup; it is not an authoring specification.
