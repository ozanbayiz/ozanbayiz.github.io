/**
 * 60-30-10 palette generator
 *
 *   60 %  dominant   --background  (pure white / black, static in globals.css)
 *   30 %  secondary  --foreground  (pure black / white, static in globals.css)
 *   10 %  accent     --accent1, --accent2, --g1…g5  (dynamic, from random hue)
 *
 * Every chromatic value is contrast-checked per-hue against the mode's
 * background (white in light, black in dark) to meet WCAG AA 4.5 : 1.
 */

/** Curated hue palette — neon-leaning stops that read vividly at full saturation */
export const HUES = [50, 90, 120, 140, 155, 170, 185, 200, 215, 235, 255, 270, 285, 300, 315, 330, 345]

const S = 100
const GRAD_OFFSETS = [-40, 0, 40, 80, 120]

// ── Color math (WCAG 2.1) ───────────────────────────────────────────

function srgbToLinear(c: number) {
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const C = (1 - Math.abs(2 * l - 1)) * s
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
    let r = 0, g = 0, b = 0
    const k = h / 60
    if (k < 1) { r = C; g = X }
    else if (k < 2) { r = X; g = C }
    else if (k < 3) { g = C; b = X }
    else if (k < 4) { g = X; b = C }
    else if (k < 5) { r = X; b = C }
    else { r = C; b = X }
    const m = l - C / 2
    return [r + m, g + m, b + m]
}

function luminance(h: number, s: number, l: number) {
    const [r, g, b] = hslToRgb(h, s / 100, l / 100)
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

/** Binary-search for the HSL lightness that just meets 4.5:1 contrast vs background. */
function contrastL(hue: number, sat: number, dark: boolean): number {
    const targetY = dark ? 4.5 * 0.05 - 0.05 : 1.05 / 4.5 - 0.05
    let lo = 0, hi = 100, l = dark ? 66 : 50
    for (let i = 0; i < 14; i++) {
        const y = luminance(hue, sat, l)
        if (!dark) { y <= targetY ? (lo = l, l = (l + hi) / 2) : (hi = l, l = (l + lo) / 2) }
        else { y >= targetY ? (hi = l, l = (l + lo) / 2) : (lo = l, l = (l + hi) / 2) }
    }
    return Math.max(0, Math.min(100, l))
}

// ── Palette ──────────────────────────────────────────────────────────

function modeVars(H: number, dark: boolean): string {
    // Primary accent — the 10 % color
    const accentL = dark ? Math.max(contrastL(H, S, true), 64) : contrastL(H, S, false)
    // Muted accent — shifted 30 lightness units toward background
    const mutedL = dark ? Math.min(100, accentL + 30) : Math.max(0, accentL - 30)
    // Gradient stops — 5 hue-shifted accents across a 160° arc, each contrast-checked
    const grads = GRAD_OFFSETS.map((offset, i) => {
        const gh = (H + offset + 360) % 360
        const gl = dark ? Math.max(contrastL(gh, S, true), 64) : contrastL(gh, S, false)
        return `--g${i + 1}: ${gh} ${S}% ${gl}%`
    }).join('; ')

    return `--hue: ${H}; --accent1: ${H} ${S}% ${accentL}%; --accent2: ${H} ${S}% ${mutedL}%; ${grads}`
}

/** Full CSS for the <style id="dynamic-accents"> tag — both light and dark rules. */
export function generatePalette(H: number): string {
    return `:root { ${modeVars(H, false)} } .dark { ${modeVars(H, true)} }`
}

export function randomHue(): number {
    return HUES[Math.floor(Math.random() * HUES.length)]!
}
