# Desert of Desolation — Unified Interface and Gameplay Repair Prompt

Repair the existing Desert of Desolation game in place. First inspect the complete project history and compare the live Site with the most recent known-good interface/audio/scene revisions. The current live Site is version 38. Identify regressions by file and revision before editing; restore proven behavior where possible, then make only the changes needed to meet this brief. Keep one canonical source of truth and sync the Site source, GitHub project, and any plugin artifacts using their supported release flow.

## Preserve player trust and project integrity

- Reuse the existing Site, campaign records, routing, access, legal notice, approved media assets, stable media IDs, fonts, and audio files. Do not reset, advance, seed, or write to the real campaign while repairing or testing.
- Do not replace the game architecture or invent backend routes, gameplay outcomes, rules, data, or media IDs. Fail safely when the canonical server cannot resolve an action.
- Use an isolated demo/fixture for gameplay and save-flow testing. Verify actual node playability with an owner-authenticated browser session; if credentials, fixtures, or native Site access are unavailable, report that boundary instead of claiming success.
- Keep builds, source commits, Site versions, deployments, and validation evidence tied to the exact same source state. Publish only through the existing Site’s supported source/build/save/deploy workflow. Record a rollback point.

## Restore the full-screen homepage

- Make the atmospheric background fill the entire viewport on phone and desktop, including the bottom behind fixed controls. Respect safe areas and avoid gaps, tiling, stretching, and horizontal overflow.
- Center the main composition: an unobtrusive rendered game title at the top with no extra decorative title border; a larger central tomb gateway integrated into the tomb artwork with a stronger but restrained animated glow; and “Seekers of Ra” directly beneath the gateway.
- Keep the publisher/legal notice anchored at the lower right on wide screens and reachable without obscuring controls on small screens.
- Use the approved art and preserve its existing color and identity. Any glow animation must honor reduced-motion preferences.

## Restore navigation and controls

- Put the settings gear at the upper right.
- Restore a visible global sound on/off switch and working background music. Audio must start or resume from a valid user gesture when browser policy requires it, report muted/blocked/playing status accurately, and provide a clear recovery control.
- Keep one audio context and the existing sound engine, mixer, saved mix, stable cues, gain/headroom, ducking, pause/resume/stop behavior, and scene-safe cancellation. Home music plays only on Home and stops/fades before narration or scene cues start. Never create duplicate music or substitute the title theme for configured scene music.
- Put the microphone control at the lower right, inside safe areas. It is optional, labeled accessibly, and never auto-submits dictated text.
- Restore a clear, playable Scene view. The bottom navigation uses distinct compact graphics: a book-like “CHAPTER” control for Scene, a party emblem for “PARTY,” and a parchment “JOURNAL” control. Keep accessible text labels or names, visible focus, selected state, and minimum touch targets.
- Remove heavy cell/card borders to create a clean screen. Retain only purposeful, subtle gold separators and heading accents; do not use a grid of gold boxes.

## Restore story and play flow

- Ensure the Home “Begin or resume” action works whenever a valid campaign snapshot is loaded. Never disable it solely because an old refresh failed if a valid current snapshot exists. Show persistent, actionable retry/sign-in recovery messages with visible Retry, Close, and owner sign-in controls; distinguish authentication, network, and missing-save failures.
- Restore scene art, chapter/location heading, narrative, choices, free-text action entry, Submit, party sheet, journal, sound controls, and loading/error recovery. Do not let notices or recovery buttons disappear prematurely.
- Narration addresses the player in second person. Snogard’s own dialogue appears as a distinct first-person passage and uses his separate voice when that approved cue exists; never invent his player-controlled intent.
- Keep story first, with meaningful lethal danger. Telegraph threats and give real counterplay; never conceal a fatal risk behind an arbitrary choice. Ask the player to decide when Snogard’s death is imminent rather than silently killing him. Use source-backed rules and resolver outcomes only.
- Support multi-select actions only where the existing API permits them, preserve draft selections through transient refresh failures, and submit exactly once. Keep keyboard/text entry fully usable.
- Keep maps small and explored areas readable; give traps discoverable clues; make rest and retreat consequential; provide useful item and prepared-spell tracking; advance levels at story milestones; keep the core party stable with situational companions and light relationship arcs. Let companions offer concise puzzle ideas without taking control away from the player.

## Small pixel-art moments

Use existing approved pixel-art assets for small scene panels at key discoveries, danger tells, combat changes, and story revelations. Match imagery to the current node, phase, and what the party has actually discovered. Never reveal hidden creatures, undiscovered items, or future events through preload, captions, alt text, or art. Text remains complete and readable if imagery fails.

## Verify before release

- Run the project’s full validation/build and meaningful UI/audio tests. Do ten focused regression passes across Home, Scene, Party, Journal, save refresh, authentication recovery, sound switch/music lifecycle, navigation, accessibility, and responsive layout.
- Check narrow phone widths and desktop; keyboard navigation, screen-reader labels, visible focus, contrast, readable sizing, reduced motion, no overlapping controls, and no missing content.
- Verify Home background coverage, settings on the right, microphone lower-right, all three graphic navigation controls, scene rendering, and audio behavior. Audio hardware listening requires actual device evidence.
- Verify the isolated demo can enter and play twenty consecutive nodes, survives refresh/resume, and leaves the real campaign untouched. Count only nodes actually rendered and playable.
- Commit implementation and QA evidence together; publish the existing Site, verify deployment status and the deployed result, and report exact changed areas, tests, commit, Site version, and anything genuinely blocked. Never label unexecuted checks as passed.
