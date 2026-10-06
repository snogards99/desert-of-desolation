# Existing-Site integration and rollback

## Target and status
Apply only to the existing private Desert of Desolation Site. Preserve plugin `Plugin_3352cc65ee508191abeb37ffa759294d`, the existing Site identity, private audience, legal/footer content, state, and audio boundary. Plugin packaging is not proof that the live Site has been edited.

## Smallest safe patch
1. Preserve a native Site revision before editing; do not create a duplicate Site.
2. Copy `theme.css`, `fonts.css`, and the `fonts/` directory into the Site static asset mechanism while preserving relative paths.
3. Load `theme.css` first and `fonts.css` immediately after it. Remove the former Google Fonts `@import`; the runtime must not depend on fonts.googleapis.com or fonts.gstatic.com.
4. Preload only the primary `Cinzel-VariableFont_wght.ttf` when the Site supports safe font preloading. Load Noto Egyptian on demand. Do not preload every static fallback face.
5. Add `data-dod-theme="moonlit-ink"` to the existing game shell and use semantic `dod-*` classes without replacing state, audio, save, or event handlers.
6. Apply Cinzel to non-logo UI/general text. Preserve official/supplied logo lettering as image assets.
7. For authentic Egyptian text, use `data-dod-script="egyptian-hieroglyphs"`. Render any verified player-visible translation immediately below in Cinzel.
8. For unknown/untranslated ancient speech without authentic source glyphs, use a clear untranslated-language treatment in Cinzel; do not substitute Egyptian hieroglyphs.
9. Put exact canon-critical text in live/deterministic typography rather than baked/generated artwork.
10. Keep node IDs, media IDs, caching, bounded preload, the seven-bus audio object, and the gesture-unlocked audio context unchanged.

## Font-failure behavior
Bundled font loading is presentation-only. If a font file is unavailable or rejected, continue immediately with the declared serif/system fallback. Font failure never blocks narration, choices, combat, saves, audio controls, or accessibility.

## Validation and rollback
Test title/home, exploration, dialogue, authentic Egyptian text, unknown/untranslated language, translated inscriptions, inventory, journal, maps, keyboard focus, 320/390px layout, text zoom, reduced motion, and network-offline behavior. Verify no request to Google Fonts occurs. Verify the variable Cinzel file covers weights 400-900 and static faces map to 400/500/600/700/800/900. Confirm no state/resource changes.

Rollback by restoring the preserved native Site revision or removing the opt-in font/theme files. Do not reset saves or replace audio files to roll back typography.
