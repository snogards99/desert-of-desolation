// Pure adjudication helpers: no IO, no automatic effect resolution or player choices.
const count=n=>Number.isSafeInteger(n)&&n>=0;
const denied=reason=>({allowed:false,reason});
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
function validLedger(l){return l&&typeof l==='object'&&!Array.isArray(l)&&['last_magic_round','last_high_level_cast_round','revision'].every(k=>l[k]===undefined||count(l[k]));}
export function magicBudget({round,level=0,kind,key,remaining,ledger={},consent=false,mechanicsReady=false,companionPresent=true,encounterId,actionId,expectedRevision}={}) {
 if(!count(round)||!count(level)||level>9||!validLedger(ledger))return denied('Valid round, level and resource counters are required.');
 if(actionId!==undefined&&(typeof actionId!=='string'||!actionId))return denied('Use a stable action identifier.');
 if(actionId&&own(ledger.receipts,actionId))return {...denied('This action is already resolved; do not apply its effect again.'),duplicate:true};
 if(expectedRevision!==undefined&&(!count(expectedRevision)||expectedRevision!==(ledger.revision??0)))return denied('Refresh the resource ledger before resolving magic.');
 if(!['prepared','fetched','power','item'].includes(kind)||typeof key!=='string'||!key||['__proto__','constructor','prototype'].includes(key))return denied('Identify the magic resource.');
 if(['prepared','fetched'].includes(kind)&&level<1)return denied('Prepared and fetched spells require their verified spell level.');
 if(kind==='fetched'&&level>5)return denied('Snogard’s current gen-fetch access stops at spell level 5.');
 if(consent!==true)return denied('Explicit caster/player choice is required.');
 if(mechanicsReady!==true)return denied('Bind the effect, components, target and casting time first.');
 if(companionPresent!==true)return denied('The required familiar is absent or unavailable.');
 if(!count(remaining)||remaining<1||(kind==='fetched'&&remaining>1))return denied('No valid confirmed unspent use.');
 if(encounterId!==undefined&&(typeof encounterId!=='string'||!encounterId))return denied('Identify the current encounter.');
 // Encounter identity prevents a previous fight’s round counters blocking a new fight.
 const same=encounterId===undefined||ledger.encounter_id===undefined||ledger.encounter_id===encounterId;
 if(same&&ledger.last_magic_round===round)return denied('One magical action per actor per round; familiars share this budget.');
 if(same&&count(ledger.last_magic_round)&&round<ledger.last_magic_round)return denied('The round clock cannot move backward within an encounter.');
 if(same&&level>=3&&count(ledger.last_high_level_cast_round)&&round<ledger.last_high_level_cast_round+3)return {...denied('Complete two intervening recovery rounds.'),next_round:ledger.last_high_level_cast_round+3};
 return {allowed:true,remaining_after:remaining-1,last_magic_round:round,...(encounterId?{encounter_id:encounterId}:{}),...(level>=3?{last_high_level_cast_round:round}:{})};
}
export function beginRetrieval({spell,level,roll,round,ledger={},consent=false,eligible=false,companionPresent=true,encounterId}={}) {
 if(consent!==true||eligible!==true||companionPresent!==true||typeof spell!=='string'||!spell||['__proto__','constructor','prototype'].includes(spell)||!count(level)||level<1||level>5||!count(roll)||roll<1||roll>6||!count(round)||!validLedger(ledger))return denied('Authorized eligible level-1–5 spell, present Gene, valid round and d6 roll required.');
 if(ledger.gene_retrieval)return denied('Gene is already retrieving a spell.');
 const cache=ledger.fetched_remaining;
 if(!cache||typeof cache!=='object'||Array.isArray(cache)||Object.values(cache).some(n=>!count(n)||n>1))return denied('Confirm the fetched-copy ledger first.');
 if((cache[spell]||0)>0)return denied('At most one fetched copy per named spell.');
 if(Object.values(cache).reduce((a,b)=>a+b,0)>=6)return denied('Six fetched copies already retained.');
 return {allowed:true,gene_retrieval:{spell,level,started_round:round,ready_round:round+roll+level,...(encounterId?{encounter_id:encounterId}:{})}};
}
export function completeRetrieval({round,ledger={},success=false,companionPresent=true,encounterId}={}) {
 const r=ledger.gene_retrieval;
 if(!r||typeof r.spell!=='string'||!r.spell||['__proto__','constructor','prototype'].includes(r.spell)||!count(r.started_round)||!count(r.ready_round)||r.ready_round<r.started_round||!count(round)||round<r.ready_round)return denied('Gene has not completed a valid recorded retrieval.');
 if(r.encounter_id&&r.encounter_id!==encounterId)return denied('Resume retrieval with its recorded clock; never reset its duration on encounter change.');
 const cache=ledger.fetched_remaining;
 if(!cache||typeof cache!=='object'||Array.isArray(cache)||Object.values(cache).some(n=>!count(n)||n>1))return denied('Confirm fetched-copy resources before completion.');
 if(success!==true||companionPresent!==true)return {allowed:true,ledger:{...ledger,gene_retrieval:null},fetched:false};
 if((cache[r.spell]||0)>0||Object.values(cache).reduce((a,b)=>a+b,0)>=6)return denied('The cache cannot accept another copy.');
 return {allowed:true,ledger:{...ledger,fetched_remaining:{...cache,[r.spell]:1},gene_retrieval:null},fetched:true};
}
// Call only AFTER exact effect resolution succeeds. Caller persists returned ledger atomically.
export function spendMagic({request={},ledger={},preparedMaximum,slotMaximum}={}) {
 const {actionId,expectedRevision,kind,key,slotKey}=request;
 if(typeof actionId!=='string'||!actionId||!validLedger(ledger))return denied('A resolved action identifier and valid ledger are required.');
 if(ledger.character_id&&request.characterId&&ledger.character_id!==request.characterId)return denied('The resource ledger belongs to a different caster.');
 if(own(ledger.receipts,actionId))return {allowed:true,duplicate:true,ledger};
 if(!count(expectedRevision)||expectedRevision!==(ledger.revision??0))return denied('Refresh the resource ledger before spending.');
 let remaining;
 if(kind==='fetched')remaining=own(ledger.fetched_remaining,key)?ledger.fetched_remaining[key]:undefined;
 else if(kind==='prepared'){
  const used=ledger.prepared_used?.[key];remaining=count(preparedMaximum)&&count(used)?preparedMaximum-used:undefined;
  const su=ledger.slot_used?.[slotKey];if(typeof slotKey!=='string'||!/^(priest|wizard):[1-9]$/.test(slotKey)||Number(slotKey.split(':')[1])!==request.level||!count(slotMaximum)||!count(su)||su>=slotMaximum)return denied('A matching unspent prepared spell slot is required.');
 }else if(kind==='power')remaining=own(ledger.powers,key)?ledger.powers[key]?.remaining:((request.characterId||ledger.character_id)==='party.snogard'?({gene_emberlight:1,sekhem_serpent_ward:1})[key]:undefined);
 else if(kind==='item')remaining=ledger.item_charges?.[key];
 const budget=magicBudget({...request,ledger,remaining});if(!budget.allowed)return budget;
 const next=structuredClone(ledger);
 if(request.encounterId&&ledger.encounter_id&&request.encounterId!==ledger.encounter_id){delete next.last_magic_round;delete next.last_high_level_cast_round;}
 if(kind==='fetched')next.fetched_remaining[key]=budget.remaining_after;
 if(kind==='prepared'){next.prepared_used={...next.prepared_used,[key]:next.prepared_used[key]+1};next.slot_used={...next.slot_used,[slotKey]:next.slot_used[slotKey]+1};}
 if(kind==='power')next.powers={...next.powers,[key]:{...next.powers?.[key],remaining:budget.remaining_after}};
 if(kind==='item')next.item_charges={...next.item_charges,[key]:budget.remaining_after};
 next.last_magic_round=budget.last_magic_round;if(budget.encounter_id)next.encounter_id=budget.encounter_id;if(budget.last_high_level_cast_round!==undefined)next.last_high_level_cast_round=budget.last_high_level_cast_round;
 next.revision=expectedRevision+1;next.receipts={...next.receipts,[actionId]:{kind,key,round:request.round}};
 return {allowed:true,duplicate:false,ledger:next};
}
