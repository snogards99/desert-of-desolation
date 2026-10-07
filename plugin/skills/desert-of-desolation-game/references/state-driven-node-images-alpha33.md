# State-driven node imagery — optimized implementation prompt

Implement one deterministic primary image per gameplay turn and place it above the narrative text. Preserve the existing audio engine, campaign state, stable IDs, discovery gates, time tracking, and Site access.

## Selection order
1. A currently focused unique/story/magic item that has actually been discovered.
2. A visible creature in confirmed DEFEATED state.
3. A visible creature in active combat using ATTACK art; reuse ATTACK across ordinary combat rounds.
4. A visible creature in ALERT or NEUTRAL state.
5. The current legal environment image, time-matched outdoors and time-neutral indoors unless lighting materially changes the visible scene.
6. The last image only when it remains legal for the same node and current state.
7. Text only when no legal image exists.

## Safety and semantics
- A creature that is only heard, suspected, hidden, or otherwise unseen must not be shown.
- DEFEATED is not automatically DEAD. Only use dead wording or corpse-specific art when authoritative state explicitly confirms death.
- Treasure/item art is discovery-gated. Never preload, name, expose in metadata, or display undiscovered items.
- Unidentified magical properties stay visually undisclosed.
- Wrong-time, wrong-state, future-state, and spoiler images are never fallbacks.

## Required art categories where applicable
- environment/time variants;
- creature NEUTRAL, ALERT, ATTACK, DEFEATED;
- dedicated unique/story/magic item stills.

Reuse canonical environment and creature assets across nodes when identity is genuinely shared. Do not generate redundant art merely to give every round a unique picture.

## UI
Render exactly one primary scene image above the current turn text. Keep the full text readable below it. Preserve mobile readability, semantic controls, reduced-motion behavior, and audio/narration continuity.

## Preload
Keep only the current legal image hot, plus one likely immediate interaction and at most two explicit player-safe alternatives. Never preload all phases, all creature states, hidden creatures, or undiscovered treasure.

## Acceptance criteria
- entry shows the legal environment;
- heard-but-unseen monsters remain visually hidden;
- visible idle/alert creatures show the matching state;
- combat selects ATTACK and can reuse it across rounds;
- DEFEATED requires confirmed outcome;
- discovered focused unique items override creature/environment art;
- undiscovered items never render;
- outdoor phase aliases resolve correctly;
- no image selection mutates campaign state or audio state.
