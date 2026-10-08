import {buses,levels} from './audio-engine.mjs';
export const mixKey='dod.sound-mix.v1';
export function defaultMix(){return {version:1,master:.5,enabled:true,layers:Object.fromEntries(buses.map(bus=>[bus,{volume:levels[bus],enabled:true}]))};}
export function readMix(storage){const mix=defaultMix();try{const raw=storage.getItem(mixKey);const saved=raw?JSON.parse(raw):{master:Number(storage.getItem('dod.output-volume')??.5),enabled:storage.getItem('dod.output-muted')!=='true'};if(Number.isFinite(saved.master))mix.master=Math.max(0,Math.min(1,saved.master));if(typeof saved.enabled==='boolean')mix.enabled=saved.enabled;for(const bus of buses){const layer=saved.layers?.[bus];if(Number.isFinite(layer?.volume))mix.layers[bus].volume=Math.max(0,Math.min(1,layer.volume));if(typeof layer?.enabled==='boolean')mix.layers[bus].enabled=layer.enabled;}}catch{}return mix;}
export function saveMix(storage,mix){try{storage.setItem(mixKey,JSON.stringify(mix));return true;}catch{return false;}}
