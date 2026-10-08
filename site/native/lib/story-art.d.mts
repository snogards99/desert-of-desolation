export type StoryArt={id:string;src:string;alt:string;width:number;height:number;mode:string;profile:string};
export function selectSceneArt(state:Record<string,unknown>):StoryArt|null;
export function projectMonsterJournal(state:Record<string,unknown>):{id:string;name:string;location:string;summary:string;image:StoryArt|null;image_caption:string;outcome:string}[];
