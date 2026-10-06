# First 20 node 32-bit pixel-art production profile

Use `dod.pixel32-rgba` for new first-20 gameplay artwork.

- Store stills as PNG RGBA 8/8/8/8 (32-bit color); there is no 64-color or indexed-palette ceiling.
- Render deliberate pixel art rather than applying a fake mosaic filter to smooth paintings.
- Target a 512x768 logical portrait canvas and preserve readability at 320/375/390/430px CSS widths.
- Outdoor/exterior nodes require MORNING, DAY, EVENING, and NIGHT stills derived from one locked composition. Game time selects the exact phase.
- Indoor nodes use a time-neutral base unless an exterior/open-sky lighting dependency is explicitly authored.
- Monster stills use NEUTRAL, ALERT, ATTACK, and DEFEATED. ATTACK must not imply hit resolution. DEFEATED is state-gated.
- This pass creates no GIFs, sprite sheets, APNGs, or interpolated animation frames.
- Do not preload all phases or all monster states. Preload only the current legal image and bounded safe alternatives.
- Preserve stable environment/actor IDs, discovery gates, campaign state, and audio ownership.
- Site/runtime availability remains false until the exact image file exists and passes canon, continuity, mobile, and spoiler QA.
