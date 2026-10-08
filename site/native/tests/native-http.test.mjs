import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
test('built native Worker HTTP action-save-reload and guards on isolated D1',async()=>{
 const mf=new Miniflare({modules:fs.readdirSync('dist/server',{recursive:true}).filter(f=>/\.m?js$/.test(f)).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:a.localeCompare(b)).map(f=>({type:'ESModule',path:path.resolve('dist/server',f)})),modulesRoot:path.resolve('dist/server'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'isolated-native-http'},r2Buckets:['MEDIA'],bindings:{DOD_CAMPAIGN_OWNER_EMAIL:'owner@sites.test'}});
 try{
  const db=await mf.getD1Database('DB');for(const f of ['0000_flaky_absorbing_man.sql','0001_production_receipts.sql'])for(const s of fs.readFileSync('drizzle/'+f,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(s).run();
  const headers={'oai-authenticated-user-id':'isolated-owner','oai-authenticated-user-email':'owner@sites.test'},origin='https://isolated.sites.test';
  const get=()=>mf.dispatchFetch(origin+'/api/game?campaign=dod-main',{headers});
  const before=await get();assert.equal(before.status,200);const saved=await before.json();assert.equal(saved.revision,2);assert.equal(saved.scene,'dod.prologue.bralizzar.charter');assert.equal(saved.media[0].media_id,'dod.audio.opening_replacement.opening_title_theme_v2');
  assert.equal((await mf.dispatchFetch(origin+'/api/game?campaign=dod-main')).status,403);
  const command={id:'isolated-http-transition',campaign:'dod-main',revision:2,text:'Accept the first objective',choice:'prologue.charter.depart'};
  const post=(input,extra={})=>mf.dispatchFetch(origin+'/api/game',{method:'POST',headers:{...headers,'content-type':'application/json',origin,...extra},body:JSON.stringify(input)});
  assert.equal((await post(command,{origin:'https://untrusted.test'})).status,403);
  const response=await post(command);assert.equal(response.status,200);const receipt=await response.json();assert.equal(receipt.status,'RESOLVED');
  const replay=await post(command);assert.deepEqual(await replay.json(),receipt);
  const after=await (await get()).json();assert.equal(after.revision,3);assert.equal(after.scene,'dod.prologue.frontier.last_camp');assert.equal(after.journal.length,1);assert.equal(after.media[0].media_id,'dod.audio.opening_replacement.frontier_campfire_loop20');assert.equal(after.journal[0].id,command.id);
  assert.deepEqual(await (await get()).json(),after);
  assert.equal((await post({...command,id:'stale'})).status,409);
  assert.equal((await post(command,{'oai-authenticated-user-email':'other@sites.test'})).status,403);
  assert.equal((await mf.dispatchFetch(origin+'/api/art?campaign=dod-main&revision=3&slot=environment')).status,503);
  assert.equal((await mf.dispatchFetch(origin+'/api/media?id=unknown')).status,404);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM action_receipts').first()).n,1);
  const approach={id:'isolated-approach',campaign:'dod-main',revision:3,text:'Break camp, cautiously',choices:['prologue.camp.approach']};
  const advance=await post(approach);assert.equal(advance.status,200);const advanceReceipt=await advance.json();assert.equal(advanceReceipt.status,'RESOLVED');
  assert.deepEqual(await (await post(approach)).json(),advanceReceipt);
  assert.equal((await post({...approach,choices:['prologue.camp.scout']})).status,409);
  const cave=await (await get()).json();assert.equal(cave.scene,'dod.troll_cave.entry.choice');assert.equal(cave.revision,4);assert.equal(cave.journal.length,2);
  assert.deepEqual(await (await get()).json(),cave);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM action_receipts').first()).n,2);

 }finally{await mf.dispose();}
});
