import './globals.css'

import localFont from 'next/font/local'

import { Providers } from '@/app/providers'
import { MODE_BOOTSTRAP_IIFE } from '@/lib/mode-script'
import { THEME_BOOTSTRAP_IIFE } from '@/lib/theme-script'

import type { Metadata } from 'next'

const xits = localFont({
    src: [
        { path: '../fonts/XITS-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/XITS-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../fonts/XITS-Bold.woff2', weight: '700', style: 'normal' },
        { path: '../fonts/XITS-BoldItalic.woff2', weight: '700', style: 'italic' }
    ],
    variable: '--font-xits',
    display: 'swap'
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

const gothic = localFont({
    src: [
        { path: '../fonts/GothicTexturaPrescius-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/GothicTexturaPrescius-Bold.woff2', weight: '700', style: 'normal' }
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
    title: {
        default: SITE_NAME,
        template: '%s — Ozan Bayiz'
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
        <html lang='en' suppressHydrationWarning>
            <body className={`${xits.variable} ${plexMono.variable} ${gothic.variable} ${calligra.variable} font-sans antialiased overflow-x-hidden`}>
                <a
                    href='#main'
                    className='sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:text-foreground focus:border focus:border-foreground focus:px-3 focus:py-2'
                >
                    Skip to content
                </a>
                <script dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP_IIFE }} />
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_IIFE }} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
