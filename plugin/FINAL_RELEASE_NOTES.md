# Desert of Desolation 1.5.1-alpha.33

State-driven node-image release.

- Adds a deterministic single-primary-image resolver for gameplay scenes.
- Shows the environment on entry, visible creature state during encounters, ATTACK during combat, confirmed DEFEATED art after resolution, and discovery-gated unique item art when focused.
- Prevents heard-only or hidden creatures from being visually revealed.
- Separates DEFEATED from DEAD; death wording/art requires explicit authoritative confirmation.
- Reuses ATTACK across ordinary combat rounds and permits last-image reuse only while that image remains legal for the same node/state.
- Keeps time-of-day aliases, bounded preload, audio behavior, stable media IDs, campaign state, and Site access unchanged.
- Adds an optimized implementation prompt and machine-readable node-image state policy.
- No new art bytes were generated and the live Site was not republished in this release.

- Final hardening requires a proven same-node identity before reusing the last image, preventing cross-node visual bleed.
