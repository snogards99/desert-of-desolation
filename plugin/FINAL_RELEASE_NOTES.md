# Desert of Desolation 1.5.1-alpha.39

Consistency-hardening release on top of alpha.38.

- Aligns the outdoor visual asset contract everywhere: DAY / DUSK / NIGHT only; MORNING maps to DAY; dawn, sunrise, evening and sunset map to DUSK.
- Repairs the executable Art Engine planner so it matches art-engine 1.6.0 and the active 32-bit RGBA pixel-art contract instead of legacy DOD_PAINTED / DOD_INK modes.
- Adds validation coverage for executable Art Engine mode/version and cross-file time-of-day aliases so this drift cannot silently recur.
- Preserves alpha.38 audio/save behavior, seven-bus mix, character aliases, magic fail-closed behavior, media IDs, access settings and campaign state.
- Does not claim native Site publication, physical-device listening, server-side write authorization, or complete binary-media parity without direct evidence.

The live Site remains the previously observed source v32 / projection 65 until a native Site publish action is available and independently verified.
