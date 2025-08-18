export function applyRandomHue(): void {
    try {
        const hues = [0, 20, 30, 40, 50, 65, 120, 140, 160, 190, 200, 210, 230, 250, 270, 300, 340]
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
        const ensureContrast = (h: number, sPct: number, initialLPct: number, darkMode: boolean): number => {
            // Targets vs white or black background
            const minRatio = 4.5
            const targetYAgainstWhite = (1.0 + 0.05) / minRatio - 0.05 // ~0.1833 max luminance when bg is white
            const targetYAgainstBlack = minRatio * 0.05 - 0.05 // ~0.175 min luminance when bg is black
            let low = 0, high = 100
            let l = initialLPct
            for (let i = 0; i < 14; i++) {
                const y = relativeLuminance(h, sPct, l)
                if (!darkMode) {
                    // Need y <= target vs white (make darker)
                    if (y <= targetYAgainstWhite) {
                        // try a bit lighter but keep within bound
                        low = l
                        l = (l + high) / 2
                    } else {
                        high = l
                        l = (l + low) / 2
                    }
                } else {
                    // Need y >= target vs black (make brighter)
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

        if (!isDark) {
            const s = 100
            const lMain = ensureContrast(H, s, 50, false)
            const l2 = Math.max(0, lMain - 14)
            const l3 = Math.min(100, lMain + 14)
            const l4 = Math.min(100, lMain + 30)
            setVar('--accent', H, s, lMain)
            setVar('--accent2', H, s, l2)
            setVar('--accent3', H, s, l3)
            setVar('--accent4', H, s, l4)
            root.style.setProperty('--accent-foreground', '0 0% 100%')
        } else {
            const s = 80
            const lMain = ensureContrast(H, s, 66, true)
            const l2 = Math.max(0, lMain - 16)
            const l3 = Math.min(100, lMain + 8)
            const l4 = Math.min(100, lMain + 20)
            setVar('--accent', H, s, lMain)
            setVar('--accent2', H, s, l2)
            setVar('--accent3', H, s, l3)
            setVar('--accent4', H, s, l4)
            root.style.setProperty('--accent-foreground', '0 0% 100%')
        }
    } catch {
        // no-op
    }
}


