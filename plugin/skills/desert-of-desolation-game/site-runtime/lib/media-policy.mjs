import {previewMediaIds} from './listening-scene.mjs';
import introductions from './module-introductions.json' with {type:'json'};
const introMedia=new Map(Object.values(introductions).map(x=>[x.media_id,x.audio]));
export const safeMedia=new Set([...previewMediaIds,...introMedia.keys(),'dod.audio.travel.camp_packup_001','dod.audio.opening_replacement.frontier_campfire_loop20','dod.audio.opening_replacement.opening_title_theme_v2','scorefile.campaign_opening_overture.v397','dod.audio.v2.camel_breathing_loop','dod.audio.travel.party_footsteps_sand_001','dod.voice.cyrra.search_bark_001']);
const ids=items=>Array.isArray(items)?items.filter(x=>typeof x==='string'):[];
export function preloadPlan(presentation={}){
 const granted=new Set((presentation.audio||[]).map(x=>x.media_id).filter(x=>typeof x==='string'));
 const plan=presentation.preload||{};
 const pick=(items,limit)=>[...new Set(ids(items).filter(id=>granted.has(id)))].slice(0,limit);
 const current=pick([...granted],6),likely=pick(plan.likely,1),alternates=pick(plan.alternates,2);
 return {current,likely,alternates};
}
export function authorizedMedia(id,row,revision){
 if(safeMedia.has(id))return true;
 if(!row||!Number.isInteger(revision)||row.revision!==revision)return false;
 try{return (JSON.parse(row.state).presentation?.audio||[]).some(x=>x.media_id===id);}catch{return false;}
}
export function fallbackPath(id){return introMedia.get(id)||new Map([["dod.voice.narrator.bralizzar_entry_001", "/audio/test-narrator.mp3"], ["dod.voice.narrator.transition_001", "/audio/test-transition.mp3"], ["dod.audio.v2.desert_night_insects_loop", "/audio/test-night.mp3"], ["dod.audio.v2.flint_fire_start", "/audio/test-flint.mp3"], ["dod.audio.travel.tent_setup_001", "/audio/test-tent.mp3"], ["dod.audio.travel.water_container_fill_001", "/audio/test-water.mp3"], ["dod.audio.v2.horse_tack_walking_loop", "/audio/test-tack.mp3"], ["dod.audio.v2.coin_pouch_jingle", "/audio/test-coins.mp3"], ["dod.audio.v2.book_close_heavy", "/audio/test-book.mp3"],['dod.audio.v2.camel_breathing_loop','/audio/test-camel.mp3'],['dod.audio.travel.party_footsteps_sand_001','/audio/test-steps.mp3'],['dod.voice.cyrra.search_bark_001','/audio/test-dialogue.mp3'],['dod.audio.travel.camp_packup_001','/audio/0.mp3'],['dod.audio.opening_replacement.frontier_campfire_loop20','/audio/1.mp3'],['dod.audio.opening_replacement.opening_title_theme_v2','/audio/title-theme.mp3'],['scorefile.campaign_opening_overture.v397','/audio/title-theme-fallback.mp3']]).get(id)||null;}
export function verifiedObject(object,asset){return !!object&&object.size===asset.bytes&&object.customMetadata?.sha256===asset.sha256;}
