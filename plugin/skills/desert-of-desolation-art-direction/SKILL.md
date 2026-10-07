---
name: desert-of-desolation-art-direction
description: Apply the approved Desert of Desolation high-definition painted art engine, classic module-cover visual language, bundled typography, state-driven imagery, and responsive presentation to the game and existing ChatGPT Site. Preserve canon, discovery gates, media IDs, state, audio, and Site access.
---

# Desert of Desolation Art Direction - 1.5.1-alpha.33

Use art engine `dod.art-engine` v1.5.0, theme `dod.moonlit-ink` v1.5.0, rendering profile `dod.hd-painted-module-realism`, and bundled Cinzel/Noto typography.

## Visual authority
- Primary painted reference: supplied I3 `Pharaoh` cover; I4 and I5 are supporting references.
- Use classic TSR-era hand-painted fantasy language: naturalistic anatomy, tactile materials, rich desert light, atmospheric shadow, strong silhouettes, restrained supernatural light, and visible painterly texture.
- Prefer believable imperfection and purposeful asymmetry over glossy AI-fantasy polish.
- No pixel art, indexed palette styling, anime/cel shading, fake text, pseudo-hieroglyphs, plastic CGI, or generic modern concept-art gloss.

## Authoring and runtime rules
1. Inspect verified node description, sound/ambience, visible actors, discovery state, and game time before creating or selecting art.
2. Indoor/enclosed scenes are time-neutral unless visible lighting genuinely changes the scene.
3. Outdoor/open-sky scenes use DAY, DUSK, EVENING, NIGHT; DAWN/SUNRISE/MORNING reuse DUSK and SUNSET uses EVENING. Controlled viewpoint variation is allowed while geography and route logic remain locked.
4. Creature states are NEUTRAL, ALERT, ATTACK, DEFEATED. ATTACK never confirms a hit; DEFEATED requires authoritative resolution and does not mean DEAD unless death is explicitly confirmed.
5. A creature that is hidden, suspected, or merely heard must not be shown.
6. Unique magic/story items, relics, keys, puzzle objects, and distinctive treasure receive dedicated images only after legal discovery. Unknown magical properties remain undisclosed.
7. Generate one runtime asset at a time. Contact sheets/collages are reference-only and never runtime-eligible.
8. Reuse stable environment, actor, and item IDs. Never invent unsupported creatures, props, routes, treasure, or iconography.
9. Only exact existing bytes that pass canon, spoiler, continuity, mobile, and binding QA may be marked runtime-eligible.

## Runtime image sequence
Follow `../desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json`: discovered focused item -> confirmed defeated creature -> combat ATTACK -> visible ALERT/NEUTRAL creature -> last legal same-node image -> current legal environment -> text. Display exactly one primary image above gameplay text.

## Runtime boundaries
Preserve campaign state, AD&D rules, source PDFs, stable IDs, audio priorities, fonts, legal/footer content, and access policy. Never leak hidden encounters, doors, traps, puzzle solutions, identities, treasure, powers, destinations, or future outcomes through images or metadata. Theme/image code never creates an audio context or advances time. ElevenLabs is audio-only for explicitly missing audio needs.

## Legacy first-20 assets
Existing first-20 bytes remain rollback-safe fallback until HD replacements exist and pass QA. Historical pixel-art guidance is not an authoring specification.
