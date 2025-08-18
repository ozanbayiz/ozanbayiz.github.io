import './globals.css'
import 'katex/dist/katex.min.css'

import { JetBrains_Mono } from 'next/font/google'

import { Providers } from '@/app/providers'
import { HUE_BOOTSTRAP_IIFE } from '@/lib/hue-script'

import type { Metadata } from 'next'

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'ozanbayiz',
    description: 'ozanbayiz',
    metadataBase: new URL('https://ozanbayiz.github.io'),
    alternates: { canonical: '/' },
    openGraph: {
        title: 'ozanbayiz',
        description: 'ozanbayiz',
        url: '/',
        siteName: 'ozanbayiz'
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
            <body className={`${jetBrainsMono.variable} antialiased`}>
                <script dangerouslySetInnerHTML={{ __html: HUE_BOOTSTRAP_IIFE }} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
