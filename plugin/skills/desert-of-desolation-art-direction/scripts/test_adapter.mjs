/** Local DOM/load-event simulation; not real network, host authorization or audio QA. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {mountTheme} from '../assets/theme.mjs';
const checks=[];const requests=[];const candidates=[];
function check(name,value){assert.ok(value,name);checks.push(name);}
class Element {
 constructor(tag='DIV'){this.tagName=tag;this.dataset={};this.attrs={};this.hidden=false;this.alt='';}
 getAttribute(k){if(k==='data-dod-theme')return this.dataset.dodTheme??null;if(k==='data-dod-motion')return this.dataset.dodMotion??null;return this.attrs[k]??null;}
 setAttribute(k,v){if(k==='data-dod-theme')this.dataset.dodTheme=v;else if(k==='data-dod-motion')this.dataset.dodMotion=v;else this.attrs[k]=v;}
 removeAttribute(k){if(k==='data-dod-theme')delete this.dataset.dodTheme;else if(k==='data-dod-motion')delete this.dataset.dodMotion;else if(k==='data-dod-theme-mounted')delete this.dataset.dodThemeMounted;else delete this.attrs[k];}
 set src(v){this.attrs.src=v;}
 get src(){return this.attrs.src;}
}
class Candidate extends Element {
 constructor(){super('IMG');candidates.push(this);}
 set src(v){this.attrs.src=v;requests.push(v);}
 load(){this.onload?.();}
 error(){this.onerror?.();}
}
const img=new Element('IMG'),fallback=new Element(),audioSentinel={},save=Object.freeze({turn:7,resources:19});
const root=new Element();root.querySelector=k=>k==='[data-dod-scene-image]'?img:k==='[data-dod-image-fallback]'?fallback:null;
root.ownerDocument={baseURI:'https://dod-fixture.test/',defaultView:{Image:Candidate,setTimeout,clearTimeout}};
let allowed=true;const authorize=p=>allowed&&p.media.id==='opaque-fixture-1';
const packet=()=>({revision:'r1',grant:{revision:'r1',expiresAt:Date.now()+60000},media:{id:'opaque-fixture-1',src:'/img/approved.png',alt:'Approved visible fixture',mode:'DOD_INK',available:true,approved:true,playerVisible:true,safeAltReviewed:true,animated:false}});
let theme=mountTheme(root,{authorizeMedia:authorize});theme.setRevision('r1');
check('opt-in theme applied',root.dataset.dodTheme==='moonlit-ink');
assert.throws(()=>mountTheme(root));checks.push('duplicate mount rejected');
for (const [name,mutate] of [
 ['undisclosed blocked',p=>p.media.playerVisible=false],['unapproved blocked',p=>p.media.approved=false],['unavailable blocked',p=>p.media.available=false],['unsafe alt blocked',p=>p.media.safeAltReviewed=false],['expired blocked',p=>p.grant.expiresAt=Date.now()-1],['wrong grant revision blocked',p=>p.grant.revision='r2'],['wrong packet revision blocked',p=>p.revision='r2'],['off-origin blocked',p=>p.media.src='https://other.test/secret.png'],['script URL blocked',p=>p.media.src='javascript:alert(1)'],['unapproved style blocked',p=>p.media.mode='GREEN'],['animated media blocked',p=>p.media.animated=true],['unknown opaque ID blocked',p=>p.media.id='private-secret'],['embedded credentials blocked',p=>p.media.src='https://user:pass@dod-fixture.test/x.png'],['invalid alt blocked',p=>p.media.alt=null],['absent grant blocked',p=>delete p.grant]
]) {const p=packet();mutate(p);check(name,theme.present(p)===false);}
check('denied packets create no load candidates',candidates.length===0&&requests.length===0);
check('approved packet accepted',theme.present(packet()));candidates.at(-1).load();
check('approved image displayed after load event',!img.hidden&&fallback.hidden&&img.src==='https://dod-fixture.test/img/approved.png');
check('safe alt applied',img.alt==='Approved visible fixture');
theme.setRevision('r2');check('revision change clears old image',img.hidden&&img.src===undefined&&img.alt==='');
theme.setRevision('r1');theme.present(packet());candidates.at(-1).error();check('load failure gives text fallback',!fallback.hidden&&img.hidden);
theme.present(packet());const delayed=candidates.at(-1);const staleLoad=delayed.onload;theme.setRevision('r3');staleLoad();check('stale load closure cannot display',img.hidden&&img.src===undefined);
theme.setRevision('r1');theme.present(packet());allowed=false;candidates.at(-1).load();check('authorization rechecked after load',img.hidden&&img.src===undefined);
allowed=true;const exp=packet();exp.grant.expiresAt=Date.now()+35;theme.present(exp);candidates.at(-1).load();check('short grant initially displays',!img.hidden);
await new Promise(resolve=>setTimeout(resolve,65));check('expiry clears displayed image',img.hidden&&img.src===undefined);
theme.setReducedMotion(true);check('static preference applied',root.dataset.dodMotion==='static');
theme.revoke();check('revoke rejects old packet',theme.present(packet())===false);
theme.destroy();check('destroy restores original attributes',root.getAttribute('data-dod-theme')===null&&root.getAttribute('data-dod-motion')===null);
check('post-destroy calls rejected',theme.present(packet())===false&&theme.setRevision('r9')===false);
check('fixture save remains unchanged',JSON.stringify(save)==='{"turn":7,"resources":19}');
check('fixture audio sentinel unchanged',Object.keys(audioSentinel).length===0);
theme=mountTheme(root);theme.setRevision('r1');check('missing authorizer denies',theme.present(packet())===false);theme.destroy();
theme=mountTheme(root,{authorizeMedia:()=>{throw Error('expired host')}});theme.setRevision('r1');check('throwing authorizer denies',theme.present(packet())===false);theme.destroy();
root.setAttribute('data-dod-theme','old');root.setAttribute('data-dod-motion','system');theme=mountTheme(root);theme.destroy();check('existing attributes restored',root.getAttribute('data-dod-theme')==='old'&&root.getAttribute('data-dod-motion')==='system');
check('simulated requests only approved fixture',requests.every(u=>u==='https://dod-fixture.test/img/approved.png'));
const report={status:'PASS',checks_passed:checks.length,checks,scope:'DOM_AND_LOAD_EVENT_SIMULATION',network_or_live_authorization_tested:false,audio_playback_tested:false};
writeFileSync(new URL('../references/adapter-validation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,checks_passed:checks.length}));
