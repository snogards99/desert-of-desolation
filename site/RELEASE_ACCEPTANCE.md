# Full-release acceptance: alpha.41 checkpoint

## Scope and authority

Use the existing Site project `appgprj_6ac3ddb2142c81918d529d4c7504e59d` and private plugin `Plugin_3352cc65ee508191abeb37ffa759294d`.
The last recorded native Site source is v32/projection 65, inherited evidence only.
Alpha.41 fixes the bundled game client. It is not a deployed native Site update.
Never recreate the Site, replace its database with fixtures, or treat queued actions as resolved.

## Ordered gates

| Order | Gate | Current state | Acceptance evidence required |
| --- | --- | --- | --- |
| 1 | Existing native source and build | BLOCKED_NATIVE_ACCESS | Obtain its package/lockfile, routes, schema, source and deployment settings; reconcile this bundle; full typecheck/build. |
| 2 | Campaign ownership and durable persistence | PRODUCTION_UNVERIFIED | Native authorization, authorized reads, serialized atomic state/receipt writes and rollback tests. |
| 3 | Source-backed adjudication | PRODUCTION_UNWIRED | Wire the existing resolver and safe projection; preserve QUEUED versus RESOLVED; do not invent rules. |
| 4 | Action-save-reload journey | SYNTHETIC_ONLY | Isolated native campaign action commits once, correlates its receipt/revision, updates scene/media and survives reload and a second authorized device. |
| 5 | Rules and canon coverage | CURRENT_AUDIT_REQUIRED | Reconcile required mechanics and reachable nodes with original/verified sources; classify real gaps and explicit exclusions. |
| 6 | Required scene/media completeness | INCOMPLETE_OR_UNVERIFIED | Approved scene assets or approved reusable bindings; outdoor DAY/DUSK/NIGHT only; no hidden-content disclosure. |
| 7 | Sound and actual delivery | SOURCE_TESTED_ONLY | Deployed bytes/decoding, saved mix, buses/ducking/fades, speaker/headphone listening and lifecycle checks. |
| 8 | Desktop/iPhone/accessibility | DEVICE_EVIDENCE_REQUIRED | Desktop and 390px native journeys, touch/keyboard, mic permissions, background/resume, network/storage failures and text equivalents. |
| 9 | Restore, source parity, distribution | OPEN | Verified backup/restore/approved rewind, complete authorized binary sync, provenance and appropriate distribution permissions. |
| 10 | Coordinated publication | BLOCKED_BY_ABOVE | Native preview review, matching actual Site/plugin references, ten varied native acceptance journeys, rollback and exact release checkpoint. |

## Required source handoff

Start with `site/ALPHA40_INTEGRATION.md`. Its four host adapters remain required.
Retain original media IDs, default prompts, sound mix, typography, footer, navigation and real campaign records.
Use `npm run verify` for repository/source checks. This is NOT native build or production acceptance.
Repeated green unit tests do not close a missing native integration or physical listening gate.
Do not clear uncertain actions using unrelated/stale refreshes; match exact request identity and durable committed revision in the native integration.
Historical FINAL and waived device records remain historical; they do not certify this deployment.

## Current access evidence

This work session can update GitHub and Plugin Creator. No native Site editing/publishing action was found; available Project/Library results describe older inspections rather than supply an editable native export.
Full plugin archive download was attempted but the execution environment could not resolve its download host. A text-overlay release preserves omitted assets; it cannot establish full binary parity.
No new hosting, database, wrapper plugin or required desktop runtime was introduced.
