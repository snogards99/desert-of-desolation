/**
 * Desert of Desolation presentation planner.
 * Pure selection only: no fetch, audio, persistence, authorization, or time mutation.
 */
export const ART_ENGINE_VERSION = '1.6.0';
export const MOBILE_BREAKPOINT = 760;
export const SUNRISE_MINUTE = 360;
export const SUNSET_MINUTE = 1200;
const PIXEL = new Set(['CHAPTER_OPEN','MAJOR_DISCOVERY','CLIMAX','EXPLORATION','NPC_DIALOGUE','COMBAT','JOURNAL','INVENTORY','MAP']);
const OUTDOOR_CONTEXTS = new Set(['OUTDOOR','EXTERIOR','OPEN_AIR','COURTYARD_OPEN_SKY','ROOFTOP_OPEN_SKY']);

function mod(n, m) { return ((n % m) + m) % m; }

export function minuteOfDay(input={}) {
  if (Number.isFinite(input.totalMinutes)) return mod(Math.trunc(input.totalMinutes), 1440);
  const h = Number(input.hour);
  const m = Number(input.minute || 0);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h >= 24 || m < 0 || m >= 60) {
    throw new TypeError('totalMinutes or valid hour/minute required');
  }
  return Math.trunc(h) * 60 + Math.trunc(m);
}

export function resolveSolarPhase(input={}) {
  const minute = minuteOfDay(input);
  if (minute >= 1200 || minute < 360) return 'NIGHT';
  if (minute < 600) return 'MORNING';
  if (minute < 1020) return 'DAY';
  return 'EVENING';
}

export function resolveAssetPhase(input={}) {
  const phase = resolveSolarPhase(input);
  if (phase === 'MORNING') return 'DAY';
  if (phase === 'EVENING') return 'DUSK';
  return phase;
}

export function nextSolarBoundary(input={}) {
  const minute = minuteOfDay(input);
  const boundaries = [360, 600, 1020, 1200, 1800];
  const absolute = boundaries.find(x => x > minute) ?? 1800;
  const delta = absolute - minute;
  const at = absolute % 1440;
  const event = at === 360 ? 'SUNRISE' : at === 600 ? 'MORNING_TO_DAY' : at === 1020 ? 'DAY_TO_EVENING' : 'SUNSET';
  return Object.freeze({minutesUntil:delta, minuteOfDay:at, event});
}

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
  if (PIXEL.has(surface)) return Object.freeze({surface,mode:'DOD_PIXEL32',semanticControls:false,advancesState:false});
  return Object.freeze({surface,mode:'TEXT_FALLBACK',semanticControls:false,advancesState:false});
}

export function acceptSceneMedia(media) {
  if (!media || media.available !== true || media.approved !== true || media.playerVisible !== true || media.safeAltReviewed !== true) return false;
  return media.mode === 'DOD_PIXEL32';
}

export function resolveOutdoorSceneVariant(input={}) {
  const context = String(input.environmentContext || '').toUpperCase();
  if (!OUTDOOR_CONTEXTS.has(context)) return Object.freeze({outdoor:false, phase:null, media:null, fallback:'UNCHANGED_INDOOR'});
  const phase = resolveAssetPhase(input);
  const variants = input.variants && typeof input.variants === 'object' ? input.variants : {};
  const exact = variants[phase];
  if (acceptSceneMedia(exact)) return Object.freeze({outdoor:true, phase, media:exact, fallback:null});
  const neutral = variants.NEUTRAL;
  if (acceptSceneMedia(neutral) && neutral.timeNeutral === true) return Object.freeze({outdoor:true, phase, media:neutral, fallback:'TIME_NEUTRAL_SAME_SCENE'});
  return Object.freeze({outdoor:true, phase, media:null, fallback:'TEXT_OR_APPROVED_NEUTRAL_BACKGROUND'});
}
