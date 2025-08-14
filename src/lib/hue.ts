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
        if (!isDark) {
            setVar('--accent', H, 100, 50)
            setVar('--accent2', H, 100, 36)
            setVar('--accent3', H, 100, 64)
            setVar('--accent4', H, 100, 80)
            root.style.setProperty('--accent-foreground', '0 0% 100%')
        } else {
            setVar('--accent', H, 80, 66)
            setVar('--accent2', H, 80, 50)
            setVar('--accent3', H, 80, 74)
            setVar('--accent4', H, 80, 86)
            root.style.setProperty('--accent-foreground', '0 0% 100%')
        }
    } catch {
        // no-op
    }
}


