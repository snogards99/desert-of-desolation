// Read-only scheduling. The caller owns save identity, revision checks and GET.
// This module never submits, retries or rebases player actions.
export function createSavePoller({load,onStatus=()=>{},isVisible=()=>true,
 intervalMs=15000,maxIntervalMs=120000,setTimer=setTimeout,clearTimer=clearTimeout}){
 if(typeof load!=='function'||!Number.isFinite(intervalMs)||intervalMs<=0||
    !Number.isFinite(maxIntervalMs)||maxIntervalMs<intervalMs)
  throw new TypeError('A load function and bounded positive intervals are required.');
 let active=false,timer=null,busy=false,failures=0,generation=0;
 const delay=()=>Math.min(maxIntervalMs,intervalMs*2**Math.min(failures,20));
 const cancel=()=>{if(timer!==null)clearTimer(timer);timer=null;};
 function schedule(){cancel();if(active&&isVisible())timer=setTimer(run,delay());}
 async function run(){
  timer=null;if(!active||!isVisible()||busy)return;
  busy=true;const request=generation;
  try{await load();if(active&&request===generation){failures=0;onStatus({stale:false,failures,nextDelayMs:delay()});}}
  catch{if(active&&request===generation){failures++;onStatus({stale:true,failures,nextDelayMs:delay()});}}
  finally{busy=false;if(active)schedule();}
 }
 return {
  start(){if(active)return;active=true;generation++;schedule();},
  stop(){active=false;generation++;cancel();},
  visibilityChanged(){cancel();if(active&&isVisible()&&!busy)void run();}
 };
}
