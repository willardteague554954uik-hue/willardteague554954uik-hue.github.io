/* Hero background video: scroll-driven playback (no autoplay).
   currentTime = heroScrollProgress(0..1) * duration, smoothed via rAF lerp.
   Targets only the hero clip (src contains the asset id). */
(function () {
  var ASSET_ID = 'WTjKqrn8HNXvDANMM6KjIZoIHI'; // hero video asset
  var SCRUB_VH = 1.4;   // how many viewport-heights of scroll scrub the whole clip
  var EASE = 0.10;      // smoothing: lower = smoother (0..1)

  var vids = [];
  var current = 0;      // smoothed progress actually applied to the video
  var raf = null;

  function isHero(v) {
    var s = (v.currentSrc || v.getAttribute('src') || '');
    return s.indexOf(ASSET_ID) !== -1;
  }

  function patch(v) {
    // strip autoplay and neutralise Framer's auto play()
    v.removeAttribute('autoplay');
    try { v.autoplay = false; } catch (e) {}
    v.muted = true;            // keep muted (required, and we never play anyway)
    v.playsInline = true;
    try { v.pause(); } catch (e) {}
    if (!v.__scrubPatched) {
      v.__scrubPatched = true;
      // block any play() call (Framer hydration tries to autoplay)
      v.play = function () { try { v.pause(); } catch (e) {} return Promise.resolve(); };
      // nudge so the first frame paints while paused
      var paint = function () { try { v.currentTime = 0.001; } catch (e) {} };
      if (v.readyState >= 1) paint();
      else v.addEventListener('loadedmetadata', paint, { once: true });
    }
  }

  function collect() {
    var found = [];
    var all = document.querySelectorAll('video');
    for (var i = 0; i < all.length; i++) {
      if (isHero(all[i])) { patch(all[i]); found.push(all[i]); }
    }
    vids = found;
    return vids.length;
  }

  function targetProgress() {
    var max = window.innerHeight * SCRUB_VH;
    if (max <= 0) return 0;
    var y = window.scrollY || window.pageYOffset || 0;
    var p = y / max;
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  function tick() {
    var target = targetProgress();
    current += (target - current) * EASE;             // lerp smoothing
    if (Math.abs(target - current) < 0.0005) current = target;
    for (var i = 0; i < vids.length; i++) {
      var v = vids[i], d = v.duration;
      if (d && isFinite(d) && d > 0) {
        var t = current * d;
        // avoid redundant seeks (reduces stutter)
        if (Math.abs(v.currentTime - t) > 0.01) {
          try { v.currentTime = t; } catch (e) {}
        }
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf == null) raf = requestAnimationFrame(tick);
  }

  // The hero <video> is created during Framer hydration — keep looking until it exists,
  // and re-patch if Framer re-renders the DOM.
  var tries = 0;
  var iv = setInterval(function () {
    var n = collect();
    if (n > 0) { start(); }
    if (n > 0 || ++tries > 80) { clearInterval(iv); }
  }, 200);

  var recollectQueued = false;
  var mo = new MutationObserver(function () {
    if (recollectQueued) return;
    recollectQueued = true;
    requestAnimationFrame(function () { recollectQueued = false; collect(); });
  });
  if (document.documentElement) {
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  window.addEventListener('resize', function () { /* max recomputed each tick */ }, { passive: true });
})();
