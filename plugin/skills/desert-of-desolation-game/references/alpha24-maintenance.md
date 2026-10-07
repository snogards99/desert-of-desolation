# Alpha.24 maintenance and UX hardening

This release reconciles the active plugin rules with the current project architecture and removes stale authoring/deployment assumptions from active guidance.

Ten passes were applied:

1. Version/authority drift: aligned plugin metadata, game skill, art skill, active policy, visual theme, Site presentation, and QA to alpha.24.
2. Architecture: ordinary play is self-contained; Site is the responsive play surface; GitHub is source/test/history; obsolete Vercel/MCP renderer code is removed from repository source.
3. Art: HD painterly module realism is the only new authoring target; old pixel guidance is historical fallback only.
4. Time/perspective: DAY/DUSK/EVENING/NIGHT policy and controlled outdoor viewpoint variation are consistent across active guidance.
5. Audio: synchronized current mixer defaults and explicitly limited ElevenLabs to missing-audio authoring only.
6. Site evidence: separated recorded live Site baseline from alpha.24 source changes; no unobserved browser/device pass is claimed.
7. Reader UX: added reading-width, line-height, focus visibility, loading-space, safe-area, and reduced-motion improvements.
8. Media/preload: retained strict bounded preload and last-legal-image/text fallbacks without hidden-state leakage.
9. Legacy cleanup: retired obsolete renderer/deployment files in GitHub and tombstoned obsolete pixel authoring guidance without breaking rollback assets.
10. Release quality: added consistency validation, a release audit, rollback metadata, and a new checkpoint.

Campaign state is not advanced by this release. Stable media IDs and working legacy image fallbacks are preserved until verified HD replacements exist.
