import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root,p),"utf8");
const json = p => JSON.parse(read(p));
const fail = message => { throw new Error(message); };

const pkg = json("package.json");
const plugin = json("plugin/plugin.json");
const codex = json("plugin/.codex-plugin/plugin.json");
const policy = json("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json");
const theme = json("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json");
const site = json("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json");
const sound = json("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json");
const soundQa = json("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json");
const artEngine = json("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json");
const gameSkill = read("plugin/skills/desert-of-desolation-game/SKILL.md");
const artSkill = read("plugin/skills/desert-of-desolation-art-direction/SKILL.md");
const mcp = json("plugin/mcp.json");

const expected = "1.5.1-alpha.24";
for (const [label,value] of [
  ["package",pkg.version],
  ["plugin",plugin.version],
  ["codex",codex.version],
  ["policy",policy.release],
  ["theme",theme.configured_in_plugin_version],
  ["site",site.configured_in_plugin_version]
]) if (value !== expected) fail(label+" version drift: "+value);

if (artEngine.engine_version !== "1.5.0") fail("art-engine version drift");
if (theme.rendering_profile !== "dod.hd-painted-module-realism") fail("visual profile drift");
if (!artSkill.includes("dod.hd-painted-module-realism")) fail("art skill missing HD profile");
if (artSkill.includes("pixel-art profile")) fail("active art skill still instructs pixel authoring");
if (gameSkill.includes("New first-20 gameplay art uses the full-color")) fail("active game skill still contains stale pixel authoring rule");
if (Object.keys(mcp).length !== 0) fail("plugin mcp.json must remain empty");

for (const p of ["vercel.json","api","audio-renderer",".devcontainer","plugin/.app.json"]) {
  if (fs.existsSync(path.join(root,p))) fail("obsolete runtime path remains: "+p);
}

const expectedAudio = {Ambience:0.42, Music:0.18};
for (const [k,v] of Object.entries(expectedAudio)) {
  if (sound.layers[k] !== v || soundQa.defaults[k] !== v) fail("audio default drift: "+k);
}
if (soundQa.defaults.theme_cue_output_before_master !== site.audio.homepage_theme.base_gain) fail("theme gain drift");
if (!site.visual.refinement_css.endsWith("site-refinement-alpha24.css")) fail("alpha24 CSS not active in source profile");

console.log("Desert of Desolation alpha.24 consistency checks passed.");
