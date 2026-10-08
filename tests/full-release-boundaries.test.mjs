import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson,validateSnapshot} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/game-client.mjs';
const headers={'content-type':'application/json'};
const base=()=>({campaign:'test-only',scene:'fixture',location:'room-a',place:'fixture',title:'Fixture',narrative:'Synthetic only.',time:0,revision:1,party:[{id:'fixture.pc',name:'Test',hp:5,max:5,equipment:{rope:1},spells:{light:1}}],choices:[],journal:[]});

test('oversized Content-Length rejects before buffering the body',async()=>{
 let read=false;
 await assert.rejects(requestJson(async()=>({ok:true,headers:new Headers({...headers,'content-length':'2000001'}),text:async()=>{read=true;return '{}';}}),'/api/game'),{code:'RESPONSE_TOO_LARGE'});
 assert.equal(read,false);
});
test('JSON size limit counts UTF-8 bytes, not JavaScript characters',async()=>{
 await assert.rejects(requestJson(async()=>new Response(JSON.stringify('\u20ac'.repeat(700000)),{headers}),'/api/game'),{code:'RESPONSE_TOO_LARGE'});
});
test('chunked oversized body is cancelled before remaining chunks are buffered',async()=>{
 let chunks=0,cancelled=false;
 const stream=new ReadableStream({pull(c){chunks++;if(chunks<=5)c.enqueue(new Uint8Array(700000).fill(32));else c.close();},cancel(){cancelled=true;}},{highWaterMark:0});
 await assert.rejects(requestJson(async()=>new Response(stream,{headers}),'/api/game'),{code:'RESPONSE_TOO_LARGE'});
 assert.equal(cancelled,true);assert.equal(chunks,3);
});
test('valid UTF-8 split across streamed chunks is decoded intact',async()=>{
 const bytes=new TextEncoder().encode(JSON.stringify({text:'a\u20acb'}));let offset=0;
 const stream=new ReadableStream({pull(c){if(offset<bytes.length)c.enqueue(bytes.slice(offset,++offset));else c.close();}},{highWaterMark:0});
 assert.deepEqual(await requestJson(async()=>new Response(stream,{headers}),'/api/game'),{text:'a\u20acb'});
});
test('same-revision location changes are rejected',()=>{
 const before=base(),after=structuredClone(before);after.location='room-b';
 assert.throws(()=>validateSnapshot(after,'test-only',before),{code:'STALE_SAVE'});
});
test('same-revision equipment changes are rejected',()=>{
 const before=base(),after=structuredClone(before);after.party[0].equipment.rope=0;
 assert.throws(()=>validateSnapshot(after,'test-only',before),{code:'STALE_SAVE'});
});
test('same-revision spell-resource changes are rejected',()=>{
 const before=base(),after=structuredClone(before);after.party[0].spells.light=0;
 assert.throws(()=>validateSnapshot(after,'test-only',before),{code:'STALE_SAVE'});
});
test('duplicate party identities are rejected',()=>{
 const state=base();state.party.push(structuredClone(state.party[0]));
 assert.throws(()=>validateSnapshot(state,'test-only'),{code:'INVALID_SAVE'});
});
test('empty party identity is rejected',()=>{
 const state=base();state.party[0].id='';
 assert.throws(()=>validateSnapshot(state,'test-only'),{code:'INVALID_SAVE'});
});
test('object key order alone does not make a snapshot stale',()=>{
 const before=base();before.party[0].equipment={rope:1,torch:2};
 const after=structuredClone(before);after.party[0]={spells:{light:1},equipment:{torch:2,rope:1},max:5,hp:5,name:'Test',id:'fixture.pc'};
 assert.equal(validateSnapshot(after,'test-only',before),after);
});
test('an exact two-million-byte JSON body remains accepted',async()=>{
 const value='x'.repeat(1999998);
 assert.equal((await requestJson(async()=>new Response(JSON.stringify(value),{headers}),'/api/game')).length,value.length);
});
test('timeout cancels a stalled response stream',async()=>{
 let cancelled=false;
 const stream=new ReadableStream({pull(){return new Promise(()=>{});},cancel(){cancelled=true;}},{highWaterMark:0});
 await assert.rejects(requestJson(async()=>new Response(stream,{headers}),'/api/game',{},10),{code:'TIMEOUT'});
 await new Promise(r=>setTimeout(r,1));assert.equal(cancelled,true);
});
