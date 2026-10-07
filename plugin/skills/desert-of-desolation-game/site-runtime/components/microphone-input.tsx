'use client';
import {useEffect,useRef,useState} from 'react';
import {Mic,MicOff} from 'lucide-react';

type RecognitionEvent={resultIndex:number,results:{length:number,[index:number]:{isFinal:boolean,0?:{transcript?:string}}}};
type RecognitionError={error?:string};
type RecognitionLike={continuous:boolean,interimResults:boolean,lang:string,start:()=>void,stop:()=>void,abort:()=>void,onresult:((event:RecognitionEvent)=>void)|null,onerror:((event:RecognitionError)=>void)|null,onend:(()=>void)|null};
type RecognitionCtor=new()=>RecognitionLike;
declare global{interface Window{SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor;}}
type MicState='off'|'listening'|'unavailable'|'denied';

export function MicrophoneInput({enabled,onTranscript,onStatus}:{enabled:boolean,onTranscript:(text:string)=>void,onStatus?:(text:string)=>void}){
 const [state,setState]=useState<MicState>('off');
 const recognition=useRef<RecognitionLike|null>(null),wanted=useRef(false),enabledRef=useRef(enabled),restartTimer=useRef<number|null>(null);
 enabledRef.current=enabled;
 function clearRestart(){if(restartTimer.current!==null){window.clearTimeout(restartTimer.current);restartTimer.current=null;}}
 function getRecognition(){
  if(recognition.current)return recognition.current;
  const C=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!C)return null;
  const r=new C();r.continuous=true;r.interimResults=true;r.lang=navigator.language||'en-US';
  r.onresult=event=>{let final='';for(let i=event.resultIndex;i<event.results.length;i++){const result=event.results[i];if(result?.isFinal)final+=' '+(result[0]?.transcript||'');}const value=final.trim();if(value)onTranscript(value);};
  r.onerror=event=>{const error=String(event.error||'');if(error==='not-allowed'||error==='service-not-allowed'){wanted.current=false;clearRestart();setState('denied');onStatus?.('Microphone permission was not granted. You can continue by typing.');return;}if(error!=='aborted'&&error!=='no-speech')onStatus?.('Microphone input stopped. You can continue by typing.');};
  r.onend=()=>{clearRestart();if(wanted.current&&enabledRef.current){restartTimer.current=window.setTimeout(()=>{try{r.start();setState('listening');}catch{wanted.current=false;setState('off');}},250);}else setState(current=>current==='denied'||current==='unavailable'?current:'off');};
  recognition.current=r;return r;
 }
 function toggle(){
  if(!enabled){onStatus?.('Open Scene to dictate an action.');return;}
  if(wanted.current){wanted.current=false;clearRestart();try{recognition.current?.stop();}catch{}setState('off');return;}
  const r=getRecognition();if(!r){setState('unavailable');onStatus?.('Speech recognition is not available in this browser. You can continue by typing.');return;}
  wanted.current=true;try{r.start();setState('listening');onStatus?.('Microphone listening. Dictation will fill the action box but will not submit it.');}catch{wanted.current=false;setState('off');onStatus?.('Microphone could not start. You can continue by typing.');}
 }
 useEffect(()=>{if(enabled)return;wanted.current=false;clearRestart();try{recognition.current?.stop();}catch{}setState(current=>current==='unavailable'||current==='denied'?current:'off');},[enabled]);
 useEffect(()=>()=>{wanted.current=false;clearRestart();try{recognition.current?.abort();}catch{}},[]);
 const listening=state==='listening',blocked=state==='unavailable'||state==='denied';
 const label=listening?'Listening':state==='denied'?'Mic denied':state==='unavailable'?'Mic unavailable':'Mic';
 return <div className="microphone-control" style={{position:'fixed',right:'max(1rem, env(safe-area-inset-right))',bottom:'calc(4.75rem + env(safe-area-inset-bottom))',zIndex:60,display:'grid',justifyItems:'center',gap:'.2rem'}}><button type="button" onClick={toggle} aria-pressed={listening} aria-label={listening?'Stop microphone dictation':'Start microphone dictation'} title={!enabled?'Open Scene to dictate an action':listening?'Stop microphone dictation':'Start microphone dictation'} style={{width:'54px',height:'54px',borderRadius:'50%',border:'1px solid rgba(205,169,90,.7)',background:listening?'rgba(35,105,83,.96)':'rgba(7,31,29,.94)',color:'#f2e3b2',display:'grid',placeItems:'center',boxShadow:'0 4px 18px rgba(0,0,0,.36)',opacity:!enabled&&state==='off'?.58:1}}>{listening?<Mic aria-hidden="true"/>:<MicOff aria-hidden="true"/>}</button><small role="status" aria-live="polite" style={{padding:'.15rem .35rem',borderRadius:'.35rem',background:'rgba(5,20,18,.86)',color:blocked?'#e9c7a1':'#f2e3b2',fontSize:'.66rem'}}>{label}</small></div>;
}
