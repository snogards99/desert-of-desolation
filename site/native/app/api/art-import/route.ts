import {env} from 'cloudflare:workers';
import manifest from '../../../server-data/scene-art.json';
const headers={'Cache-Control':'private, no-store'};
const assets=[...manifest.environments.flatMap(x=>x.assets),...manifest.actors.flatMap(x=>x.assets)];
export async function POST(req:Request){
 const e=env as unknown as {MEDIA:R2Bucket,ART_IMPORT_KEY?:string};
 if(!e.ART_IMPORT_KEY||req.headers.get('x-art-import-key')!==e.ART_IMPORT_KEY)return new Response('Forbidden',{status:403,headers});
 try{
  const hash=new URL(req.url).searchParams.get('key'),asset=assets.find(x=>x.sha256===hash&&x.available&&x.runtime_eligible);
  if(!asset)return new Response('Unknown asset',{status:404,headers});
  const bytes=await req.arrayBuffer();
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
  if(bytes.byteLength!==asset.bytes||digest!==asset.sha256)return new Response('Checksum mismatch',{status:400,headers});
  await e.MEDIA.put(asset.sha256,bytes,{httpMetadata:{contentType:'image/png'},customMetadata:{sha256:asset.sha256}});
  return Response.json({verified:true,key:asset.sha256},{headers});
 }catch{return new Response('Storage unavailable',{status:503,headers});}
}
export async function GET(req:Request){
 const e=env as unknown as {MEDIA:R2Bucket,ART_IMPORT_KEY?:string};
 if(!e.ART_IMPORT_KEY||req.headers.get('x-art-import-key')!==e.ART_IMPORT_KEY)return new Response('Forbidden',{status:403,headers});
 const checks=await Promise.all(assets.map(async a=>{const o=await e.MEDIA.head(a.sha256);return !!o&&o.size===a.bytes&&o.customMetadata?.sha256===a.sha256;}));
 return Response.json({expected:assets.length,verified:checks.filter(Boolean).length,missing:assets.filter((_,i)=>!checks[i]).map(a=>a.sha256)},{headers});
}
