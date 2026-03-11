import './globals.css'

import { Inter, JetBrains_Mono, Baskervville } from 'next/font/google'

import { Providers } from '@/app/providers'
import { HUE_BOOTSTRAP_IIFE } from '@/lib/hue-script'
import { MODE_BOOTSTRAP_IIFE } from '@/lib/mode-script'
import { THEME_BOOTSTRAP_IIFE } from '@/lib/theme-script'

import type { Metadata } from 'next'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin']
})

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin']
})

const baskervville = Baskervville({
    variable: '--font-baskervville',
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal', 'italic'],
})

export const metadata: Metadata = {
    title: 'ozanbayiz',
    description: 'ozanbayiz',
    metadataBase: new URL('https://ozanbayiz.github.io'),
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        title: 'ozanbayiz',
        description: 'ozanbayiz',
        url: '/',
        siteName: 'ozanbayiz',
        images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ozanbayiz' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ozanbayiz',
        description: 'ozanbayiz'
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
            <body className={`${inter.variable} ${jetBrainsMono.variable} ${baskervville.variable} antialiased overflow-x-hidden`}>
                <script dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP_IIFE }} />
                <script dangerouslySetInnerHTML={{ __html: HUE_BOOTSTRAP_IIFE }} />
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_IIFE }} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
