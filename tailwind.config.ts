import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

export default {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
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
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            // theme param type provided by plugin util; keeping as unknown-compatible
            typography: ({ theme }: { theme: (path: string) => string }) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.foreground'),
                        // Site-wide smaller body text for prose
                        p: {
                            fontSize: '0.875rem'
                        },
                        li: {
                            fontSize: '0.875rem'
                        },
                        code: {
                            fontSize: '0.875rem',
                            color: theme('colors.foreground'),
                            backgroundColor: 'transparent',
                            borderWidth: '1px',
                            borderColor: theme('colors.foreground'),
                            borderRadius: '0',
                            paddingLeft: '0.2em',
                            paddingRight: '0.2em',
                            paddingTop: '0.05em',
                            paddingBottom: '0.05em'
                        },
                        figcaption: {
                            fontSize: '0.8125rem'
                        },
                        a: {
                            color: 'inherit',
                            textDecorationLine: 'none',
                            transitionProperty: 'color',
                            transitionDuration: '150ms'
                        },
                        'a:hover': {
                            color: theme('colors.accent.DEFAULT')
                        },
                        strong: { color: theme('colors.foreground') },
                        em: { color: theme('colors.foreground') },
                        hr: { borderColor: theme('colors.foreground') },
                        blockquote: {
                            color: theme('colors.foreground'),
                            borderLeftColor: theme('colors.foreground')
                        },
                        'code::before': { content: 'none' },
                        'code::after': { content: 'none' },
                        pre: {
                            color: theme('colors.foreground'),
                            backgroundColor: theme('colors.background'),
                            borderWidth: '1px',
                            borderColor: theme('colors.foreground'),
                            boxShadow: 'none'
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            borderWidth: '0'
                        },
                        'ul > li::marker': { color: theme('colors.foreground') },
                        'ol > li::marker': { color: theme('colors.foreground') },
                        th: {
                            color: theme('colors.foreground')
                        },
                        thead: {
                            borderBottomColor: theme('colors.foreground')
                        },
                        'thead th': {
                            backgroundColor: 'transparent',
                            borderBottomColor: theme('colors.foreground')
                        },
                        'tbody tr': {
                            borderBottomColor: theme('colors.foreground')
                        }
                    }
                },
                invert: {
                    css: {
                        color: theme('colors.foreground'),
                        // Site-wide smaller body text for prose (dark)
                        p: {
                            fontSize: '0.875rem'
                        },
                        li: {
                            fontSize: '0.875rem'
                        },
                        code: {
                            fontSize: '0.875rem',
                            color: theme('colors.foreground'),
                            backgroundColor: 'transparent',
                            borderWidth: '1px',
                            borderColor: theme('colors.foreground'),
                            borderRadius: '0',
                            paddingLeft: '0.2em',
                            paddingRight: '0.2em',
                            paddingTop: '0.05em',
                            paddingBottom: '0.05em'
                        },
                        figcaption: {
                            fontSize: '0.8125rem'
                        },
                        a: {
                            color: 'inherit',
                            textDecorationLine: 'none',
                            transitionProperty: 'color',
                            transitionDuration: '150ms'
                        },
                        'a:hover': {
                            color: theme('colors.accent.DEFAULT')
                        },
                        strong: { color: theme('colors.foreground') },
                        em: { color: theme('colors.foreground') },
                        hr: { borderColor: theme('colors.foreground') },
                        blockquote: {
                            color: theme('colors.foreground'),
                            borderLeftColor: theme('colors.foreground')
                        },
                        'code::before': { content: 'none' },
                        'code::after': { content: 'none' },
                        pre: {
                            color: theme('colors.foreground'),
                            backgroundColor: theme('colors.background'),
                            borderWidth: '1px',
                            borderColor: theme('colors.foreground'),
                            boxShadow: 'none'
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            borderWidth: '0'
                        },
                        'ul > li::marker': { color: theme('colors.foreground') },
                        'ol > li::marker': { color: theme('colors.foreground') },
                        th: {
                            color: theme('colors.foreground')
                        },
                        thead: {
                            borderBottomColor: theme('colors.foreground')
                        },
                        'thead th': {
                            backgroundColor: 'transparent',
                            borderBottomColor: theme('colors.foreground')
                        },
                        'tbody tr': {
                            borderBottomColor: theme('colors.foreground')
                        }
                    }
                }
            }),
            fontSize: {
                '2xs': '0.6rem'
            },
            borderRadius: {
                DEFAULT: '0px',
                lg: '0px',
                md: '0px',
                sm: '0px',
                xl: '0px',
                '2xl': '0px',
                full: '9999px'
            }
        }
    },
    variants: {
        fill: ['hover', 'focus']
    },
    plugins: [animate, typography]
} satisfies Config
