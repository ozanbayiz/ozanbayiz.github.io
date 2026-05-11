'use client'

/**
 * Theming has two orthogonal axes:
 *   - light/dark — managed by next-themes (`ThemeProvider`), driven by sunrise/sunset.
 *     Affects ink mode only; color mode is locked to a fixed theme.
 *   - ink/color   — managed by `ModeProvider` (style-mode), data-mode on <html>.
 */

import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'

import { ModeProvider } from '@/lib/mode-context'
import { isDaytime } from '@/lib/sun'

/** Sync theme to sunrise/sunset every 60 seconds. */
function SunThemeEffect() {
    const { setTheme } = useTheme()

    useEffect(() => {
        const sync = () => setTheme(isDaytime() ? 'light' : 'dark')
        sync()
        const id = setInterval(sync, 60_000)
        return () => clearInterval(id)
    }, [setTheme])

    return null
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
        >
            <ModeProvider>
                <SunThemeEffect />
                {children}
            </ModeProvider>
        </ThemeProvider>
    )
}
