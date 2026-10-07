import {campfireCues,campfireBeds,previewClips,previewMediaIds} from './listening-scene.mjs';
export {campfireCues} from './listening-scene.mjs';
// Approved, spoiler-free previews only. No campaign API or save writes.
export class SoundSession{
 constructor(engine,theme,onState=()=>{}){this.engine=engine;this.theme=theme;this.onState=onState;this.mode='off';this.state='stopped';this.request=0;this.timer=null;this.elapsed=0;this.failures=new Set();}
 notify(){this.onState({mode:this.mode,state:this.state,elapsed:this.elapsed,missing:[...this.failures]});}
 stop(){this.request++;clearInterval(this.timer);this.timer=null;this.engine.stop();this.mode='off';this.state='stopped';this.elapsed=0;this.failures.clear();this.notify();}
 async startScene(cues){this.stop();const request=++this.request;this.mode='scene';this.state='loading';this.failures.clear();this.notify();try{await this.engine.unlock();if(request!==this.request)return;await Promise.all(cues.map(async cue=>{try{await this.engine.play(cue.media_id,cue.bus,{loop:!!cue.loop,key:cue.bus,gain:cue.gain??1});}catch{if(request===this.request)this.failures.add(cue.bus);}}));if(request!==this.request)return;const health=this.engine.sceneHealth(cues);for(const bus of health.missing)this.failures.add(bus);if(health.contextState!=='running'||health.active.length===0)throw Error('Scene audio did not begin. Tap Play to retry.');this.state='playing';this.notify();}catch(error){if(request!==this.request)return;this.stop();throw error;}}
 async toggleScene(cues){if(this.mode==='scene'&&this.state==='playing')return this.pause();if(this.mode==='scene'&&this.state==='paused')return this.resume();return this.startScene(cues);}
 async startIntroduction(mediaId){this.stop();this.introductionMediaId=mediaId;const request=++this.request;this.mode='introduction';this.state='loading';this.notify();try{await this.engine.unlock();if(request!==this.request)return;await this.engine.play(mediaId,'Narrator',{key:'Introduction:Narrator',gain:1});if(request!==this.request)return;this.state='playing';this.notify();this.watchIntroduction(request);}catch(error){if(request!==this.request)return;this.stop();throw error;}}
 watchIntroduction(request){clearInterval(this.timer);this.timer=setInterval(()=>{if(request!==this.request||this.mode!=='introduction')return clearInterval(this.timer);if(!this.engine.hasAudibleCue('Narrator')){clearInterval(this.timer);this.timer=null;this.state='complete';this.notify();}},200);}
 async pause(){const request=++this.request;await this.engine.pause();if(request!==this.request)return;this.state='paused';this.notify();}
 async resume(){const request=++this.request;await this.engine.unlock();if(request!==this.request)return;this.state='playing';this.notify();}
 async audition(bus){
 if(this.state!=='playing'||!['campfire','scene'].includes(this.mode)||!previewClips[bus])return;
 if(this.engine.hasAudibleCue(bus))return;
 const cue=previewClips[bus],key=this.mode==='campfire'?'Campfire:'+bus:'Preview:'+bus;
 const request=this.request;
 try{await this.engine.play(cue.media_id,bus,{...cue,key});}catch{if(request===this.request){this.failures.add(bus);this.notify();}}
 }
 async layerChanged(bus,wasEnabled){const layer=this.engine.layers[bus];if(!layer.enabled||layer.volume<=0||wasEnabled)return;if(this.mode==='introduction'&&bus==='Narrator'&&!this.engine.hasAudibleCue('Narrator')&&this.introductionMediaId){await this.engine.play(this.introductionMediaId,'Narrator',{key:'Introduction:Narrator',gain:1});this.state='playing';this.notify();this.watchIntroduction(this.request);return}await this.audition(bus);}
 async startCampfire(){
 this.stop();const request=++this.request;this.mode='campfire';this.state='loading';this.failures.clear();this.notify();
 try{await this.engine.unlock();if(request!==this.request)return;
 // Preload once, then schedule on the production buses. Individual cues remain bounded.
 for(const id of previewMediaIds){try{await this.engine.buffer(id);}catch{for(const cue of [...Object.values(previewClips),...campfireBeds,...campfireCues])if(cue.media_id===id)this.failures.add(cue.bus??Object.keys(previewClips).find(bus=>previewClips[bus]===cue));}if(request!==this.request)return;}
 await Promise.all(campfireBeds.map(async cue=>{try{await this.engine.play(cue.media_id,cue.bus,cue);}catch{if(request===this.request)this.failures.add(cue.bus);}}));if(request!==this.request)return;
 this.startedAt=this.engine.context.currentTime;this.engine.setPlaybackDeadline(this.startedAt+60);this.next=0;this.elapsed=0;
 this.state='playing';this.notify();this.tick();this.timer=setInterval(()=>this.tick(),100);
 }catch(error){if(request!==this.request)return;this.stop();throw error;}}
 tick(){
 if(this.mode!=='campfire'||this.state!=='playing'||this.engine.context?.state!=='running')return;
 const elapsed=this.engine.context.currentTime-this.startedAt,previous=this.elapsed;this.elapsed=Math.min(60,Math.floor(elapsed));
 if(elapsed>=60){this.stop();this.elapsed=60;this.notify();return;}
 while(this.next<campfireCues.length&&campfireCues[this.next].at<=elapsed){const cue=campfireCues[this.next++],request=this.request;
 if(this.failures.has(cue.bus)||!this.engine.layers[cue.bus].enabled)continue;
 void this.engine.play(cue.media_id,cue.bus,{...cue,key:'Campfire:'+cue.bus}).catch(()=>{if(request===this.request){this.failures.add(cue.bus);this.notify();}});}
 if(this.elapsed!==previous)this.notify();
 }
}
