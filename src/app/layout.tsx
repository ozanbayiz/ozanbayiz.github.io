import './globals.css'

import localFont from 'next/font/local'

import MoldTransition from '@/shared/ui/mold-transition'

import type { Metadata } from 'next'

/* Kept available as `font-serif` (e.g. for math-heavy article pages);
 * not preloaded — browsers only fetch it where it's actually used. */
const xits = localFont({
    src: [
        { path: '../fonts/XITS-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/XITS-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../fonts/XITS-Bold.woff2', weight: '700', style: 'normal' },
        { path: '../fonts/XITS-BoldItalic.woff2', weight: '700', style: 'italic' }
    ],
    variable: '--font-xits',
    display: 'swap',
    preload: false
})

const plexMono = localFont({
    src: [
        { path: '../fonts/IBMPlexMono-Text.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/IBMPlexMono-TextItalic.woff2', weight: '400', style: 'italic' },
        { path: '../fonts/IBMPlexMono-Bold.woff2', weight: '700', style: 'normal' }
    ],
    variable: '--font-plex-mono',
    display: 'swap'
})

/* Chomsky (Fredrick Brennan, OFL) — the site's blackletter: an
 * Old-English-style revival modeled on the New York Times nameplate,
 * so every letterform (C, z, …) reads conventionally to modern eyes.
 * Single weight, declared at 400 and 700 so bold requests reuse the
 * real outlines instead of synthesizing a faux bold. */
const gothic = localFont({
    src: [
        { path: '../fonts/Chomsky.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/Chomsky.woff2', weight: '700', style: 'normal' }
    ],
    variable: '--font-gothic',
    display: 'swap'
})

const calligra = localFont({
    src: '../fonts/Calligra.woff2',
    variable: '--font-calligra',
    display: 'swap'
})

const SITE_NAME = 'Ozan Bayiz'
const SITE_DESCRIPTION = 'Personal site of Ozan Bayiz — Computer Science at UC Berkeley.'

export const metadata: Metadata = {
    /* The tab reads as the domain; SITE_NAME stays the person for
     * OpenGraph cards and JSON-LD. */
    title: {
        default: 'ozanbayiz.net',
        template: '%s — ozanbayiz.net'
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL('https://ozanbayiz.github.io'),
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: '/',
        siteName: SITE_NAME,
        images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }]
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ['/og.png']
    },
    robots: {
        index: true,
        follow: true
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png'
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${xits.variable} ${plexMono.variable} ${gothic.variable} ${calligra.variable} font-sans antialiased overflow-x-hidden flex min-h-screen flex-col`}>
                {/* Card→page transition overlay: a project card's cloud
                  * floods the screen like growing mold, the navigation
                  * happens under the cover, and the black dissolves to
                  * reveal the page. Lives in the layout because it must
                  * survive the very navigation it covers. Transparent
                  * and inert when idle. */}
                <MoldTransition />
                <a
                    href='#main'
                    className='sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:text-foreground focus:border focus:border-foreground focus:px-stack focus:py-inline'
                >
                    Skip to content
                </a>
                {children}
            </body>
        </html>
    )
}
