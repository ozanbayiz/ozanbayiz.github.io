'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'

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
            <SunThemeEffect />
            {children}
        </ThemeProvider>
    )
}
