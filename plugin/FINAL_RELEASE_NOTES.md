# Desert of Desolation 1.5.1-alpha.34

UX and audio-lifecycle repair release. Campaign state is unchanged.

- Reworks action choices into selectable toggles. Players can select one or multiple suggested actions, add optional free-form detail, and submit once with the shared Submit control.
- Removes immediate per-choice submission and enables Submit whenever a choice is selected or free-form text is present.
- Restricts the homepage title theme to the Home view, raises its base gain from 0.10 to 0.16, and fades/stops it before narrated introductions or node audio.
- Removes the homepage title theme from Scene and introduction playback so it cannot continue underneath story audio.
- Requests node audio automatically on Scene entry and on each authoritative scene revision, with user-gesture retry when browser audio start is blocked.
- Adds scene playback health reporting for enabled buses and surfaces missing buses instead of assuming sound started.
- Aligns runtime Ambience default with the configured 0.42 mix.
- Hardens character-sheet portrait bindings so an unmapped character never falls back to Snogard's portrait, and cache-busts the currently verified portrait files.
- New HD painterly portrait bytes were not generated in this release and remain an explicit follow-up.
- The observed live Site remains source version 32 / projection revision 65; this release does not claim a native Site republish or physical-device audio verification.
