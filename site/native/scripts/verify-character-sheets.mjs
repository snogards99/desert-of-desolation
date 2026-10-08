import fs from 'node:fs';
import assert from 'node:assert/strict';
import {projectSheet} from '../lib/character-sheet.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../server-data/game.json',import.meta.url)));
const profiles=JSON.parse(fs.readFileSync(new URL('../server-data/character-sheets.json',import.meta.url)));
for(const state of data.HotRuntimeSnapshot){
 const rows=data.Characters.filter(c=>c.campaign_id===state.campaign_id);
 assert.equal(rows.length,6);
 for(const c of rows){const sheet=projectSheet(c,data,profiles,state);assert.equal(sheet.template,'AD&D 2E Character Sheet Rev 4.6');assert.equal(sheet.location,state.location_id);assert.equal(sheet.inventory.length,data.Inventory.filter(i=>i.campaign_id===c.campaign_id&&i.owner_id===c.character_id).length);assert(!JSON.stringify(sheet).includes('source_db'));assert(!JSON.stringify(sheet).includes('Temple of Set'));}
}
const main=data.HotRuntimeSnapshot[0],snogard=projectSheet(data.Characters[0],data,profiles,main);
assert.equal(snogard.scores.WIS,18);assert.equal(snogard.scores.STR,12);
assert.equal(snogard.magic.prepared_spells.reduce((n,p)=>n+p.available,0),16);
assert(snogard.magic.prepared_spells.some(p=>p.spell==='endure heat cold'));
assert(!snogard.magic.prepared_spells.some(p=>p.spell==='sanctuary'));
const ery=data.Characters.find(c=>c.campaign_id==='dod-main'&&c.character_id==='party.tal');assert(projectSheet(ery,data,profiles,main).weapons.some(w=>w.weapon==='Short Bow'));
const demo=data.HotRuntimeSnapshot[1],sera=data.Characters.find(c=>c.campaign_id===demo.campaign_id&&c.character_id==='party.syrra');const sheet=projectSheet(sera,data,profiles,demo);assert(sheet.injury.includes('trapped leg'));assert.equal(Object.keys(sheet.scores).length,6);assert(sheet.rulesCompletion.ability_origin.startsWith('Generated:'));assert.equal(sera.hp_current,39);
console.log('PASS: twelve campaign sheets, Rev 4.6 alias, runtime spell preparation, inventory isolation, unknowns, discovery-safe projection, preserved demo injuries.');
for(const c of data.Characters){const state=data.HotRuntimeSnapshot.find(s=>s.campaign_id===c.campaign_id),s=projectSheet(c,data,profiles,state);assert(!('psionics' in s));assert(!('family' in s));if(['party.zarvak','party.syrra'].includes(c.character_id)||(c.campaign_id!=='dod-main'&&['party.vaelis','party.malekith'].includes(c.character_id))){assert.equal(s.sections.magic,false);assert.equal(s.magic,null);}if(c.campaign_id==='dod-main'&&['party.syrra','party.tal'].includes(c.character_id))assert.equal(s.sections.thieving,true);if(c.character_id==='party.zarvak')assert.equal(s.sections.thieving,false);}
assert(snogard.proficiencies.general.includes('Desert Survival'));
console.log('PASS: no psionics/family payload, noncaster spells omitted, recorded thief/bard skills retained, source proficiencies preserved.');
