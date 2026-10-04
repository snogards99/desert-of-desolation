# Runtime Semantic Operations

Use the existing Drive-backed runtime rather than inventing a parallel API.

Core semantic operations:
- `get_game_state`
- `save_game_state`
- `get_scene`
- `get_entity`
- `get_room`
- `get_encounter`
- `get_media`
- `get_audio_scene`
- `get_next_scene_candidates`
- `prefetch_scene`
- `checkpoint`
- `log_feedback`
- `resolve_media_manifest`
- `queue_audio`
- `update_audio_state`

Audio renderer operations, when a playback MCP/UI is connected, are defined in `audio-runtime.md`. Treat Google Drive as asset authority/storage, not as the renderer.
