# Desert of Desolation — Master Visual, Art, Site, Audio, and Runtime Production Prompt

Use this as the canonical implementation brief for the current Desert of Desolation project.

## Targets and authority

- Plugin: `Plugin_3352cc65ee508191abeb37ffa759294d`
- Existing Site only; do not create a replacement Site.
- Preserve the 361-node campaign, authoritative state, stable IDs, rules, audio, fonts, private access, legal/footer content, and existing navigation.
- Canon priority: original project/TSR sources > verified ledger > approved project decisions > research > explicitly labeled gap-filling.
- Work in development/maintenance mode unless explicitly playing. Development must never advance the live campaign.

Use:
`inspect -> reconcile -> implement -> render -> QA -> integrate -> optimize -> verify -> commit/sync`

## Final Art Engine

Lock `dod.art-engine` v1.5.0 with rendering profile `dod.hd-painted-module-realism` as the production visual authority.

Primary painted reference:
- supplied I3 `Pharaoh` cover

Supporting references:
- supplied I4 `Oasis of the White Palm` cover
- supplied I5 `Lost Tomb of Martek` cover

Reproduce the broad visual language, not exact compositions:
- classic TSR-era hand-painted fantasy illustration
- naturalistic anatomy and believable proportions
- painterly realism rather than photographic CGI
- tactile stone, sand, cloth, metal, wood, water, bone and skin
- unrestricted full color
- strong silhouettes
- dimensional directional light
- atmospheric depth
- subtle visible brush texture
- believable dust, wear, age and irregularity
- restrained supernatural glow
- ancient Egyptian/desert fantasy motifs only where canonically justified

Avoid:
- pixel art, 32-bit/64-bit styling, indexed palettes
- anime or cel shading
- glossy modern concept-art rendering
- plastic CGI surfaces
- excessive bloom
- over-symmetry
- generic AI-fantasy ornament
- pseudo-writing or fake hieroglyphs
- unsupported fantasy motifs

The objective is artwork that feels intentionally hand-painted and period-authentic while benefiting from modern resolution and readability.

## Anti-AI quality standard

Reject and rerender images containing:
- malformed hands or limbs
- duplicated anatomy, props or faces
- inconsistent weapons, clothing or markings
- melted ornament
- floating or fused objects
- impossible perspective
- inconsistent lighting
- repeated facial structures
- nonsensical inscriptions
- overly perfect bilateral symmetry
- meaningless decorative clutter
- oversharpened CGI texture
- incompatible creature anatomy
- obvious procedural repetition

Prefer purposeful asymmetry, restrained detail, believable imperfections, coherent materials and composition.

## Node grounding

Before creating art for a node, inspect only the minimum authoritative data needed:
- node/environment description
- source/canon facts
- sensory text
- sound/ambience profile
- visible actors
- encounter state
- discovered treasure
- discovery/spoiler gates
- game time
- plausible party approach

Allow sound to influence visible atmosphere only when physically plausible:
- wind -> sand, cloth or vegetation movement
- dripping water -> dampness, staining, reflection
- torch crackle -> localized warm light, smoke
- echoes -> perceived depth/scale
- silence -> sparse/still composition

Never invent visible content merely because it is dramatic.

## First 20 nodes

Reassess and rebuild the first 20 authoritative nodes.

Deduplicate by stable environment ID and actor ID before rendering. Reuse canonical assets where legitimate.

Old first-20 runtime art is superseded only after a replacement file actually exists and passes QA. Keep old bytes for rollback/provenance if required, but do not keep them active after a verified replacement is bound.

### Indoor/enclosed scenes

Normally create one time-neutral environment painting for:
- rooms
- chambers
- antechambers
- libraries
- tunnels
- collapsed tunnels
- tomb interiors
- crypt interiors
- enclosed caves
- corridors

Create additional indoor states only when gameplay genuinely changes the visible scene.

### Outdoor/open-sky scenes

Create four physical environment stills:
- DAY
- DUSK
- EVENING
- NIGHT

Phase mapping:
- DAWN / SUNRISE / MORNING -> DUSK
- DAY -> DAY
- SUNSET -> EVENING
- EVENING -> EVENING
- NIGHT -> NIGHT

Time variants may use controlled viewpoint variation rather than identical framing:
- slight left/right approach
- modest elevated viewpoint
- ground-level viewpoint
- slightly closer/farther framing
- perspective matching plausible party approach

Always preserve:
- canonical geography
- major landmarks
- architecture
- scale
- route/exit logic
- visible object placement where game-relevant
- current discovery state

Perspective variety must never imply a new route or reveal hidden information.

## Monsters and important creatures

Create one canonical fully rendered design per unique creature and reuse it across nodes.

Required still states where applicable:
- NEUTRAL
- ALERT
- ATTACK
- DEFEATED

Preserve across states:
- anatomy
- face
- proportions
- equipment
- markings
- coloration
- clothing
- scale

Rules:
- ATTACK depicts an attempted attack and never implies a hit.
- Reuse ATTACK for ordinary combat rounds unless another legal state becomes true.
- DEFEATED requires authoritative combat resolution.
- Do not infer permanent death from zero HP alone.
- No GIFs, sprite sheets, APNGs or animation interpolation in this production pass.

## Treasure and story-item imagery

Every unique, magical, valuable or story-relevant item should receive a dedicated still image when discovered, especially:
- magic items
- relics
- keys
- puzzle objects
- named weapons
- rings
- amulets
- scrolls
- statues
- quest items
- distinctive treasure

Use one stable item-art ID per unique item.

Never generate, name, preload or display hidden treasure before discovery when doing so would spoil gameplay.

Unidentified magical properties must remain visually undisclosed until known.

## Runtime image sequence

Display the relevant current image at the top of the main gameplay text surface. Narration and text scroll beneath it.

Default state flow:

1. Enter node -> current environment image
2. Creature becomes visible -> NEUTRAL or ALERT
3. Combat begins -> ATTACK
4. Combat rounds -> reuse ATTACK unless state changes
5. Confirmed defeat -> DEFEATED
6. Treasure/item discovered -> dedicated item image
7. Return to exploration -> contextually appropriate environment image

If no new legal image exists:
- reuse the last legal image, otherwise
- use the current legal environment image

Selection must be deterministic from:
- current node
- game time
- environment phase
- visible creature
- creature state
- combat state
- discovered items
- last valid image

Never show future-state art.

## Site visual system

Retain the approved responsive Desert of Desolation Site identity:
- desktop and mobile compositions are equal first-class targets
- Eye emblem remains the primary project mark
- deep midnight blue, indigo and violet foundation
- aged-gold borders/rules/controls
- warm ivory/parchment text surfaces
- subtle Egyptian/desert ornament
- cinematic hero/title presentation
- restrained scarab, pottery, jar, spider, snake, dust, spectral and ruin motifs where tasteful
- no generic SaaS/dashboard styling

Use the Art Engine subtly across:
- Home
- gameplay scene shell
- Party
- Journal
- Map
- Inventory
- Sound
- Settings
- loading/fallback states
- footer/legal surfaces

Do not bake functional controls into background images. Real controls remain semantic and accessible.

Mobile priorities:
- 320, 375, 390 and 430 px widths
- no horizontal scrolling
- touch targets >=44 px where practical
- critical subjects remain readable without zoom
- important artwork stays clear of navigation/safe areas
- text scaling and reduced motion remain functional

## Background theme and audio

Preserve the existing Sound Engine and its single audio context.

Keep the faint background campaign theme as a subtle bed:
- default music gain around 0.08
- duck to roughly 0.025 under narration/dialogue
- gentle fades
- preserve user mute/volume settings
- keep iPhone hardware volume independent
- music/ambience/SFX/voice controls remain functional

Images should complement current music, ambience, SFX, creature audio and narration, but art code must never create a new AudioContext or restart the audio engine.

Do not claim audible playback unless actually tested.

## Performance, storage and preload

Current first-20 bound image packages historically averaged about 7 MiB/node and ranged roughly 1.8–10 MiB/node before the new HD pass. Treat this as a storage reference, not a preload target.

For HD production:
- retain high-resolution masters
- create efficient responsive derivatives
- optimize visually lossless delivery
- avoid duplicate environment and actor downloads
- target roughly 2–5 MiB of active image payload per turn where practical
- do not preload an entire node package

Bounded preload remains:
- Tier 0: current legal environment/actor/item
- Tier 1: one likely immediate interaction
- Tier 2: at most two explicit player-safe alternatives
- everything else cold

Do not preload all time phases, monster states or treasures.
Cancel stale speculative loads after player choice.

## Spoiler safety

Never expose through art, filename, alt text, manifest, preload or client metadata:
- hidden monsters
- secret doors
- undiscovered traps
- hidden treasure
- puzzle solutions
- disguised identities
- unidentified magical properties
- future transformations
- future locations
- future combat outcomes
- private NPC knowledge

Fallback order:
`correct legal image -> correct legal environment -> last legal image -> text`

Wrong-state and wrong-time images are never fallbacks.

## Asset acceptance and runtime eligibility

Generate one runtime asset at a time.

A contact sheet, collage, concept board, storyboard or atlas is reference-only and must never be treated as a runtime image.

Only set:
- `available=true`
- `runtime_eligible=true`

when the exact file:
1. exists
2. represents the correct canonical scene/actor/item
3. passes spoiler review
4. passes continuity review
5. passes anatomy/material/perspective QA
6. passes mobile review
7. matches the Art Engine profile

## First-20 QA

For every final asset verify:
- canon/source consistency
- sensory/sound alignment
- indoor/outdoor classification
- time-of-day logic
- perspective continuity
- creature identity/state
- item discovery gating
- human-painted quality
- mobile readability
- spoiler safety
- filename/metadata safety
- runtime binding
- graceful missing-art fallback

Reject and rerender failures; do not silently waive them.

## Integration order

1. Inspect current plugin, Site/source package, manifests and release metadata.
2. Build one compact first-20 production ledger.
3. Deduplicate environments, actors and items.
4. Update production descriptions.
5. Render individual environment assets.
6. Render individual creature-state assets.
7. Render discovered item/treasure assets.
8. QA each file.
9. Bind only approved bytes.
10. Update state-driven image resolver.
11. Integrate into existing Site.
12. Verify mobile/desktop rendering.
13. Verify audio/state remain unchanged.
14. Run three genuine optimization passes:
   - correctness/spoiler/state mapping
   - reuse/performance/mobile delivery
   - player experience/visual continuity
15. Update plugin manifests/source.
16. Run applicable automated checks.
17. Commit/sync verified changes.
18. Publish only when separately authorized.

## Three optimization passes

### Pass 1 — correctness
Fix only genuine problems:
- wrong scene
- wrong phase
- wrong actor/state
- spoiler leak
- bad treasure gating
- broken path
- stale manifest
- illegal fallback

### Pass 2 — performance/reuse
Improve:
- deduplication
- responsive derivatives
- cache reuse
- file size
- decoding
- preload
- image reuse
- mobile framing

### Pass 3 — player experience
Improve:
- composition
- perspective variety
- image/text balance
- time-of-day distinction
- creature readability
- transition timing
- perceived loading
- atmosphere
- continuity

Do not manufacture changes to satisfy the pass count.

## Commit and synchronization

Treat plugin and Site source as one coordinated project.

Before commit:
- reconcile current plugin release with repository source
- preserve unrelated work
- verify shared manifests and release metadata
- do not force-push
- do not change access settings
- do not reset the campaign

A commit request authorizes synchronization and source commits, not a new Site/plugin publication unless explicitly requested.

Record:
- plugin version/release
- repository commit
- Site source/deployment state
- QA evidence
- unresolved limitations
- rollback reference

## Completion rule

Do not claim the first-20 art rebuild is complete until the actual individual HD environment, monster-state and treasure files exist, pass QA, are bound to runtime, and work in the existing Site.

Core rule:

**Use the original Desert of Desolation trilogy cover language as the artistic north star, ground every image in verified node state and sensory context, show the correct environment/creature/treasure image for the current turn, preserve audio/state/spoilers, optimize mobile delivery, and never substitute concept-sheet output for production assets.**
