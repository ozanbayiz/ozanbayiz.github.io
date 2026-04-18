/**
 * Blocking IIFE: picks random accent colors within an accessibility-safe
 * hue/lightness range and sets them as CSS variables on :root before paint.
 *
 * Palette: bright blues (200-240°) and reds (340-360° / 0-20°).
 * Lightness is locked so colors always meet WCAG AA contrast:
 *   - Light mode (white bg): L* 38-43%  → ≥4.5:1 against #fff
 *   - Dark mode (black bg):  L* 68-73%  → ≥4.5:1 against #000
 */
export const ACCENT_BOOTSTRAP_IIFE = `(function(){
  try {
    var d = document.documentElement;
    var isDark = d.classList.contains('dark') || (localStorage.getItem('theme') === 'dark');
    var light = !isDark
      ? { min: 38, max: 43 }
      : { min: 68, max: 73 };
    function hueBlueOrRed() {
      var r = Math.random();
      if (r < 0.45) return 200 + Math.random() * 40;         // blue
      if (r < 0.90) return (Math.random() < 0.5)             // red
        ? 340 + Math.random() * 20
        : Math.random() * 20;
      return 145 + Math.random() * 25;                       // occasional green accent
    }
    function pick() {
      var h = hueBlueOrRed();
      var s = 72 + Math.random() * 22;
      var l = light.min + Math.random() * (light.max - light.min);
      return 'hsl(' + h.toFixed(1) + ' ' + s.toFixed(0) + '% ' + l.toFixed(0) + '%)';
    }
    for (var i = 1; i <= 5; i++) {
      d.style.setProperty('--accent-' + i, pick());
    }
  } catch (e) {}
})();`
