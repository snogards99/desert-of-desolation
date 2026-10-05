# Desert of Desolation

## Active runtime

The game itself is intentionally simple:

**Google Drive = authoritative game state, canon, manifests, checkpoints, and media identity**

**ChatGPT Desert of Desolation plugin = gameplay, AD&D resolution, narration, state orchestration, preload decisions, and save/resume**

That is the complete game runtime.

GitHub is **not required to play the game**. It exists only for source control, CI, and optional audio-renderer experiments.

If the external audio renderer is unavailable, gameplay continues normally with text and silent media fallback. GitHub/Codespaces must never block a turn, save, resume, encounter, or narration.

## Optional audio renderer

`audio-renderer/` contains an optional MCP Apps playback sidecar for real layered browser/mobile audio. It is presentation infrastructure only. Do not couple campaign state or normal gameplay to it.

Railway is not used.

## Source layout

- `plugin/` — plugin/skill source
- `audio-renderer/` — optional MCP audio sidecar
- `.github/workflows/` — CI only
- `.devcontainer/` — optional renderer development environment

For the active runtime rules, see `plugin/skills/desert-of-desolation-game/SKILL.md`.
