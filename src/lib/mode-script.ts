/**
 * Blocking IIFE injected into <body> via dangerouslySetInnerHTML.
 * Sets data-mode on <html> before first paint to prevent FOUC.
 * Must run BEFORE the hue bootstrap script.
 */
export const MODE_BOOTSTRAP_IIFE = `
(function(){
  try {
    var m = localStorage.getItem('style-mode');
    document.documentElement.dataset.mode =
      (m === 'color' || m === 'clean') ? m : 'ink';
  } catch(e) { document.documentElement.dataset.mode = 'ink'; }
})();
`
