// Public previews, not campaign events. Original MP3 bytes and stable IDs retained.
const clip=(media_id,gain,extra={})=>({media_id,gain,...extra});
export const previewClips={
 Narrator:clip('dod.voice.narrator.bralizzar_entry_001',.88,{duration:8.25}),
 Dialogue:clip('dod.voice.cyrra.search_bark_001',.88,{duration:6.72}),
 Creature:clip('dod.audio.v2.camel_breathing_loop',.7,{pan:.25,duration:8}),
 Movement:clip('dod.audio.travel.party_footsteps_sand_001',.65,{pan:-.2,duration:6}),
 SFX:clip('dod.audio.travel.camp_packup_001',.48,{pan:.2,duration:7}),
 Ambience:clip('dod.audio.opening_replacement.frontier_campfire_loop20',1,{duration:8}),
 Music:clip('dod.audio.opening_replacement.opening_title_theme_v2',.45,{duration:10})
};
export const campfireBeds=[
 {...previewClips.Ambience,bus:'Ambience',loop:true,duration:undefined,key:'Campfire:Ambience'},
 {...previewClips.Music,bus:'Music',loop:false,duration:undefined,key:'Campfire:Music'},
 {...previewClips.Creature,bus:'Creature',loop:true,duration:undefined,key:'Campfire:Creature',gain:.42},
 {media_id:'dod.audio.v2.desert_night_insects_loop',bus:'Ambience',loop:true,key:'Campfire:Night',gain:.3,pan:-.15}
];
export const campfireCues=[
 {at:0,bus:'Movement',...previewClips.Movement,key:'Campfire:Movement'},
 {at:1,bus:'SFX',media_id:'dod.audio.v2.flint_fire_start',gain:.3,pan:.15,duration:5},
 {at:3,bus:'Narrator',...previewClips.Narrator},
 {at:7,bus:'Movement',media_id:'dod.audio.travel.tent_setup_001',gain:.48,pan:.2,duration:6},
 {at:12,bus:'SFX',media_id:'dod.audio.travel.water_container_fill_001',gain:.4,pan:-.2,duration:4},
 {at:15,bus:'Dialogue',...previewClips.Dialogue},
 {at:18,bus:'Music',...previewClips.Music,duration:undefined},
 {at:19,bus:'Movement',media_id:'dod.audio.v2.horse_tack_walking_loop',gain:.4,pan:-.25,duration:7},
 {at:22,bus:'SFX',media_id:'dod.audio.v2.coin_pouch_jingle',gain:.35,pan:.15,duration:4},
 {at:26,bus:'Narrator',media_id:'dod.voice.narrator.transition_001',gain:.88,duration:7.2},
 {at:28,bus:'Movement',...previewClips.Movement,pan:.2},
 {at:34,bus:'SFX',...previewClips.SFX},
 {at:36,bus:'Music',...previewClips.Music,duration:undefined},
 {at:37,bus:'Movement',media_id:'dod.audio.travel.tent_setup_001',gain:.42,pan:-.2,duration:6},
 {at:41,bus:'Dialogue',...previewClips.Dialogue},
 {at:44,bus:'SFX',media_id:'dod.audio.v2.book_close_heavy',gain:.34,pan:-.15,duration:4},
 {at:48,bus:'Movement',...previewClips.Movement},
 {at:51,bus:'Narrator',...previewClips.Narrator},
 {at:54,bus:'Music',...previewClips.Music,duration:undefined},
 {at:54,bus:'SFX',media_id:'dod.audio.travel.water_container_fill_001',gain:.3,pan:.15,duration:4}
];
export const previewMediaIds=[...new Set([...Object.values(previewClips),...campfireBeds,...campfireCues].map(x=>x.media_id))];
