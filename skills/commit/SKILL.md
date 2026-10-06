---
name: commit
description: Coordinate Desert of Desolation plugin, Site, media, and GitHub changes; repair QA or GitHub Actions failures; synchronize authorized work; commit it; and record a verified development checkpoint. Use when the user invokes $commit or asks to commit, synchronize, finalize, checkpoint, repair CI, or keep this project's plugin, Site, and GitHub aligned. Do not apply to unrelated repositories.
---

# Commit

Treat the Desert of Desolation plugin, Site, media, and GitHub repository `snogards99/desert-of-desolation` as one coordinated development project. Complete authorized implementation, validation, synchronization, GitHub CI repair, and commits; establish an evidence-backed checkpoint for subsequent work.

## Resolve current authority

- Target plugin `Plugin_3352cc65ee508191abeb37ffa759294d`, existing Site `desert-of-desolation`, and GitHub repository `snogards99/desert-of-desolation`, unless the user explicitly changes targets.
- Inspect current project files, plugin release metadata, Site deployment/source references, GitHub `main`, recent commits, GitHub Actions status/logs, and applicable project instructions. GitHub is a required synchronization and checkpoint target for this project; do not introduce Drive, desktop software, or new infrastructure merely to complete a commit.
- Record source commits, plugin release, Site deployment, dirty files, and existing checkpoint. Treat conversation versions as historical until verified. Distinguish latest source, latest published release, and latest validated baseline.
- Reconcile compatible work using provenance and verified behavior. Do not select authority solely by version number or timestamp. Preserve unrelated edits and valuable work; escalate only consequential conflicts that evidence cannot resolve.

## Coordinate changes

Establish or reuse one canonical source for shared game data, assets, audio, presentation rules, and release metadata. Identify platform-specific files and their relationship to shared sources.

Implement a repeatable synchronization workflow: reconcile changes from the plugin or Site into the canonical project source, propagate them to GitHub, and verify GitHub matches the intended runtime release. Detect drift before committing or releasing. Prevent recursive updates and silent overwrites. Use a shared release identifier with plugin release ID, Site reference, and GitHub commit SHA. Never let a newer plugin/Site silently coexist with stale GitHub source while calling the release synchronized.

Prefer the existing workflow. If none exists, implement the minimum supported synchronization and verification mechanism. Do not promise continuous automation without a running, verified mechanism; report an explicit workflow when that is the available capability.

Preserve gameplay, campaign state, stable IDs, the authoritative node database, media references, navigation, fonts, legal/footer content, and access settings. Preserve the removal of MCP dependencies and remnants from the game project; this does not prohibit available development tools.

## Verify and repair

Proceed through applicable QA and routine reviews without repeated confirmation. Inspect GitHub Actions for the relevant source commit. If any required workflow is red, fetch the failed job/step logs, identify the actual root cause, fix it within scope, and rerun or trigger validation through the corrective commit. Do not mark the checkpoint verified until required CI is green. Fix other failed checks, errors, and actionable warnings within scope, then rerun affected checks. Accept successful QA results; never waive failures, fabricate passes, or suppress warnings merely to obtain a clean report. Classify remaining warnings by impact and cause.

Choose checks proportional to changed behavior. For coordinated releases, verify shared-source consistency, campaign-state compatibility, gameplay, desktop/mobile layouts, audio controls, narration ducking, and graceful audio failure. Use test state or fixtures; do not advance the user's real campaign. State checks that could not be executed.

## Commit, release, and checkpoint

1. Review the final diff and stage all task-related changes across both targets. Exclude unrelated work, secrets, and caches; include generated output only when the project tracks it intentionally.
2. Synchronize task-related source into GitHub `main`, then commit/push through the supported GitHub tools. Verify the resulting commit SHA, repository head, and required GitHub Actions run. Distinguish committed source, pushed GitHub state, plugin release, and Site deployment.
3. Publish both existing targets when the current request or prior session authorizes release. A bare commit request authorizes synchronization and commits, but does not itself authorize publication or access changes. Prepare a reviewable release when publication lacks authorization.
4. Verify published artifacts and GitHub source against the intended release. Treat separate services as non-atomic: if plugin, Site, GitHub synchronization, or required GitHub Actions fails, preserve recoverable work, report partial state, and do not label it a coordinated release.
5. Save a checkpoint in the canonical project store containing UTC timestamp, shared release identifier, canonical source reference, plugin version/release, Site source/version/deployment, GitHub repository/branch/commit SHA, GitHub Actions run and conclusion, shared-file manifest or checksums, QA evidence, unresolved limitations, synchronization instructions, and rollback references. Record unavailable or unpublished states explicitly; never invent references.
6. Avoid circular metadata: record artifact commits first, then commit the checkpoint referencing them; report its own commit separately. Mark a checkpoint verified only when required checks passed. Preserve the previous verified baseline when a new candidate is incomplete.

Continue routine reversible work within authorization until complete or a specific technical or user-dependent boundary remains. Do not force-push, discard edits, change access, or introduce paid/external infrastructure without applicable authorization.

## Report

Return a concise before/after version table, coordinated changes, QA outcome, commit/push/deployment evidence, checkpoint location and status, and genuine blockers. State whether the result is committed, published, or partially complete. Never claim that creating this skill alone synchronizes or changes the project.
