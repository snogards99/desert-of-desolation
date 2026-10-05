---
name: desert-of-desolation-art-direction
description: Apply the approved final Desert of Desolation art engine to the game and existing private ChatGPT Site. Use for title/home UI, responsive presentation, image selection, visual QA, illustration prompts, journal/dialogue/inventory/map presentation, and icon/theme work. Use DOD_SITE for the approved desktop/mobile interface, DOD_PAINTED for title/chapter/major cinematic art, and DOD_INK for ordinary gameplay. Preserve canon, discovery gates, media IDs, state, audio, privacy, and the existing Site; supersede legacy green pixel-art authoring without replacing working systems.
---

# Desert of Desolation Art Direction

Use art engine `dod.art-engine` v1.1.0 and theme `dod.moonlit-ink` v1.1.0.

## Workflow
1. Inspect the current game release, current presentation, approved references, and player-visible state. Work in maintenance mode unless explicitly playing.
2. Read `references/style-bible.md`, `references/responsive-layout.md`, `references/component-guidelines.md`, and `references/continuity-and-spoiler-rules.md`.
3. Resolve presentation through `assets/art-engine.json` / `assets/art-engine.mjs`: `DOD_SITE` for TITLE_SPLASH/HOME, `DOD_PAINTED` for chapter/major discovery/climax, and `DOD_INK` for ordinary play.
4. Treat `assets/reference-ui/home-desktop-approved.png` and `assets/reference-ui/home-mobile-approved.png` as approved master visual references and noninteractive splash/poster assets. Recreate controls semantically; never use invisible hotspots over baked controls.
5. Reuse existing background/actor/composite IDs and A/B/C state relationships. Reconstruct legacy prompts from verified visible facts; never concatenate green pixel-art instructions with the final modes.
6. For Site work, reuse the existing private Site and follow `references/site-integration.md`. Preserve the root game/audio/state ownership and legal/footer content.
7. For new illustrations, compile a DM-reviewed visible-scene packet using `scripts/compile_prompt.py`, generate with the available image tool, inspect actual bytes, then mark eligible only after approval.
8. Run `scripts/validate_theme.py`, `scripts/test_prompt.py`, and `scripts/test_art_engine.mjs`; rebuild CSS after token/component edits. Keep local/browser-fixture results distinct from live-Site and physical-device QA.

## Runtime boundaries
- Preserve the supplied eye icon silhouette and original source bytes.
- Preserve source PDFs, existing media bytes, campaign state, AD&D rules, actor identities, stable IDs, and audio priorities.
- Continue Adventure restores authoritative existing state. New Game must use the existing confirmation/reset flow and never silently overwrite a save.
- The art engine is presentation selection only. It never creates an audio context, fetches audio, changes state, spends resources, advances time, or authorizes hidden media.
- Discovery gates remain absolute. Never expose hidden encounters, future-state filenames, puzzle solutions, map secrets, undiscovered treasure, or private NPC knowledge through art/preload/alt text.
- Master UI screenshots are not a substitute for semantic controls. They may be displayed only as noninteractive poster/splash assets or used for visual QA.
- Missing imagery becomes text or an approved background. Wrong-state creature art is never a fallback.
- Do not introduce external fonts, providers, desktop runtimes, or substitute hosts.

## Resource map
- `assets/art-engine.json`, `assets/art-engine.mjs`: deterministic surface/mode/responsive selection.
- `assets/reference-ui/`: approved desktop/mobile master UI references.
- `assets/theme.tokens.json`, `assets/theme.css`, `assets/theme.mjs`: shared visual implementation.
- `assets/templates/homepage.md`, `assets/templates/title-splash.md`: final home/title patterns.
- `assets/templates/`: painted, ink, composite, NPC, object, and journal patterns.
- `assets/art-manifest.json`: private production manifest; never send the whole file to a player.
- `references/style-bible.md`: palette, medium, composition, typography.
- `references/responsive-layout.md`: desktop/mobile responsive contract.
- `references/component-guidelines.md`: semantic DOD_SITE component contract.
- `references/site-integration.md`: existing-Site integration and rollback.
- `references/verification.md`: actual tested scope and remaining boundaries.
