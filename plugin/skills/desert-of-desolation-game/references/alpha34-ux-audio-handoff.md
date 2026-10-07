# Alpha34 UX/audio implementation prompt

Fix the current gameplay UX defects without advancing campaign state.

## 1. Action selection and submit
- Choice buttons are selections, not immediate submissions.
- Allow one or multiple actions to be selected.
- Selected choices must have a clear persistent visual/accessible selected state.
- The player may also type optional free-form details or a different action.
- Enable Submit whenever at least one choice is selected or free-form text is non-empty.
- Submit exactly once when the player presses Submit.
- Clear selections only after a confirmed submission, explicit cancellation, or authoritative scene/revision change.
- Preserve legacy single-choice compatibility with the existing game API; encode multi-choice intent in submitted text rather than inventing an unsupported backend contract.

## 2. Character-sheet portraits
- Verify every known party member maps to that character's intended portrait.
- Never fall back to another character's portrait when a binding is missing.
- Force a cache refresh of the existing verified portrait bytes so stale browser copies are not mistaken for current art.
- Keep a visible neutral fallback if a portrait is unavailable.
- Do not claim the requested HD portrait rerender is complete until new portrait bytes actually exist, pass QA, and are bound.

## 3. Homepage-to-gameplay audio lifecycle
Treat homepage audio and story/node audio as mutually exclusive modes.

Homepage:
- The title/home theme may play only while the Home view is active.
- Raise homepage theme base gain to 0.16 while respecting the user's master and Music settings.
- When the player starts/resumes the story or enters an introduction, fade and fully stop the homepage theme before story audio begins.
- Never leave the homepage theme running underneath narration or node audio.
- Returning intentionally to Home may restart the homepage theme.

Gameplay:
- On first Scene entry and every authoritative scene revision/node transition, start the node's configured scene cues from the beginning.
- Use the existing single AudioContext and seven buses: Narrator, Dialogue, Creature, Movement, SFX, Ambience, Music.
- Do not substitute the homepage title theme as generic scene music. Node Music must come from the node's configured media.
- Start available node cues independently so one missing optional cue does not kill the entire scene mix.
- Verify the AudioContext is running and report which enabled buses are actually active/missing rather than assuming playback succeeded.
- If browser autoplay prevents start, keep a visible Play recovery path and retry the current node on the next permitted user gesture.
- Stop/restart, refresh, navigation back to Home, and node changes must not leave duplicate or stale audio.

## Preserve
Keep saved mixer settings, one AudioContext, ducking/headroom, stable media IDs, narration, discovery/spoiler gates, accessibility, existing campaign state, and iPhone hardware-volume independence.

## Acceptance criteria
1. One or several choices can be selected and visibly remain selected.
2. Submit works with selected choices, free text, or both, and never fires merely by selecting a choice.
3. Missing portrait mappings never display the wrong character.
4. Homepage theme is louder, Home-only, and has stopped before node audio starts.
5. Scene audio auto-start is requested on initial Scene entry and each new authoritative revision.
6. Playback health is checked; missing buses are surfaced and autoplay failure has a one-tap recovery path.
7. No change advances the campaign during development/QA.
8. New HD character portraits remain explicitly pending until real replacement bytes are produced and verified.
