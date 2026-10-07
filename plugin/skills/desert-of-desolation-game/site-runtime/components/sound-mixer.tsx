'use client';
import {buses} from '../lib/audio-engine.mjs';
export type Mix={version:number,master:number,enabled:boolean,layers:Record<string,{volume:number,enabled:boolean}>};
export function SoundMixer({mix,onChange,prefix}:{mix:Mix,onChange:(bus:string,patch:{volume?:number,enabled?:boolean})=>void,prefix:string}){
 function row(bus:string){const master=bus==='Master';const level=master?{volume:mix.master,enabled:mix.enabled}:mix.layers[bus];if(!level)return null;const id=prefix+'-'+bus;return <div className={'mixer-row'+(master?' mixer-master':'')} key={bus}><label htmlFor={id}>{bus}</label><button type="button" aria-label={`${bus} ${level.enabled?'on':'off'}`} aria-pressed={level.enabled} onClick={()=>onChange(bus,{enabled:!level.enabled})}>{level.enabled?'On':'Off'}</button><input id={id} aria-label={`${bus} volume`} type="range" min="0" max="1" step=".01" value={level.volume} onInput={e=>onChange(bus,{volume:Number(e.currentTarget.value)})} onChange={e=>onChange(bus,{volume:Number(e.currentTarget.value)})}/><output htmlFor={id}>{Math.round(level.volume*100)}%</output></div>}
 return <div className="sound-mixer"><h3>Default game volume</h3>{row('Master')}<div className="mixer-layers" aria-label="Audio layers">{buses.map(row)}</div></div>;
}
