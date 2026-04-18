import './globals.css'
import 'computer-modern/cmu-serif.css'
import 'computer-modern/cmu-typewriter-text.css'

import { Providers } from '@/app/providers'
import { THEME_BOOTSTRAP_IIFE } from '@/lib/theme-script'

import type { Metadata } from 'next'

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
            <body className='antialiased overflow-x-hidden'>
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_IIFE }} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
