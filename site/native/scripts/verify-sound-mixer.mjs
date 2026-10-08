import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AudioEngine,buses,levels} from '../lib/audio-engine.mjs';
import {SoundSession,campfireCues} from '../lib/campfire-test.mjs';
import {campfireBeds,previewClips} from '../lib/listening-scene.mjs';
import {defaultMix,readMix,saveMix,mixKey} from '../lib/sound-settings.mjs';
import {authorizedMedia,fallbackPath} from '../lib/media-policy.mjs';
let contexts=0,started=0,requests=[];
class Param{value=0;setValueAtTime(v){this.value=v;}setTargetAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}cancelScheduledValues(){}}
class Node{gain=new Param();pan=new Param();threshold=new Param();knee=new Param();ratio=new Param();attack=new Param();release=new Param();connect(){}disconnect(){}start(){started++;}stop(time){this.stopAt=time;if(time===undefined)this.onended?.();}}
class Context{constructor(){contexts++;this.state='suspended';}currentTime=0;destination={};createGain(){return new Node();}createDynamicsCompressor(){return new Node();}createBufferSource(){return new Node();}createStereoPanner(){return new Node();}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}async decodeAudioData(){return {duration:20,length:100,numberOfChannels:2,getChannelData:()=>new Float32Array(100).fill(.95)};}}
globalThis.AudioContext=Context;globalThis.fetch=async(url,options)=>{requests.push({url,...options});return {ok:true,status:200,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>new ArrayBuffer(4)};};
const config={enabled:true,media_id:'dod.audio.opening_replacement.opening_title_theme_v2',fallback_media_id:'scorefile.campaign_opening_overture.v397',base_gain:.08,speech_duck_gain:.025,fade_in_seconds:2.5,fade_out_seconds:1.5};
const e=new AudioEngine();await e.unlock();
for(const bus of buses)await e.play(bus,bus,{loop:true});
const originalSources=[...e.active.values()].map(x=>x.source);e.setVolume(.7);for(const bus of buses)assert.equal(e.layers[bus].volume,levels[bus]);assert.equal(e.master.gain.value,.7);e.mute(true);assert.equal(e.master.gain.value,0);e.mute(false);
for(const bus of buses){const before=Object.fromEntries(buses.map(x=>[x,e.layers[x].volume]));e.setLayer(bus,{volume:.61});assert.equal(e.layers[bus].volume,.61);for(const other of buses.filter(x=>x!==bus))assert.equal(e.layers[other].volume,before[other]);e.setLayer(bus,{enabled:false});assert.equal(e.nodes.get(bus).gain.value,0);e.setLayer(bus,{enabled:true});assert(e.nodes.get(bus).gain.value>0);assert.deepEqual([...e.active.values()].map(x=>x.source),originalSources);}
assert.equal(contexts,1);const beforeStarts=started;for(let i=0;i<20;i++){e.setLayer('Music',{enabled:false});e.setLayer('Music',{enabled:true});}assert.equal(started,beforeStarts);
for(const bus of buses)e.setLayer(bus,{volume:1,enabled:true});e.setVolume(1);let worstBound=0;for(const voice of e.active.values())worstBound+=voice.peak*voice.cueGain*e.nodes.get(voice.bus).gain.value;assert(worstBound*e.headroom.gain.value<=.900001);e.setLayer('Narrator',{enabled:false});e.setLayer('Dialogue',{enabled:false});assert.equal(e.nodes.get('Ambience').gain.value,.5);e.setLayer('SFX',{enabled:false});assert.equal(e.nodes.get('Ambience').gain.value,1);
e.stop();e.applyMix(defaultMix());await e.startTheme(config);const theme=e.active.get('SiteTheme');e.setLayer('Music',{volume:0});assert.equal(e.nodes.get('Music').gain.value,0);assert(Number.isFinite(theme.mix.gain.value));e.setLayer('Music',{volume:.36});assert.equal(theme.mix.gain.value*e.nodes.get('Music').gain.value,.16);e.setLayer('Music',{enabled:false});assert.equal(e.nodes.get('Music').gain.value,0);e.setLayer('Music',{enabled:true});assert.equal(e.active.get('SiteTheme'),theme);
console.log('PASS: master × layer × cue mix; all seven layer mute/volume controls; independent music; no new sources/context on toggles; speech ducking; conservative max-output bound <=0.90.');
const items=new Map();const storage={getItem:key=>items.get(key)??null,setItem:(key,value)=>items.set(key,value)};const chosen=e.getMix();chosen.enabled=false;chosen.master=.82;chosen.layers.Movement={volume:.37,enabled:false};assert(saveMix(storage,chosen));assert.deepEqual(readMix(storage),chosen);assert.deepEqual([...items.keys()],[mixKey]);const reload=new AudioEngine();reload.applyMix(readMix(storage));assert.deepEqual(reload.getMix(),chosen);assert.deepEqual(readMix(null),defaultMix());assert.equal(saveMix(null,chosen),false);items.clear();storage.setItem('dod.output-volume','.73');storage.setItem('dod.output-muted','true');assert.equal(readMix(storage).master,.73);assert.equal(readMix(storage).enabled,false);assert.equal(contexts,1);
console.log('PASS: reload/navigation-compatible preferences, legacy migration, isolated presentation storage, blocked-storage graceful handling.');
const session=new SoundSession(e,config);await session.toggleScene([{media_id:'camp',bus:'Ambience',loop:true}]);e.setThemeSuppressed(true);assert(e.active.get('SiteTheme').mix.gain.value>0);const bed=e.active.get('Ambience'),sceneContext=e.context;for(let i=0;i<12;i++){await session.toggleScene([{media_id:'camp',bus:'Ambience',loop:true}]);assert.equal(session.state,'paused');assert.equal(e.context.state,'suspended');await session.toggleScene([{media_id:'camp',bus:'Ambience',loop:true}]);assert.equal(session.state,'playing');assert.equal(e.active.get('Ambience'),bed);}assert.equal(e.context,sceneContext);assert.equal([...e.active.values()].filter(x=>x.id==='camp').length,1);session.stop();e.setThemeSuppressed(false);
console.log('PASS: real-engine scene first play, second pause, third resume; 12 repeats retain one scene loop and one context.');
requests=[];const campaign={revision:7,time:900,location:'camp',resources:{water:14},journal:[],quests:[]};const checkpoint=JSON.stringify(campaign);await session.startCampfire();const origin=session.startedAt;assert(e.active.has('Campfire:Ambience'));assert.equal(e.active.get('Campfire:Ambience').source.stopAt,origin+60);assert.equal(e.active.get('Campfire:Music').source.stopAt,origin+60);
for(let second=0;second<60;second++){e.context.currentTime=origin+second;session.tick();await new Promise(r=>setImmediate(r));if(second===22){await session.pause();const elapsed=session.elapsed;session.tick();assert.equal(session.elapsed,elapsed);await session.resume();}for(const voice of e.active.values())assert.equal(voice.source.stopAt,origin+60);}
assert(campfireCues.every(c=>requests.some(r=>r.url.includes(encodeURIComponent(c.media_id)))));assert.equal(session.elapsed,59);e.context.currentTime=origin+60;session.tick();assert.equal(session.mode,'off');assert.equal(session.elapsed,60);assert.equal(e.active.size,0);assert.equal(session.timer,null);assert.equal(JSON.stringify(campaign),checkpoint);assert(requests.every(r=>r.url.startsWith('/api/media?')&&!r.method));assert.equal(contexts,1);
console.log('PASS: 60 audio-clock seconds, all seven approved preview layers sequenced, pause freezes clock, source cutoff guards background timer delays, no writes or campaign mutation.');
const assets=JSON.parse(readFileSync(new URL('../server-data/audio.json',import.meta.url)));for(const id of new Set(['dod.audio.opening_replacement.frontier_campfire_loop20',config.media_id,...campfireBeds.map(x=>x.media_id),...campfireCues.map(x=>x.media_id)])){assert(authorizedMedia(id,null,0));const row=assets.find(a=>a.media_id===id);const bytes=readFileSync(new URL('../public'+fallbackPath(id),import.meta.url));assert.equal(bytes.length,row.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);}assert.equal(authorizedMedia('dod.voice.narrator.treasure_001',null,0),false);
console.log('PASS: current asset checksums, approved harmless previews only; secrets and narration outside the preview remain gated.');
// Static fit calculation for the actual grid declaration; browser layout is a separate pending check.
for(const width of [320,375,390,430]){const outer=24,frame=6,padding=width<=350?16:24;const content=width-outer-frame-padding;const columns=width<=350?(4.75*16+44+24+2.5*16+12):(5.3*16+44+30+2.65*16+15);assert(columns<=content,`${width}px mixer grid must fit`);}
console.log('PASS: mixer grid minimum sizes fit 320/375/390/430px with 44px touch controls (static sizing; visual browser/iPhone QA not performed).');
// Live controls exercise ongoing beds and ended one-shots, including both output mixers.
await session.startCampfire();const start=e.context.currentTime;
for(const bus of buses){
 const active=[...e.active.values()].find(v=>v.bus===bus);const other=[...e.active.values()].filter(v=>v.bus!==bus).map(v=>v.source);
 e.setLayer(bus,{enabled:false});assert.equal(e.nodes.get(bus).gain.value,0);
 if(!active||!active.loop){for(const [key,v] of e.active)if(v.bus===bus)e.cancel(key);}
 e.setLayer(bus,{enabled:true,volume:.64});await session.layerChanged(bus,false);
 assert(e.nodes.get(bus).gain.value>0);assert([...e.active.values()].some(v=>v.bus===bus));
 for(const source of other)assert([...e.active.values()].some(v=>v.source===source));
 const same=[...e.active.values()].filter(v=>v.bus===bus).map(v=>v.source);await session.layerChanged(bus,false);assert.deepEqual([...e.active.values()].filter(v=>v.bus===bus).map(v=>v.source),same);
 for(const volume of [.1,.7,.2,.9,.45]){e.setLayer(bus,{volume});assert.equal(e.layers[bus].volume,volume);assert(e.nodes.get(bus).gain.value>0);}
}
assert.equal(contexts,1);assert.equal(session.startedAt,start);session.stop();
const ui=readFileSync(new URL('../components/sound-mixer.tsx',import.meta.url),'utf8');assert(ui.includes('onInput='));assert(ui.includes('onChange(bus,{volume:'));assert(!ui.includes('onChange(master?'));
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');assert(page.includes('previous=mixRef.current'));assert(page.includes('layerChanged(bus,level.enabled&&level.volume>0)'));
await e.startTheme(config);const website=e.active.get('SiteTheme');e.setThemeSuppressed(true);assert.equal(website.mix.gain.value,0);e.setThemeSuppressed(false);assert(website.mix.gain.value>0);assert.equal(e.active.get('SiteTheme'),website);
assert(campfireCues.some(c=>c.bus==='Narrator'));assert(campfireBeds.find(c=>c.bus==='Music').loop===false);assert(!readFileSync(new URL('../lib/campfire-test.mjs',import.meta.url),'utf8').includes('/api/game'));
console.log('PASS: immediate input handlers, safe sample replay after ended cues, restore ongoing beds without duplicates, rapid live gain changes, one context; menu theme suppression/recovery retains its source.');
await e.dispose();
