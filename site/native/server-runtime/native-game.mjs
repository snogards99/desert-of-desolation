import {createActionService} from './action-service.mjs';
export class NativeGameError extends Error {constructor(code){super(code);this.code=code;}}
const fail=code=>{throw new NativeGameError(code);};
export function nativePrincipal(request){
 const email=request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
 // Sites dispatch supplies the verified email claim, not a user-ID claim.
 return email?{subject:'email:'+email,email}:null;
}
export function createNativeGameService(db,source,ownerEmail){
 const known=new Set(source.HotRuntimeSnapshot.map(s=>s.campaign_id));
 async function authorize(principal,campaign){
  if(!principal?.subject||!principal?.email||!known.has(campaign))fail('FORBIDDEN');
  const owner=await db.prepare('SELECT subject FROM campaign_owners WHERE campaign=?').bind(campaign).first();
  if(owner?owner.subject!==principal.subject:!ownerEmail||principal.email!==ownerEmail.toLowerCase())fail('FORBIDDEN');
  return {subject:principal.subject,campaign};
 }
 async function load(principal,campaign){
  await authorize(principal,campaign);
  const row=await db.prepare('SELECT state,revision FROM campaigns WHERE id=?').bind(campaign).first();
  const raw=row?JSON.parse(row.state):structuredClone(source.HotRuntimeSnapshot.find(s=>s.campaign_id===campaign));
  const journal=await db.prepare('SELECT id,text,status,created FROM actions WHERE campaign=? ORDER BY created,id').bind(campaign).all();
  return {campaign,revision:Number(row?.revision??raw.snapshot_revision),raw,journal:journal.results};
 }
 const handle=createActionService({
  authorize:async(p,c,tx)=>{const result=await authorize(p,c);tx.setPrincipal(p);return result;},
  transact:async(campaign,callback)=>{
   // D1 has no interactive transaction callback. Read/resolve speculatively;
   // a serialized D1 batch rechecks ownership and revision
   // and atomically write the state, journal and receipt, or abort all writes.
   let next,receipt,commandId,grant,original;
   const answer=await callback({
    setPrincipal:p=>{grant=p;},
    getState:async()=>{original=await load(grant,campaign);return structuredClone(original);},
    getReceipt:async id=>{const r=await db.prepare('SELECT fingerprint,response FROM action_receipts WHERE campaign=? AND id=?').bind(campaign,id).first();return r?{fingerprint:r.fingerprint,response:JSON.parse(r.response)}:null;},
    putState:async state=>{next=state;},
    putReceipt:async(id,r)=>{commandId=id;receipt=r;}
   });
   if(!next)return answer;
   const raw={...next.raw,snapshot_revision:next.revision,checkpoint_save_id:commandId};
   const entry=next.journal.at(-1);
   try{
    await db.batch([
     db.prepare('INSERT OR IGNORE INTO campaign_owners(campaign,subject) VALUES (?,?)').bind(campaign,grant.subject),
     db.prepare('INSERT OR IGNORE INTO campaigns(id,state,revision) VALUES (?,?,?)').bind(campaign,JSON.stringify(original.raw),original.revision),
     db.prepare('INSERT OR IGNORE INTO action_receipts(campaign,id,subject,expected_revision,fingerprint,response,next_state,next_revision,text,status,created) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM campaign_owners WHERE campaign=? AND subject=?) AND EXISTS(SELECT 1 FROM campaigns WHERE id=? AND revision=?)').bind(campaign,commandId,grant.subject,original.revision,receipt.fingerprint,JSON.stringify(receipt.response),JSON.stringify(raw),next.revision,entry.text,entry.status,entry.created,campaign,grant.subject,campaign,original.revision),
     db.prepare('UPDATE campaigns SET state=?,revision=? WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM action_receipts WHERE campaign=? AND id=? AND fingerprint=?)').bind(JSON.stringify(raw),next.revision,campaign,original.revision,campaign,commandId,receipt.fingerprint),
     db.prepare('INSERT INTO actions(id,campaign,text,status,created) SELECT ?,?,?,?,? WHERE changes()=1').bind(commandId,campaign,entry.text,entry.status,entry.created)
    ]);
   }catch(e){
    // Recheck authorization before exposing a replay. Never retry a resolver.
    await authorize(grant,campaign);
    const r=await db.prepare('SELECT fingerprint,response FROM action_receipts WHERE campaign=? AND id=?').bind(campaign,commandId).first();
    if(r){if(r.fingerprint!==receipt.fingerprint)fail('IDEMPOTENCY_CONFLICT');return JSON.parse(r.response);}
    const row=await db.prepare('SELECT revision FROM campaigns WHERE id=?').bind(campaign).first();
    if(row?.revision!==original.revision)fail('REVISION_CONFLICT');
    throw e;
   }
   await authorize(grant,campaign);
   const committed=await db.prepare('SELECT fingerprint,response FROM action_receipts WHERE campaign=? AND id=?').bind(campaign,commandId).first();
   if(!committed)fail('REVISION_CONFLICT');
   if(committed.fingerprint!==receipt.fingerprint)fail('IDEMPOTENCY_CONFLICT');
   return JSON.parse(committed.response);
  },
  resolve:async(s,c)=>{
   const choice=source.StoryChoices.find(x=>x.choice_id===c.choice&&x.node_id===s.raw.scene_id&&x.visibility==='PLAYER'&&x.active!==false&&x.active!=='FALSE');
   if(c.choice&&!choice)fail('UNSUPPORTED_ACTION');
   const target=choice?.choice_id==='prologue.charter.depart'?source.StoryNodes.find(x=>x.node_id===choice.success_target_node):null;
   const resolved=!!target,raw=structuredClone(s.raw);
   if(resolved){raw.scene_id=target.node_id;raw.location_id=target.location_id;delete raw.presentation;}
   return {status:resolved?'RESOLVED':'QUEUED',message:'internal',state:{...s,revision:s.revision+1,raw,journal:[...s.journal,{id:c.id,text:c.text,status:resolved?'RESOLVED_EXPLICIT_TRANSITION':'QUEUED_RULES_RESOLUTION',created:new Date().toISOString()}]}};
  },
  project:async(s,_grant,outcome)=>({campaign:s.campaign,revision:s.revision,message:outcome.status==='RESOLVED'?'Your chosen passage is saved.':'Action saved for adjudication. Exact rules resolution is required; gameplay is unchanged.'})
 });
 return {authorize,load,handle};
}
