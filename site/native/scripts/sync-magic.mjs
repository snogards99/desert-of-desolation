import fs from 'node:fs';
import path from 'node:path';
const check=process.argv.includes('--check');
const pairs=[['shared/magic-budget.mjs','lib/magic-budget.mjs'],['shared/magic-budget.mjs','plugin-magic-update/skills/desert-of-desolation-game/data/magic-budget.mjs'],['shared/party-magic.json','server-data/party-magic.json'],['shared/magic-story.json','server-data/magic-story.json'],['shared/magic-story.json','plugin-magic-update/skills/desert-of-desolation-game/data/MAGIC_STORY.json']];
function emit(to,bytes){if(check){if(!fs.existsSync(to)||!bytes.equals(fs.readFileSync(to)))throw Error('Shared magic drift: '+to);}else{fs.mkdirSync(path.dirname(to),{recursive:true});fs.writeFileSync(to,bytes);}}
for(const [from,to] of pairs)emit(to,fs.readFileSync(from));
const party=JSON.parse(fs.readFileSync('shared/party-magic.json'));
const base='plugin-magic-update/skills/desert-of-desolation-game/data/';
const encode=o=>Buffer.from(JSON.stringify(o,null,2)+'\n');
const index={...party,characters:[]};
for(const character of party.characters){
 const slug=character.character_id.replace(/^party\./,'');
 const actor={...character,spells:undefined,spell_parts:[]};
 let chunk=[];let part=0;
 function flush(){if(!chunk.length)return;const file=`magic/${slug}-spells-${++part}.json`;emit(base+file,encode({shared_release:party.shared_release,character_id:character.character_id,spells:chunk}));actor.spell_parts.push(file);chunk=[];}
 for(const spell of character.spells){if(encode([...chunk,spell]).length>10000)flush();chunk.push(spell);}flush();
 const file=`magic/${slug}.json`;emit(base+file,encode(actor));index.characters.push({character_id:character.character_id,name:character.name,record:file});
}
emit(base+'PARTY_MAGIC.json',encode(index));
console.log(check?'PASS shared magic consistency and bounded actor knowledge':'Synchronized shared magic and compact plugin records');
