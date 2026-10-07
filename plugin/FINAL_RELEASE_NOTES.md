# Desert of Desolation 1.5.1-alpha.24

Ten-pass maintenance release focused on structural consistency, reader UX, and removal of obsolete deployment assumptions.

- Synchronized plugin metadata, game skill, art skill, active runtime policy, Site presentation, visual theme, and QA evidence.
- Made `dod.art-engine` 1.5.0 / `dod.hd-painted-module-realism` the only new visual authoring target.
- Converted the old first-20 pixel-art reference into a historical tombstone while preserving working legacy image bytes as rollback-safe fallback until HD replacements exist.
- Synchronized DAY/DUSK/EVENING/NIGHT presentation and controlled outdoor viewpoint variation.
- Synchronized current audio defaults and limited ElevenLabs to explicitly needed missing-audio authoring only.
- Added alpha.24 mobile/readability CSS for scene-art sizing, readable measure, focus visibility, safe areas, loading stability, and reduced motion.
- Separated recorded live Site evidence from source-only alpha.24 improvements; no browser or physical-device pass is fabricated.
- Removed obsolete Vercel/MCP audio-renderer source and replaced it with project consistency checks.
- Campaign state, access settings, stable media IDs, rules, and existing working runtime fallbacks remain unchanged.
