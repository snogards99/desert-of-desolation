import Image from 'next/image';
type ArtImage={src:string,width?:number,height?:number,alt?:string,mode?:string};
type SceneArt={environment?:ArtImage|null,actor?:ArtImage|null,phase?:string|null};
function plate(image:ArtImage|null|undefined,kind:string){if(!image?.src)return null;return <figure className={`scene-plate scene-plate-${kind}`}><Image src={image.src} alt={image.alt||''} width={image.width||1536} height={image.height||1024} sizes="(max-width: 760px) 100vw, 900px" unoptimized/></figure>}
export function ScenePlate({art}:{art?:SceneArt|null}){if(!art)return null;return <section className="scene-media" aria-label={art.phase?`Current scene · ${art.phase}`:'Current scene'}>{plate(art.environment,'environment')}{plate(art.actor,'actor')}</section>}
