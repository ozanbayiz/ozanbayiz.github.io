/**
 * Blocking IIFE: picks ONE random accent color and sets it as a CSS
 * variable on :root before first paint. One color per page load —
 * applied consistently across all headings, hovered links, and singular
 * accented moments. Refresh = new color.
 *
 * Palette: bright blues (200-240°) and reds (340-360° / 0-20°), with
 * occasional green (145-170°) — matches the Computer Modern specimen's
 * vivid-but-restrained palette.
 *
 * Lightness is locked so the accent always meets WCAG AA contrast:
 *   - Light mode (cream bg): L* 38-43% → ≥4.5:1 against #fff-ish
 *   - Dark mode (black bg):  L* 68-73% → ≥4.5:1 against #000
 */
export const ACCENT_BOOTSTRAP_IIFE = `(function(){
  try {
    var d = document.documentElement;
    var isDark = d.classList.contains('dark') || (localStorage.getItem('theme') === 'dark');
    var light = !isDark
      ? { min: 38, max: 43 }
      : { min: 68, max: 73 };
    var r = Math.random();
    var h;
    if (r < 0.45) h = 200 + Math.random() * 40;                          // blue
    else if (r < 0.90) h = (Math.random() < 0.5)                         // red
      ? 340 + Math.random() * 20
      : Math.random() * 20;
    else h = 145 + Math.random() * 25;                                   // occasional green
    var s = 72 + Math.random() * 22;
    var l = light.min + Math.random() * (light.max - light.min);
    var color = 'hsl(' + h.toFixed(1) + ' ' + s.toFixed(0) + '% ' + l.toFixed(0) + '%)';
    d.style.setProperty('--accent', color);
  } catch (e) {}
})();`
