/**
 * Blocking IIFE injected into <body> via dangerouslySetInnerHTML.
 * Sets data-mode on <html> before first paint to prevent FOUC.
 * Must run BEFORE the pair bootstrap script.
 */
export const MODE_BOOTSTRAP_IIFE = `
(function(){
  try {
    var m = localStorage.getItem('style-mode');
    document.documentElement.dataset.mode = (m === 'ink') ? 'ink' : 'color';
  } catch(e) { document.documentElement.dataset.mode = 'color'; }
})();
`
