# Migration from the legacy green authoring profile

The inspected plugin release 1.3.7 contained an Apple-monochrome-inspired four-green-value style in `data/imagery/index.json`. It also retained a 361-node authoring catalogue and shared background/actor/composite plans. This update changes the STYLE AUTHORITY, not those source relationships.

The updated index preserves the original profile under `legacy_style` and replaces the active `style` with the painted/ink defaults. The old workbook and JSONL row prompt fields remain immutable provenance. Their counts, IDs, hashes, proposed paths, availability flags, and actor/frame relationships are not rewritten.

Before producing any new art, reconstruct the prompt from the verified scene description, source references, current visible state, camera, actor identity, and approved continuity constraints. Apply the new templates. Do NOT concatenate a new style prefix onto an old complete prompt; that would mix two incompatible media and palettes.

`compile_prompt.py` deliberately accepts a newly normalized scene packet rather than raw workbook prompts. It rejects recognizable legacy green/pixel-art control phrases. A DM or authoring tool must map source facts into that packet and explicitly certify the visible slice. It does not claim to independently verify canon or replace the game's server-side discovery checks.

Do not mass-generate assets to make counts match. Unknown source details remain gaps; missing bytes remain unavailable. An optional return to a green mode would require a later explicit user request; this release does not add a competing runtime theme toggle.
