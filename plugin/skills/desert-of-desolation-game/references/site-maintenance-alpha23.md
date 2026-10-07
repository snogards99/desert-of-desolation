# Desert of Desolation Site/Game Engine Maintenance — Alpha.23

Update the existing Desert of Desolation Site/game engine in place. Do not rebuild the architecture and do not create a replacement Site. Preserve campaign state, current homepage pyramid imagery, working audio/media IDs/assets, legal/footer content, access settings, the 361-node routing/data model, and the established Egyptian visual identity.

## Priority 1 — audio and narration

Fix audio before visual polish. Preserve the existing single AudioContext and seven semantic buses. Ensure Play, Pause/Resume, Stop, navigation, node changes, and stale-cue cancellation are deterministic. Stop must cancel pending/delayed starts; entering a new node must retire superseded narration/SFX while preserving only legal persistent beds.

For node entry, prepare the node's discovery-safe narration and complete sound scene immediately, but start audible playback only when browser autoplay policy permits (existing running context or a valid user gesture). Never create a second AudioContext to work around autoplay.

Homepage music: preserve the existing title-theme identity/media ID. Remove the quiet lead-in at the byte level when the source file is available; otherwise use a decoded first-audible offset until the re-rendered bytes can be substituted under the same stable ID. Raise the title-theme output from 0.08 to about 0.10 (+25%) and its speech-duck target proportionally to about 0.031. Raise default ambience from 0.35 to about 0.42 (+20%). Retain the existing decoded-peak headroom guard/compressor and verify no clipping.

Synchronize narration with a progressive book-like text emphasis. Keep the entire node text present in the DOM and readable at all times; the synchronized effect is emphasis/reveal, not content withholding. On narration failure, the full text remains usable.

## Priority 2 — interaction and reading layout

Allow multiple action choices when the node supports it. Each selected action must have an obvious persistent highlighted/checked state using semantic `aria-pressed` or checkboxes. Do not execute individual actions on tap in multi-select mode. Add one clear Submit button that commits the current selection set through the existing adjudication handler. Preserve existing single-choice behavior where multi-select is not legal.

Add microphone input as an optional enhancement, not a dependency. Use one persistent lower-right microphone control with Off / On / Listening states, respect safe areas, request microphone permission only from an explicit user gesture, expose accessible labels/status, and keep keyboard/text entry fully functional when speech input is unavailable or denied.

Move the existing ornate framed node/place title from the footer to the top of the scene. Remove the redundant plain node title rather than duplicating it. Make display titles slightly bolder while preserving the current typeface. Darken the green record-sheet theme modestly without changing the overall palette family.

Long node text must not force unnecessary document scrolling. Use a contained reading surface with internal scrolling or paging while preserving text selection, zoom, keyboard access, and 200% text behavior. Avoid horizontal overflow at 320/375/390/430 px.

## Priority 3 — character sheets

Keep all authoritative character data, campaign overrides, spell rules, and exclusions unchanged. Replace small monochrome portrait presentation with the existing approved full-body transparent character render when that asset exists for the actor; do not invent a substitute identity. Use `object-fit: contain`, transparent surroundings, and mobile-safe height limits.

Replace long stacked character-sheet sections with accessible tabs. Keep the actor identity/vitals immediately visible; group the remaining existing content into logical tabs such as Abilities, Combat, Skills, Equipment, Magic, Companions, and Notes, omitting tabs that do not apply. Never add PSIONICS or FAMILY CHART.

## Priority 4 — atmospheric graphics

Preserve the current homepage pyramid artwork. Add two independent lightweight presentation overlays above the image and below interactive controls:
1. **Moonlight / glow:** a slow, soft light field that drifts toward the pyramids without washing out the title or controls.
2. **Dust / sand:** a separate sparse drifting layer whose particles occasionally coalesce into an ambiguous mysterious silhouette/shape before dispersing. It must remain subtle and nonliteral.

Prefer CSS gradients/transforms/opacity over canvas/video. No pointer events. Keep mobile GPU cost low. Under `prefers-reduced-motion`, freeze or substantially simplify both overlays while preserving atmosphere.

Add restrained corner/border ornament—scarabs, spiders, pottery/glass jars, relic forms, or similar tomb/Egyptian details—at very low opacity and only where they do not compete with text, art, controls, or legal notices.

For Explore, create an original mummy-focused image/ornament that evokes the ominous desert-tomb atmosphere and hand-painted classic fantasy mood associated with Desert of Desolation, but do not copy a cover composition, pose, logo, trade dress, or exact artwork.

## Acceptance criteria and QA

Use the smallest reliable changes and preserve working systems. Never advance the live campaign during maintenance QA.

Run exactly three focused QA passes after implementation:

1. **Audio / narration:** user-gesture unlock, play-stop-play, pause/resume, navigation continuity, node-entry scene initialization, stale-cue cancellation, narration/text timing, theme +25%, ambience +20%, speech ducking, graceful decode/fetch failure, and headroom/no clipping.
2. **Layout / interaction / character sheets:** multi-select + Submit semantics, microphone states/fallback, ornate title at scene top with duplicate removed, contained long reading, tabs, full-body transparent portraits when available, 200% text, keyboard/focus, and no horizontal overflow at 320/375/390/430/768/1440.
3. **Graphics / animation / responsive polish:** pyramid artwork unchanged, moonlight and dust layers separate/nonintrusive, reduced-motion behavior, decorative motifs restrained, Explore mummy art original, safe-area/mobile fit, and desktop balance.

For every check, distinguish CONFIGURED, STATIC/SIMULATED PASS, BROWSER VERIFIED, and PHYSICAL DEVICE VERIFIED. Never upgrade evidence levels without observation. Record any unavailable native-Site or physical-iPhone checks as open rather than passing them.

Finally reconcile plugin source, GitHub canonical source, and the existing Site deployment metadata; commit only verified source changes and a checkpoint. Do not claim the live Site is current unless its actual native Site version/deployment has been inspected after this change.
