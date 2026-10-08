# Desert of Desolation 1.5.1-alpha.40

Gameplay-boundary and recovery improvements in ten focused passes. The live Site is not republished by this source release.

The bundled page validates save identity/revisions and uses bounded reads. Action submission is single-flight, retains uncertain receipts across reloads when session storage is available, and never automatically retries a write. Scene-scoped drafts survive refreshes; accepted actions clear only their own draft. Accessible pending-action controls offer refresh and journal review.

An integration adapter implements authorization, revision checks, idempotent receipts, history preservation and state/receipt atomicity through required native host callbacks. Tests use synthetic state and in-memory storage only. It is not wired to production and adds no replacement rules engine, database or hosting service.

Scene media now requires current visibility/discovery/focus and valid lighting; failed images degrade to text with explicit retry. Checkpoint copying is bounded and allowlisted. Exact SHA-256 coverage protects runtime and shared-policy source from drift. Existing media bytes, saved mix, campaign state, access and default prompts are unchanged.

Native Site source/build/publication, real database/security integration, physical iPhone/listening QA, and complete binary-media synchronization remain open.
