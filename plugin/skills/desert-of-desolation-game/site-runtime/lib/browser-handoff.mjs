export function browserHandoff(game){
 if(!game)return '';
 const visible={schema:'dod.browser-checkpoint.v1',campaign:game.campaign,revision:game.revision,scene:game.scene,location:game.location,place:game.place,time:game.time,title:game.title,narrative:game.narrative,choices:Array.isArray(game.choices)?game.choices.map(x=>({id:x.id,text:x.text})):[],party:Array.isArray(game.party)?game.party.map(x=>({id:x.id,name:x.name,hp:x.hp,max:x.max})):[],journal:Array.isArray(game.journal)?game.journal:[]};
 return JSON.stringify(visible,null,2);
}
