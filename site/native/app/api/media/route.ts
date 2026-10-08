import {env} from 'cloudflare:workers';
import {authorizeCampaign} from '../../../lib/campaign-access';
import audio from '../../../server-data/audio.json';
import {safeMedia,authorizedMedia,verifiedObject} from '../../../lib/media-policy.mjs';
export async function GET(req:Request){
 const url=new URL(req.url),id=url.searchParams.get('id')||'';
 if(!safeMedia.has(id)){
  const campaign=url.searchParams.get('campaign'),revision=Number(url.searchParams.get('revision'));
  if(!['dod-main','dod-demo-001'].includes(campaign||''))return new Response('Unavailable',{status:404});
  try{await authorizeCampaign(req,campaign!);const row=await (env as unknown as {DB:D1Database}).DB.prepare('SELECT state,revision FROM campaigns WHERE id=?').bind(campaign).first<{state:string,revision:number}>();
  if(!authorizedMedia(id,row,revision))return new Response('Unavailable',{status:404});}catch{return new Response('Unavailable',{status:503});}
 }
 const a=audio.find(x=>x.media_id===id);if(!a)return new Response('Unavailable',{status:404});
 try{const object=await (env as unknown as {MEDIA:R2Bucket}).MEDIA.get(a.sha256);
 if(verifiedObject(object,a)&&object)return new Response(object.body,{headers:{'X-Media-Origin':'site-r2','Content-Type':'audio/mpeg','Content-Length':String(object.size),'Cache-Control':'private, no-store'}});}catch{}
 // The client retries only harmless bundled clips. Avoid redirecting media through sign-in or host URL rewriting.
 return new Response('Optional audio unavailable',{status:503,headers:{'Cache-Control':'private, no-store'}});
}
