type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
type Command={campaign:string,revision:number,text:string,choice?:string,id:string};
type Receipt={command:Command,phase:string,message:string};
export class GameClientError extends Error {code:string;uncertain:boolean;}
export function validateCommand(command:unknown):Command;
export function requestJson(fetchImpl:typeof fetch,url:string,init?:RequestInit,timeoutMs?:number):Promise<unknown>;
export function validateSnapshot<T>(data:unknown,campaign:string,current?:T|null):T;
export function createActionGate(options?:{fetchImpl?:typeof fetch,storage?:Store|null,uuid?:()=>string,timeoutMs?:number}):{pending(campaign:string):Receipt|null;clear(campaign:string,id:string,reviewed?:boolean):boolean;reconcile(game:unknown):boolean;submit(input:Omit<Command,'id'>):Promise<Receipt>};
export function readDraft(storage:Store|null,game:unknown):{text:string,choices:string[]};
export function writeDraft(storage:Store|null,game:unknown,draft:{text:string,choices:string[]}):boolean;
