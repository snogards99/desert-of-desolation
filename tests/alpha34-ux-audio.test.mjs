import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page=fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/app/page.tsx","utf8");
const engine=fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/lib/audio-engine.mjs","utf8");
const session=fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/lib/campfire-test.mjs","utf8");
const sheet=fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/components/character-sheet.tsx","utf8");
const pres=JSON.parse(fs.readFileSync("plugin/skills/desert-of-desolation-game/site-runtime/lib/site-presentation.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("plugin/assets/character-sheet/manifest.json","utf8"));

test("choices select without immediate submission and use a shared submit path",()=>{
  assert.match(page,/selectedActions/);
  assert.match(page,/aria-pressed=\{picked\}/);
  assert.match(page,/submitAction/);
  assert.doesNotMatch(page,/onClick=\{\(\)=>act\(c\.text,c\.id\)\}/);
});

test("inherited homepage gain stays unchanged; Home-only ownership remains wired",()=>{
  assert.equal(pres.background_theme.base_gain,0.16);
  assert.match(page,/tabRef\.current!==['"]Home['"]/);
  assert.match(engine,/stopTheme\(/);
});

test("scene audio auto-starts without injecting the homepage theme",()=>{
  assert.match(page,/startSceneAudio/);
  assert.match(page,/g\?\.revision/);
  assert.match(page,/startSceneAudio\(currentGame\.current,\{force:true\}\)/);
  assert.match(session,/const \[first,\.\.\.rest\]=cues/);
  assert.match(session,/await this\.engine\.buffer\(first\.media_id\)/);
  assert.match(session,/await this\.engine\.play\(first\.media_id,first\.bus/);
  assert.match(session,/sceneHealth\(cues\)/);
  assert.match(engine,/sceneHealth\(cues=\[\]\)/);
  assert.doesNotMatch(session,/startTheme\(this\.theme,\{role:['"]scene['"]\}\)/);
});

test("missing portrait bindings never show another character",()=>{
  assert.match(sheet,/Portrait unavailable/);
  assert.doesNotMatch(sheet,/portraits\[member\.id\]\|\|['"]\/character-sheet\/snogard\.png['"]/);
  assert.ok(manifest.entries.every(e=>e.runtime_binding_verified===true));
  assert.ok(manifest.entries.every(e=>e.hd_painterly_rerender_status==="PENDING_NEW_IMAGE_BYTES"));
});


test("homepage cleanup removes legacy Home navigation and labels",()=>{
  assert.doesNotMatch(page,/\['Home','Scene','Party','Journal'\]/);
  assert.match(page,/\['Scene','Party','Journal'\]/);
  assert.doesNotMatch(page,/home-features/);
  assert.doesNotMatch(page,/AN ADVENTURE IN RAURIN/);
  assert.doesNotMatch(page,/title-wordmark-header/);
  assert.match(page,/home-seekers/);
});
