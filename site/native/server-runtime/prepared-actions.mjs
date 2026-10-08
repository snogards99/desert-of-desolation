// Resolve only fully specified source actions. Never infer mechanics from prose.
const active=x=>x.active!==false&&x.active!=='FALSE'&&x.visibility==='PLAYER';
const empty=value=>{try{const v=JSON.parse(value||'{}');return v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===0;}catch{return false;}};
const normalize=text=>text.trim().toLowerCase().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
export function preparedActionPlan(source,scene,command){
 const available=source.StoryChoices.filter(x=>x.node_id===scene&&active(x));
 let ids=command.choices??(command.choice?[command.choice]:[]);
 if(!ids.length){
  const matches=available.filter(x=>normalize(x.player_text)===normalize(command.text));
  if(matches.length===1)ids=[matches[0].choice_id];
 }
 const selected=ids.map(id=>available.find(x=>x.choice_id===id));
 if(selected.some(x=>!x))return {invalid:true};
 if(!selected.length)return {resolved:false};
 // Free text accompanying structured selections is retained in the journal as
 // player detail, never treated as authority for additional game effects.
 const targets=[];
 for(const choice of selected){
  if(!empty(choice.prerequisite_json)||!empty(choice.state_effects_json))return {resolved:false};
  if(choice.handler==='getPlayerDashboard'&&choice.success_target_node===scene)continue;
  if(!empty(choice.rules_required_json)||choice.partial_target_node||choice.failure_target_node||choice.terminal_target_node)return {resolved:false};
  let args;try{args=JSON.parse(choice.handler_args_json||'{}');}catch{return {resolved:false};}
  const target=source.StoryNodes.find(x=>x.node_id===choice.success_target_node&&x.active!==false&&x.active!=='FALSE');
  if(!target||args.target!==target.node_id||Object.keys(args).some(k=>k!=='target'))return {resolved:false};
  targets.push(target);
 }
 if(new Set(targets.map(x=>x.node_id)).size>1)return {resolved:false};
 return {resolved:true,target:targets[0]??null};
}
