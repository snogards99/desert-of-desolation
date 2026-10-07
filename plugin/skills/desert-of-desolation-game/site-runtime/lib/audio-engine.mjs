import {fallbackPath} from './media-policy.mjs';
export const buses=['Narrator','Dialogue','Creature','Movement','SFX','Ambience','Music'];
export const levels={Narrator:1,Dialogue:.9,Creature:.35,Movement:.25,SFX:.8,Ambience:.42,Music:.18};
export class AudioEngine{
 constructor(urlForId=id=>'/api/media?id='+encodeURIComponent(id)){this.urlForId=urlForId;this.context=null;this.master=null;this.nodes=new Map();this.active=new Map();this.retiring=new Set();this.cache=new Map();this.pending=new Map();this.epoch=0;this.tokens=new Map();this.volume=.5;this.muted=false;this.themeConfig=null;this.themeToken=0;this.themePending=null;this.layers=Object.fromEntries(buses.map(bus=>[bus,{volume:levels[bus],enabled:true}]));this.busFactors={};this.playbackDeadline=null;this.themeSuppressed=false;}
 async unlock(){if(this.context?.state==='closed'){this.context=null;this.nodes.clear();this.active.clear();this.cache.clear();}if(!this.context){const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)throw Error('Audio unavailable');this.context=new C();this.master=this.context.createGain();const limiter=this.context.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=12;limiter.ratio.value=8;limiter.attack.value=.003;limiter.release.value=.25;this.headroom=this.context.createGain();this.master.connect(this.headroom);this.headroom.connect(limiter);limiter.connect(this.context.destination);for(const name of buses){const g=this.context.createGain();g.gain.value=levels[name];g.connect(this.master);this.nodes.set(name,g);}this.setVolume(this.volume);this.duck();}await this.context.resume();this.scheduleTheme();if(this.context.state==='suspended'||this.context.state==='interrupted')throw Error('Tap Play again to resume sound.');}
 setVolume(v){this.volume=Number.isFinite(v)?Math.max(0,Math.min(1,v)):this.volume;if(this.master)smooth(this.master.gain,this.muted?0:this.volume,this.context.currentTime);}
 setLayer(bus,patch){if(!buses.includes(bus))throw Error("Invalid bus");const layer=this.layers[bus];if(Number.isFinite(patch.volume))layer.volume=Math.max(0,Math.min(1,patch.volume));if(typeof patch.enabled==='boolean')layer.enabled=patch.enabled;this.duck();}
 setPlaybackDeadline(deadline){this.playbackDeadline=deadline;if(deadline!==null){for(const v of [...this.active.values(),...this.retiring]){v.endsAt=Math.min(v.endsAt??Infinity,deadline);try{v.source.stop(deadline);}catch{}}}}
 getMix(){return {version:1,master:this.volume,enabled:!this.muted,layers:structuredClone(this.layers)};}
 applyMix(mix){if(Number.isFinite(mix.master))this.volume=Math.max(0,Math.min(1,mix.master));this.muted=!mix.enabled;for(const bus of buses){const patch=mix.layers?.[bus];if(!patch)continue;if(Number.isFinite(patch.volume))this.layers[bus].volume=Math.max(0,Math.min(1,patch.volume));if(typeof patch.enabled==='boolean')this.layers[bus].enabled=patch.enabled;}this.setVolume(this.volume);this.duck();}
 protectHeadroom(){if(!this.context||!this.headroom)return;let bound=0;for(const v of [...this.active.values(),...this.retiring])bound+=(v.peak??1)*Math.max(v.cueGain??1,v.mix?.gain.value??0)*Math.max(this.nodes.get(v.bus).gain.value,(this.layers[v.bus].enabled?this.layers[v.bus].volume:0)*(this.busFactors[v.bus]??1));this.headroom.gain.setValueAtTime(Math.min(1,.9/Math.max(.9,bound)),this.context.currentTime);}
 mute(value){this.muted=value;this.setVolume(this.volume);}
 async buffer(id){const cacheKey=this.urlForId(id);if(this.cache.has(cacheKey))return this.cache.get(cacheKey);if(this.pending.has(cacheKey))return this.pending.get(cacheKey).promise;const controller=new AbortController();const promise=(async()=>{let bytes;
const read=async path=>{const response=await fetch(path,{signal:controller.signal,credentials:'same-origin',cache:'no-store'});if(response.status===401||response.status===403){const error=Error('Reopen this private Site to refresh your sign-in.');error.auth=true;throw error;}if(!response.ok)throw Error('The sound clip is temporarily unavailable.');const type=response.headers?.get('content-type')||'';if(type.includes('text/html')||type.includes('application/json')){const error=Error('Reopen this private Site to refresh your sign-in.');error.auth=true;throw error;}return response.arrayBuffer();};
try{bytes=await read(cacheKey);}catch(error){if(error.auth||controller.signal.aborted||!fallbackPath(id))throw error;bytes=await read(fallbackPath(id));}
let result;try{result=await this.context.decodeAudioData(bytes.slice(0));}catch(error){if(controller.signal.aborted||!fallbackPath(id))throw error;const fallbackBytes=await read(fallbackPath(id));result=await this.context.decodeAudioData(fallbackBytes.slice(0));}if(controller.signal.aborted)throw Error('Cancelled');this.cache.set(cacheKey,result);let size=0;for(const b of this.cache.values())size+=b.length*b.numberOfChannels*4;while((this.cache.size>6||size>12*1024*1024)&&this.cache.size>1){const key=this.cache.keys().next().value;const b=this.cache.get(key);size-=b.length*b.numberOfChannels*4;this.cache.delete(key);}return result;})();this.pending.set(cacheKey,{promise,controller});try{return await promise;}finally{if(this.pending.get(cacheKey)?.promise===promise)this.pending.delete(cacheKey);}}
 reconcile(cues){this.cancelSpeculative();const allowed=new Set(cues.map(x=>x.bus+':'+x.media_id));for(const [key,v] of this.active)if(!v.theme&&!allowed.has(v.bus+':'+v.id))this.cancel(key);}
 async preload(plan){if(!this.context)return;const epoch=this.epoch;const ids=[...new Set([...(plan.current||[]).slice(0,6),...(plan.likely||[]).slice(0,1),...(plan.alternates||[]).slice(0,2)])];for(const id of ids){if(epoch!==this.epoch)return;try{await this.buffer(id);}catch{if(epoch!==this.epoch)return;}}}
 async play(id,bus,{loop=false,key=bus,pan=0,distance=0,gain:cueGain=1,offset=0,duration,until}={}){const requestedEpoch=this.epoch,token=(this.tokens.get(key)||0)+1;this.tokens.set(key,token);await this.unlock();if(requestedEpoch!==this.epoch||token!==this.tokens.get(key))return;if(!this.nodes.has(bus))throw Error('Invalid bus');if(this.playbackDeadline!==null&&this.context.currentTime>=this.playbackDeadline)return;if(this.active.get(key)?.id===id&&loop)return;const epoch=this.epoch;const buffer=await this.buffer(id);if(epoch!==this.epoch||token!==this.tokens.get(key))return;if(this.playbackDeadline!==null&&this.context.currentTime>=this.playbackDeadline)return;const old=this.active.get(key);if(old?.id===id&&loop)return;const source=this.context.createBufferSource(),gain=this.context.createGain(),panner=this.context.createStereoPanner?.();source.buffer=buffer;source.loop=loop;offset=Number.isFinite(offset)?Math.max(0,Math.min(buffer.duration??0,offset)):0;const cueDuration=Number.isFinite(duration)?Math.max(.01,Math.min(duration,buffer.duration-offset)):undefined;const endsAt=this.playbackDeadline===null?(until??null):Math.min(this.playbackDeadline,until??Infinity);gain.gain.value=0;source.connect(gain);if(panner){panner.pan.value=Math.max(-1,Math.min(1,pan));gain.connect(panner);panner.connect(this.nodes.get(bus));}else gain.connect(this.nodes.get(bus));const peak=bufferPeak(buffer)*(panner&&buffer.numberOfChannels>1?Math.SQRT2:1);cueGain=Number.isFinite(cueGain)?Math.max(0,Math.min(1,cueGain)):1;cueGain/=1+Math.max(0,distance);const voice={id,bus,source,gain,peak,cueGain,loop,startedAt:this.context.currentTime,endsAt:Math.min(endsAt??Infinity,loop?Infinity:this.context.currentTime+(cueDuration??(buffer.duration-offset)))};this.active.set(key,voice);gain.gain.linearRampToValueAtTime(cueGain,this.context.currentTime+.15);source.onended=()=>{this.retiring.delete(voice);if(this.active.get(key)===voice)this.active.delete(key);source.disconnect();gain.disconnect();panner?.disconnect();this.duck();};if(old){this.retiring.add(old);old.gain.gain.cancelScheduledValues(this.context.currentTime);old.gain.gain.setTargetAtTime(0,this.context.currentTime,.08);try{old.source.stop(this.context.currentTime+.35);}catch{}}if(cueDuration!==undefined&&!loop)source.start(0,offset,cueDuration);else source.start(0,offset);if(endsAt!==null)source.stop(endsAt);this.duck();}
 duck(){if(!this.context)return;
 const voices=[...this.active.values(),...this.retiring];
 const audible=v=>this.layers[v.bus].enabled&&this.layers[v.bus].volume>0;
 const speech=voices.some(x=>['Narrator','Dialogue'].includes(x.bus)&&audible(x));
 const event=voices.some(x=>x.bus==='SFX'&&audible(x));
 for(const name of buses){const decorative=['Ambience','Music','Creature','Movement'].includes(name);
 const factor=decorative?(speech?.2:event?.5:1):1;this.busFactors[name]=factor;
 const layer=this.layers[name];smooth(this.nodes.get(name).gain,layer.enabled?layer.volume*factor:0,this.context.currentTime);}
 for(const v of voices)if(v.theme&&this.themeConfig){
 const factor=this.busFactors.Music,target=this.themeSuppressed&&v.themeRole!=='scene'?0:speech?this.themeConfig.speech_duck_gain:this.themeConfig.base_gain*(event?.5:1);
 // Cue calibration is independent of the user's Music slider, including zero.
 v.cueGain=target/(levels.Music*factor);smooth(v.mix.gain,v.cueGain,this.context.currentTime);
 }
 this.protectHeadroom();
 }
 cancelSpeculative(){this.epoch++;for(const p of this.pending.values())p.controller.abort();this.pending.clear();for(const [key,v] of this.active)if(!['Ambience','Music'].includes(v.bus))this.cancel(key);}
 cancel(key){this.tokens.set(key,(this.tokens.get(key)||0)+1);const v=this.active.get(key);if(v){this.active.delete(key);clearTimeout(v.timer);try{v.source.stop();}catch{}this.duck();}}
 stop(){this.playbackDeadline=null;this.themeToken++;this.themeConfig=null;this.themePending=null;this.themeRender=null;this.epoch++;for(const v of this.retiring){clearTimeout(v.timer);try{v.source.stop();}catch{}}this.retiring.clear();for(const p of this.pending.values())p.controller.abort();this.pending.clear();for(const key of this.active.keys())this.cancel(key);}
 async pause(){for(const v of this.active.values())clearTimeout(v.timer);this.epoch++;for(const p of this.pending.values())p.controller.abort();this.pending.clear();await this.context?.suspend();}

 // A presentation-only voice on the existing Music bus. Never unlocks itself.
 setThemeSuppressed(value){this.themeSuppressed=!!value;this.duck();}
 stopTheme({fadeSeconds=.2}={}){this.themeToken++;this.themeConfig=null;this.themePending=null;this.themeRender=null;const voice=this.active.get('SiteTheme');if(!voice)return;this.active.delete('SiteTheme');clearTimeout(voice.timer);const now=this.context?.currentTime??0;if(this.context&&fadeSeconds>0){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);voice.gain.gain.linearRampToValueAtTime(0,now+fadeSeconds);try{voice.source.stop(now+fadeSeconds);}catch{}}else{try{voice.source.stop();}catch{}}this.duck();}
 hasAudibleCue(bus){const now=this.context?.currentTime??0;return [...this.active.values()].some(v=>v.bus===bus&&(!v.theme||v.themeRole==='scene'||!this.themeSuppressed)&&(v.endsAt??Infinity)>now);}
 sceneHealth(cues=[]){const expected=buses.filter(bus=>this.layers[bus].enabled&&this.layers[bus].volume>0),configured=[...new Set(cues.map(c=>c.bus).filter(bus=>buses.includes(bus)))],active=expected.filter(bus=>this.hasAudibleCue(bus));return{contextState:this.context?.state??'uninitialized',expected,configured,active,missing:expected.filter(bus=>!active.includes(bus))};}
 async startTheme(config,{role='website'}={}){
  if(!config.enabled||!this.context||this.context.state!=='running')return;
  this.themeConfig=config;this.themeRole=role;
  const current=this.active.get('SiteTheme');
  if(current&&(current.endsAt??Infinity)>this.context.currentTime)return;
  if(current)this.cancel('SiteTheme');
  if(this.themePending)return this.themePending;
  const token=this.themeToken;
  const promise=this.renderTheme(token).catch(()=>{});
  this.themePending=promise;
  try{await promise;}finally{if(this.themePending===promise)this.themePending=null;}
 }
 async renderTheme(token){
  if(this.themeRender?.token===token)return this.themeRender.promise;
  const promise=this.buildTheme(token);this.themeRender={token,promise};
  try{return await promise;}finally{if(this.themeRender?.promise===promise)this.themeRender=null;}
 }
 async buildTheme(token){
  const config=this.themeConfig;
  if(!config||token!==this.themeToken||this.context?.state!=='running'||(this.playbackDeadline!==null&&this.context.currentTime>=this.playbackDeadline))return;
  let buffer,id=config.media_id;
  try{buffer=await this.buffer(id);}catch(error){if(error.auth||token!==this.themeToken||!this.themeConfig)return;id=config.fallback_media_id;try{buffer=await this.buffer(id);}catch{return;}}
  if(token!==this.themeToken||!this.themeConfig||this.context?.state!=='running')return;
  const now=this.context.currentTime,source=this.context.createBufferSource(),gain=this.context.createGain(),mix=this.context.createGain();
  source.buffer=buffer;source.loop=false;gain.gain.value=0;
  source.connect(gain);gain.connect(mix);mix.connect(this.nodes.get('Music'));
  const old=this.active.get('SiteTheme');
  const voice={id,bus:'Music',source,gain,mix,theme:true,themeRole:this.themeRole,startedAt:now,duration:buffer.duration,endsAt:now+buffer.duration,timer:null,peak:bufferPeak(buffer),cueGain:config.base_gain/levels.Music};
  this.active.set('SiteTheme',voice);
  gain.gain.linearRampToValueAtTime(1,now+(old?config.fade_out_seconds:config.fade_in_seconds));
  source.onended=()=>{clearTimeout(voice.timer);this.retiring.delete(voice);const current=this.active.get('SiteTheme')===voice;if(current)this.active.delete('SiteTheme');source.disconnect();gain.disconnect();mix.disconnect();this.duck();if(current&&token===this.themeToken&&this.context?.state==='running')void this.renderTheme(token).catch(()=>{});};
  if(old){clearTimeout(old.timer);this.retiring.add(old);old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+config.fade_out_seconds);try{old.source.stop(now+config.fade_out_seconds);}catch{}}
  source.start();if(this.playbackDeadline!==null)source.stop(this.playbackDeadline);this.duck();this.scheduleTheme();
 }
 scheduleTheme(){
  const voice=this.active.get('SiteTheme'),config=this.themeConfig;
  if(!voice||!config||this.context?.state!=='running'||!Number.isFinite(voice.duration))return;
  clearTimeout(voice.timer);
  const remaining=voice.startedAt+voice.duration-this.context.currentTime-config.fade_out_seconds;
  voice.timer=setTimeout(()=>{if(this.active.get('SiteTheme')===voice&&this.context?.state==='running')void this.renderTheme(this.themeToken).catch(()=>{});},Math.max(.1,remaining)*1000);
 }
 async dispose(){this.stop();await this.context?.close();this.context=null;this.cache.clear();}
}

function bufferPeak(buffer){if(!buffer.getChannelData)return 1;let peak=0;for(let c=0;c<buffer.numberOfChannels;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)peak=Math.max(peak,Math.abs(data[i]));}return peak;}

// Cancel superseded automation before each live control change, including Safari.
function smooth(param,target,now){if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(now);else{const value=param.value;param.cancelScheduledValues(now);param.setValueAtTime(value,now);}param.setTargetAtTime(target,now,.015);}
