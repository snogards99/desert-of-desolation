/**
 * Desert of Desolation presentation planner.
 * Pure selection only: no fetch, audio, persistence, state mutation, or authorization.
 */
export const ART_ENGINE_VERSION = '1.1.0';
export const MOBILE_BREAKPOINT = 760;
const MAJOR = new Set(['CHAPTER_OPEN','MAJOR_DISCOVERY','CLIMAX']);
const INK = new Set(['EXPLORATION','NPC_DIALOGUE','COMBAT','JOURNAL','INVENTORY','MAP']);
export function selectMasterUi(width) {
  if (!Number.isFinite(width) || width <= 0) throw new TypeError('viewport width required');
  return width <= MOBILE_BREAKPOINT
    ? {mode:'DOD_SITE',assetId:'dod.ui.home.mobile.v1',layout:'mobile'}
    : {mode:'DOD_SITE',assetId:'dod.ui.home.desktop.v1',layout:'desktop'};
}
export function resolvePresentation(input={}) {
  const surface = String(input.surface || '').toUpperCase();
  if (!surface) throw new TypeError('surface required');
  if (surface === 'TITLE_SPLASH' || surface === 'HOME') {
    const master = selectMasterUi(Number(input.viewportWidth));
    return Object.freeze({...master,surface,semanticControls:true,interactiveHotspots:false,advancesState:false});
  }
  if (MAJOR.has(surface)) return Object.freeze({surface,mode:'DOD_PAINTED',semanticControls:false,advancesState:false});
  if (INK.has(surface)) return Object.freeze({surface,mode:'DOD_INK',semanticControls:false,advancesState:false});
  return Object.freeze({surface,mode:'TEXT_FALLBACK',semanticControls:false,advancesState:false});
}
export function acceptSceneMedia(media) {
  if (!media || media.available !== true || media.approved !== true || media.playerVisible !== true || media.safeAltReviewed !== true) return false;
  return media.mode === 'DOD_INK' || media.mode === 'DOD_PAINTED';
}
