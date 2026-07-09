import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
    content: [
        './src/*.tsx', // src-root files (mdx-components.tsx) — easy to miss
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/features/**/*.{js,ts,jsx,tsx,mdx}',
        './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
        './src/content/**/*.{md,mdx,js,ts,jsx,tsx}'
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem'
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-plex-mono)', 'monospace'],
                serif: ['var(--font-xits)', 'serif'],
                mono: ['var(--font-plex-mono)', 'monospace'],
                display: ['var(--font-gothic)', 'serif'],
                script: ['var(--font-calligra)', 'cursive'],
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                accent1: 'hsl(var(--accent1))',
                accent2: 'hsl(var(--accent2))',
                accent3: 'hsl(var(--accent3))',
                /* Text-safe variants: dark on white surfaces, light inside
                 * .section-fill (the vars swap per surface). */
                'accent1-text': 'hsl(var(--accent1-text))',
                'accent2-text': 'hsl(var(--accent2-text))',
                'accent3-text': 'hsl(var(--accent3-text))',
                border: 'hsl(var(--foreground))',
                input: 'hsl(var(--foreground))',
                ring: 'hsl(var(--foreground))'
            },
            fontSize: {
                '2xs': '0.6rem'
            }
        },
        borderRadius: {
            DEFAULT: '0px',
            lg: '0px',
            md: '0px',
            sm: '0px',
            xl: '0px',
            '2xl': '0px',
            full: '9999px'
        },
        keyframes: {
            scroll: {
                to: {
                    transform: 'translate(calc(-50% + 0.5rem))'
                }
            }
        },
        animation: {
            scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, normal) linear infinite'
        }
    },
    variants: {
        fill: ['hover', 'focus']
    },
    plugins: [animate]
} satisfies Config
