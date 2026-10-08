import registry from '../server-data/story-art.json' with {type:'json'};
const publicArt = art => ({id:art.id,src:art.src,alt:art.alt,width:art.width,height:art.height,mode:art.mode,profile:art.profile});
export function selectSceneArt(state){
 const art=registry.scenes.find(a=>a.node_id===state.scene_id && a.available===true && a.approved===true && a.player_visible===true);
 if(!art)return null;
 // New plates are enclosed/time-neutral. Exterior plates must match authoritative time.
 if(art.environment!=='INDOOR' && art.phase!=='NEUTRAL'){
  const minutes=((Number(state.game_time)%1440)+1440)%1440;
  const phase=minutes>=360&&minutes<600?'MORNING':minutes<1020&&minutes>=600?'DAY':minutes>=1020&&minutes<1200?'EVENING':'NIGHT';
  if(art.phase!==phase)return null;
 }
 return publicArt(art);
}
export function projectMonsterJournal(state){
 // Text entered into the action journal is never evidence of a kill.
 const candidates=[...registry.confirmed_kills.filter(k=>k.campaign_id===state.campaign_id && Number(state.snapshot_revision)>=k.minimum_revision && Number(state.game_time)>=k.minimum_minutes),...(Array.isArray(state.monster_journal)?state.monster_journal:[])];
 const seen=new Set();return candidates.filter(k=>k.campaign_id===state.campaign_id && k.player_visible===true && k.outcome==='KILLED' && k.permanently_destroyed===true && typeof k.instance_id==='string' && !seen.has(k.instance_id) && seen.add(k.instance_id)).map(k=>{
  const art=registry.monsters.find(a=>a.actor_id===k.actor_id && a.state==='NEUTRAL' && a.available===true && a.approved===true);
  return {id:k.instance_id,name:k.name,location:k.location_label,summary:k.summary,image:art?publicArt(art):null,image_caption:'Living-form portrait',outcome:'Killed'};
 });
}
