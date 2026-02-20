import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

export default {
    darkMode: ['class'],
    content: [
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
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                accent1: 'hsl(var(--accent1))',
                accent2: 'hsl(var(--accent2))',
                border: 'hsl(var(--foreground))',
                input: 'hsl(var(--foreground))',
                ring: 'hsl(var(--foreground))',

                // Keep Shadcn structure mapped to strict palette to avoid crashes if any component uses them implicitly
                primary: {
                    DEFAULT: 'hsl(var(--foreground))',
                    foreground: 'hsl(var(--background))'
                },
                card: {
                    DEFAULT: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent1))',
                    foreground: 'hsl(var(--background))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--foreground))',
                    foreground: 'hsl(var(--background))'
                }
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
    plugins: [animate, typography]
} satisfies Config
