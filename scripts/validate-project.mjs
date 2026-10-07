import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const j=p=>JSON.parse(read(p));
const fail=m=>{throw new Error(m)};
const expected="1.5.1-alpha.36";

for(const [k,v] of [
  ["package",j("package.json").version],
  ["plugin",j("plugin/plugin.json").version],
  ["codex",j("plugin/.codex-plugin/plugin.json").version],
  ["policy",j("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json").release],
  ["theme",j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json").configured_in_plugin_version],
  ["soundQA",j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json").reviewed_in_version],
  ["art",j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").plugin_release],
  ["nodePolicy",j("plugin/skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json").release],
  ["siteProfile",j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json").configured_in_plugin_version],
  ["siteQA",j("plugin/skills/desert-of-desolation-game/data/SITE_RUNTIME_QA.json").reviewed_in_version]
]) if(v!==expected) fail(k+" drift: "+v);

const site=j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json");
if(site.live_site_evidence?.source_version_number!==32||site.live_site_evidence?.projection_revision!==65) fail("site evidence drift");
if(site.live_site_evidence?.alpha2_candidate_republished!==false) fail("candidate must not claim live Site republish");

if(!fs.existsSync("plugin/skills/desert-of-desolation-game/site-runtime/lib/scene-image-resolver.mjs")) fail("resolver missing");
if(!read("plugin/skills/desert-of-desolation-game/site-runtime/components/scene-plate.tsx").includes("resolveSceneImage")) fail("ScenePlate resolver wiring missing");

const wrappers={
  "plugin/skills/desert-of-desolation-game/site-runtime/audio-engine.mjs":"export * from './lib/audio-engine.mjs';",
  "plugin/skills/desert-of-desolation-game/site-runtime/campfire-test.mjs":"export * from './lib/campfire-test.mjs';",
  "plugin/skills/desert-of-desolation-game/site-runtime/media-policy.mjs":"export * from './lib/media-policy.mjs';",
  "plugin/skills/desert-of-desolation-game/site-runtime/listening-scene.mjs":"export * from './lib/listening-scene.mjs';",
  "plugin/skills/desert-of-desolation-game/site-runtime/sound-settings.mjs":"export * from './lib/sound-settings.mjs';"
};
for(const [p,v] of Object.entries(wrappers)) if(read(p).trim()!==v) fail("legacy entrypoint drift: "+p);

const audio=read("plugin/skills/desert-of-desolation-game/site-runtime/lib/audio-engine.mjs");
if(!audio.includes("expected=configured.filter")) fail("scene health must expect configured buses only");
if(audio.includes("const expected=buses.filter")) fail("scene health all-bus regression");

console.log("Alpha 2 candidate consistency checks passed");
