// Exact native source bindings: context-parts/p931.json, AssetBundles.
// No narration or creature cue is inferred from a location name.
const cues={
 'dod.prologue.bralizzar.charter':[{media_id:'dod.audio.opening_replacement.opening_title_theme_v2',bus:'Music',loop:false}],
 'dod.prologue.frontier.last_camp':[{media_id:'dod.audio.opening_replacement.frontier_campfire_loop20',bus:'Ambience',loop:true}]
};
export function sceneAudio(state){return state.presentation?.audio??structuredClone(cues[state.scene_id]??[]);}
