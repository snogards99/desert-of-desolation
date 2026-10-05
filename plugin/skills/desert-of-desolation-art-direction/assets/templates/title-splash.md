# DOD_SITE title splash

Select `dod.ui.home.mobile.v1` at 760px and below, otherwise `dod.ui.home.desktop.v1`. The master image is a noninteractive splash/poster reference, never the sole interactive UI.

After or alongside the poster, render semantic Continue Adventure and New Game controls using the existing game handlers. Showing the splash does not advance time or state. Continue restores authoritative state. New Game uses the existing confirmation/reset flow and never silently overwrites a save. Keep sound-enable/audio controls attached to the existing audio engine.
