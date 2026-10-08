# Alpha.40 integration and verification boundary

The existing Site project remains `appgprj_6ac3ddb2142c81918d529d4c7504e59d`.
This release changes bundled source, not the deployed Site. Do not create a replacement Site or a required external runtime.

## Implemented source

The page now uses bounded JSON reads, validates campaign/revision/display records, rejects older saves, preserves session-local drafts across refreshes, locks action submissions synchronously, and retains uncertain receipts across reloads when session storage is available. Network errors never automatically resend a command. A confirmed receipt followed by failed refresh offers a read-only recovery path. Unknown outcomes require journal confirmation or an explicit user review before clearing the local receipt.

Requests keep the existing `/api/game` protocol: `id`, `campaign`, `revision`, `text`, optional `choice`. Extra server idempotency is not assumed. Storage-denied browsers retain an in-memory guard while open; drafts are explicitly reported as unsaved. Separate tabs/devices require the native server's transaction and identity guarantees.

Scene images require explicit creature visibility, focused discovered items, matching outdoor lighting or a neutral fallback, and current node/entity identity. Missing or failed art degrades to text and a retry control. Checkpoint copying exports bounded allowlisted player-visible fields, not an importable save or raw journal objects.

## Native server adapter (not deployed)

`plugin/skills/desert-of-desolation-game/server-runtime/action-service.mjs` exports a dependency-injected action service. The existing native Site must supply all four adapters:

- `authorize(principal, campaign, tx)`: derive the principal from native authentication, verify current ownership inside the transaction, and return the authorized subject and exact campaign. Never trust a client-provided principal or authorization flag.
- `transact(campaign, callback)`: run a durable serialized transaction providing `getState`, `getReceipt`, `putState`, and `putReceipt`. State and receipt must commit together or both roll back. Enforce uniqueness on campaign plus command ID. Do not evict receipts while retries remain possible.
- `resolve(state, command, grant)`: invoke only the existing, source-backed gameplay resolver. Reject unsupported mechanics; never invent a substitute rules engine. Return QUEUED or RESOLVED, a next-revision state and internal message. QUEUED may change only revision and journal, not HP, resources, time or location.
- `project(state, grant, outcomeSummary)`: produce authorized, player-visible identity/revision and a safe receipt message. Raw resolver text and private state are never returned by this adapter.

The native HTTP route must also enforce method, trusted origin/CSRF policy, payload bounds, authentication and deployment-specific error mapping. None of those production checks can be verified without the actual native source and runtime. The in-memory transaction implementation exists only in tests.

## Acceptance before live publication

Export and reconcile the native Site, wire its real adapters, build/typecheck it, and test an isolated campaign: load, draft, submit once, save, update scene, reload. Exercise duplicate requests, stale revisions, unauthorized users, receipt write rollback, timed-out responses, hidden art and unavailable media. Then publish the existing Site and test desktop, 390-pixel layout, physical iPhone and actual audio. Preserve the real campaign and bundled media throughout.
