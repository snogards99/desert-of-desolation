import {env} from 'cloudflare:workers';
import inventory from '../../../server-data/media-inventory.json';
const headers={'Cache-Control':'private, no-store'};
export async function POST(req:Request){
 const e=env as unknown as {MEDIA:R2Bucket,MEDIA_IMPORT_KEY?:string};
 if(!e.MEDIA_IMPORT_KEY||req.headers.get('x-media-import-key')!==e.MEDIA_IMPORT_KEY)return new Response('Forbidden',{status:403,headers});
 try{const key=new URL(req.url).searchParams.get('key');const item=inventory.find(x=>x.key===key);if(!item)return new Response('Unknown asset',{status:404,headers});
 if(Number(req.headers.get('content-length'))!==item.bytes)return new Response('Size mismatch',{status:400,headers});
 const bytes=await req.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
 if(bytes.byteLength!==item.bytes||hash!==item.sha256)return new Response('Checksum mismatch',{status:400,headers});
 await e.MEDIA.put(item.key,bytes,{httpMetadata:{contentType:item.mime},customMetadata:{sha256:hash,originalPath:item.path}});
 return Response.json({key:item.key,bytes:item.bytes,sha256:hash},{headers});
 }catch{return new Response('Storage unavailable',{status:503,headers});}
}
export async function GET(req:Request){const e=env as unknown as {MEDIA:R2Bucket,MEDIA_IMPORT_KEY?:string};if(!e.MEDIA_IMPORT_KEY||req.headers.get('x-media-import-key')!==e.MEDIA_IMPORT_KEY)return new Response('Forbidden',{status:403,headers});const results=await Promise.all(inventory.map(async x=>{const o=await e.MEDIA.head(x.key);return {key:x.key,verified:!!o&&o.size===x.bytes&&o.customMetadata?.sha256===x.sha256}}));return Response.json({expected:inventory.length,verified:results.filter(x=>x.verified).length,bytes:inventory.filter((_,i)=>results[i].verified).reduce((n,x)=>n+x.bytes,0)},{headers:{'Cache-Control':'private, no-store'}});}
