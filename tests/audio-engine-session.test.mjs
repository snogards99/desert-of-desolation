import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioEngine,buses} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/audio-engine.mjs';
import {SoundSession} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/campfire-test.mjs';
// Production engine + production session, with simulated Web Audio and fetch.
// No real decoding, audio output, device permissions or production writes.
class Param{
 constructor(v=0){this.value=v;}
 setValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}
 setTargetAtTime(v){this.value=v;}cancelScheduledValues(){}cancelAndHoldAtTime(){}
}
class Node{
 constructor(ctx){this.ctx=ctx;this.gain=new Param();this.pan=new Param();}
 connect(){return this;}disconnect(){}
 start(){this.started=true;}
 stop(at){this.stops??=[];this.stops.push(at);if(at===undefined||at<=this.ctx.currentTime)this.onended?.();}
}
class Context{
 constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.sources=[];}
 createGain(){return new Node(this);}createStereoPanner(){return new Node(this);}
 createDynamicsCompressor(){return Object.assign(new Node(this),Object.fromEntries(['threshold','knee','ratio','attack','release'].map(x=>[x,new Param()])));}
 createBufferSource(){const source=new Node(this);this.sources.push(source);return source;}
 async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
 async decodeAudioData(){return {length:2,numberOfChannels:1,duration:10,getChannelData:()=>new Float32Array([.1,-.2])};}
}
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
function setup(t,{fetcher}={}){
 const old=Object.getOwnPropertyDescriptor(globalThis,'AudioContext');Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:Context});
 t.after(()=>{if(old)Object.defineProperty(globalThis,'AudioContext',old);else delete globalThis.AudioContext;});
 const calls=[];t.mock.method(globalThis,'fetch',async(url,options)=>{
  calls.push(String(url));if(fetcher)return fetcher(url,options);
  return {ok:!String(url).includes('missing'),status:String(url).includes('missing')?404:200,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>new ArrayBuffer(4)};
 });
 const engine=new AudioEngine(id=>'/fixture/'+id),session=new SoundSession(engine,{});
 t.after(async()=>{session.stop();await engine.dispose();});return {engine,session,calls};
}
const cue=(bus,id,extra={})=>({bus,media_id:id,...extra});
test('production session uses one production context and seven existing buses',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','one')]);const context=engine.context;
 await session.startScene([cue('Narrator','two')]);assert.equal(engine.context,context);assert.equal(engine.nodes.size,7);assert.equal(buses.length,7);
});
test('production scene first-cue fetch precedes optional layers and adds no title theme',async t=>{
 const {engine,session,calls}=setup(t);await session.startScene([cue('Narrator','first'),cue('Ambience','bed',{loop:true})]);
 assert.equal(calls[0],'/fixture/first');assert.deepEqual([...engine.active.keys()],['Narrator','Ambience']);
});
test('production restart stops the old source before keeping the new scene',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','old')]);const source=engine.active.get('Narrator').source;
 await session.startScene([cue('Narrator','new')]);assert.ok(source.stops.length);assert.deepEqual([...engine.active.values()].map(v=>v.id),['new']);
});
test('production optional fetch failure retains narration and reports only failed content',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','script'),cue('Ambience','missing-bed')]);
 assert.ok(engine.active.has('Narrator'));assert.deepEqual([...session.failures],['Ambience']);assert.deepEqual(session.requiredMissing,[]);
});
test('production required narration failure remains distinguishable',async t=>{
 const {session}=setup(t);await session.startScene([cue('Narrator','missing-script'),cue('Ambience','bed')]);
 assert.deepEqual(session.requiredMissing,['Narrator']);assert.equal(session.state,'playing');
});
test('production mute, pause and resume preserve source identity and user mix',async t=>{
 const {engine,session}=setup(t);engine.setLayer('Ambience',{volume:.21});engine.setVolume(.31);engine.mute(true);
 const saved=engine.getMix();await session.startScene([cue('Narrator','script')]);const voice=engine.active.get('Narrator');
 await session.pause();assert.equal(engine.context.state,'suspended');await session.resume();
 assert.equal(engine.active.get('Narrator'),voice);assert.deepEqual(engine.getMix(),saved);
});
test('production stop aborts pending first-cue fetch and does not revive old voices',async t=>{
 let requested=false,aborted=false;
 const {engine,session}=setup(t,{fetcher:(_url,{signal})=>new Promise((_resolve,reject)=>{
  requested=true;signal.addEventListener('abort',()=>{aborted=true;reject(Error('fixture abort'));},{once:true});
 })});
 const pending=session.startScene([cue('Narrator','slow')]);await flush();assert.equal(requested,true);
 session.stop();await pending;assert.equal(aborted,true);assert.equal(engine.active.size,0);assert.equal(session.state,'stopped');
});
test('production scene preserves spatial attenuation and explicit voice key',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Movement','steps',{key:'near-steps',gain:.8,distance:3,pan:.2})]);
 assert.equal(engine.active.get('near-steps').cueGain,.2);assert.equal(engine.active.size,1);
});
