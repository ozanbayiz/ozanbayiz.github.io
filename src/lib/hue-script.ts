import { HUES } from './palette'

/**
 * Blocking IIFE injected into <head> via dangerouslySetInnerHTML.
 * Runs before first paint to prevent a flash of default-purple.
 *
 * Duplicates palette.ts math because this executes before React hydration.
 * The HUES array is shared via the import above.
 */
export const HUE_BOOTSTRAP_IIFE = `
(function(){
  try {
    var dataMode = document.documentElement.dataset.mode || 'color';
    if (dataMode === 'ink' || dataMode === 'clean') return;
    var hues = ${JSON.stringify(HUES)};
    var H = hues[Math.floor(Math.random() * hues.length)];
    var S = 100;
    function srgb(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function hsl2rgb(h, s, l) {
      var C = (1 - Math.abs(2 * l - 1)) * s, X = C * (1 - Math.abs((h / 60 % 2) - 1));
      var r = 0, g = 0, b = 0, k = h / 60;
      if (k < 1) { r = C; g = X; } else if (k < 2) { r = X; g = C; }
      else if (k < 3) { g = C; b = X; } else if (k < 4) { g = X; b = C; }
      else if (k < 5) { r = X; b = C; } else { r = C; b = X; }
      var m = l - C / 2; return [r + m, g + m, b + m];
    }
    function lum(h, s, l) {
      var c = hsl2rgb(h, s / 100, l / 100);
      return 0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2]);
    }
    function cL(hue, dk) {
      var tY = dk ? 4.5 * 0.05 - 0.05 : 1.05 / 4.5 - 0.05;
      var lo = 0, hi = 100, l = dk ? 66 : 50;
      for (var i = 0; i < 14; i++) {
        var y = lum(hue, S, l);
        if (!dk) { y <= tY ? (lo = l, l = (l + hi) / 2) : (hi = l, l = (l + lo) / 2); }
        else { y >= tY ? (hi = l, l = (l + lo) / 2) : (lo = l, l = (l + hi) / 2); }
      }
      return Math.max(0, Math.min(100, l));
    }
    function mode(dk) {
      var aL = dk ? Math.max(cL(H, true), 64) : cL(H, false);
      var mL = dk ? Math.min(100, aL + 30) : Math.max(0, aL - 30);
      var off = [-40, 0, 40, 80, 120], g = '';
      for (var i = 0; i < 5; i++) {
        var gh = (H + off[i] + 360) % 360;
        var gl = dk ? Math.max(cL(gh, true), 64) : cL(gh, false);
        g += '; --g' + (i + 1) + ': ' + gh + ' ' + S + '% ' + gl + '%';
      }
      return '--hue: ' + H + '; --accent1: ' + H + ' ' + S + '% ' + aL + '%; --accent2: ' + H + ' ' + S + '% ' + mL + '%' + g;
    }
    var el = document.createElement('style');
    el.id = 'dynamic-accents';
    el.innerHTML = ':root { ' + mode(false) + ' } .dark { ' + mode(true) + ' }';
    document.head.appendChild(el);
  } catch(e) {}
})();
`
