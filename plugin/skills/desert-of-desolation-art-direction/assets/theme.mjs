/**
 * Optional scoped presentation adapter. No fetches, storage, audio, or save writes.
 * It DOES NOT provide authorization. The existing host must verify grants and
 * return only discovery-safe opaque URLs. authorizeMedia defaults to deny.
 */
export function mountTheme(root, options = {}) {
  if (!root || typeof root.querySelector !== 'function') throw new TypeError('A game root element is required');
  const img = root.querySelector('[data-dod-scene-image]');
  const fallback = root.querySelector('[data-dod-image-fallback]');
  if (!img || img.tagName !== 'IMG') throw new TypeError('A dedicated scene IMG is required');
  if (root.dataset.dodThemeMounted === 'true') throw new Error('Theme already mounted');
  const original = {theme: root.getAttribute('data-dod-theme'), motion: root.getAttribute('data-dod-motion')};
  const authorizeMedia = typeof options.authorizeMedia === 'function' ? options.authorizeMedia : () => false;
  const now = typeof options.now === 'function' ? options.now : () => Date.now();
  const base = new URL(root.ownerDocument.baseURI);
  let revision = null, disposed = false, epoch = 0, pending = null, expiryTimer = null;
  root.dataset.dodTheme = 'moonlit-ink';
  root.dataset.dodThemeMounted = 'true';
  const showFallback = () => { img.hidden = true; if (fallback) fallback.hidden = false; };
  const clear = () => {
    epoch++;
    if (expiryTimer !== null) { root.ownerDocument.defaultView.clearTimeout(expiryTimer); expiryTimer=null; }
    if (pending) { pending.onload = null; pending.onerror = null; pending.removeAttribute('src'); pending = null; }
    img.onload = null; img.onerror = null; img.removeAttribute('src'); img.removeAttribute('srcset');
    img.alt = ''; showFallback();
  };
  const setRevision = value => {
    if (disposed) return false;
    if (typeof value !== 'string' || !value.trim()) { revision=null; clear(); return false; }
    if (value !== revision) { revision=value; clear(); }
    return true;
  };
  const setReducedMotion = value => { if (!disposed) root.dataset.dodMotion = value ? 'static' : 'system'; };
  const present = packet => {
    clear();
    if (disposed || !packet || !revision || packet.revision !== revision) return false;
    const {media, grant} = packet;
    if (!media || !grant || media.available !== true || media.approved !== true || media.playerVisible !== true || media.safeAltReviewed !== true) return false;
    if (grant.revision !== revision || !Number.isFinite(grant.expiresAt) || grant.expiresAt <= now()) return false;
    if (typeof media.src !== 'string' || typeof media.alt !== 'string' || media.alt.length > 500) return false;
    if (!['DOD_INK','DOD_PAINTED'].includes(media.mode)) return false;
    // The host selects a still A frame for reduced motion; animated formats are
    // intentionally unsupported by this adapter. Existing host animation stays separate.
    if (media.animated === true) return false;
    let url;
    try {
      url = new URL(media.src, base);
      if (!['http:','https:'].includes(url.protocol) || url.origin !== base.origin || url.username || url.password) return false;
      if (authorizeMedia(packet) !== true) return false;
    } catch { return false; }
    const ticket=epoch;
    expiryTimer=root.ownerDocument.defaultView.setTimeout(() => { if(ticket===epoch) clear(); }, Math.min(2147483647, Math.max(1, grant.expiresAt-now())));
    const candidate=new root.ownerDocument.defaultView.Image();
    candidate.decoding='async'; candidate.referrerPolicy='same-origin';
    pending=candidate;
    candidate.onload = () => {
      if (disposed || ticket !== epoch || packet.revision !== revision || grant.expiresAt <= now()) return;
      // Recheck revocable host authorization at display time, not only load time.
      try { if (authorizeMedia(packet) !== true) { clear(); return; } } catch { clear(); return; }
      pending=null;
      img.onload=null; img.onerror=()=>{ if (ticket===epoch) clear(); };
      img.src=url.href; img.alt=media.alt; img.dataset.dodArtMode=media.mode;
      img.hidden=false; if(fallback) fallback.hidden=true;
    };
    candidate.onerror = () => { if(ticket===epoch) clear(); };
    candidate.src=url.href;
    return true;
  };
  clear(); setReducedMotion(options.reducedMotion === true);
  return Object.freeze({
    setRevision, present, setReducedMotion,
    revoke: () => { revision=null; clear(); },
    destroy: () => {
      if(disposed) return;
      clear();disposed=true;
      for(const [key,value] of [['data-dod-theme',original.theme],['data-dod-motion',original.motion]]) {
        if(value===null)root.removeAttribute(key);else root.setAttribute(key,value);
      }
      root.removeAttribute('data-dod-theme-mounted');
    }
  });
}
