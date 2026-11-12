/* PhySim: on touch devices, ignore "resize" events where only the height changed
   (address bar showing/hiding while scrolling, on-screen keyboard). Many sims reset
   themselves on resize, which would otherwise interrupt a running simulation. */
(function () {
  if (!window.matchMedia || !matchMedia('(pointer: coarse)').matches) return;
  var w = window, add = w.addEventListener, rem = w.removeEventListener, map = new WeakMap();
  function wrap(fn) {
    if (map.has(fn)) return map.get(fn);
    var lastW = w.innerWidth;
    var g = function (e) {
      if (Math.abs(w.innerWidth - lastW) < 2) return;
      lastW = w.innerWidth;
      return typeof fn === 'function' ? fn.call(this, e) : fn.handleEvent(e);
    };
    map.set(fn, g);
    return g;
  }
  w.addEventListener = function (type, fn, opts) {
    if (type === 'resize' && fn) return add.call(this, type, wrap(fn), opts);
    return add.call(this, type, fn, opts);
  };
  w.removeEventListener = function (type, fn, opts) {
    if (type === 'resize' && fn && map.has(fn)) return rem.call(this, type, map.get(fn), opts);
    return rem.call(this, type, fn, opts);
  };
  var onr = null;
  try {
    Object.defineProperty(w, 'onresize', {
      configurable: true,
      get: function () { return onr; },
      set: function (fn) { if (onr) rem.call(w, 'resize', wrap(onr)); onr = fn; if (fn) add.call(w, 'resize', wrap(fn)); }
    });
  } catch (e) {}
})();

/* PhySim.touchPanZoom(el, onPan(dx, dy), onZoom(factor, cx, cy))
   One-finger drag pans, two-finger pinch zooms (and pans). Mouse input is left
   to the sim's own handlers. Used by sims whose canvases can be dragged/zoomed. */
window.PhySim = window.PhySim || {};
PhySim.touchPanZoom = function (el, onPan, onZoom) {
  el.style.touchAction = 'none';
  var pts = {}, prev = null;
  function snapshot() {
    var ids = Object.keys(pts);
    if (!ids.length) return null;
    var a = pts[ids[0]], b = pts[ids[1]] || a;
    return { n: ids.length, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
  }
  el.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    prev = snapshot();
  });
  el.addEventListener('pointermove', function (e) {
    if (!pts[e.pointerId]) return;
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var cur = snapshot();
    if (prev && cur && prev.n === cur.n) {
      if (onPan && (cur.x !== prev.x || cur.y !== prev.y)) onPan(cur.x - prev.x, cur.y - prev.y);
      if (onZoom && cur.n >= 2 && prev.d > 10 && cur.d > 10) {
        var r = el.getBoundingClientRect();
        onZoom(cur.d / prev.d, cur.x - r.left, cur.y - r.top);
      }
    }
    prev = cur;
    e.preventDefault();
  });
  function end(e) { delete pts[e.pointerId]; prev = snapshot(); }
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
};
