# Publication and release

The project does not require a separate hosted renderer.

## Runtime targets

- Plugin: `Plugin_3352cc65ee508191abeb37ffa759294d`
- Site: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`
- Canonical source: `snogards99/desert-of-desolation`, branch `main`

The plugin is workspace-private. The existing Site is the responsive browser play surface. Preserve current access settings unless the user explicitly changes them.

## Release flow

1. Inspect current plugin release, Site record, GitHub head, and latest checkpoint.
2. Reconcile active source and remove stale deployment/runtime assumptions.
3. Run `npm run verify`.
4. Update the existing plugin with a guarded release ID.
5. Publish the existing Site only through a supported native Site editor/publish action and only when publication is authorized.
6. Verify published artifacts separately; services are non-atomic.
7. Commit source and an evidence-backed checkpoint with rollback references.

## Evidence rules

Do not claim:
- live Site publication without a real Site publish result;
- browser audio without browser/user-gesture observation;
- physical iPhone QA without physical-device evidence;
- first-20 HD art completion until individual files exist, pass QA, and are bound.

Campaign state must not advance during release work.
