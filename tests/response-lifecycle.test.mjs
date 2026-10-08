import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson,createActionGate} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/game-client.mjs';
const headers={'content-type':'application/json'};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('non-JSON responses cancel unused streams',async()=>{
 let cancelled=false;
 const body=new ReadableStream({cancel(){cancelled=true;}},{highWaterMark:0});
 await assert.rejects(requestJson(async()=>new Response(body,{headers:{'content-type':'text/html'}}),'/api/game'),{code:'INVALID_RESPONSE'});
 assert.equal(cancelled,true);
});

test('a fetch resolving after timeout cannot start reading a late body',async()=>{
 let resolveFetch,reads=0,cancelled=false;
 const fetchResult=new Promise(resolve=>{resolveFetch=resolve;});
 await assert.rejects(requestJson(()=>fetchResult,'/api/game',{},5),{code:'TIMEOUT'});
 resolveFetch(new Response(new ReadableStream({pull(){reads++;return new Promise(()=>{});},cancel(){cancelled=true;}},{highWaterMark:0}),{headers}));
 await sleep(2);
 assert.equal(reads,0);
 assert.equal(cancelled,true);
});

test('malformed UTF-8 is rejected rather than silently replaced',async()=>{
 const body=new Uint8Array([123,34,120,34,58,34,0xff,34,125]);
 await assert.rejects(requestJson(async()=>new Response(body,{headers}),'/api/game'),{code:'INVALID_RESPONSE'});
});

test('an oversized POST response retains uncertainty and blocks a new submission',async()=>{
 let posts=0;
 const gate=createActionGate({uuid:()=> 'test-receipt',fetchImpl:async()=>{posts++;return new Response(JSON.stringify('x'.repeat(2000001)),{headers});}});
 const command={campaign:'test-only',revision:1,text:'Synthetic action'};
 await assert.rejects(gate.submit(command),{code:'RESPONSE_TOO_LARGE',uncertain:true});
 assert.equal(gate.pending('test-only').phase,'unknown');
 await assert.rejects(gate.submit(command),{code:'PENDING_ACTION'});
 assert.equal(posts,1);
});

test('a null JSON response body never becomes a confirmed save',async()=>{
 await assert.rejects(requestJson(async()=>new Response(null,{headers}),'/api/game'),{code:'INVALID_RESPONSE'});
});

test('legacy text-only response objects fail closed without unbounded buffering',async()=>{
 let buffered=false;
 await assert.rejects(requestJson(async()=>({ok:true,headers:new Headers(headers),text:async()=>{buffered=true;return '{}';}}),'/api/game'),{code:'INVALID_RESPONSE'});
 assert.equal(buffered,false);
});
