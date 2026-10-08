export const safeMedia:Set<string>;
export function preloadPlan(presentation?:{audio?:{media_id:string}[],preload?:{likely?:string[],alternates?:string[]}}):{current:string[],likely:string[],alternates:string[]};
export function authorizedMedia(id:string,row:{state:string,revision:number}|null,revision:number):boolean;
export function fallbackPath(id:string):string|null;
export function verifiedObject(object:{size:number,customMetadata?:Record<string,string>}|null,asset:{bytes:number,sha256:string}):boolean;
