'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

import { applyRandomHue } from '@/lib/hue'


export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        applyRandomHue()
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    applyRandomHue()
                }
            }
        })
        observer.observe(document.documentElement, { attributes: true })
        return () => observer.disconnect()
    }, [pathname])

    return (
        <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}
