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

/** Track mouse position as unitless 0-100 values on :root.
 *  --mx feeds ROND, --my feeds GRAD in .type-mouse-axes elements. */
function MouseTracker() {
    useEffect(() => {
        let frame: number
        const onMove = (e: MouseEvent) => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const x = Math.round((e.clientX / window.innerWidth) * 100)
                const y = Math.round((e.clientY / window.innerHeight) * 100)
                document.documentElement.style.setProperty('--mx', String(x))
                document.documentElement.style.setProperty('--my', String(y))
            })
        }
        window.addEventListener('mousemove', onMove)
        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(frame)
        }
    }, [])

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
            <MouseTracker />
            {children}
        </ThemeProvider>
    )
}
