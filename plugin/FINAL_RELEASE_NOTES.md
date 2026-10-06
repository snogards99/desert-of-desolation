# Desert of Desolation 1.5.1-alpha.9

- Promoted the art engine to `dod.art-engine@1.3.0` with full-color 32-bit RGBA pixel-art authoring (`dod.pixel32-rgba`).
- Added the first-20 still-art production overlay: 20 node records, 18 unique environment reuse groups, 17 outdoor/exterior records with MORNING/DAY/EVENING/NIGHT requirements, three indoor records, and four state-gated troll stills.
- Removed the proposed 64-color ceiling. Approved stills are PNG RGBA 8/8/8/8 with deliberate pixel construction and nearest-neighbor enlargement.
- Explicitly deferred GIFs, sprite sheets, APNGs and interpolation for this pass.
- Kept all planned assets unavailable until exact image bytes exist and pass canon, continuity, mobile and spoiler QA.
- Rejected image-generator atlas/contact-sheet outputs that invented unsupported nodes and monsters; none were integrated into the Site or runtime.
- Preserved campaign state, audio, stable IDs, existing Site, and current Site audience.
