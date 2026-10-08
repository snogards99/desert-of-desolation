# Player Experience Review - 2026-10-08

## Scope and result

Ten review passes covered access, UI, narrative, agency, rules, pacing, sound, art, saves, and accessibility/replay. This is a source and live-homepage review, not a completed 20-node playtest.

**Live first-session score: 2/10. Design potential: 7/10.**

The production Site homepage loaded at Site version 36. “Begin or resume” was disabled because save refresh failed and the page required the campaign-owner sign-in. The isolated “Saved demo” showed the same failure. No campaign node was advanced, and no save was reset.

The 60-second Campfire Test reached “playing · 12/60s” and was stopped. This verifies that the playback path started; actual listening quality and narration ducking were not evaluated.

## Ratings

| Area | Score | Evidence |
|---|---:|---|
| Start and first-session reliability | 2/10 | Direct live Site |
| Homepage presentation | 7/10 | Direct live Site |
| Narrative premise and atmosphere | 8/10 | Source review |
| Narration viewpoint consistency | 4/10 | Source review; current prologue refers to Snogard in third person |
| Choice and player agency | 7/10 | Node/choice source; not played |
| AD&D rules clarity and fairness | 6/10 | Runtime policies; not played |
| Audio architecture and controls | 7/10 | Mixer UI and playback state; no listening |
| Art direction and scene readability | 7/10 | Homepage direct; gameplay scenes untested |
| Save and recovery experience | 3/10 | Direct live Site |
| Accessibility and mobile readiness | 5/10 | Source/UI inspection; no device test |

## Ten-pass findings

1. **Access/start:** owner-authenticated save failure disables the only start action. Provide a demo route that does not touch the main campaign.
2. **Home UI:** atmospheric art works; the next action and play expectations need to be clearer. Keep a functional primary action visible.
3. **Narrative voice:** the expedition setup gives companions distinct motives, but the prologue uses third-person Snogard despite the requested first-person perspective. Rewrite consistently and leave his intent to the player.
4. **Agency:** talk, observe, evade, fight, and free text support old-school experimentation. Number choices, clarify informed risks, and ensure outcomes are distinct.
5. **Rules:** fail-closed rules protect AD&D 2e fairness. In play, explain the action, roll, result, consequence, and resource change; offer a safe alternative when a rule is unresolved.
6. **Pacing:** the opening is evocative but lengthy before the first decision. Break it into short scene beats with optional lore and recaps.
7. **Sound:** seven mixer layers are exposed, and the campfire test started. Verify sound quality, loop seams, loudness, stop/resume, and voice ducking by listening on desktop and phone.
8. **Art:** the cinematic homepage is strong but differs from the requested text-first, low-graphic retro feel. Use maps, readable prose, and restrained pixel vignettes; make large art optional.
9. **Save/recovery:** stale-save handling avoids silently using old state, but its current recovery is a dead end. Separate disposable demo state from owner saves, report revision/retry status, and never leave the only start action disabled without a next step.
10. **Mobile/accessibility/replay:** Scene/Party/Journal and optional microphone input are useful. Verify 390px portrait, keyboard and screen-reader controls, contrast, text scaling, reduced motion, and a no-microphone path.

## Recommended order

- **P0:** repair the save-refresh/start path; let a disposable demo launch without editing the real campaign.
- **P1:** establish a text-first loop: concise scene, numbered choices plus free text, visible stakes, one Submit, clear outcome, updated party/resources/journal, next scene.
- **P1:** align narration with the requested Snogard first-person voice while preserving player control.
- **P1:** make AD&D rules legible through short action/roll/result explanations and deterministic resource updates.
- **P2:** prioritize text, maps, and compact pixel illustrations; keep cinematic cover art at transitions or optional.
- **P2:** run real listening and mobile QA for narration ducking, cue overlap, loop quality, stop/pause, and autoplay failure.
- **P2:** show save status and offer reversible checkpoints; keep campaign state and UI preferences distinct.
- **P3:** strengthen the journal with discoveries, maps, clues, defeated-creature records, and spoiler-safe recaps.

## 20-node playtest status

**0/20 live nodes completed.** Both Main campaign and Saved demo were blocked before node 1. A 20-node result would be inaccurate. Once the start path works, test in a disposable campaign and log choice clarity, mechanics, party/resource deltas, prose length, sound/image relevance, save/resume, one combat, exploration, NPC interaction, retreat, resource spend, and recovery from invalid/free-text input.

## Evidence and release boundary

- Site: version 36; latest deployment succeeded; access reports public.
- Plugin: stable 1.5.1.
- Repository main at review time: `e55465a5b38fc239ad25dd840f55beb2d294a9ca`.
- Bundled ALPHA41 report: ten consecutive runs of 166 passing automated tests, but explicitly `SOURCE_REPAIRS_ONLY_NOT_NATIVE_SITE_RELEASE`; it records no full build/device QA and refers to Site version 32. It is not production-browser evidence for version 36.
- No gameplay code, Site settings, campaign state, or deployment was changed in this review.

## Questions for the next pass

1. Should Snogard narration default to first person (“I”) or second person (“you”)?
2. Should the game prioritize strict AD&D 2e procedures and resource pressure, or faster story-first resolution?
3. Should retro presentation be mostly text and maps, or include small pixel-art panels at key moments?
