import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";const j=p=>JSON.parse(fs.readFileSync(p,"utf8")),expected="1.5.1-alpha.36";
test("active release metadata is synchronized",()=>{assert.equal(j("package.json").version,expected);assert.equal(j("plugin/plugin.json").version,expected);assert.equal(j("plugin/.codex-plugin/plugin.json").version,expected);assert.equal(j("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json").release,expected);assert.equal(j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json").configured_in_plugin_version,expected);assert.equal(j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json").reviewed_in_version,expected);assert.equal(j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").plugin_release,expected)});
test("live Site source evidence is v32",()=>{const s=j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json");assert.equal(s.live_site_evidence.source_version_number,32);assert.ok(s.live_site_evidence.projection_revision>=65);assert.equal(s.live_site_evidence.status,"active");assert.equal(s.live_site_evidence.access_mode,"public")});
test("art and audio policy remain consistent",()=>{const t=j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json"),a=j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json"),p=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json"),q=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json");assert.equal(t.pixel_art,false);assert.equal(t.rendering_profile,"dod.hd-painted-module-realism");assert.equal(a.engine_version,"1.5.0");assert.equal(p.layers.Ambience,q.defaults.Ambience);assert.equal(p.layers.Music,q.defaults.Music);assert.equal(p.theme_base_gain,q.defaults.theme_cue_output_before_master);assert.equal(p.theme_speech_duck_gain,q.defaults.theme_speech_duck_gain)});
test("bundled Site runtime has no unresolved relative imports",()=>{const base="plugin/skills/desert-of-desolation-game/site-runtime",files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.(tsx|ts|mjs|js)$/.test(e.name))files.push(f)}};walk(base);const re=/from\s+['"](\.{1,2}\/[^'"]+)['"]|import\s+['"](\.{1,2}\/[^'"]+)['"]/g,missing=[];for(const file of files){const src=fs.readFileSync(file,"utf8");let m;while((m=re.exec(src))){const spec=m[1]||m[2],raw=path.resolve(path.dirname(file),spec),c=/\.[a-z0-9]+$/i.test(raw)?[raw]:[raw,raw+".mjs",raw+".js",raw+".ts",raw+".tsx",raw+".json",path.join(raw,"index.ts"),path.join(raw,"index.tsx"),path.join(raw,"index.js"),path.join(raw,"index.mjs")];if(!c.some(fs.existsSync))missing.push(file+" -> "+spec)}}assert.deepEqual(missing,[])});
test("obsolete external renderer files are removed",()=>{for(const p of ["vercel.json","api","audio-renderer",".devcontainer","plugin/.app.json"])assert.equal(fs.existsSync(p),false,p);assert.deepEqual(j("plugin/mcp.json"),{})});

test("Alpha 2 candidate canonicalizes legacy audio entrypoints",()=>{
  const base="plugin/skills/desert-of-desolation-game/site-runtime";
  const expectedWrappers={
    "audio-engine.mjs":"export * from './lib/audio-engine.mjs';",
    "campfire-test.mjs":"export * from './lib/campfire-test.mjs';",
    "media-policy.mjs":"export * from './lib/media-policy.mjs';",
    "listening-scene.mjs":"export * from './lib/listening-scene.mjs';",
    "sound-settings.mjs":"export * from './lib/sound-settings.mjs';"
  };
  for(const [name,src] of Object.entries(expectedWrappers)) assert.equal(fs.readFileSync(path.join(base,name),"utf8").trim(),src);
});

test("scene health reports only configured enabled buses",()=>{
  const src=fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/lib/audio-engine.mjs","utf8");
  assert.match(src,/expected=configured\.filter/);
  assert.doesNotMatch(src,/const expected=buses\.filter/);
});

test("candidate does not overclaim live Site publication",()=>{
  const p=j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json");
  const q=j("plugin/skills/desert-of-desolation-game/data/SITE_RUNTIME_QA.json");
  assert.equal(p.configured_in_plugin_version,expected);
  assert.equal(p.live_site_evidence.alpha2_candidate_republished,false);
  assert.equal(q.recorded_live_baseline.source_version_number,32);
  assert.equal(q.recorded_live_baseline.projection_revision,65);
  assert.equal(q.gates.find(x=>x.id==="live_site_candidate_publication").status,"OPEN");
});
