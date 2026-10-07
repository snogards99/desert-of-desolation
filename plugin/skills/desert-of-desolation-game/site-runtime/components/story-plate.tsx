import Image from 'next/image';
type Art={src?:string,url?:string,image?:string,width?:number,height?:number,alt?:string};
export function StoryPlate({art,caption,compact=false}:{art?:Art|null,caption?:string,compact?:boolean}){const src=art?.src||art?.url||art?.image;if(!src)return null;return <figure className={'story-plate'+(compact?' story-plate-compact':'')}><Image src={src} alt={art?.alt||caption||''} width={art?.width||1536} height={art?.height||1024} sizes="(max-width: 760px) 100vw, 900px" unoptimized/>{caption&&<figcaption>{caption}</figcaption>}</figure>}
