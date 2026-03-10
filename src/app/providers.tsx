'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { useEffect, useRef } from 'react'

import { generatePalette, randomHue } from '@/lib/palette'

/** Re-randomize accent hue on SPA route changes. IIFE handles first paint;
 *  theme toggle is pure CSS (the style tag has both :root and .dark rules). */
function HueEffect() {
    const pathname = usePathname()
    const isFirstMount = useRef(true)

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false
            return
        }
        const tag = document.getElementById('dynamic-accents')
        if (tag) tag.innerHTML = generatePalette(randomHue())
    }, [pathname])

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
            enableSystem
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
        >
            <HueEffect />
            {children}
        </ThemeProvider>
    )
}
