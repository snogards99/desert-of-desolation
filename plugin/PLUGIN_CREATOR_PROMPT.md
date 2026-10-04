# Plugin Creator handoff prompt

@plugin-creator Create a plugin named **Desert of Desolation** for ChatGPT and Codex using the existing Google Drive-backed game architecture. Do not replace the game engine or move authoritative state out of Google Drive.

## Existing authorities
- Runtime specification: `1qLyjMAuCBWG5PkPaBrnp3mhU1nIhMC0ahWRmOiR0irY`
- Runtime state: `1vtvKlYP3zFWTf4p98L8wKMDcizg-6KAtjJ7KDx7ksPU`
- Drive-native commit: `1DDvt0H7bdvmOa-HC1Du6_0qbpHJiysqW_Ug0Pt4b5sk`
- Plugin package folder: `1KAEyDMkNzA0TKx4wbOmtH5lPL4UQHhBk`
- Current baseline: `DOD-DRIVE-NATIVE-v393-20261004`, with later runtime/audio contracts already recorded in the runtime specification.

## Architecture
Use the plugin as a thin presentation/orchestration layer around the existing Drive-native engine:
ChatGPT conversation -> Desert of Desolation skill -> connected Google Drive app -> existing runtime state/manifests/media.

Google Drive must remain authoritative for persistent state, campaign history, manifests, media IDs, audio IDs, checkpoints, recovery, and approved source material. In-session caches may be used only as disposable hot state.

Do not introduce runtime dependencies on a local PC, mounted drive, GitHub, ChatGPT Work, or live ElevenLabs. Pre-rendered ElevenLabs assets may be used only after they are stored and approved in Drive.

## Required skill behavior
Bundle a reusable gameplay skill that:
- starts, resumes, and runs the campaign from the current certified Drive state;
- reads only the Drive records needed for the current turn rather than broad-searching the corpus;
- preserves player agency: Snogard is player-controlled and the plugin never invents his intent, speech, movement, spell choice, target choice, promises, consent, or resource spending;
- enforces discovery and spoiler gates for traps, secrets, puzzle solutions, identities, routes, future encounters, and NPC-private knowledge;
- fails closed when exact source truth is unavailable or conflicting;
- never advances gameplay state because of testing, migration, release work, media synchronization, or plugin maintenance;
- persists only explicit gameplay mutations through the established Drive runtime schema;
- supports checkpoint/save/resume and transaction-safe recovery.

## Media and audio
Keep media progressive rather than blocking:
1. text/state;
2. imagery;
3. dedicated audio;
4. layered cinematic playback.

Use deterministic Drive-native media IDs and preload the current node plus at most two explicit player-safe successor bundles. Never leak spoilers through preload metadata.

Audio uses Narrator, Character Dialogue, Ambience, Music, and Sound Effects buses, with non-destructive mixing, smooth ducking/crossfades, spatial distance/movement where supported, and graceful stereo fallback. Support up to 12 active voices when the client allows it. Every monster should resolve NORMAL/PRESENCE, ATTACK, and DEATH cue families when approved assets exist. Audio must never predict mechanics or reveal hidden creatures. User input can interrupt stale queued audio immediately.

## Cross-platform requirements
Target ChatGPT web, desktop, and supported mobile clients with one game engine. Keep all platform-specific behavior in presentation/playback adapters. Missing audio or imagery must never block text/state gameplay.

## Connected apps
Use the user's existing Google Drive connection as the required external data source. If Plugin Creator requires an app mapping or connection step that cannot be inferred automatically, stop only at that concrete connection boundary and tell me exactly what identifier or authorization is required. Do not fabricate an MCP/app ID.

## Package and testing
Create a supported portable plugin package with root `plugin.json` and bundled skill(s). Add OpenAI-specific metadata only where supported. Also create a personal/local marketplace entry if the current environment supports it.

Validate at least these flows without mutating the live campaign unless the test uses an isolated snapshot:
- resume current state;
- exploration turn;
- combat turn;
- save/resume recovery;
- missing-image fallback;
- missing-audio fallback;
- stale queued-audio interruption;
- spoiler-safe preload;
- constrained mobile playback fallback;
- plugin/runtime maintenance that leaves gameplay state unchanged.

Do not declare completion until the package validates and the only remaining steps, if any, are true client installation/authorization boundaries.
