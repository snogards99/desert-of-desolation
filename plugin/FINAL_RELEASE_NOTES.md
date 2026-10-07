# Desert of Desolation 1.5.1-alpha.36 — Alpha 2 Candidate

Finalized review candidate produced from a ten-pass audit of the coordinated Desert of Desolation project. Campaign state is unchanged.

- Reconciles the published alpha.35 Plugin Creator release back into canonical Git history and preserves its QA provenance.
- Eliminates stale duplicate audio implementations by converting legacy Site runtime entrypoints into thin re-exports of the authoritative `lib/` modules.
- Fixes Scene playback health so only buses configured by the current node can be reported missing.
- Preserves the alpha.34/35 gameplay UX: Scene / Party / Journal dock, cleaned homepage, shared multi-select Submit path, Home-only title theme, hard Scene restart, and first-cue preload/start ordering.
- Refreshes Site runtime QA to the verified live baseline of source version 32 / projection revision 65 without inventing deployment or source-commit evidence.
- Strengthens validation to fail on release-version drift, compatibility-entrypoint drift, all-bus Scene health regressions, unresolved relative imports, obsolete external renderer/MCP remnants, and live-Site publication overclaims.
- Reviews the divergent `deploy-optimize-20261004` branch and explicitly excludes it because its unique work restores obsolete Vercel, MCP/API, and external audio-renderer architecture removed from the current project.
- Preserves stable media IDs, 361-node routing, campaign state, workspace-private plugin audience, public Site access, legal/footer content, fonts, discovery gates, and current art/audio policies.
- Does not publish alpha.36 to Plugin Creator and does not republish the live ChatGPT Site. The currently published plugin remains 1.5.1-alpha.35.
- Physical iPhone speaker/headphone verification and new HD painterly character portrait bytes remain explicit external/future evidence gates.
