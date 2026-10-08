'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {resolveSceneImage} from '../lib/scene-image-resolver.mjs';
type ArtImage={src:string,width?:number,height?:number,alt?:string,mode?:string};
type SceneArt={nodeId?:string|null,environment?:ArtImage|null,environmentByPhase?:Record<string,ArtImage|null>,actor?:ArtImage|null,actorStates?:Record<string,ArtImage|null>,item?:ArtImage|null,itemId?:string|null,itemDiscovered?:boolean,items?:Record<string,ArtImage|null>,focusedItemId?:string|null,discoveredItemIds?:string[],phase?:string|null,creatureVisibility?:string|null,creatureState?:string|null,inCombat?:boolean,outcomeConfirmed?:boolean};
type Selected={image?:ArtImage|null,kind?:string,reason?:string,nodeId?:string|null,phase?:string|null,creatureState?:string,itemId?:string|null};
export function ScenePlate({art,nodeId}:{art?:SceneArt|null,nodeId?:string}){
 const last=useRef<Selected|null>(null);
 const [failed,setFailed]=useState<string[]>([]);
 if(!art){last.current=null;return null;}
 const selected=resolveSceneImage(art,{...art,nodeId:nodeId||art.nodeId,failedSources:failed},last.current) as Selected;
 if(selected.image?.src)last.current=selected;
 if(!selected.image?.src||failed.length>=16){last.current=null;return failed.length?<section className="notice"><p role="status">Scene image unavailable. The expedition remains readable.</p><button onClick={()=>setFailed([])}>Retry scene image</button></section>:null;}
 const image=selected.image,kind=selected.kind||'current';
 return <section className="scene-media" aria-label={art.phase?`Current scene · ${art.phase}`:'Current scene'} data-scene-image-kind={kind} data-scene-image-reason={selected.reason||'CURRENT'}><figure className={`scene-plate scene-plate-${kind}`}><Image src={image.src} alt={image.alt||''} width={image.width||1536} height={image.height||1024} sizes="(max-width: 760px) 100vw, 900px" unoptimized onError={()=>{last.current=null;setFailed(current=>current.includes(image.src)?current:[...current,image.src].slice(0,16));}}/></figure></section>;
}
