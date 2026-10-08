import fs from "node:fs";import path from "node:path";
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),"utf8"),j=p=>JSON.parse(read(p)),fail=m=>{throw new Error(m)},release=j("plugin/RELEASE_COMPONENTS.json"),expected=release.release;
for(const [k,v,exp] of [
["package",j("package.json").version,expected],
["plugin",j("plugin/plugin.json").version,expected],
["codex",j("plugin/.codex-plugin/plugin.json").version,expected],
["policy",j("plugin/skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json").release,release.active.policy],
["theme",j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json").configured_in_plugin_version,release.active.theme],
["soundProfile",j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json").reviewed_in_version,release.active.sound_profile],
["soundQA",j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json").reviewed_in_version,release.active.sound_qa],
["artRelease",j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").plugin_release,release.active.art_release||expected],
["artEngine",j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json").engine_version,release.active.art_engine],
["nodePolicy",j("plugin/skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json").release,release.active.node_policy],
["aliases",j("plugin/skills/desert-of-desolation-game/data/CHARACTER_ALIASES.json").release,release.active.alias_authority],
["gain",j("plugin/GAIN_AUTHORITY.json").release,release.active.gain_authority],
["timePolicy",j("plugin/skills/desert-of-desolation-game/data/TIME_OF_DAY_POLICY.json").configured_in_plugin_version,release.active.time_policy],
["siteProfile",j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json").configured_in_plugin_version,release.active.site_profile]
])if(v!==exp)fail(k+" drift: "+v+" expected "+exp);
const phases=JSON.stringify(["DAY","DUSK","NIGHT"]),theme=j("plugin/skills/desert-of-desolation-game/data/VISUAL_THEME.json"),art=j("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.json"),node=j("plugin/skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json"),time=j("plugin/skills/desert-of-desolation-game/data/TIME_OF_DAY_POLICY.json"),site=j("plugin/skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json"),host=j("plugin/skills/desert-of-desolation-game/data/HOSTING_CONFIG.json");
for(const p of [theme.outdoor_physical_variants,art.time_of_day.runtime_still_phases,node.environment.outdoor_phases,time.variant_keys])if(JSON.stringify(p)!==phases)fail("outdoor phase drift");
for(const aliases of [theme.outdoor_phase_aliases,art.time_of_day.phase_aliases,node.environment.aliases,time.visual_asset_aliases]){if(aliases.MORNING!=="DAY"||aliases.EVENING!=="DUSK"||aliases.SUNSET!=="DUSK"||aliases.DAWN!=="DUSK")fail("outdoor alias drift");}
const planner=read("plugin/skills/desert-of-desolation-art-direction/assets/art-engine.mjs"),sitePlanner=read("plugin/skills/desert-of-desolation-game/site-runtime/lib/art-engine.mjs");
if(!planner.includes("ART_ENGINE_VERSION = '1.6.0'")||!planner.includes("DOD_PIXEL32")||planner.includes("DOD_PAINTED")||planner.includes("DOD_INK"))fail("art-direction executable planner drift");
if(!sitePlanner.includes("ART_ENGINE_VERSION='1.6.0'")||!sitePlanner.includes("DOD_PIXEL32"))fail("site art planner drift");
if(site.live_site_evidence?.source_version_number!==32||site.live_site_evidence?.projection_revision!==65||site.live_site_evidence?.republished_current_release!==false||host.site_observed_source_version!==32||host.site_observed_projection_revision!==65||host.site_primary_cutover_approved!==false)fail("Site evidence drift");
const gain=j("plugin/GAIN_AUTHORITY.json"),sound=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_PROFILE.json"),soundQa=j("plugin/skills/desert-of-desolation-game/data/SOUND_MIXER_QA.json"),runtimeTheme=j("plugin/skills/desert-of-desolation-game/site-runtime/lib/site-presentation.json");
if(gain.homepage_theme.base_gain!==.16||sound.theme_base_gain!==.16||soundQa.defaults.theme_cue_output_before_master!==.16||runtimeTheme.background_theme.base_gain!==.16)fail("gain authority drift");
const aliases=j("plugin/skills/desert-of-desolation-game/data/CHARACTER_ALIASES.json");if(aliases.alias_to_canonical["party.talanis"]!=="party.tal")fail("character alias drift");
const intros=j("plugin/skills/desert-of-desolation-game/site-runtime/lib/module-introductions.json");if(Object.values(intros).some(x=>x.text_policy!=="EXACT_APPROVED_SOURCE_COPY"||x.rewrite_for_first_person!==false))fail("narrative alignment drift");
const page=read("plugin/skills/desert-of-desolation-game/site-runtime/app/page.tsx"),mic=read("plugin/skills/desert-of-desolation-game/site-runtime/components/microphone-input.tsx"),sheet=read("plugin/skills/desert-of-desolation-game/site-runtime/components/character-sheet.tsx");
if(!page.includes("<MicrophoneInput"))fail("microphone page wiring missing");if(mic.includes("submitAction"))fail("microphone auto-submit regression");if(!sheet.includes("canonicalId(member.id)"))fail("character alias presentation wiring missing");
const runtime=path.join(root,"plugin/skills/desert-of-desolation-game/site-runtime"),code=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.(tsx|ts|mjs|js)$/.test(e.name))code.push(f)}};walk(runtime);const re=/from\s+['"](\.{1,2}\/[^'"]+)['"]|import\s+['"](\.{1,2}\/[^'"]+)['"]/g,missing=[];for(const f of code){const src=fs.readFileSync(f,"utf8");let m;while((m=re.exec(src))){const spec=m[1]||m[2],raw=path.resolve(path.dirname(f),spec),cand=/\.[a-z0-9]+$/i.test(raw)?[raw]:[raw,raw+".mjs",raw+".js",raw+".ts",raw+".tsx",raw+".json",path.join(raw,"index.ts"),path.join(raw,"index.tsx"),path.join(raw,"index.js"),path.join(raw,"index.mjs")];if(!cand.some(fs.existsSync))missing.push(path.relative(root,f)+" -> "+spec)}}if(missing.length)fail("unresolved runtime imports: "+missing.join(", "));
for(const p of ["vercel.json","api","audio-renderer",".devcontainer","plugin/.app.json"])if(fs.existsSync(path.join(root,p)))fail("obsolete runtime path remains: "+p);if(Object.keys(j("plugin/mcp.json")).length!==0)fail("plugin mcp.json must remain empty");
console.log("Desert of Desolation "+expected+" consistency checks passed; native Site publication, device listening and full binary parity remain separate evidence gates.");
