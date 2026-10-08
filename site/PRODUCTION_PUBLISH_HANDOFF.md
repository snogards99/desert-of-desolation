# Desert of Desolation — stable 1.5.1 production handoff

The existing public Site is published at source version **36**, native commit `e9c6074d4e8d23e7820f2cb9625b3b9cde3f1de6`, deployment `appgdep_6ac7136db60081918bac4a1b2ee7939d`. Project ID, URL and public audience are unchanged. See `site/PRODUCTION_DEPLOYMENT_EVIDENCE_2026-10-08.json` for exact returned identifiers, timestamp, archive hash and checks.

Native frozen dependency installation, typecheck, Worker build/module closure and isolated D1/HTTP action-save-reload tests passed. The real production campaign remains at revision 3; its state rows matched the baseline exactly, with zero production action receipts and zero gameplay write requests during QA.

Stable plugin 1.5.1 / `pluginrel_6ac6f61338388191a83cdaa17c2f256e` is unchanged. Its original v32/projection65 observations are immutable release-history evidence; the current external release guard and checkpoint describe version 36. Do not publish another alpha or create another Site.

The coordinated release is **not yet fully verified**: secure owner sign-in was cancelled, so owner-session live scene/party/art inspection is unverified. Desktop and 390px native preview checks passed; public live homepage/settings/legal controls were inspected. Physical iPhone, listening quality, OS reduced-motion emulation and full plugin archive parity were not performed. GitHub must have a directly verified green run for this handoff; historical success runs are insufficient.

Continue with read-only owner verification and an isolated fixture for writes. Never advance, reset or rewind the real campaign. Preserve the existing source, D1/R2 data and saved mix. Rollback references and limitations are in the evidence/checkpoint; restore only a reviewed version on this same Site, without resetting state.
