# Unified Project Synchronization

Canonical repository: `snogards99/desert-of-desolation`

Runtime targets:
- Plugin: `Plugin_3352cc65ee508191abeb37ffa759294d`
- Site: `appgprj_6ac3ddb2142c81918d529d4c7504e59d`

## Required release rule
A coordinated release is VERIFIED only when:
1. plugin version + release ID are recorded;
2. GitHub commit SHA is recorded;
3. Site source/deployment reference is recorded when available;
4. plugin manifests and Site presentation/configuration match repository copies;
5. expected media inventory is fully present in GitHub or the release is explicitly PARTIAL;
6. campaign state was not unintentionally advanced;
7. rollback references are recorded.

Never silently prefer an older GitHub file over a newer published plugin file. For sync recovery, the current published plugin is authoritative unless a stronger verified checkpoint proves otherwise.

## Media policy
All runtime media should be versioned in GitHub under `plugin/assets/` or the corresponding canonical project path. Stable filenames and media IDs must not change during mirroring. Any transfer limitation must fail closed: mark synchronization PARTIAL and never claim full parity.

## Site policy
Site-specific code/configuration belongs under `site/`; shared presentation/data remains canonical under `plugin/` until extracted into a verified shared package. Do not duplicate shared data without a generated/checksummed relationship.
