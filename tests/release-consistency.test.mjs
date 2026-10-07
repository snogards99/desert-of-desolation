import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const j = p => JSON.parse(fs.readFileSync(p,"utf8"));

test("release metadata is synchronized", () => {
  const expected="1.5.1-alpha.24";
  assert.equal(j("plugin/plugin.json").version, expected);
  assert.equal(j("plugin/.codex-plugin/plugin.json").version, expected);
  assert.equal(j("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json").release, expected);
  assert.equal(j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json").configured_in_plugin_version, expected);
});

test("current art authoring is HD painterly, not pixel", () => {
  const theme=j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json");
  assert.equal(theme.pixel_art,false);
  assert.equal(theme.rendering_profile,"dod.hd-painted-module-realism");
  assert.equal(j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").engine_version,"1.5.0");
});

test("audio configuration is internally consistent", () => {
  const profile=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json");
  const qa=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json");
  assert.equal(profile.layers.Ambience, qa.defaults.Ambience);
  assert.equal(profile.layers.Music, qa.defaults.Music);
  assert.equal(profile.theme_base_gain, qa.defaults.theme_cue_output_before_master);
});

test("obsolete external renderer files are removed", () => {
  for (const p of ["vercel.json","api","audio-renderer",".devcontainer","plugin/.app.json"]) assert.equal(fs.existsSync(p),false,p);
  assert.deepEqual(j("plugin/mcp.json"),{});
});
