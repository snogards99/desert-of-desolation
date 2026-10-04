# Desert of Desolation Audio Improvement Passes — v0.3.0

1. **Playback truth** — separated RESOLVED/READY/QUEUED/PLAYING and prohibited false playback claims.
2. **Preload correctness** — prioritized current-scene essentials over speculative successor assets.
3. **Stale-audio invalidation** — introduced monotonic `audio_epoch` invalidation on new player input/transitions.
4. **Adaptive 12-voice budgeting** — retained speech/mechanics first; merged or culled optional layers under pressure.
5. **Speech intelligibility** — specified smooth, bus-sensitive ducking and non-destructive gain discipline.
6. **Environmental continuity** — added loop hygiene, ambience continuity, acoustic morphing, and transition crossfades.
7. **Mobile degradation** — added constrained-device profile with graceful stereo fallback and optional-layer shedding.
8. **Preload latency/cache** — separated transport/decoded/image pressure budgets and added exact-ID dedupe/cancellation.
9. **Save/resume audio** — persist semantic beds/profiles only; never replay stale one-shots on resume.
10. **Production gate** — real renderer + real-device playback tests are mandatory before claiming audio is working.

The remaining external boundary is renderer deployment/registration and secure short-lived delivery of private Drive-backed audio to that renderer.
