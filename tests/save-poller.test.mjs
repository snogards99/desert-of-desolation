import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createSavePoller} from '../plugin/skills/desert-of-desolation-game/site-runtime/lib/save-poller.mjs';
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function setup(t,{hidden=false,load=async()=>{}}={}){
 let visible=!hidden,serial=0,calls=0;const timers=new Map(),states=[];
 const poller=createSavePoller({load:async()=>{calls++;return load();},isVisible:()=>visible,
 onStatus:s=>states.push(s),setTimer:(fn,ms)=>{const id=++serial;timers.set(id,{fn,ms});return id;},clearTimer:id=>timers.delete(id)});
 t.after(()=>poller.stop());return {poller,timers,states,get calls(){return calls;},
 setVisible(v){visible=v;poller.visibilityChanged();},
 async tick(){const [id,entry]=timers.entries().next().value;timers.delete(id);await entry.fn();}};
}
test('initial load remains caller-owned; polling starts after 15 seconds',async t=>{
 const x=setup(t);x.poller.start();assert.equal(x.calls,0);assert.equal([...x.timers.values()][0].ms,15000);
 await x.tick();assert.equal(x.calls,1);assert.equal(x.states.at(-1).stale,false);
});
test('hidden start schedules no network work',t=>{
 const x=setup(t,{hidden:true});x.poller.start();assert.equal(x.timers.size,0);assert.equal(x.calls,0);
});
test('hiding cancels the next scheduled refresh',t=>{
 const x=setup(t);x.poller.start();x.setVisible(false);assert.equal(x.timers.size,0);
});
test('becoming visible requests one refresh and one future timer',async t=>{
 const x=setup(t,{hidden:true});x.poller.start();x.setVisible(true);await flush();
 assert.equal(x.calls,1);assert.equal(x.timers.size,1);
});
test('failures report staleness and back off with a 120-second cap',async t=>{
 const x=setup(t,{load:async()=>{throw Error('fixture failure');}});x.poller.start();
 for(const expected of [30000,60000,120000,120000]){
  await x.tick();assert.equal(x.states.at(-1).stale,true);assert.equal([...x.timers.values()][0].ms,expected);
 }
});
test('successful recovery clears staleness and restores the normal interval',async t=>{
 let fail=true;const x=setup(t,{load:async()=>{if(fail)throw Error('fixture failure');}});x.poller.start();
 await x.tick();fail=false;await x.tick();assert.equal(x.states.at(-1).stale,false);
 assert.equal(x.states.at(-1).failures,0);assert.equal([...x.timers.values()][0].ms,15000);
});
test('visibility changes never overlap a pending request',async t=>{
 let resolve;const gate=new Promise(r=>resolve=r),x=setup(t,{load:()=>gate});x.poller.start();
 const pending=x.tick();x.setVisible(false);x.setVisible(true);x.setVisible(true);
 assert.equal(x.calls,1);resolve();await pending;assert.equal(x.timers.size,1);
});
test('stopping prevents late status updates and further scheduling',async t=>{
 let resolve;const gate=new Promise(r=>resolve=r),x=setup(t,{load:()=>gate});x.poller.start();
 const pending=x.tick();x.poller.stop();resolve();await pending;assert.equal(x.states.length,0);assert.equal(x.timers.size,0);
});
test('invalid timing and load contracts are rejected',()=>{
 assert.throws(()=>createSavePoller({load:null}));assert.throws(()=>createSavePoller({load:async()=>{},intervalMs:0}));
 assert.throws(()=>createSavePoller({load:async()=>{},maxIntervalMs:1}));
});
test('Site source wires visibility cleanup and a persistent stale-save warning',()=>{
 const s=readFileSync('plugin/skills/desert-of-desolation-game/site-runtime/app/page.tsx','utf8');
 assert.match(s,/createSavePoller/);assert.match(s,/visibilitychange/);assert.match(s,/poller\.stop\(\)/);
 assert.match(s,/saveStale&&/);assert.match(s,/displayed revision may be stale/);
 assert.doesNotMatch(s,/setInterval\(\(\)=>\{loadFromEffect/);
});
test('scene autostart is driven by presentation inputs, not playback status changes',()=>{
 const s=readFileSync('plugin/skills/desert-of-desolation-game/site-runtime/app/page.tsx','utf8');
 assert.match(s,/void sceneFromEffect\(\)\.catch\(\(\)=>\{\}\)/);
 assert.match(s,/\[tab,g\?\.campaign,g\?\.revision,introId,mix\.enabled\]/);
 assert.doesNotMatch(s,/\[tab,g\?\.campaign,g\?\.revision,introId,mix\.enabled,soundState\.mode,playing\]/);
 assert.match(s,/session\.current\.state==='error'\)void sceneFromEffect\(\)\.catch/);
 assert.doesNotMatch(s,/sceneFromEffect\(currentGame\.current\)/);
});
