export type ModuleIntroduction='explore'|'i3'|'i4'|'i5';
export const moduleEntries:Readonly<Record<string,ModuleIntroduction>>;
export function moduleAtEntry(scene:string):ModuleIntroduction|null;
export function introSeenKey(campaign:string,id:ModuleIntroduction):string;
export function introWasSeen(storage:Storage|null,campaign:string,id:ModuleIntroduction):boolean;
export function rememberIntro(storage:Storage|null,campaign:string,id:ModuleIntroduction):boolean;
