import test from 'node:test';
import assert from 'node:assert/strict';
import {createActionService} from '../plugin/skills/desert-of-desolation-game/server-runtime/action-service.mjs';
const command=extra=>({id:'one',campaign:'test-only',revision:0,text:'Inspect fixture',...extra});
function fixture(options={}){
 let state={campaign:'test-only',revision:0,time:0,hp:5,journal:[],privateNotes:'NEVER_PROJECT_THIS'},receipts=new Map(),tail=Promise.resolve(),resolutions=0;
 const adapters={authorize:async(p,c)=>p==='owner'?{subject:p,campaign:c}:null,
 transact:(_campaign,fn)=>{const run=tail.then(async()=>{let next=structuredClone(state),nextReceipts=new Map(receipts);const tx={getState:async()=>structuredClone(next),getReceipt:async id=>nextReceipts.get(id),putState:async s=>{next=s;},putReceipt:async(id,r)=>{if(options.receiptFailure)throw Error('storage failure');nextReceipts.set(id,r);}};const result=await fn(tx);state=next;receipts=nextReceipts;return result;});tail=run.catch(()=>{});return run;},
 resolve:async(s,c)=>{resolutions++;if(c.text==='Unsupported')throw Error('unsupported');s.revision++;s.journal.push({id:c.id,status:'QUEUED',text:c.text});return {state:s,status:'QUEUED',message:'Awaiting adjudication'};},
 project:async(s)=>({campaign:s.campaign,revision:s.revision,message:'Awaiting adjudication'}),...options.adapters};
 return {handle:createActionService(adapters),state:()=>state,receipts:()=>receipts.size,resolutions:()=>resolutions};
}
test('service cannot start without native authority adapters',()=>assert.throws(()=>createActionService(),TypeError));
test('unauthorized request reads no state and writes nothing',async()=>{const f=fixture();await assert.rejects(f.handle('stranger',{...command(),authorized:true}),{code:'FORBIDDEN'});assert.equal(f.state().revision,0);assert.equal(f.receipts(),0);});
test('concurrent same-ID action resolves once and replay returns same receipt',async()=>{const f=fixture();const [a,b]=await Promise.all([f.handle('owner',command()),f.handle('owner',command())]);assert.deepEqual(a,b);assert.equal(f.resolutions(),1);assert.equal(f.state().revision,1);assert.equal(f.receipts(),1);assert.equal(f.state().time,0);assert.equal(f.state().hp,5);assert.equal('privateNotes' in a,false);});
test('same-ID changed payload is rejected',async()=>{const f=fixture();await f.handle('owner',command());await assert.rejects(f.handle('owner',command({text:'Different'})),{code:'IDEMPOTENCY_CONFLICT'});assert.equal(f.resolutions(),1);});
test('stale revisions reject without resolver or writes',async()=>{const f=fixture();await assert.rejects(f.handle('owner',command({revision:9})),{code:'REVISION_CONFLICT'});assert.equal(f.resolutions(),0);});
test('receipt write failure rolls back the whole test transaction',async()=>{const f=fixture({receiptFailure:true});await assert.rejects(f.handle('owner',command()));assert.equal(f.state().revision,0);assert.equal(f.state().journal.length,0);assert.equal(f.receipts(),0);});
test('unsupported rules never silently advance gameplay',async()=>{const f=fixture();await assert.rejects(f.handle('owner',command({text:'Unsupported'})));assert.equal(f.state().revision,0);});
test('queued actions cannot mutate HP or game time',async()=>{const f=fixture({adapters:{resolve:async s=>({status:'QUEUED',message:'queued',state:{...s,revision:1,hp:0}})}});await assert.rejects(f.handle('owner',command()),{code:'QUEUED_GAMEPLAY_MUTATION'});assert.equal(f.state().hp,5);});
test('projection failure rolls back before persistence',async()=>{const f=fixture({adapters:{project:async()=>({campaign:'other',revision:1})}});await assert.rejects(f.handle('owner',command()),{code:'INVALID_PROJECTION'});assert.equal(f.state().revision,0);});
test('authorization is checked even on receipt replay',async()=>{const f=fixture();await f.handle('owner',command());await assert.rejects(f.handle('stranger',command()),{code:'FORBIDDEN'});});

test('receipt message comes only from safe projection, never raw resolver output',async()=>{const f=fixture({adapters:{resolve:async s=>({status:'RESOLVED',message:s.privateNotes,state:{...s,revision:1}})}});const receipt=await f.handle('owner',command());assert.equal(receipt.message,'Awaiting adjudication');assert.equal(JSON.stringify(receipt).includes('NEVER_PROJECT_THIS'),false);});

test('later actions cannot delete earlier journal history',async()=>{const f=fixture({adapters:{resolve:async s=>({status:'RESOLVED',message:'result',state:{...s,revision:s.revision+1,journal:s.revision===0?[{text:'existing'}]:[]}})}});await f.handle('owner',command());await assert.rejects(f.handle('owner',command({id:'two',revision:1})),{code:'HISTORY_MUTATION'});assert.equal(f.state().revision,1);});
