/**
 * Blocking IIFE injected into <body> via dangerouslySetInnerHTML.
 * Calculates sunrise/sunset and sets light/dark class before first paint.
 * Duplicates sun.ts math since this runs pre-React.
 */
export const THEME_BOOTSTRAP_IIFE = `
(function(){
  try {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 0);
    var doy = Math.floor((d.getTime() - start.getTime()) / 86400000);
    var DEG = Math.PI / 180;
    var decl = -23.44 * DEG * Math.cos(2 * Math.PI / 365 * (doy + 10));
    var latRad = 40 * DEG;
    var cosOmega = -Math.tan(latRad) * Math.tan(decl);
    var day;
    if (cosOmega < -1) { day = true; }
    else if (cosOmega > 1) { day = false; }
    else {
      var omega = Math.acos(cosOmega) / DEG;
      var B = 2 * Math.PI / 365 * (doy - 81);
      var EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
      var solarNoon = 12 - EoT / 60;
      var sunrise = solarNoon - omega / 15;
      var sunset = solarNoon + omega / 15;
      var h = d.getHours() + d.getMinutes() / 60;
      day = h >= sunrise && h < sunset;
    }
    document.documentElement.classList.toggle('dark', !day);
    localStorage.setItem('theme', day ? 'light' : 'dark');
  } catch(e) {}
})();
`
