// Selection is presentation-only. Explicit current visibility overrides old art metadata.
const PHASE_ALIASES=Object.freeze({DAWN:'DUSK',SUNRISE:'DUSK',MORNING:'DAY',EVENING:'DUSK',SUNSET:'DUSK'});
const phaseOf=value=>{const p=String(value||'').toUpperCase();return PHASE_ALIASES[p]||(['DAY','DUSK','NIGHT'].includes(p)?p:null);};
const outdoorContexts=new Set(['OUTDOOR','EXTERIOR','OPEN_AIR','COURTYARD_OPEN_SKY','ROOFTOP_OPEN_SKY']);
const indoorContexts=new Set(['INDOOR','INTERIOR','ROOM','TUNNEL']);
function outdoors(art,s){if(s.outdoor===false||indoorContexts.has(s.environmentContext))return false;return s.outdoor===true||outdoorContexts.has(s.environmentContext)||!!(art.environmentByPhase||art.environments||art.phase);}
function validImage(image,rejected){return !!image&&typeof image.src==='string'&&(/^\/(?!\/)/.test(image.src)||/^https:\/\//i.test(image.src))&&image.playerVisible!==false&&image.available!==false&&image.approved!==false&&!rejected.has(image.src);}
function desiredCreature(s){const declared=String(s.creatureState||'NEUTRAL').toUpperCase();if(declared==='DEFEATED'&&s.outcomeConfirmed===true)return 'DEFEATED';if(s.inCombat===true)return 'ATTACK';if(declared==='DEFEATED')return 'ALERT';return ['NEUTRAL','ALERT','ATTACK'].includes(declared)?declared:'NEUTRAL';}
function environment(art,s,valid){
 const outdoor=outdoors(art,s),phase=outdoor?phaseOf(s.phase):null,variants=art.environmentByPhase||art.environments;
 const exact=outdoor&&phase?variants?.[phase]:null;
 if(valid(exact)&&(!exact.phase||phaseOf(exact.phase)===phase))return {image:exact,kind:'environment',phase};
 const image=art.environment;
 if(valid(image)&&(!outdoor||image.timeNeutral===true||(phase&&(phaseOf(image.phase||art.phase)===phase))))return {image,kind:'environment',phase:image.timeNeutral?null:phase};
 if(outdoor&&valid(variants?.NEUTRAL)&&variants.NEUTRAL.timeNeutral===true)return {image:variants.NEUTRAL,kind:'environment',phase:null};
 return null;
}
function item(art,s,valid){
 const focused=s.focusedItemId,discovered=new Set(Array.isArray(s.discoveredItemIds)?s.discoveredItemIds:[]);
 if(!focused)return null;
 const known=discovered.has(focused)||(s.itemDiscovered===true&&s.itemId===focused);
 if(!known)return null;
 const image=art.items?.[focused]||(s.itemId===focused?art.item:null);
 return valid(image)?{image,kind:'treasure',itemId:focused}:null;
}
function actor(art,s,valid){
 if(String(s.creatureVisibility).toUpperCase()!=='VISIBLE')return null;
 const creatureState=desiredCreature(s),states=art.actorStates||art.creatureStates;
 let image=states?.[creatureState];
 if(!valid(image)){
  const generic=art.actor;
  image=valid(generic)&&((generic.creatureState&&generic.creatureState===creatureState)||(!generic.creatureState&&['NEUTRAL','ALERT'].includes(creatureState)))?generic:null;
 }
 return valid(image)?{image,kind:'creature',creatureState,creatureId:s.creatureId||null}:null;
}
function lastLegal(last,art,s,valid){
 if(!last||!valid(last.image)||!s.nodeId||last.nodeId!==s.nodeId)return false;
 if(last.kind==='treasure')return !!last.itemId&&s.focusedItemId===last.itemId&&new Set(s.discoveredItemIds||[]).has(last.itemId);
 if(last.kind==='creature')return String(s.creatureVisibility).toUpperCase()==='VISIBLE'&&last.creatureState===desiredCreature(s)&&(!s.creatureId||last.creatureId===s.creatureId);
 if(last.kind==='environment'){if(!outdoors(art,s))return !last.phase;return last.image.timeNeutral===true||!!phaseOf(s.phase)&&last.phase===phaseOf(s.phase);}
 return false;
}
export function resolveSceneImage(art={},state={},last=null){
 art=art||{};const s={...art,...state},rejected=new Set(Array.isArray(s.failedSources)?s.failedSources:[]),valid=image=>validImage(image,rejected);
 const nodeId=s.nodeId||null,treasure=item(art,s,valid);if(treasure)return {...treasure,nodeId,reason:'DISCOVERED_ITEM'};
 const creature=actor(art,s,valid);if(creature)return {...creature,nodeId,reason:creature.creatureState==='ATTACK'?'COMBAT':creature.creatureState==='DEFEATED'?'CONFIRMED_DEFEAT':'VISIBLE_CREATURE'};
 if(lastLegal(last,art,s,valid))return {...last,reason:'LAST_LEGAL_IMAGE'};
 const env=environment(art,s,valid);if(env)return {...env,nodeId,reason:'ENVIRONMENT'};
 return {image:null,kind:'none',nodeId,reason:'TEXT_ONLY_FALLBACK'};
}
export const sceneImagePolicy=Object.freeze({priority:['DISCOVERED_ITEM','CONFIRMED_DEFEAT','COMBAT','VISIBLE_CREATURE','LAST_LEGAL_IMAGE','ENVIRONMENT','TEXT_ONLY_FALLBACK'],hiddenCreatureRule:'HEARD_OR_HIDDEN_NEVER_REVEALS_CREATURE_ART',defeatedRule:'DEFEATED_REQUIRES_OUTCOME_CONFIRMED',phaseAliases:PHASE_ALIASES});
