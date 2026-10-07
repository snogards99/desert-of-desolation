import fs from "node:fs";import path from "node:path";
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),"utf8"),j=p=>JSON.parse(read(p)),fail=m=>{throw new Error(m)},release=j("plugin/RELEASE_COMPONENTS.json"),expected=release.release;
const versions=[
["package",j("package.json").version],["plugin",j("plugin/plugin.json").version],["codex",j("plugin/.codex-plugin/plugin.json").version],
["policy",j("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json").release],
["theme",j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json").configured_in_plugin_version],
["soundProfile",j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json").reviewed_in_version],
["soundQA",j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json").reviewed_in_version],
["art",j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").plugin_release],
["nodePolicy",j("plugin/skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json").release],
["aliases",j("plugin/skills/desert-of-desolation-game/data/CHARACTER_ALIASES.json").release],
["gain",j("plugin/GAIN_AUTHORITY.json").release]
];
for(const [k,v] of versions)if(v!==expected)fail(k+" drift: "+v+" expected "+expected);
if(release.schema_version!==2||release.scope!=="PROJECT_WIDE_RECONCILIATION")fail("alpha.38 release manifest schema/scope drift");
for(const k of ["policy","theme","sound_profile","sound_qa","node_policy","alias_authority","gain_authority"])if(release.active?.[k]!==expected)fail("release active "+k+" drift");
if(release.active?.art_engine!=="1.6.0")fail("art engine release drift");
const site=j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json"),host=j("plugin/skills/desert-of-desolation-game/data/HOSTING_CONFIG.json"),sound=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json"),soundQa=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json"),runtimeTheme=j("plugin/skills/desert-of-desolation-game/site-runtime/lib/site-presentation.json"),visual=j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json"),nodePolicy=j("plugin/skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json");
if(site.live_site_evidence?.source_version_number!==32||site.live_site_evidence?.projection_revision!==65||host.site_observed_source_version!==32||host.site_observed_projection_revision!==65)fail("site evidence drift");
if(site.live_site_evidence?.alpha38_republished!==false||host.site_primary_cutover_approved!==false)fail("unverified Site publication/cutover claimed");
if(sound.theme_base_gain!==0.16||soundQa.defaults.theme_cue_output_before_master!==0.16||runtimeTheme.background_theme.base_gain!==0.16)fail("homepage theme gain drift");
if(visual.rendering_profile!=="dod.pixel32-rgba"||visual.pixel_art!==true||visual.art_engine_version!=="1.6.0")fail("pixel32 visual authority drift");
const phases=JSON.stringify(["DAY","DUSK","NIGHT"]);if(JSON.stringify(visual.outdoor_physical_variants)!==phases||JSON.stringify(nodePolicy.environment.outdoor_phases)!==phases)fail("outdoor phase policy drift");
const page=read("plugin/skills/desert-of-desolation-game/site-runtime/app/page.tsx"),mic=read("plugin/skills/desert-of-desolation-game/site-runtime/components/microphone-input.tsx");
if(!page.includes("MicrophoneInput")||!page.includes("<MicrophoneInput"))fail("microphone page wiring missing");if(!mic.includes("SpeechRecognition")||mic.includes("submitAction"))fail("microphone source contract invalid");
const magic=j("plugin/MAGIC_RECONCILIATION_QA.json"),snogard=j("plugin/skills/desert-of-desolation-game/data/magic/snogard.json"),syrra=j("plugin/skills/desert-of-desolation-game/data/magic/syrra.json");
if(!magic.unresolved_fail_closed?.length||!snogard.abilities.some(x=>x.ability==="Call Upon the Jann"&&x.source_status==="SOURCE_2E_VERIFIED"))fail("magic reconciliation drift");if(!syrra.magic_items.some(x=>x.item==="Twin Daggers +1"&&x.enchantment===1))fail("Cyrra weapon reconciliation drift");
const runtime=path.join(root,"plugin/skills/desert-of-desolation-game/site-runtime"),code=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.(tsx|ts|mjs|js)$/.test(e.name))code.push(f)}};walk(runtime);const re=/from\s+['"](\.{1,2}\/[^'"]+)['"]|import\s+['"](\.{1,2}\/[^'"]+)['"]/g,missing=[];for(const file of code){const src=fs.readFileSync(file,"utf8");let m;while((m=re.exec(src))){const spec=m[1]||m[2],raw=path.resolve(path.dirname(file),spec),c=/\.[a-z0-9]+$/i.test(raw)?[raw]:[raw,raw+".mjs",raw+".js",raw+".ts",raw+".tsx",raw+".json",path.join(raw,"index.ts"),path.join(raw,"index.tsx"),path.join(raw,"index.js"),path.join(raw,"index.mjs")];if(!c.some(fs.existsSync))missing.push(path.relative(root,file)+" -> "+spec)}}if(missing.length)fail("unresolved runtime imports: "+missing.join(", "));
for(const p of ["vercel.json","api","audio-renderer",".devcontainer","plugin/.app.json"])if(fs.existsSync(path.join(root,p)))fail("obsolete runtime path remains: "+p);if(Object.keys(j("plugin/mcp.json")).length!==0)fail("plugin mcp.json must remain empty");
if(!/^1\.5\.1-alpha\.[1-9]\d*$/.test(expected))fail("invalid release version");
console.log("Desert of Desolation "+expected+" consistency checks passed; binary-media parity and native Site publication remain separate evidence gates.");
