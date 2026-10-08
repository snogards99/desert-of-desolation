// Integration adapter, NOT a deployed endpoint. Native authentication, durable
// transactions, source-backed rules and safe projection must be supplied by the host.
import {validateCommand} from '../lib/game-client.mjs';
export class ActionServiceError extends Error{constructor(code){super(code);this.code=code;}}
const reject=code=>{throw new ActionServiceError(code);};
export function createActionService({authorize,transact,resolve,project}={}){
  if([authorize,transact,resolve,project].some(x=>typeof x!=='function'))throw new TypeError('Native authorization, atomic transaction, supported resolver and safe projection adapters are required.');
  return async function handle(principal,input){
    const command=validateCommand(input);
    // Do not allow client input to supply principal or an authorization flag.
    return transact(command.campaign,async tx=>{
      const grant=await authorize(principal,command.campaign,tx);
      if(!grant||grant.campaign!==command.campaign||typeof grant.subject!=='string'||!grant.subject)reject('FORBIDDEN');
      const fingerprint=JSON.stringify([grant.subject,command.campaign,command.revision,command.text,command.choice??null,...(command.choices?[command.choices]:[])]);
      // The host must serialize this callback and roll back ALL writes on throw.
      const previous=await tx.getReceipt(command.id);
      if(previous){if(previous.fingerprint!==fingerprint)reject('IDEMPOTENCY_CONFLICT');return structuredClone(previous.response);}
      const state=await tx.getState();
      if(!state||state.campaign!==command.campaign)reject('CAMPAIGN_MISMATCH');
      if(state.revision!==command.revision)reject('REVISION_CONFLICT');
      const outcome=await resolve(structuredClone(state),Object.freeze({...command}),Object.freeze({...grant}));
      if(!outcome||!['QUEUED','RESOLVED'].includes(outcome.status)||!outcome.state||outcome.state.campaign!==command.campaign||!Number.isSafeInteger(outcome.state.revision)||outcome.state.revision!==state.revision+1||typeof outcome.message!=='string'||!outcome.message||outcome.message.length>2000)reject('INVALID_RESOLVER_OUTCOME');
      if(Array.isArray(state.journal)&&(!Array.isArray(outcome.state.journal)||outcome.state.journal.length<state.journal.length||JSON.stringify(outcome.state.journal.slice(0,state.journal.length))!==JSON.stringify(state.journal)))reject('HISTORY_MUTATION');
      if(outcome.status==='QUEUED'){
        const unchanged=s=>{const {revision,journal,...rest}=s;return rest;};
        if(JSON.stringify(unchanged(state))!==JSON.stringify(unchanged(outcome.state)))reject('QUEUED_GAMEPLAY_MUTATION');
      }
      const visible=await project(structuredClone(outcome.state),Object.freeze({...grant}),Object.freeze({status:outcome.status}));
      if(!visible||visible.campaign!==command.campaign||visible.revision!==outcome.state.revision||typeof visible.message!=='string'||!visible.message||visible.message.length>2000)reject('INVALID_PROJECTION');
      const response={id:command.id,campaign:command.campaign,revision:visible.revision,status:outcome.status,message:visible.message};
      await tx.putState(structuredClone(outcome.state));
      await tx.putReceipt(command.id,{fingerprint,response:structuredClone(response)});
      return response;
    });
  };
}
