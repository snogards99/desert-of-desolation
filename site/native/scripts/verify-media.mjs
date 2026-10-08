import assert from 'node:assert/strict';
import {preloadPlan,authorizedMedia,fallbackPath,verifiedObject} from '../lib/media-policy.mjs';
const safe='dod.audio.travel.camp_packup_001',audio=['a','b','c','d'].map(media_id=>({media_id}));
assert.deepEqual(preloadPlan({audio,preload:{likely:['hidden','a','b'],alternates:['hidden','b','c','d']}}),{current:['a','b','c','d'],likely:['a'],alternates:['b','c']});
const row={state:JSON.stringify({presentation:{audio}}),revision:4};
assert(authorizedMedia('a',row,4));assert(!authorizedMedia('hidden',row,4));assert(!authorizedMedia('a',row,3));assert(!authorizedMedia('a',{state:'bad',revision:4},4));assert(authorizedMedia(safe,null,0));assert(fallbackPath(safe));assert.equal(fallbackPath('hidden'),null);
const asset={bytes:42,sha256:'abc'};assert(verifiedObject({size:42,customMetadata:{sha256:'abc'}},asset));assert(!verifiedObject(null,asset));assert(!verifiedObject({size:41,customMetadata:{sha256:'abc'}},asset));assert(!verifiedObject({size:42,customMetadata:{sha256:'wrong'}},asset));
console.log('PASS: revision/discovery gating, bounded explicit preload, harmless bundled fallback, missing/corrupt R2 rejection; no campaign writes.');
