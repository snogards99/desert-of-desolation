export const moduleEntries=Object.freeze({'dod.desert_wilderness.entry':'i3','i3.A':'i3','dod.oasis_white_palm.entry':'i4','i4.A':'i4','dod.citadel_martek.entry':'i5','i5.G14':'i5','i5.I1':'i5'});
export function moduleAtEntry(scene){return moduleEntries[scene]??null;}
export function introSeenKey(campaign,id){return `dod.presentation.intro.v1:${campaign}:${id}`;}
export function introWasSeen(storage,campaign,id){try{return storage?.getItem(introSeenKey(campaign,id))==='1'}catch{return false}}
export function rememberIntro(storage,campaign,id){try{storage?.setItem(introSeenKey(campaign,id),'1');return true}catch{return false}}
