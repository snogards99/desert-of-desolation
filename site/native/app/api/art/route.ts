import {env} from 'cloudflare:workers';
import {authorizeCampaign} from '../../../lib/campaign-access';
import source from '../../../server-data/game.json';
import manifest from '../../../server-data/scene-art.json';
import worlds from '../../../server-data/art-world-clocks.json';
import {projectMonsterJournal} from '../../../lib/native-story-art.mjs';
import {selectSceneArt} from '../../../lib/scene-art.mjs';
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
export async function GET(req:Request){
 const url=new URL(req.url),campaign=url.searchParams.get('campaign'),revision=Number(url.searchParams.get('revision')),slot=url.searchParams.get('slot');
 if(!['dod-main','dod-demo-001'].includes(campaign||'')||!Number.isInteger(revision)||!['environment','actor','journal'].includes(slot||''))return new Response('Unavailable',{status:404,headers});
 try{
  await authorizeCampaign(req,campaign!);
  const e=env as unknown as {DB:D1Database,MEDIA:R2Bucket};
  const row=await e.DB.prepare('SELECT state,revision FROM campaigns WHERE id=?').bind(campaign).first<{state:string,revision:number}>();
  const state=row?JSON.parse(row.state):source.HotRuntimeSnapshot.find(x=>x.campaign_id===campaign);
  if(!state||Number(row?.revision??state.snapshot_revision)!==revision)return new Response('Unavailable',{status:404,headers});
  const selected=selectSceneArt(state,manifest,worlds),asset=slot==='journal'?(projectMonsterJournal(state).some(k=>k.image?.id==='dod.journal.actor.troll.living.v1')?manifest.actors.find(x=>x.actor_id==='actor.troll')?.assets.find(x=>x.state==='NEUTRAL'&&x.available&&x.runtime_eligible&&x.qa.accepted):null):slot==='actor'?selected.actor:selected.environment;
  if(!asset)return new Response('Unavailable',{status:404,headers});
  const object=await e.MEDIA.get(asset.sha256);
  if(!object||object.size!==asset.bytes||object.customMetadata?.sha256!==asset.sha256)return new Response('Optional image unavailable',{status:503,headers});
  return new Response(object.body,{headers:{...headers,'Content-Type':'image/png','Content-Length':String(object.size),'X-Art-Origin':'site-r2'}});
 }catch{return new Response('Optional image unavailable',{status:503,headers});}
}
