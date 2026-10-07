import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';

const moduleURL=process.env.DOD_SESSION_MODULE
 ?pathToFileURL(process.env.DOD_SESSION_MODULE)
 :new URL('../plugin/skills/desert-of-desolation-game/site-runtime/lib/campfire-test.mjs',import.meta.url);
const {SoundSession,orderSceneCues}=await import(moduleURL.href);
const {previewClips}=await import(new URL('./listening-scene.mjs',moduleURL).href);
const buses=['Narrator','Dialogue','Creature','Movement','SFX','Ambience','Music'];
const cue=(bus,media_id=bus.toLowerCase(),extra={})=>({bus,media_id,...extra});
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};

// Deterministic session-level fixtures. These are NOT a Web Audio emulation,
// production authorization test, physical-device QA or actual listening test.
class EngineFixture{
 constructor(){
  this.context={state:'suspended',currentTime:0};this.volume=.5;this.muted=false;
  this.layers=Object.fromEntries(buses.map(bus=>[bus,{enabled:true,volume:1}]));
  this.active=new Map();this.events=[];this.epoch=0;this.failIds=new Set();
  this.bufferGates=new Map();this.playGates=new Map();this.themeStarts=0;
 }
 async unlock(){this.context.state='running';this.events.push(['unlock']);}
 async buffer(id){this.events.push(['buffer',id]);await this.bufferGates.get(id)?.promise;
  if(this.failIds.has(id))throw Error('Fixture missing '+id);return {};
 }
 async play(id,bus,options={}){
  const epoch=this.epoch;this.events.push(['play-request',id,bus,options]);
  await this.playGates.get(id)?.promise;
  if(epoch!==this.epoch)return;
  if(this.failIds.has(id))throw Error('Fixture missing '+id);
  this.active.set(options.key??bus,{id,bus,endsAt:Infinity,...options});
  this.events.push(['started',id,bus,options]);
 }
 stop(){this.epoch++;this.active.clear();this.events.push(['stop']);}
 async pause(){this.epoch++;this.context.state='suspended';this.events.push(['pause']);}
 setPlaybackDeadline(time){this.deadline=time;}
 async startTheme(){this.themeStarts++;}
 // The baseline engine's method tracks source presence rather than audibility.
 hasAudibleCue(bus){return [...this.active.values()].some(v=>v.bus===bus&&v.endsAt>this.context.currentTime);}
 sceneHealth(cues){const expected=buses.filter(bus=>this.layers[bus].enabled&&this.layers[bus].volume>0);
  const active=expected.filter(bus=>this.hasAudibleCue(bus));return {
   contextState:this.context.state,expected,configured:[...new Set(cues.map(c=>c.bus))],
   active,missing:expected.filter(bus=>!active.includes(bus))
  };
 }
}
function setup(t){
 const timers=new Map();let serial=0;
 t.mock.method(globalThis,'setInterval',fn=>{const id=++serial;timers.set(id,fn);return id;});
 t.mock.method(globalThis,'clearInterval',id=>timers.delete(id));
 const engine=new EngineFixture(),updates=[];
 const session=new SoundSession(engine,{enabled:true},v=>updates.push(v));
 t.after(()=>session.stop());
 return {engine,session,updates,timers,tick:()=>{for(const fn of [...timers.values()])fn();}};
}
const started=engine=>engine.events.filter(e=>e[0]==='started').map(e=>e[1]);

test('compatibility entry point uses the exact canonical implementation',async()=>{
 const legacy=await import(new URL('../campfire-test.mjs',moduleURL).href);
 assert.equal(legacy.SoundSession,SoundSession);
});
test('authored cue order remains unchanged without an explicit first cue',()=>{
 const input=[cue('Ambience'),cue('Narrator')];assert.deepEqual(orderSceneCues(input),input);
 assert.notEqual(orderSceneCues(input)[0],input[0]);
});
test('an explicit current-scene first cue is honored without mutating the plan',()=>{
 const input=[cue('Ambience'),cue('Narrator','script')];
 assert.deepEqual(orderSceneCues(input,'script').map(c=>c.media_id),['script','ambience']);
 assert.equal(input[0].media_id,'ambience');
});
test('a first_cue marker is honored',()=>{
 assert.equal(orderSceneCues([cue('Music'),cue('Narrator','script',{first_cue:true})])[0].media_id,'script');
});
test('unknown or ambiguous first cues and malformed plans fail before playback',()=>{
 assert.equal(typeof orderSceneCues,'function');
 assert.throws(()=>orderSceneCues([cue('Narrator')],'not-present'));
 assert.throws(()=>orderSceneCues([cue('Narrator','same'),cue('Music','same')],'same'));
 assert.throws(()=>orderSceneCues([cue('Narrator','n',{first_cue:true}),cue('Music','m',{first_cue:true})]));
 assert.throws(()=>orderSceneCues(null));assert.throws(()=>orderSceneCues([{}]));
});
test('first cue buffering holds back optional layers',async t=>{
 const {engine,session}=setup(t);const gate=deferred();engine.bufferGates.set('first',gate);
 const running=session.startScene([cue('Narrator','first'),cue('Ambience','bed')]);await flush();
 assert.deepEqual(started(engine),[]);gate.resolve();await running;
 assert.deepEqual(started(engine),['first','bed']);
});
test('new scene always stops old sound and never starts the website theme',async t=>{
 const {engine,session}=setup(t);engine.active.set('old',{bus:'Music',id:'old',endsAt:Infinity});
 await session.startScene([cue('Narrator')]);assert.equal(engine.events[0][0],'stop');
 assert.equal(engine.active.has('old'),false);assert.equal(engine.themeStarts,0);
});
test('failed optional cue does not silence available narration',async t=>{
 const {engine,session,updates}=setup(t);engine.failIds.add('broken');
 await session.startScene([cue('Narrator'),cue('Ambience','broken')]);
 assert.equal(session.state,'playing');assert.ok(started(engine).includes('narrator'));
 assert.deepEqual(updates.at(-1).requiredMissing,[]);assert.ok(updates.at(-1).missing.includes('Ambience'));
});
test('required narration failure is distinct from optional ambience',async t=>{
 const {engine,session,updates}=setup(t);engine.failIds.add('broken');
 await session.startScene([cue('Narrator','broken'),cue('Ambience')]);
 assert.deepEqual(updates.at(-1).requiredMissing,['Narrator']);assert.equal(session.state,'playing');
});
test('unconfigured buses are not reported as missing scene content',async t=>{
 const {session,updates}=setup(t);await session.startScene([cue('Narrator')]);
 assert.deepEqual(updates.at(-1).missing,[]);
});
test('all intentionally disabled buses do not cause a false startup failure',async t=>{
 const {engine,session}=setup(t);for(const layer of Object.values(engine.layers))layer.enabled=false;
 await session.startScene([cue('Narrator')]);assert.equal(session.state,'playing');
});
test('empty cue plan remains playable without injecting preview audio',async t=>{
 const {engine,session}=setup(t);await session.startScene([]);assert.deepEqual(started(engine),[]);
});
test('total cue failure rejects with retained error diagnostics',async t=>{
 const {engine,session,updates}=setup(t);engine.failIds.add('broken');
 await assert.rejects(session.startScene([cue('Narrator','broken')]),/did not begin/);
 assert.equal(session.state,'error');assert.deepEqual(updates.at(-1).requiredMissing,['Narrator']);
});
test('stop while first cue buffers prevents later playback',async t=>{
 const {engine,session}=setup(t);const gate=deferred();engine.bufferGates.set('slow',gate);
 const running=session.startScene([cue('Narrator','slow'),cue('Ambience')]);await flush();
 session.stop();gate.resolve();await running;assert.deepEqual(started(engine),[]);assert.equal(session.state,'stopped');
});
test('late old-scene work cannot revive voices after a restart',async t=>{
 const {engine,session}=setup(t);const gate=deferred();engine.playGates.set('old-bed',gate);
 const old=session.startScene([cue('Narrator','old-script'),cue('Ambience','old-bed')]);await flush();
 await session.startScene([cue('Narrator','new-script')]);gate.resolve();await old;
 assert.deepEqual([...engine.active.values()].map(v=>v.id),['new-script']);
});
test('scene audition never substitutes a campfire preview',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Ambience')]);
 const before=started(engine);await session.audition('Narrator');assert.deepEqual(started(engine),before);
});
test('reenabling a scene layer restores only its scene-bound media',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','current-script')]);
 engine.active.clear();await session.layerChanged('Narrator',false);
 assert.equal(started(engine).at(-1),'current-script');assert.ok(!started(engine).includes(previewClips.Narrator.media_id));
});
test('reenabling a bus absent from this scene never adds a preview',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Ambience')]);
 const before=started(engine);await session.layerChanged('Dialogue',false);assert.deepEqual(started(engine),before);
});
test('saved scene cues are not altered by caller mutation',async t=>{
 const {engine,session}=setup(t);const cues=[cue('Narrator','original')];await session.startScene(cues);
 cues[0].media_id='not-authorized';engine.active.clear();await session.layerChanged('Narrator',false);
 assert.equal(started(engine).at(-1),'original');
});
test('a successful explicit retry clears required-cue failure',async t=>{
 const {engine,session,updates}=setup(t);engine.failIds.add('script');
 await session.startScene([cue('Narrator','script'),cue('Ambience')]);engine.failIds.delete('script');
 await session.layerChanged('Narrator',false);assert.deepEqual(updates.at(-1).requiredMissing,[]);
});
test('layer change during pause does not restart an introduction',async t=>{
 const {engine,session}=setup(t);await session.startIntroduction('intro');await session.pause();
 engine.active.clear();const count=started(engine).length;await session.layerChanged('Narrator',false);
 assert.equal(session.state,'paused');assert.equal(started(engine).length,count);
});
test('introduction completion tracking resumes after pause',async t=>{
 const {engine,session,tick}=setup(t);await session.startIntroduction('intro');await session.pause();
 tick();await session.resume();engine.active.clear();tick();assert.equal(session.state,'complete');
});
test('source still alive is not completed just because audible health is false',async t=>{
 const {engine,session,tick}=setup(t);await session.startIntroduction('intro');
 engine.hasAudibleCue=()=>false;engine.muted=true;tick();assert.equal(session.state,'playing');
});
test('interrupted audio does not falsely complete an introduction',async t=>{
 const {engine,session,tick}=setup(t);await session.startIntroduction('intro');
 engine.context.state='interrupted';engine.active.clear();tick();assert.equal(session.state,'playing');
});
test('a stale introduction watcher cannot cancel a newer timer',async t=>{
 const {session,timers}=setup(t);await session.startIntroduction('old');const stale=[...timers.values()][0];
 await session.startIntroduction('new');const current=session.timer;stale();
 assert.equal(timers.has(current),true);assert.equal(session.timer,current);
});
test('stop resets scene and introduction identities and cancels timer',async t=>{
 const {session,timers}=setup(t);await session.startIntroduction('intro');session.stop();
 assert.equal(session.introductionMediaId,null);assert.deepEqual(session.sceneCues,[]);assert.equal(timers.size,0);
});
test('resume from stopped is a no-op, not a spurious playing state',async t=>{
 const {engine,session}=setup(t);await session.resume();assert.equal(session.state,'stopped');assert.deepEqual(engine.events,[]);
});
test('campfire pause/resume preserves original deadline and has one timer',async t=>{
 const {engine,session,timers}=setup(t);await session.startCampfire();const deadline=engine.deadline;
 engine.context.currentTime=15;await session.pause();await session.resume();
 assert.equal(engine.deadline,deadline);assert.equal(timers.size,1);assert.equal(session.elapsed,15);
});
test('one failed narration preview does not suppress another narration file',async t=>{
 const {engine,session}=setup(t);engine.failIds.add(previewClips.Narrator.media_id);await session.startCampfire();
 engine.context.currentTime=26;session.tick();await flush();
 assert.ok(started(engine).includes('dod.voice.narrator.transition_001'));
});
test('campfire stops all voices at its original 60-second deadline',async t=>{
 const {engine,session,timers}=setup(t);await session.startCampfire();engine.context.currentTime=60;
 session.tick();assert.equal(session.state,'stopped');assert.equal(session.elapsed,60);
 assert.equal(engine.active.size,0);assert.equal(timers.size,0);
});
test('scene spatial gain and timing options survive the session boundary',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','n',{pan:.2,distance:4,offset:2,duration:3,gain:.8,key:'n-key'})]);
 const options=engine.events.find(e=>e[0]==='started')[3];
 assert.equal(options.pan,.2);assert.equal(options.distance,4);assert.equal(options.offset,2);
 assert.equal(options.duration,3);assert.equal(options.gain,.8);assert.ok(engine.active.has('n-key'));
});
test('audio session source has no campaign-write or network entry point',()=>{
 const source=readFileSync(moduleURL,'utf8');assert.doesNotMatch(source,/\bfetch\s*\(|\/api\/game|localStorage|indexedDB/);
});

// A short required cue can end while optional media is still loading.
test('completed first cue is not reclassified as a startup failure after a slow optional failure',async t=>{
 const {engine,session}=setup(t);const gate=deferred();engine.playGates.set('slow-bed',gate);
 engine.failIds.add('slow-bed');const running=session.startScene([cue('Narrator','short-script'),cue('Ambience','slow-bed')]);
 await flush();assert.ok(started(engine).includes('short-script'));engine.active.clear();gate.resolve();
 await running;assert.equal(session.state,'playing');assert.deepEqual(session.requiredMissing,[]);
});

// Follow-up acceptance checks for plan validation and multiple voices per bus.
test('unknown buses are rejected before any current session is stopped',async t=>{
 const {engine,session}=setup(t);await session.startScene([cue('Narrator','current')]);
 const events=engine.events.length;
 await assert.rejects(session.startScene([cue('Unsupported','bad')]),/supported bus/);
 assert.equal(engine.events.length,events);assert.equal(session.state,'playing');
});
test('duplicate default voice keys cannot silently replace required narration',()=>{
 assert.throws(()=>orderSceneCues([cue('Narrator','one'),cue('Narrator','two')]),/distinct/);
});
test('explicit keys allow separate voices on the same bus',()=>{
 const input=[cue('Ambience','wind',{key:'wind'}),cue('Ambience','fire',{key:'fire'})];
 assert.deepEqual(orderSceneCues(input),input);
});
test('empty or non-string voice keys fail validation',()=>{
 for(const key of ['',4,{}])assert.throws(()=>orderSceneCues([cue('Narrator','one',{key})]),/voice keys/);
});
test('a finished first cue is not reported as missing after optional load latency',async t=>{
 const {engine,session,updates}=setup(t);const gate=deferred();engine.playGates.set('bed',gate);
 const running=session.startScene([cue('Narrator','short'),cue('Ambience','bed')]);await flush();
 engine.active.delete('Narrator');gate.resolve();await running;
 assert.ok(!updates.at(-1).missing.includes('Narrator'));
});
test('an unrelated same-bus voice does not prove the requested cue started',async t=>{
 const {engine,session}=setup(t);engine.play=async(id,bus,options)=>{
  engine.active.set(options.key,{id:'wrong',bus,endsAt:Infinity});
 };
 await assert.rejects(session.startScene([cue('Narrator','requested')]),/did not begin/);
 assert.deepEqual(session.requiredMissing,['Narrator']);
});
test('reenabling a bus retries its failed keyed cue without restarting its active cue',async t=>{
 const {engine,session}=setup(t);engine.failIds.add('fire');
 await session.startScene([cue('Ambience','wind',{key:'wind'}),cue('Ambience','fire',{key:'fire'})]);
 engine.failIds.delete('fire');const before=started(engine).filter(x=>x==='wind').length;
 await session.layerChanged('Ambience',false);
 assert.ok(engine.active.has('wind'));assert.ok(engine.active.has('fire'));
 assert.equal(started(engine).filter(x=>x==='wind').length,before);assert.equal(session.failures.size,0);
});
test('a no-start retry does not falsely clear the required-cue failure',async t=>{
 const {engine,session}=setup(t);engine.failIds.add('script');
 await session.startScene([cue('Narrator','script'),cue('Ambience','bed')]);
 engine.play=async()=>{};await session.layerChanged('Narrator',false);
 assert.deepEqual(session.requiredMissing,['Narrator']);
});
test('the campfire deadline is set before optional bed startup finishes',async t=>{
 const {engine,session}=setup(t);const gate=deferred();
 engine.playGates.set(previewClips.Music.media_id,gate);
 const running=session.startCampfire();
 for(let i=0;i<12;i++)await flush();
 assert.equal(engine.deadline,60);engine.context.currentTime=20;gate.resolve();await running;
 assert.equal(engine.deadline,60);assert.equal(session.elapsed,20);
});
test('optional bed latency beyond the deadline cannot extend the campfire test',async t=>{
 const {engine,session,timers}=setup(t);const gate=deferred();
 engine.playGates.set(previewClips.Music.media_id,gate);const running=session.startCampfire();
 for(let i=0;i<12;i++)await flush();
 engine.context.currentTime=61;gate.resolve();await running;
 assert.equal(session.state,'stopped');assert.equal(session.elapsed,60);assert.equal(timers.size,0);
});
