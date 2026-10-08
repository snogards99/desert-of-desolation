// Client-side safety only. Same-origin server authorization remains authoritative.
export class GameClientError extends Error {
  constructor(code,message,uncertain=false){super(message);this.name='GameClientError';this.code=code;this.uncertain=uncertain;}
}
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const string=(x,max=2000)=>typeof x==='string'&&x.length<=max;
const fail=(code,message)=>{throw new GameClientError(code,message);};
export function validateCommand(command){
  if(!object(command)||!string(command.id,128)||!command.id||!string(command.campaign,128)||!command.campaign||!nat(command.revision)||!string(command.text)||!command.text.trim()||(command.choice!==undefined&&(!string(command.choice,128)||!command.choice)))
    fail('INVALID_COMMAND','Review the action and current save before submitting (maximum 2,000 characters).');
  if(command.choices!==undefined&&(!Array.isArray(command.choices)||!command.choices.length||command.choices.length>100||command.choices.some(x=>!string(x,128)||!x)||new Set(command.choices).size!==command.choices.length||command.choice!==undefined))fail('INVALID_COMMAND','Review the selected actions before submitting.');
  return {id:command.id,campaign:command.campaign,revision:command.revision,text:command.text.trim(),...(command.choice===undefined?{}:{choice:command.choice}),...(command.choices===undefined?{}:{choices:[...command.choices]})};
}
export function validateSnapshot(data,campaign,current=null){
  if(!object(data)||data.campaign!==campaign)fail('CAMPAIGN_MISMATCH','The response belongs to a different expedition. Refresh your save.');
  if(!nat(data.revision)||!nat(data.time)||!['scene','location','place','title','narrative'].every(k=>string(data[k],k==='narrative'?100000:1000))||!data.scene||!Array.isArray(data.choices)||data.choices.length>100||!Array.isArray(data.party)||data.party.length>100||!Array.isArray(data.journal)||data.journal.length>5000)
    fail('INVALID_SAVE','The saved expedition response is incomplete. Your current display has been preserved.');
  if(data.choices.some(x=>!object(x)||!string(x.id,128)||!x.id||!string(x.text))||new Set(data.choices.map(x=>x.id)).size!==data.choices.length||data.party.some(x=>!object(x)||!string(x.id,128)||!x.id||!string(x.name,200)||!Number.isFinite(x.hp)||!Number.isFinite(x.max))||new Set(data.party.map(x=>x.id)).size!==data.party.length||data.journal.some(x=>!object(x)||!string(x.text,10000)||!string(x.status,200)||!string(x.created,100)))
    fail('INVALID_SAVE','The saved expedition contains invalid display records. Refresh rather than submitting.');
  // Compare authoritative displayed state, including equipment and spell resources.
  // Presentation-only media URLs may refresh independently. Object key order is not state.
  const stable=value=>JSON.stringify(value,(_key,item)=>object(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
  const core=s=>stable([s.scene,s.location,s.place,s.title,s.time,s.narrative,s.magicAtmosphere??null,s.choices,s.party,s.journal]);
  if(current?.campaign===campaign&&(data.revision<current.revision||(data.revision===current.revision&&core(data)!==core(current))))
    fail('STALE_SAVE','An older or inconsistent save was rejected. Your newer state has been preserved.');
  return data;
}
const MAX_RESPONSE_BYTES=2000000;
async function readBoundedBody(response,controller,write){
  const oversized=()=>new GameClientError('RESPONSE_TOO_LARGE','The response exceeded the safe display limit.',write);
  const invalid=()=>new GameClientError('INVALID_RESPONSE','The response could not be read safely. Refresh your save.',write);
  const length=response.headers.get('content-length');
  if(length&&/^\d+$/.test(length)&&Number(length)>MAX_RESPONSE_BYTES){
    try{Promise.resolve(response.body?.cancel()).catch(()=>{});}catch{}
    controller.abort();throw oversized();
  }
  // Native fetch streams are required; do not buffer an unbounded legacy text() body.
  if(response.body===null)return '';
  if(typeof response.body?.getReader!=='function')throw invalid();
  const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true}),chunks=[];
  let bytes=0,completed=false;
  const cancel=()=>{try{Promise.resolve(reader.cancel()).catch(()=>{});}catch{}};
  controller.signal.addEventListener('abort',cancel,{once:true});
  try{
    while(true){
      const {done,value}=await reader.read();
      if(controller.signal.aborted)throw new GameClientError('TIMEOUT','The response timed out. Refresh the saved record before sending another action.',write);
      if(done){completed=true;break;}
      if(!(value instanceof Uint8Array))throw invalid();
      bytes+=value.byteLength;
      if(bytes>MAX_RESPONSE_BYTES){controller.abort();throw oversized();}
      try{chunks.push(decoder.decode(value,{stream:true}));}catch{throw invalid();}
    }
    try{chunks.push(decoder.decode());}catch{throw invalid();}
    return chunks.join('');
  }finally{
    controller.signal.removeEventListener('abort',cancel);
    if(!completed)cancel();
    try{reader.releaseLock();}catch{}
  }
}
export async function requestJson(fetchImpl,url,init={},timeoutMs=15000){
  if(typeof fetchImpl!=='function'||!Number.isFinite(timeoutMs)||timeoutMs<=0||timeoutMs>120000)throw new TypeError('A fetch function and bounded timeout are required.');
  const write=String(init.method||'GET').toUpperCase()!=='GET',controller=new AbortController();let timer;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new GameClientError('TIMEOUT',write?'The action timed out. It may already be saved; check the journal before sending again.':'Save refresh timed out. The current display is unchanged.',write));},timeoutMs);});
  try{return await Promise.race([timeout,(async()=>{
    const r=await fetchImpl(url,{...init,signal:controller.signal,credentials:'same-origin'});
    const discard=()=>{try{Promise.resolve(r.body?.cancel()).catch(()=>{});}catch{}controller.abort();};
    // Some injected transports can resolve after abort. Never consume their late body.
    if(controller.signal.aborted){discard();throw new GameClientError('TIMEOUT','The response arrived after the deadline. Refresh the saved record.',write);}
    if(!/application\/(?:[\w.+-]*\+)?json\b/i.test(r.headers.get('content-type')||'')){discard();throw new GameClientError('INVALID_RESPONSE','Your session needs refreshing. No action or save result has been confirmed.',write);}
    const text=await readBoundedBody(r,controller,write);
    let data;try{data=JSON.parse(text);}catch{throw new GameClientError('INVALID_RESPONSE','The response could not be read. Refresh your save.',write);}
    if(!r.ok)throw new GameClientError('HTTP_'+r.status,typeof data?.error==='string'?data.error.slice(0,1000):'The request was not confirmed. Check your saved expedition.',write);
    return data;
  })()]);}catch(e){if(e instanceof GameClientError)throw e;throw new GameClientError('NETWORK',write?'The action was not confirmed. It may already be saved; do not resend before checking the journal.':'Save refresh failed. Your displayed state is unchanged.',write);}finally{clearTimeout(timer);}
}
const receiptKey=campaign=>'dod.pending-action.v1:'+encodeURIComponent(campaign);
export function createActionGate({fetchImpl=globalThis.fetch,storage=null,uuid=()=>globalThis.crypto.randomUUID(),timeoutMs=15000}={}){
  const receipts=new Map();
  function pending(campaign){
    if(receipts.has(campaign))return receipts.get(campaign);
    let raw;try{raw=storage?.getItem(receiptKey(campaign));}catch{return null;}
    if(!raw)return null;
    let p;try{p=JSON.parse(raw);validateCommand(p.command);if(p.command.campaign!==campaign||!['sending','unknown','accepted'].includes(p.phase))throw Error();p={...p,phase:p.phase==='sending'?'unknown':p.phase};}
    catch{p={command:{campaign,id:'unreadable'},phase:'unknown',message:'A stored pending receipt is unreadable. Review the journal before clearing it.'};}
    receipts.set(campaign,p);return p;
  }
  function remember(p){receipts.set(p.command.campaign,p);try{storage?.setItem(receiptKey(p.command.campaign),JSON.stringify(p));}catch{/* Memory guard still prevents duplicates while this page is open. */}}
  function clear(campaign,id,reviewed=false){const p=pending(campaign);if(!p||p.command.id!==id||p.phase==='sending'||(p.phase!=='accepted'&&!reviewed))return false;receipts.delete(campaign);try{storage?.removeItem(receiptKey(campaign));}catch{/* Keep a conservative receipt on reload if storage is inaccessible. */}return true;}
  return {
    pending:campaign=>{const p=pending(campaign);return p?structuredClone(p):null;},clear,
    reconcile(game){const p=pending(game?.campaign);if(!p||p.phase==='sending'||!Array.isArray(game.journal))return false;const found=game.journal.some(x=>(x.id===p.command.id||x.requestId===p.command.id||x.request_id===p.command.id)&&/^(RESOLVED|QUEUED|AWAITING)/.test(x.status||''));return found?clear(game.campaign,p.command.id,true):false;},
    async submit(input){
      if(!object(input)||!string(input.campaign,128)||!input.campaign)fail('INVALID_COMMAND','A current expedition is required before submitting.');
      if(pending(input.campaign))throw new GameClientError('PENDING_ACTION','An earlier action still needs confirmation. Refresh and review the journal; no duplicate was sent.');
      const command=validateCommand({...input,id:uuid()});let p={command,phase:'sending',message:'Sending action...'};
      remember(p); // Synchronous lock, before the first await.
      try{
        const data=await requestJson(fetchImpl,'/api/game',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(command)},timeoutMs);
        if(!object(data)||!string(data.message)||!data.message||(data.id!==undefined&&data.id!==command.id)||(data.campaign!==undefined&&data.campaign!==command.campaign))throw new GameClientError('INVALID_RECEIPT','The action receipt did not match. Check the journal before sending again.',true);
        p={command,phase:'accepted',message:data.message,status:data.status};remember(p);return structuredClone(p);
      }catch(e){remember({command,phase:'unknown',message:e.message});throw e;}
    }
  };
}
const draftKey=(campaign,scene)=>'dod.action-draft.v1:'+encodeURIComponent(campaign)+':'+encodeURIComponent(scene);
export function readDraft(storage,game){
  const empty={text:'',choices:[]};try{const d=JSON.parse(storage?.getItem(draftKey(game.campaign,game.scene))||'null');if(!object(d)||d.campaign!==game.campaign||d.scene!==game.scene||!string(d.text)||!Array.isArray(d.choices))return empty;const legal=new Set(game.choices.map(x=>x.id));return {text:d.text,choices:d.choices.filter(x=>legal.has(x)).slice(0,100)};}catch{return empty;}
}
export function writeDraft(storage,game,draft){
  if(!game||!string(draft.text)||!Array.isArray(draft.choices))return false;
  try{if(!storage)return false;const k=draftKey(game.campaign,game.scene);if(!draft.text&&!draft.choices.length)storage.removeItem(k);else storage.setItem(k,JSON.stringify({campaign:game.campaign,scene:game.scene,revision:game.revision,text:draft.text,choices:draft.choices.slice(0,100)}));return true;}catch{return false;}
}
