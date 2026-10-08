import {campfireCues,campfireBeds,previewClips,previewMediaIds} from './listening-scene.mjs';
export {campfireCues} from './listening-scene.mjs';

// Public preview IDs are valid only in the isolated campfire test, never as
// replacements for a scene's missing narration. This module makes no save writes.
const sceneOptions = cue => ({
 ...cue, loop:!!cue.loop, key:cue.key??cue.bus, gain:cue.gain??1
});

// An explicit first cue is optional for existing callers. Preserve authored order
// otherwise; do not infer a new story order or add cues not in the supplied plan.
const sceneBuses=new Set(['Narrator','Dialogue','Creature','Movement','SFX','Ambience','Music']);
export function orderSceneCues(input,firstCueId){
 if(!Array.isArray(input))throw new TypeError('Scene cues must be an array.');
 const keys=new Set();
 const cues=input.map(cue=>{
  if(!cue||typeof cue.media_id!=='string'||!cue.media_id||!sceneBuses.has(cue.bus))
   throw new TypeError('A scene cue needs a media ID and a supported bus.');
  const key=cue.key??cue.bus;
  if(typeof key!=='string'||!key||keys.has(key))
   throw new TypeError('Scene cues must have distinct nonempty voice keys.');
  keys.add(key);return {...cue};
 });
 const marked=cues.filter(cue=>cue.first_cue===true);
 if(firstCueId==null&&marked.length>1)throw new Error('Only one first cue is allowed.');
 const id=firstCueId??marked[0]?.media_id;
 if(id==null)return cues;
 const matches=cues.filter(cue=>cue.media_id===id);
 if(matches.length!==1)throw new Error('The first cue must identify one current-scene cue.');
 return [matches[0],...cues.filter(cue=>cue!==matches[0])];
}

export class SoundSession{
 constructor(engine,theme,onState=()=>{}){
  this.engine=engine;this.theme=theme;this.onState=onState;
  this.mode='off';this.state='stopped';this.request=0;this.timer=null;this.elapsed=0;
  this.failures=new Set();this.failedMedia=new Set();this.requiredMissing=[];
  this.sceneCues=[];this.introductionMediaId=null;
 }
 notify(){this.onState({mode:this.mode,state:this.state,elapsed:this.elapsed,
  missing:[...this.failures],requiredMissing:[...this.requiredMissing]});}
 clearTimer(){clearInterval(this.timer);this.timer=null;}
 stop(){
  this.request++;this.clearTimer();this.engine.stop();
  this.mode='off';this.state='stopped';this.elapsed=0;
  this.sceneCues=[];this.introductionMediaId=null;
  this.failures.clear();this.failedMedia.clear();this.requiredMissing=[];this.notify();
 }
 // Source lifetime, not audibility. Mute, ducking and output-device routing must
 // not be mistaken for end-of-file or cause an already running voice to restart.
 hasActiveBus(bus){
  if(this.engine.active instanceof Map){
   const now=this.engine.context?.currentTime??0;
   return [...this.engine.active.values()].some(v=>v.bus===bus&&(v.endsAt??Infinity)>now);
  }
  return this.engine.hasAudibleCue(bus);
 }
 hasActiveCue(cue){
  if(!(this.engine.active instanceof Map))return this.hasActiveBus(cue.bus);
  const voice=this.engine.active.get(cue.key??cue.bus);
  return !!voice&&voice.id===cue.media_id&&voice.bus===cue.bus&&
   (voice.endsAt??Infinity)>(this.engine.context?.currentTime??0);
 }
 recordFailure(cue,request){
  if(request!==this.request)return;
  this.failures.add(cue.bus);this.failedMedia.add(cue.media_id);
  this.refreshRequiredMissing();
 }
 refreshRequiredMissing(){
  this.requiredMissing=[...new Set(this.sceneCues.filter(cue=>
   (cue.required===true||(cue.bus==='Narrator'&&cue.required!==false))&&
   this.failedMedia.has(cue.media_id)).map(cue=>cue.bus))];
 }
 fail(error,request){
  if(request!==this.request)return;
  this.request++;this.clearTimer();this.engine.stop();this.state='error';this.notify();
  throw error;
 }
 async startScene(input,{firstCueId}={}){
  const cues=orderSceneCues(input,firstCueId);
  this.stop();const request=++this.request;
  this.sceneCues=cues;this.mode='scene';this.state='loading';this.notify();
  const startedBuses=new Set();
  try{
   await this.engine.unlock();if(request!==this.request)return;
   const [first,...rest]=cues;
   if(first){try{
    await this.engine.buffer(first.media_id);if(request!==this.request)return;
    await this.engine.play(first.media_id,first.bus,sceneOptions(first));
    if(request===this.request){
     if(this.hasActiveCue(first))startedBuses.add(first.bus);
     else this.recordFailure(first,request);
    }
   }catch{this.recordFailure(first,request);}}
   if(request!==this.request)return;
   await Promise.all(rest.map(async cue=>{try{
    await this.engine.play(cue.media_id,cue.bus,sceneOptions(cue));
    if(request===this.request){
     if(this.hasActiveCue(cue))startedBuses.add(cue.bus);
     else this.recordFailure(cue,request);
    }
   }catch{this.recordFailure(cue,request);}}));
   if(request!==this.request)return;
   const health=this.engine.sceneHealth(cues);
   // Missing assets come from cue failures, not source lifetime: a completed
   // finite cue is not missing, and an unused bus is not missing content.
   const allMuted=this.engine.muted||this.engine.volume===0||cues.every(cue=>{
    const layer=this.engine.layers[cue.bus];return !!layer&&(!layer.enabled||layer.volume===0);
   });
   // A finite first cue may already have finished while an optional file
   // loads. A recorded source start is not a failed start (nor proof of hearing).
   if(health.contextState!=='running'||(cues.length>0&&!allMuted&&startedBuses.size===0&&
      !cues.some(cue=>this.hasActiveCue(cue))))
    throw Error('Scene audio did not begin. Tap Play to retry.');
   this.state='playing';this.notify();
  }catch(error){this.fail(error,request);}
 }
 async toggleScene(cues){
  if(this.mode==='scene'&&this.state==='playing')return this.pause();
  if(this.mode==='scene'&&this.state==='paused')return this.resume();
  return this.startScene(cues);
 }
 async startIntroduction(mediaId){
  this.stop();this.introductionMediaId=mediaId;
  const request=++this.request;this.mode='introduction';this.state='loading';this.notify();
  try{
   await this.engine.unlock();if(request!==this.request)return;
   await this.engine.play(mediaId,'Narrator',{key:'Introduction:Narrator',gain:1});
   if(request!==this.request)return;
   this.state='playing';this.notify();this.watchIntroduction(request);
  }catch(error){this.fail(error,request);}
 }
 watchIntroduction(request){
  this.clearTimer();
  const timer=setInterval(()=>{
   if(request!==this.request||this.mode!=='introduction'||this.state!=='playing'){
    clearInterval(timer);if(this.timer===timer)this.timer=null;return;
   }
   if(this.engine.context?.state!=='running')return;
   if(!this.hasActiveBus('Narrator')){
    clearInterval(timer);if(this.timer===timer)this.timer=null;
    this.state='complete';this.notify();
   }
  },200);
  this.timer=timer;
 }
 async pause(){
  if(this.state!=='playing')return;
  const request=++this.request;this.clearTimer();
  try{await this.engine.pause();if(request!==this.request)return;
   this.state='paused';this.notify();
  }catch(error){this.fail(error,request);}
 }
 async resume(){
  if(this.state!=='paused')return;
  const request=++this.request;
  try{await this.engine.unlock();if(request!==this.request)return;
   this.state='playing';this.notify();
   if(this.mode==='introduction')this.watchIntroduction(request);
   if(this.mode==='campfire')this.watchCampfire(request);
  }catch(error){this.fail(error,request);}
 }
 async audition(bus){
  if(this.state!=='playing'||this.mode!=='campfire'||!previewClips[bus])return;
  if(this.hasActiveBus(bus))return;
  const cue={...previewClips[bus],bus},request=this.request;
  try{await this.engine.play(cue.media_id,bus,{...cue,key:'Campfire:'+bus});}
  catch{this.recordFailure(cue,request);if(request===this.request)this.notify();}
 }
 async layerChanged(bus,wasEnabled){
  const layer=this.engine.layers[bus];
  if(this.state!=='playing'||!layer||!layer.enabled||layer.volume<=0||wasEnabled)return;
  if(this.mode!=='scene'&&this.hasActiveBus(bus))return;
  const request=this.request;
  if(this.mode==='introduction'&&bus==='Narrator'&&this.introductionMediaId){
   try{await this.engine.play(this.introductionMediaId,'Narrator',{key:'Introduction:Narrator',gain:1});
    if(request!==this.request)return;
    this.watchIntroduction(request);this.notify();
   }catch{this.recordFailure({bus,media_id:this.introductionMediaId},request);
    if(request===this.request)this.notify();}
   return;
  }
  if(this.mode==='scene'){
   for(const cue of this.sceneCues.filter(cue=>cue.bus===bus)){
    if(request!==this.request)return;
    if(this.hasActiveCue(cue))continue;
    try{await this.engine.play(cue.media_id,bus,sceneOptions(cue));
     if(request!==this.request)return;
     if(this.hasActiveCue(cue))this.failedMedia.delete(cue.media_id);
     else this.recordFailure(cue,request);
    }catch{this.recordFailure(cue,request);}
   }
   if(request!==this.request)return;
   if(!this.sceneCues.some(cue=>cue.bus===bus&&this.failedMedia.has(cue.media_id)))this.failures.delete(bus);
   this.refreshRequiredMissing();this.notify();return;
  }
  await this.audition(bus);
 }
 async startCampfire(){
  this.stop();const request=++this.request;
  this.mode='campfire';this.state='loading';this.notify();
  try{
   await this.engine.unlock();if(request!==this.request)return;
   const previews=Object.entries(previewClips).map(([bus,cue])=>({...cue,bus}));
   for(const id of previewMediaIds){
    try{await this.engine.buffer(id);}
    catch{for(const cue of [...previews,...campfireBeds,...campfireCues])
     if(cue.media_id===id)this.recordFailure(cue,request);}
    if(request!==this.request)return;
   }
   // Bound the whole audition from its first possible voice, not from the
   // slowest bed download. Late optional loads cannot extend the 60s limit.
   this.startedAt=this.engine.context.currentTime;this.engine.setPlaybackDeadline(this.startedAt+60);
   await Promise.all(campfireBeds.map(async cue=>{try{
    await this.engine.play(cue.media_id,cue.bus,cue);
   }catch{this.recordFailure(cue,request);}}));
   if(request!==this.request)return;
   this.next=0;this.elapsed=0;this.state='playing';this.notify();this.watchCampfire(request);
  }catch(error){this.fail(error,request);}
 }
 watchCampfire(request){
  this.clearTimer();this.tick();
  if(request!==this.request||this.mode!=='campfire'||this.state!=='playing')return;
  const timer=setInterval(()=>{
   if(request!==this.request){clearInterval(timer);if(this.timer===timer)this.timer=null;return;}
   this.tick();
  },100);
  this.timer=timer;
 }
 tick(){
  if(this.mode!=='campfire'||this.state!=='playing'||this.engine.context?.state!=='running')return;
  const elapsed=this.engine.context.currentTime-this.startedAt,previous=this.elapsed;
  this.elapsed=Math.min(60,Math.floor(elapsed));
  if(elapsed>=60){this.stop();this.elapsed=60;this.notify();return;}
  while(this.next<campfireCues.length&&campfireCues[this.next].at<=elapsed){
   const cue=campfireCues[this.next++],request=this.request;
   // A failed file must not silence other, available files on the same bus.
   if(this.failedMedia.has(cue.media_id)||!this.engine.layers[cue.bus].enabled)continue;
   void this.engine.play(cue.media_id,cue.bus,{...cue,key:'Campfire:'+cue.bus})
    .catch(()=>{this.recordFailure(cue,request);if(request===this.request)this.notify();});
  }
  if(this.elapsed!==previous)this.notify();
 }
}
