export function applyRandomHue(): void {
    try {
        // Neon-leaning palette (high-chroma stops that read vividly)
        const hues = [50, 90, 120, 140, 155, 170, 185, 200, 215, 235, 255, 270, 285, 300, 315, 330, 345]
        const idx = Math.floor(Math.random() * hues.length)
        const H: number = hues[idx] as number
        const root = document.documentElement
        const isDark = root.classList.contains('dark')
        const setVar = (name: string, h: number, s: number, l: number) => {
            root.style.setProperty(name, `${h} ${s}% ${l}%`)
        }

        // Contrast helpers (WCAG 2.1): ensure accent vs bg (white in light, black in dark) >= 4.5:1
        const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
        const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
            const C = (1 - Math.abs(2 * l - 1)) * s
            const Hprime = h / 60
            const X = C * (1 - Math.abs((Hprime % 2) - 1))
            let r: number = 0, g: number = 0, b: number = 0
            if (0 <= Hprime && Hprime < 1) [r, g, b] = [C, X, 0]
            else if (1 <= Hprime && Hprime < 2) [r, g, b] = [X, C, 0]
            else if (2 <= Hprime && Hprime < 3) [r, g, b] = [0, C, X]
            else if (3 <= Hprime && Hprime < 4) [r, g, b] = [0, X, C]
            else if (4 <= Hprime && Hprime < 5) [r, g, b] = [X, 0, C]
            else if (5 <= Hprime && Hprime < 6) [r, g, b] = [C, 0, X]
            const m = l - C / 2
            return [r + m, g + m, b + m]
        }
        const relativeLuminance = (h: number, sPct: number, lPct: number) => {
            const s = sPct / 100
            const l = lPct / 100
            const [r, g, b] = hslToRgb(h, s, l)
            const R = srgbToLinear(r)
            const G = srgbToLinear(g)
            const B = srgbToLinear(b)
            return 0.2126 * R + 0.7152 * G + 0.0722 * B
        }
        // Ensure minimum text contrast vs background (AA 4.5:1)
        const ensureContrast = (h: number, sPct: number, initialLPct: number, darkMode: boolean): number => {
            const minRatio = 4.5
            const targetYAgainstWhite = (1.0 + 0.05) / minRatio - 0.05 // ~0.1833
            const targetYAgainstBlack = minRatio * 0.05 - 0.05 // ~0.175
            let low = 0, high = 100
            let l = initialLPct
            for (let i = 0; i < 14; i++) {
                const y = relativeLuminance(h, sPct, l)
                if (!darkMode) {
                    if (y <= targetYAgainstWhite) {
                        low = l
                        l = (l + high) / 2
                    } else {
                        high = l
                        l = (l + low) / 2
                    }
                } else {
                    if (y >= targetYAgainstBlack) {
                        high = l
                        l = (l + low) / 2
                    } else {
                        low = l
                        l = (l + high) / 2
                    }
                }
            }
            return Math.max(0, Math.min(100, l))
        }

        // Neon intent: fully saturated; push brighter in dark mode while preserving contrast
        const s = 100
        const baseL = ensureContrast(H, s, isDark ? 66 : 50, isDark)
        const lMain = isDark ? Math.max(baseL, 64) : baseL

        setVar('--accent', H, s, lMain)
        // Tiering for neon look (glow-like lighter tiers and a slightly darker pressed tier)
        const l2 = Math.max(0, lMain - (isDark ? 8 : 12))
        const l3 = Math.min(100, lMain + (isDark ? 12 : 10))
        const l4 = Math.min(100, lMain + (isDark ? 24 : 18))
        setVar('--accent2', H, s, l2)
        setVar('--accent3', H, s, l3)
        setVar('--accent4', H, s, l4)

        // Foreground on accent backgrounds (for badges/buttons/etc.)
        const y = relativeLuminance(H, s, lMain)
        const accentFg = y > 0.5 ? '0 0% 0%' : '0 0% 100%'
        root.style.setProperty('--accent-foreground', accentFg)
    } catch {
        // no-op
    }
}


