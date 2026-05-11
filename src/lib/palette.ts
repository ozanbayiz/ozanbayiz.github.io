/**
 * Color tokens (HSL triples — compose with `hsl(var(--name))`).
 *
 * Site theme is fixed: white background, black body text, fuchsia headers.
 * The canonical palette is defined in CSS (globals.css) — this file is the
 * source of truth for the underlying color values, kept for reference.
 */

export type ColorKey = 'black' | 'white' | 'fuchsia' | 'chartreuse' | 'cyan'

export const COLORS: Record<ColorKey, string> = {
    black: '0 0% 0%',
    white: '0 0% 100%',
    fuchsia: '312 100% 50%',     // #FF00CC
    chartreuse: '72 100% 50%',   // #CCFF00
    cyan: '192 100% 50%',        // #00CCFF
}
