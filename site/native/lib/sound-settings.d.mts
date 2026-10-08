export type Mix={version:number,master:number,enabled:boolean,layers:Record<string,{volume:number,enabled:boolean}>};
export const mixKey:string;export function defaultMix():Mix;export function readMix(storage:Storage|null):Mix;export function saveMix(storage:Storage|null,mix:Mix):boolean;
