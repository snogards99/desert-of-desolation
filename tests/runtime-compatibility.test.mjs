import test from 'node:test';
import assert from 'node:assert/strict';
for(const name of ['audio-engine','campfire-test','listening-scene','media-policy','sound-settings']){
 test(`legacy ${name} exports the canonical implementation`,async()=>{
  const root=await import(`../plugin/skills/desert-of-desolation-game/site-runtime/${name}.mjs`);
  const canonical=await import(`../plugin/skills/desert-of-desolation-game/site-runtime/lib/${name}.mjs`);
  assert.deepEqual(Object.keys(root),Object.keys(canonical));
  for(const key of Object.keys(canonical))assert.equal(root[key],canonical[key],key);
 });
}
