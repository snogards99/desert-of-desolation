# Existing-Site integration and rollback

## Target and status
Apply only to existing private Site project `appgprj_6ac3ddb2142c81918d529d4c7504e59d`, recorded URL `https://desert-of-desolation.nreach-1221.chatgpt.site`. Preserve plugin `Plugin_3352cc65ee508191abeb37ffa759294d`. Baseline inspected: 1.3.7; rebased after inspection of the concurrent 1.3.8 node-knowledge release. Theme target: 1.4.0 / art engine 1.1.0. This package is theme source, NOT proof of a live Site update. The Site's frontend source was not present in the plugin export, and native Site-editing tools were not available in this maintenance session.

Use the original Site's editing conversation or its native edit action. Inspect the actual current components, styles, footer, icon configuration, asset resolver and audio boundary before integrating. Do not create a second Site. The existing legal statements, Wizards/TSR footer assets and licensing link are host-owned and must survive untouched. Do not invent missing logo files or claim permission has been verified.

## Smallest safe patch
1. Preserve a native Site revision before editing. Keep audience owner-only/private; no visibility changes.
2. Copy `theme.css`, `theme.mjs` and necessary `icons/` into the existing Site's static asset mechanism. The icon originals remain in the plugin; do not replace the eye design.
3. Load `theme.css` after the existing base CSS. Add `data-dod-theme="moonlit-ink"` to the existing game shell. Add the opt-in `dod-*` classes to matching components without replacing their event handlers, state owners, keys or audio component.
4. Use `dod-plate` for painted chapter art and `dod-ink-plate` for normal ink imagery. Display only actual available, approved, current-state art. The private reference specimens are NOT production defaults. Use gradients/icon until artwork is approved for its intended use.
5. Set `--dod-backdrop-image` only from an authorized decorative asset. Keep 6.5% opacity and opaque reading panels. Do not place background opacity on the parent container. Never use a DM map or future scene as decoration.
6. Keep the current seven-bus audio object and gesture-unlocked context mounted. Do not route theme lifecycle events to sound, state, combat or save actions.
7. Keep node IDs, media IDs, server discovery checks, private R2 storage, caching and bounded preload unchanged. Do not ship this skill's full `art-manifest.json`, sources, prompts or catalogue to a browser.
8. Add app/favicon derivatives to the actual supported icon surfaces only; retain the host's original manifest fields and identity. These are raster size derivatives, not a new logo.

## Optional defensive image adapter
The host may use `mountTheme` with a dedicated image/fallback. It does not assume a host framework, endpoint format or credential flow. The host must implement `authorizeMedia(packet)` against its verified current presentation grants. Omitting that function denies all art. Do not replace it with `() => true` in production. Same-origin checking is NOT access control.

```js
import { mountTheme } from './theme.mjs';
const presentation = mountTheme(existingGameRoot, {
  authorizeMedia: packet => existingVerifiedGrantChecker(packet),
  reducedMotion: currentPresentationSettings.staticImages
});
presentation.setRevision(currentAuthorizedPresentation.revision);
// Pass only the approved player-visible handle issued by the existing resolver.
presentation.present(currentAuthorizedPresentation.imagePacket);
// On state/knowledge change, clear old art before accepting a new packet.
presentation.setRevision(nextAuthorizedPresentation.revision);
// On grant revocation or session loss:
presentation.revoke();
// On cleanup: presentation.destroy();
```

Required markup: `<img data-dod-scene-image hidden alt="">` and an optional element with `data-dod-image-fallback`. Server-issued packet fields: `revision`, `grant.revision`, `grant.expiresAt` (Unix milliseconds), `media.src`, safe `media.alt`, `media.mode`, `media.available`, `media.approved`, `media.playerVisible`, `media.safeAltReviewed`, and `media.animated=false`. These browser flags are defense-in-depth only. The server remains authoritative. Static frames are intentionally the only accepted images; preserve any already-tested host animation system separately.

The adapter rejects expired, wrong-revision, off-origin, unapproved or undisclosed media before initiating image loading. It rechecks revocable authorization before display and cancels stale in-flight handlers. A presentation-only expiry timer also clears displayed art at grant expiry. Keep the host's existing revocation flow; call `revoke()` on session loss or early revocation. Never depend on CSS to conceal a secretly fetched image.

## Validation and rollback
Test current Site home, exploration, dialogue, inventory, journal, maps, sound controls, missing media, unauthorized/revoked media, keyboard focus, 320/390px layout, text zoom and reduced motion. Confirm no state or resource changes. Run the existing safe campfire diagnostic; do not generate a new encounter for QA. Browser decoding, browser playback, and physical listening are separate results.

Undo this integration by restoring the preserved native revision or removing the opt-in theme attribute/classes/stylesheet and destroying the optional adapter. Do not reset saves or replace audio files to roll back a visual theme.

## Evidence limits
The included preview and local browser fixture are authoring-only. They are not the live Site and not a playable copy of the campaign. Plugin packaging does not automatically publish Site files, install a Site connection, or complete physical iPhone QA.

## Final DOD_SITE master references
The approved desktop/mobile images are bundled as `assets/reference-ui/home-desktop-approved.png` and `home-mobile-approved.png`. In the Site they may be used as noninteractive loading/title posters or visual QA references. Do not make their baked controls interactive via image maps or invisible hotspots. Recreate the same hierarchy with semantic components and existing Continue/New Game/audio handlers. Use the engine breakpoint at 760px.
