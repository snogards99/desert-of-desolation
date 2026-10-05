# Master style bible - 1.1.0

## Identity
Moonlit isolation, ancient splendor, uneasy discovery, human vulnerability, and gathering supernatural dread. Use the uploaded I3/I4/I5 and compilation art as references, not interchangeable lore. The current game edition controls scene facts. The supplied eye emblem is the identity anchor.

## DOD_PAINTED
Use for title, chapter, major location, or major discovery presentation. Follow the atmosphere of the supplied original trilogy covers: broad nocturnal blue masses, violet shadow, small areas of luminous turquoise, aged gold, mist, architectural scale, and fragile figures. Use hand-painted surface variation and controlled dramatic light. Preserve empty sky or shadow where live text must sit. Put text in the interface, not inside generated art.

Study I3's cover for spectral silhouette, moon, pyramid mass, and warm detail against cool mist. Study I4 for diagonal lightning, a strong gesture, and cool/warm separation. Study I5 for violet depth and action across a reflective environment. These visual observations do not authorize an encounter or claim it is currently visible.

Avoid photographic skin, glossy CGI, excessive bloom, saturated neon, fantasy-poster crowds, pseudo-Egyptian readable labels, generated signatures, and heroic poses unrelated to the scene.

## DOD_INK
Use for normal room art, encounters, portraits, objects, and journal vignettes. Use black line and solid black shapes on white or lightly warm paper. Build depth with contour weight, selective hatching, stipple, and negative space. Maintain clear gesture, ordinary equipment, distinct faces, practical costume, and physical weight. I3 PDF page 6 is the principal supplied expressive group reference.

Do not simply desaturate a painting. Avoid airbrush gray, a pencil-sketch filter, uniform scratchy texture, excessive crosshatching at mobile size, or universal caricature. A nervous expression may be humorous; a lethal threat remains frightening. New work is not represented as original art by Jim Holloway.

## Palette
The exact working values are in `../assets/theme.tokens.json`; they are selected design tokens, not measured pigment samples. Blue and purple dominate; gold is restrained. Use ivory text and muted lavender secondary text on dark opaque reading panels. Use ink text on paper. Do not use dark lapis/amethyst/danger as small text on the night background. Danger uses a labeled treatment with ivory text and a danger-colored edge.

## Type and layout
Georgia/Times serif headings and reading blocks; system UI text for controls. No font downloads. Body text 16px equivalent or larger at normal scale, leading 1.6, reading width about 65 characters. Large headings may scale responsively; controls remain at least 44px high. Small captions must remain legible. Do not copy the AD&D logotype as a new game wordmark.

## Components
Use a compact eye/title header, scene plate, opaque narration panel, nearby free-form action area, compact status, optional side panels, and an audio area that remains the host's existing component. A chapter introduction may use a painted plate; routine play uses a paper-mounted ink plate. Dialogue must show a speaker label from the actual disclosed state. Inventory, journal, and rule notices must remain distinct from narration. Maps reveal only known areas; never use a DM map as wallpaper.

The provided CSS is opt-in and namespaced under `[data-dod-theme="moonlit-ink"]`. It is not a replacement application. Existing legal and logo footer elements are retained by the host and may receive `dod-footer`, `dod-publisher-marks`, and `dod-tsr-mark` classes without changing their content. Do not invent or extract logos from covers merely because a footer asset is unavailable.

## Decorative artwork
Start at 6.5% opacity, never above 9% without a new readability test. Apply opacity only to the decorative pseudo-element. Keep reading panels opaque. Reserve image dimensions to prevent jumps. Use source artwork only for an authorized purpose. Reference crops in this skill are private production specimens and are not auto-published by the runtime theme.

## Image quality and continuity
Retain pristine masters. Prefer lossless PNG/WebP for ink, and high-quality source-preserving derivatives for paint. Existing 320x200 media remains valid only as existing media; do not force new ink artwork to that size. Start new environments at 1536x1024 where supported, portraits at 1024x1024, and object art at an appropriate close-up size. These are export targets, not claims of current asset availability. Keep a central mobile-safe subject area; lock camera and anchors across state changes.

## Motion and audio
Static is the default for this theme. Keep the existing optional A-B-C-B environment/idle structure, A-B-C attack, and dying-then-static-dead semantics. The B/C variants must not change geometry or the outcome. Honor reduced motion and the player's static setting. Artwork swaps do not start, stop, or duplicate any audio event.

## DOD_SITE approved master UI
The approved desktop and portrait compositions are canonical visual targets for the title/home interface. Their identity is midnight desert, full moon, spectral pharaonic presence, pyramid/ruins, aged-gold rules and type, the eye emblem, and restrained ivory text. Use real semantic controls to reproduce the hierarchy; do not turn the screenshot into an image map.

The master screenshots are allowed as noninteractive splash/poster assets and as visual QA references. Interactive home/title surfaces must preserve the same hierarchy responsively while keeping Continue Adventure, New Game, navigation, sound controls, and legal/footer material as actual accessible elements.

Use `DOD_SITE` only for interface composition. It does not replace `DOD_PAINTED` or `DOD_INK` scene art.
