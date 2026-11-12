/* Shared helper for every PhySim simulation: adds a "back to all simulations" button
   (hidden when the page is embedded in an iframe, e.g. Google Sites). */
(function () {
  // Collapsible control panels: <div data-physim-panel="Controls">
  var panels = document.querySelectorAll('[data-physim-panel]');
  if (panels.length) {
    document.body.classList.add('physim-has-panel');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'physim-panel-toggle';
    var name = panels[0].getAttribute('data-physim-panel') || 'Controls';
    function label() {
      var hidden = panels[0].classList.contains('physim-collapsed');
      btn.textContent = (hidden ? 'Show ' : 'Hide ') + name;
      btn.setAttribute('aria-expanded', String(!hidden));
    }
    btn.addEventListener('click', function () {
      for (var i = 0; i < panels.length; i++) panels[i].classList.toggle('physim-collapsed');
      label();
    });
    label();
    document.body.appendChild(btn);
  }
})();

(function () {
  var inFrame = false;
  try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  if (inFrame) return;
  var root = document.currentScript && document.currentScript.getAttribute('data-root') || '../';
  var a = document.createElement('a');
  a.className = 'physim-home';
  a.href = root;
  a.title = 'All simulations';
  a.setAttribute('aria-label', 'Back to all simulations');
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg><span>All sims</span>';
  document.body.appendChild(a);
})();
