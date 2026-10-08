// Synthetic, isolated state only. This is not a production Site/device test.
import test from 'node:test';import assert from 'node:assert/strict';
import {createActionService} from '../plugin/skills/desert-of-desolation-game/server-runtime/action-service.mjs';
import {createActionGate,requestJson,validateSnapshot,writeDraft,readDraft} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/game-client.mjs';
import {resolveSceneImage} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/scene-image-resolver.mjs';
import {browserHandoff} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/browser-handoff.mjs';
test('isolated action -> authorized transaction -> save -> scene projection -> reload round trip',async()=>{
 const original={campaign:'synthetic-only',revision:0,time:0,scene:'fixture-a',location:'fixture',place:'fixture',title:'Fixture A',narrative:'Synthetic scene.',choices:[{id:'next',text:'Next fixture'}],party:[{id:'fixture.pc',name:'Fixture',hp:5,max:5}],journal:[],privateNotes:'DO_NOT_EXPORT'};
 let state=structuredClone(original),receipts=new Map(),commits=0;const memory=new Map();
 const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 const project=s=>{const {privateNotes,...visible}=s;return {...visible,message:'Fixture action saved'};};
 const handle=createActionService({authorize:async(p,c)=>p==='owner'?{subject:p,campaign:c}:null,
 transact:async(_c,fn)=>{let next=structuredClone(state),rs=new Map(receipts);const answer=await fn({getState:async()=>structuredClone(next),getReceipt:async id=>rs.get(id),putState:async s=>next=s,putReceipt:async(id,r)=>rs.set(id,r)});state=next;receipts=rs;commits++;return answer;},
 resolve:async(s,c)=>({status:'RESOLVED',message:'Internal fixture result',state:{...s,revision:s.revision+1,time:s.time+1,scene:'fixture-b',title:'Fixture B',journal:[...s.journal,{id:c.id,status:'RESOLVED_FIXTURE',text:c.text,created:'2026-10-07'}],sceneArt:{nodeId:'fixture-b',environment:{src:'/fixture-b.png'},environmentContext:'INDOOR'}}}),project});
 const transport=async(_url,o={})=>new Response(JSON.stringify(o.method==='POST'?await handle('owner',JSON.parse(o.body)):project(state)),{headers:{'content-type':'application/json'}});
 const before=validateSnapshot(await requestJson(transport,'/api/game'),'synthetic-only');
 writeDraft(storage,before,{text:'Move to next fixture',choices:['next']});
 const gate=createActionGate({fetchImpl:transport,storage,uuid:()=> 'fixture-command'});
 const receipt=await gate.submit({campaign:before.campaign,revision:before.revision,text:'Move to next fixture',choice:'next'});
 writeDraft(storage,before,{text:'',choices:[]});
 const after=validateSnapshot(await requestJson(transport,'/api/game'),'synthetic-only',before);
 assert.equal(after.revision,1);assert.equal(after.party[0].hp,5);assert.equal(commits,1);assert.equal(after.scene,'fixture-b');
 assert.equal(resolveSceneImage(after.sceneArt).image.src,'/fixture-b.png');
 assert.equal(gate.reconcile(after),true);
 assert.equal(createActionGate({storage,fetchImpl:transport}).pending('synthetic-only'),null);
 assert.deepEqual(readDraft(storage,before),{text:'',choices:[]});
 assert.equal(JSON.stringify(JSON.parse(browserHandoff(after))).includes('DO_NOT_EXPORT'),false);
 assert.deepEqual(validateSnapshot(await requestJson(transport,'/api/game'),'synthetic-only'),after);
 assert.equal(original.revision,0);assert.equal(receipt.command.id,'fixture-command');
});
