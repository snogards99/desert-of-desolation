import story from '../server-data/magic-story.json' with {type:'json'};
export function magicAtmosphere(state,node) {
  if(state.campaign_id!=='dod-main'||!node||(node.campaign_id&&node.campaign_id!==state.campaign_id)||(state.scene_id&&node.node_id!==state.scene_id)) return '';
  if(/charter/.test(node.node_id)) return story.cues.charter;
  if(/tomb|crypt|temple/.test(String(state.location_id))) return story.cues.tomb;
  if(/desert|exterior_transit/.test(String(state.location_id))) return story.cues.desert;
  return '';
}
