# Desert of Desolation 1.5.1-alpha.38

Project-wide reconciliation after ten focused repair passes.

- Restores the current Art Engine contract to 32-bit RGBA pixel art with DAY / DUSK / NIGHT outdoor variants only. Morning maps to DAY; dawn, evening and sunset map to DUSK. Existing legal imagery is preserved until intentionally replaced.
- Centralizes character aliases so Ery's legacy `party.talanis` identifier resolves to canonical `party.tal` for presentation without duplicating or merging campaign state.
- Preserves approved module-introduction wording exactly and records source-perspective policy instead of rewriting canonical copy.
- Resolves homepage-theme gain authority at 0.16 without changing the saved mix or audio asset bytes.
- Preserves alpha.37 scene-safe audio, bounded save polling, microphone no-auto-submit behavior, stable media IDs, campaign state, access, and fail-closed unknown magic.
- Separates readable source mirroring from binary-media parity; the latter remains tool-bound because binary plugin bytes are not exposed through the current text file API.

The existing live Site remains v32 / projection 65 and requires native republish before alpha.38 Site-source changes can be called live. Server-side write authorization/resolver persistence, browser/device/listening QA, and complete binary-media GitHub parity remain explicit evidence/tool boundaries.
