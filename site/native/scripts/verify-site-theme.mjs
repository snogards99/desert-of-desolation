import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AudioEngine} from '../lib/audio-engine.mjs';
import {authorizedMedia,fallbackPath} from '../lib/media-policy.mjs';
const profile=JSON.parse(readFileSync(new URL('../lib/site-presentation.json',import.meta.url)));
const config={...profile.background_theme,media_id:'dod.audio.opening_replacement.opening_title_theme_v2',fallback_media_id:'scorefile.campaign_opening_overture.v397'};
let contexts=0,mode='ok',requests=[],delayed,release;
const timers=new Map();let timerId=0;
globalThis.setTimeout=(fn)=>{timers.set(++timerId,fn);return timerId;};
globalThis.clearTimeout=id=>timers.delete(id);
class Param{value=0;targets=[];setTargetAtTime(v){this.value=v;this.targets.push(v);}linearRampToValueAtTime(v,time){this.value=v;this.rampTime=time;}setValueAtTime(v){this.value=v;}cancelScheduledValues(){}}
class Node{gain=new Param();threshold=new Param();knee=new Param();ratio=new Param();attack=new Param();release=new Param();connect(n){this.connected=n;}disconnect(){this.disconnected=true;}start(){this.started=true;}stop(time){this.stopTime=time;this.stopped=true;if(!time)this.onended?.();}}
class Context{constructor(){contexts++;}state='suspended';currentTime=0;destination={};createGain(){return new Node();}createDynamicsCompressor(){return new Node();}createBufferSource(){return new Node();}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}async decodeAudioData(){return {length:100,numberOfChannels:2,duration:30};}}
globalThis.AudioContext=Context;
globalThis.fetch=async(url)=>{requests.push(url);if(delayed)await new Promise(r=>release=r);if(mode==='offline')throw Error('offline');if(mode==='denied')return {ok:false,status:403};if(mode==='primary-failed'&&!url.includes(config.fallback_media_id)&&!url.includes('fallback.mp3'))throw Error('missing primary');return {ok:true,status:200,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>new ArrayBuffer(16)};};
const closeTo=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const e=new AudioEngine();await e.startTheme(config);assert.equal(contexts,0);assert.equal(requests.length,0);
await e.unlock();await e.play('camp','Ambience',{loop:true});await e.startTheme(config);const theme=e.active.get('SiteTheme');assert(theme.theme);assert.equal(theme.source.loop,false);assert.equal(theme.mix.connected,e.nodes.get('Music'));assert.equal(theme.gain.gain.rampTime,2.5);closeTo(theme.mix.gain.value*e.nodes.get('Music').gain.value,.08);
await e.startTheme(config);assert.equal(e.active.get('SiteTheme'),theme);assert.equal(contexts,1);
e.reconcile([]);assert.equal(e.active.get('SiteTheme'),theme);assert.equal(e.active.size,1);
for(const bus of ['Narrator','Dialogue']){await e.play(bus,bus);closeTo(theme.mix.gain.value*e.nodes.get('Music').gain.value,.025);e.cancel(bus);closeTo(theme.mix.gain.value*e.nodes.get('Music').gain.value,.08);}
e.setVolume(.3);closeTo(e.master.gain.value,.3);e.mute(true);assert.equal(e.master.gain.value,0);e.mute(false);closeTo(e.master.gain.value,.3);
await e.pause();assert.equal(timers.size,0);assert.equal(e.active.get('SiteTheme'),theme);await e.unlock();assert.equal(e.active.get('SiteTheme'),theme);assert.equal(timers.size,1);
// Simulate reaching the final 1.5s: next non-looping voice fades across the tail.
e.context.currentTime=28.5;const next=timers.get(theme.timer);next();await new Promise(queueMicrotask);await new Promise(queueMicrotask);
const replacement=e.active.get('SiteTheme');assert.notEqual(replacement,theme);assert.equal(replacement.gain.gain.rampTime,30);assert.equal(theme.gain.gain.value,0);assert.equal(theme.source.stopTime,30);assert.equal(e.retiring.size,1);
let cycle=replacement;for(let count=0;count<2;count++){e.context.currentTime=cycle.startedAt+28.5;const advance=timers.get(cycle.timer);assert(advance);advance();await new Promise(queueMicrotask);await new Promise(queueMicrotask);const nextCycle=e.active.get('SiteTheme');assert.notEqual(nextCycle,cycle);cycle=nextCycle;}assert.equal(contexts,1);
await e.play('speech','Narrator');e.stop();assert.equal(timers.size,0);assert.equal(e.active.size,0);assert.equal(e.retiring.size,0);await e.dispose();
mode='primary-failed';const fallback=new AudioEngine();await fallback.unlock();await fallback.startTheme(config);assert.equal(fallback.active.get('SiteTheme').id,config.fallback_media_id);await fallback.dispose();
mode='offline';const unavailable=new AudioEngine();await unavailable.unlock();await unavailable.startTheme(config);assert.equal(unavailable.active.size,0);assert.equal(timers.size,0);await unavailable.dispose();
mode='denied';requests=[];const denied=new AudioEngine();await denied.unlock();await denied.startTheme(config);assert.equal(requests.length,1);assert.equal(denied.active.size,0);await denied.dispose();
mode='ok';delayed=true;const cancelled=new AudioEngine();await cancelled.unlock();const pending=cancelled.startTheme(config);cancelled.stop();delayed=false;release();await pending;assert.equal(cancelled.active.size,0);assert.equal(timers.size,0);await cancelled.dispose();
for(const id of [config.media_id,config.fallback_media_id]){assert(authorizedMedia(id,null,0));assert(fallbackPath(id));const asset=JSON.parse(readFileSync(new URL('../server-data/audio.json',import.meta.url))).find(a=>a.media_id===id);const bytes=readFileSync(new URL('../public'+fallbackPath(id),import.meta.url));assert.equal(bytes.length,asset.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);}
assert.equal(authorizedMedia('undiscovered-sound',null,0),false);
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');assert(readFileSync(new URL('../lib/campfire-test.mjs',import.meta.url),'utf8').includes('await this.engine.unlock()'));assert(readFileSync(new URL('../lib/campfire-test.mjs',import.meta.url),'utf8').includes("await this.engine.startTheme(this.theme,{role:'scene'})"));const settings=readFileSync(new URL('../lib/sound-settings.mjs',import.meta.url),'utf8');assert(settings.includes('dod.output-muted'));assert(settings.includes('dod.output-volume'));
console.log('PASS: gesture gate, existing seven-bus context, three-plus continuous theme cycles on one context, exact 0.08/0.025 theme gain, narrator and NPC duck/recovery, navigation continuity, pause/resume, volume/mute/stop, 1.5s crossfade, no unsafe loop, primary fallback, offline silence, auth denial, stop-during-fetch, unchanged media bytes and discovery gates. Simulated Web Audio; browser layout and audible QA unavailable.');
