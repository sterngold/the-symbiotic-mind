// GA4 (G-KWP96516NC) bootstrap + Consent Mode v2 + lightweight cookie banner.
//
// External same-origin script (served at /ga.js via Eleventy `src/static` passthrough).
// Using an external file keeps this portable across the portfolio and CSP-safe.
//
// Behaviour: analytics_storage defaults to DENIED (GA4 runs cookieless, GDPR-safe).
// The banner shows only until the visitor chooses. Accept -> grant (cookies + full
// data) and remember it; Decline -> stays cookieless. Choice persists in localStorage.
// Runs alongside the always-cookieless Umami tag.
(function () {
  var MEASUREMENT_ID = 'G-KWP96516NC';
  var KEY = 'ga-consent';
  var GRANT = {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — default DENY (cookieless) until the visitor opts in.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  // Returning visitor who already accepted -> grant before config so cookies work immediately.
  if (choice === 'granted') gtag('consent', 'update', GRANT);

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  // Already chose? Don't show the banner.
  if (choice === 'granted' || choice === 'denied') return;

  var bar;
  function decide(granted) {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (e) {}
    if (granted) gtag('consent', 'update', GRANT);
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
  }

  function mkBtn(label, primary) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText =
      'cursor:pointer;border-radius:6px;padding:8px 16px;font:500 13px/1 inherit;' +
      'border:1px solid ' + (primary ? '#e8e8e8' : 'rgba(255,255,255,.4)') + ';' +
      'background:' + (primary ? '#e8e8e8' : 'transparent') + ';' +
      'color:' + (primary ? '#1c1c1e' : '#e8e8e8') + ';';
    return b;
  }

  function initBanner() {
    bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:#1c1c1e;' +
      'color:#e8e8e8;border-top:1px solid rgba(255,255,255,.12);padding:14px 18px;' +
      'font:14px/1.5 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;display:flex;' +
      'flex-wrap:wrap;gap:12px 16px;align-items:center;justify-content:center;' +
      'box-shadow:0 -4px 24px rgba(0,0,0,.35)';

    var txt = document.createElement('span');
    txt.style.cssText = 'flex:1 1 320px;min-width:240px;max-width:640px';
    txt.textContent =
      'This site uses privacy-friendly analytics. May we also use Google Analytics ' +
      'cookies to understand usage?';

    var group = document.createElement('div');
    group.style.cssText = 'display:flex;gap:10px;flex:0 0 auto';
    var decline = mkBtn('Decline', false);
    var accept = mkBtn('Accept', true);
    decline.addEventListener('click', function () { decide(false); });
    accept.addEventListener('click', function () { decide(true); });
    group.appendChild(decline);
    group.appendChild(accept);

    bar.appendChild(txt);
    bar.appendChild(group);
    (document.body || document.documentElement).appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();
