// A bounded, player-visible summary, never an importable save or executable instruction.
const text=(value,limit)=>typeof value==='string'?value.slice(0,limit):'';
const number=value=>Number.isFinite(value)?value:null;
export function browserHandoff(game){
 if(!game)return '';
 let clipped=false;const cut=(value,limit)=>{if(typeof value==='string'&&value.length>limit)clipped=true;return text(value,limit);};
 const choices=Array.isArray(game.choices)?game.choices:[],party=Array.isArray(game.party)?game.party:[],journal=Array.isArray(game.journal)?game.journal:[];
 return JSON.stringify({schema:'dod.browser-checkpoint.v1',kind:'PLAYER_VISIBLE_SUMMARY_NOT_SAVE_IMPORT',campaign:cut(game.campaign,128),revision:number(game.revision),scene:cut(game.scene,128),location:cut(game.location,300),place:cut(game.place,300),time:number(game.time),title:cut(game.title,300),narrative:cut(game.narrative,6000),choices:choices.slice(0,20).map(x=>({id:cut(x?.id,128),text:cut(x?.text,300)})),party:party.slice(0,20).map(x=>({id:cut(x?.id,128),name:cut(x?.name,100),hp:number(x?.hp),max:number(x?.max)})),journal:journal.slice(-20).map(x=>({text:cut(x?.text,500),status:cut(x?.status,100),created:cut(x?.created,100)})),truncated:clipped||choices.length>20||party.length>20||journal.length>20||(game.narrative?.length||0)>6000},null,2);
}
