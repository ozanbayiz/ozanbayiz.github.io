'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import { useModeContext, ModeProvider } from '@/lib/mode-context'
import { generatePalette, randomHue } from '@/lib/palette'
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

/** Re-randomize accent hue on SPA route changes. IIFE handles first paint. */
function HueEffect() {
    const pathname = usePathname()
    const { mode } = useModeContext()
    const isFirstMount = useRef(true)

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false
            return
        }
        const tag = document.getElementById('dynamic-accents')
        if (mode === 'ink' || mode === 'clean') {
            if (tag) tag.innerHTML = ''
        } else {
            if (tag) tag.innerHTML = generatePalette(randomHue())
        }
    }, [pathname, mode])

    return null
}

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        let frame: number
        const onMove = (e: MouseEvent) => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) * 100
                const y = (e.clientY / window.innerHeight) * 100
                document.documentElement.style.setProperty('--mouse-x', `${x}%`)
                document.documentElement.style.setProperty('--mouse-y', `${y}%`)
            })
        }
        window.addEventListener('mousemove', onMove)
        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
        >
            <ModeProvider>
                <SunThemeEffect />
                <HueEffect />
                {children}
            </ModeProvider>
        </ThemeProvider>
    )
}
