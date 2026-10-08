import {resolveSolarPhase} from './native-art-engine.mjs';
// Pure presentation selection. Never mutates state, clock, audio, or discovery.
export const PHASE_ALIASES=Object.freeze({DAWN:'DUSK',MORNING:'DUSK',EVENING:'DUSK',DAY:'DAY',DUSK:'DUSK',NIGHT:'NIGHT'});
export function artPhase(totalMinutes){
 if(!Number.isFinite(totalMinutes))return null;
 return PHASE_ALIASES[resolveSolarPhase({totalMinutes})]||null;
}
export function worldMinutes(state,worlds=[]){
 const direct=state.WorldState?.total_minutes??state.world_state?.total_minutes??state.total_minutes;
 if(typeof direct==='number'&&Number.isFinite(direct))return direct;
 const world=worlds.find(x=>x.campaign_id===state.campaign_id);
 // Legacy snapshots mirror WorldState. Fail closed if the clocks disagree.
 if(world&&Number.isFinite(world.total_minutes)&&Number(state.game_time)===world.total_minutes)return world.total_minutes;
 return null;
}
function ready(asset){return !!asset&&asset.available===true&&asset.runtime_eligible===true&&asset.qa?.accepted===true&&typeof asset.sha256==='string'&&/^[a-f0-9]{64}$/.test(asset.sha256)&&asset.bytes>0;}
export function selectSceneArt(state,manifest,worlds=[]){
 const node=manifest.nodes.find(x=>x.node_id===state.scene_id);
 if(!node)return {environment:null,actor:null,phase:null};
 const environment=manifest.environments.find(x=>x.environment_id===node.environment_id);
 if(!environment)return {environment:null,actor:null,phase:null};
 const phase=environment.scene_context==='INDOOR'?'NEUTRAL':artPhase(worldMinutes(state,worlds));
 let plate=phase?environment.assets.find(x=>x.phase===phase&&ready(x)):null;
 if(!plate&&phase&&phase!=='NEUTRAL')plate=environment.assets.find(x=>x.phase==='NEUTRAL'&&x.time_neutral===true&&ready(x));
 let actor=null;
 // Only a resolver-written actor grant is sufficient; node membership alone is not visibility.
 const grants=state.presentation?.actors;
 if(Array.isArray(grants))for(const grant of grants){
  if(grant.visible!==true||!node.actor_ids?.includes(grant.actor_id))continue;
  if(!['NEUTRAL','ALERT','ATTACK','DEFEATED'].includes(grant.state))continue;
  if(grant.state==='DEFEATED'&&grant.defeat_resolved!==true)continue;
  const design=manifest.actors.find(x=>x.actor_id===grant.actor_id);
  const asset=design?.assets.find(x=>x.state===grant.state&&ready(x));
  if(asset){actor=asset;break;}
 }
 return {environment:plate||null,actor,phase};
}
export function artProjection(state,manifest,worlds=[]){
 const selected=selectSceneArt(state,manifest,worlds);
 const query=new URLSearchParams({campaign:state.campaign_id,revision:String(state.snapshot_revision)});
 const project=(asset,slot)=>asset?{src:'/api/art?'+query+'&slot='+slot,width:512,height:768,alt:slot==='environment'?'Current surroundings':'Visible creature',mode:asset.mode}:null;
 return {environment:project(selected.environment,'environment'),actor:project(selected.actor,'actor'),phase:selected.phase};
}
