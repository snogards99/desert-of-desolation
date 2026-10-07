# Alpha.36 reconciliation execution prompt

Update the existing Desert of Desolation project in place. Treat the current plugin, canonical GitHub repository, and existing ChatGPT Site as one coordinated release; do not rebuild the architecture, create a replacement Site, advance campaign state, change access, regenerate working media, or reintroduce retired MCP/provisioning requirements.

## Authority and targets
- Plugin: `Plugin_3352cc65ee508191abeb37ffa759294d`
- GitHub: `snogards99/desert-of-desolation`, branch `main`
- Existing Site: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`, slug `desert-of-desolation`
- Resolve authority from current metadata/files and verified behavior, not conversation version labels alone.
- Preserve 361-node routing, campaign state, stable IDs, working audio/assets, legal/footer, fonts, Egyptian visual language, and current public Site access.

## Required work
1. Reconcile the current plugin release with canonical GitHub source/checkpoints. Eliminate release-label/config/QA drift and commit the exact current candidate.
2. Reconcile Site evidence to the latest actually observed Site metadata. Do not invent a deployment ID or source commit. Republish the existing Site only when a native publish action is available and the candidate has a real Site/runtime delta.
3. Audio: preserve the seven-bus engine, hard Scene stop/restart, first-current-node-cue buffer/start-before-rest ordering, user-gesture recovery, ducking, headroom, and stable media IDs. Make the active homepage-theme gain match runtime truth. Treat live latency, intelligibility, quiet-gap, narration-timing and physical-device claims as evidence gates until observed.
4. Interaction: keep multi-select choices and one shared Submit path. Provide a persistent lower-right microphone control using feature detection and explicit user activation. Dictation may fill Scene free text but must never auto-submit or advance state; unsupported or denied permission must fail visibly and safely.
5. Magic: reconcile compact character records against the newest authoritative Rev 4.6/State270 and player-database records. Promote only already verified mechanics/possession facts. Do not invent custom-item powers, charges, learned spells, preparations, companion combat/poison rules, or resource refills. Missing counters remain unavailable. Keep general Site magic queued for adjudication unless an exact resolver plus current ledger exists.
6. Character presentation: preserve correct one-character/one-portrait bindings and tabbed sheets. Do not substitute another character portrait. Existing inspected portraits may remain fallback; do not claim new HD painterly bytes unless they actually exist and pass QA. Keep magic-aware personality/story cues atmospheric and non-mechanical unless an effect has resolved.
7. Retired DIRECT_BROWSER_CLEANUP / ArchitectureSupersession MCP/provisioning requirements are provenance, not blockers. Keep Site and conversation saves explicitly separate unless a verified synchronization mechanism exists.

## Validation
Run ten bounded review passes covering: authority/version drift; plugin readability; Site publication need; stale Site QA; audio profile/runtime consistency; first-cue ordering/latency evidence; magic authority; inventory/preparation reconciliation; portrait/story/microphone presentation; final release/CI/checkpoint closure. Fix actionable failures and rerun affected checks.

Before approval require: current plugin readback; no unresolved bundled relative imports; active release/config version alignment; homepage-theme profile equals runtime; microphone source contract present; magic fail-closed rules preserved; exact changed plugin files mirrored to GitHub; repository validation/tests pass; campaign state unchanged; rollback references recorded.

## Completion
Publish the plugin release if authorized. Commit/push canonical GitHub source and a release guard, then create a separate checkpoint commit referencing the artifact commit(s). Publish the existing Site only if the native Site tool is available; otherwise leave the current live Site untouched and record the exact source delta awaiting publication. Report browser/device tests only if actually performed.
