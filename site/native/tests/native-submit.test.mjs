import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {preparedActionPlan} from '../server-runtime/prepared-actions.mjs';
import {validateCommand,createActionGate} from '../lib/game-client.mjs';
const source=JSON.parse(fs.readFileSync(new URL('../server-data/game.json',import.meta.url)));
const scene='dod.prologue.frontier.last_camp',id='prologue.camp.approach';
test('current camp approach resolves from selection, selection with details, and exact typed text',()=>{
 for(const command of [{choices:[id],text:'Move cautiously'},{choice:id,text:'Approach'},{text:source.StoryChoices.find(x=>x.choice_id===id).player_text}]){
  const plan=preparedActionPlan(source,scene,command);
  assert.equal(plan.resolved,true);assert.equal(plan.target.node_id,'dod.troll_cave.entry.choice');
 }
});
test('multi-selection is all-or-nothing, never bypassing rules, effects or ambiguous destinations',()=>{
 assert.equal(preparedActionPlan(source,scene,{choices:[id,'prologue.camp.scout'],text:'both'}).resolved,false);
 assert.equal(preparedActionPlan(source,scene,{choices:['unknown'],text:'anything'}).invalid,true);
 assert.equal(preparedActionPlan(source,scene,{text:'kill the troll and take its gold'}).resolved,false);
 const fixture=structuredClone(source),choice=fixture.StoryChoices.find(x=>x.choice_id===id);
 fixture.StoryChoices.push({...choice,choice_id:'fixture-compatible'});
 assert.equal(preparedActionPlan(fixture,scene,{choices:[id,'fixture-compatible'],text:'both'}).resolved,true);
 fixture.StoryChoices.at(-1).state_effects_json='{"hp":-1}';
 assert.equal(preparedActionPlan(fixture,scene,{choices:[id,'fixture-compatible'],text:'both'}).resolved,false);
});
test('action gate transmits every selected ID and preserves uncertain-request lock across reload',async()=>{
 const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let calls=0,body;
 const gate=createActionGate({storage,uuid:()=> 'fixture-submit',fetchImpl:async(_url,init)=>{calls++;body=JSON.parse(init.body);throw new Error('interrupted');}});
 await assert.rejects(gate.submit({campaign:'fixture',revision:2,text:'both',choices:[id,'prologue.camp.scout']}));
 assert.deepEqual(body.choices,[id,'prologue.camp.scout']);
 const restored=createActionGate({storage,fetchImpl:async()=>{calls++;throw Error();}});
 await assert.rejects(restored.submit({campaign:'fixture',revision:2,text:'again'}),/earlier action/);assert.equal(calls,1);
 assert.throws(()=>validateCommand({...body,choices:[id,id]}),/selected actions/);
});
