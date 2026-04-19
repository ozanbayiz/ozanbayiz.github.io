import './globals.css'

import { Providers } from '@/app/providers'
import { THEME_BOOTSTRAP_IIFE } from '@/lib/theme-script'

import type { Metadata } from 'next'

const SITE_NAME = 'Ozan Bayiz'
const SITE_DESCRIPTION = 'CS for Education @ Berkeley — projects, research, and notes by Ozan Bayiz.'

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
            <head>
                <link rel='preload' href='/fonts/cmu-serif-500-roman.woff2' as='font' type='font/woff2' crossOrigin='anonymous' />
                <link rel='preload' href='/fonts/cmu-serif-700-roman.woff2' as='font' type='font/woff2' crossOrigin='anonymous' />
            </head>
            <body className='antialiased overflow-x-hidden'>
                <a
                    href='#main'
                    className='sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:text-foreground focus:border focus:border-foreground focus:px-3 focus:py-2'
                >
                    Skip to content
                </a>
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_IIFE }} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
