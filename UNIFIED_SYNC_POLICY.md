# Unified Project Synchronization

Canonical repository: `snogards99/desert-of-desolation`

Runtime targets:
- Plugin: `Plugin_3352cc65ee508191abeb37ffa759294d`
- Site: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`

## Authority

The plugin package plus active session/checkpoint state is runtime authority. GitHub is unified source/test/media/history authority. The Site is the browser presentation surface. No external renderer or hosting adapter is a game-state authority.

## Verified release rule

A coordinated release is VERIFIED only when:
1. plugin version and release ID are recorded;
2. GitHub commit SHA is recorded;
3. Site source/deployment reference is recorded when available;
4. active plugin manifests/config match GitHub copies;
5. campaign state was not unintentionally advanced;
6. rollback references are recorded;
7. every claimed browser/device check has actual evidence.

Never silently overwrite a newer verified artifact with an older file solely because its timestamp or version label differs.

## Media

Stable media IDs must remain stable. GitHub stores source and intended runtime media when supported. Missing or unapproved optional media fails closed to another legal image, bundled media, text, or silence.

## Site

Shared presentation/data remains canonical under `plugin/`. `site/` records the native Site identity and publication state. Do not claim a byte-for-byte Site export unless a supported Site source/export action actually produced one.
