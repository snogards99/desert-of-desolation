import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {nativePrincipal,createNativeGameService} from '../server-runtime/native-game.mjs';
const require=createRequire(import.meta.url),{Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
const original=JSON.parse(fs.readFileSync(new URL('../server-data/game.json',import.meta.url)));
test('native dispatch identity uses the documented email claim without invented user-ID header',()=>{assert.deepEqual(nativePrincipal(new Request('https://isolated.sites.test',{headers:{'oai-authenticated-user-email':'OWNER@sites.test'}})),{subject:'email:owner@sites.test',email:'owner@sites.test'});assert.equal(nativePrincipal(new Request('https://isolated.sites.test')),null);});
test('native migration files match the ordered journal exactly',()=>{
 const dir=new URL('../drizzle/',import.meta.url),journal=JSON.parse(fs.readFileSync(new URL('meta/_journal.json',dir)));
 assert.deepEqual(fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort(),journal.entries.map(x=>x.tag+'.sql').sort());
});
test('native D1: supported transition, atomic receipt, duplicates, concurrency, stale, ownership, rollback, durable reload',async()=>{
 const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("isolated")}}',compatibilityDate:'2026-05-15',d1Databases:{DB:'isolated-production-handoff'}});
 try{
  const db=await mf.getD1Database('DB');
  for(const file of ['0000_flaky_absorbing_man.sql','0001_production_receipts.sql'])for(const sql of fs.readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
  const source=structuredClone(original);source.HotRuntimeSnapshot=source.HotRuntimeSnapshot.filter(s=>s.campaign_id==='dod-main').map(s=>({...s,campaign_id:'isolated-fixture'}));
  const owner={subject:'test-owner',email:'owner@sites.test'},other={subject:'other',email:'other@sites.test'};
  const service=createNativeGameService(db,source,owner.email),before=await service.load(owner,'isolated-fixture');
  assert.equal(before.revision,2);
  await assert.rejects(service.load(other,'isolated-fixture'),/FORBIDDEN/);
  const command={id:'fixture-transition',campaign:'isolated-fixture',revision:2,text:'Accept the first objective',choice:'prologue.charter.depart'};
  const results=await Promise.all([service.handle(owner,command),service.handle(owner,command)]);
  assert.deepEqual(results[0],results[1]);assert.equal(results[0].status,'RESOLVED');assert.equal(results[0].revision,3);
  const after=await createNativeGameService(db,source,owner.email).load(owner,'isolated-fixture');
  assert.equal(after.raw.scene_id,'dod.prologue.frontier.last_camp');assert.equal(after.raw.game_time,before.raw.game_time);assert.equal(after.journal.length,1);
  assert.deepEqual(await service.handle(owner,command),results[0]);
  await assert.rejects(service.handle(other,command),/FORBIDDEN/);
  await assert.rejects(service.handle(owner,{...command,text:'changed'}),/IDEMPOTENCY_CONFLICT/);
  await assert.rejects(service.handle(owner,{...command,id:'stale'}),/REVISION_CONFLICT/);
  await assert.rejects(service.handle(owner,{...command,id:'unknown',revision:3,choice:'unknown'}),/UNSUPPORTED_ACTION/);
  assert.deepEqual(await service.load(owner,'isolated-fixture'),after);
  // Existing global journal ID collision must roll back a receipt and state.
  await db.prepare('INSERT INTO actions VALUES(?,?,?,?,?)').bind('collision','other-fixture','unchanged','QUEUED','2026-10-08').run();
  await assert.rejects(service.handle(owner,{...command,id:'collision',revision:3,choice:undefined}));
  assert.deepEqual(await service.load(owner,'isolated-fixture'),after);
  assert.equal(await db.prepare('SELECT id FROM action_receipts WHERE id=?').bind('collision').first(),null);
  const queued=await service.handle(owner,{...command,id:'queued',revision:3,choice:undefined});assert.equal(queued.status,'QUEUED');
  const next=await service.load(owner,'isolated-fixture');assert.equal(next.revision,4);assert.equal(next.raw.scene_id,after.raw.scene_id);assert.equal(next.journal.length,2);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM action_receipts').first()).n,2);
  assert.equal(original.HotRuntimeSnapshot.find(s=>s.campaign_id==='dod-main').snapshot_revision,2);
 }finally{await mf.dispose();}
});
