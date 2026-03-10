'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useMounted } from '@/hooks/useMounted'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const mounted = useMounted()

    if (!mounted) {
        return (
            <button
                className={cn(
                    'flex items-center justify-center hover:text-accent1 transition-all duration-300',
                    className
                )}
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5" />
            </button>
        )
    }

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
                'flex items-center justify-center hover:text-accent1 transition-all duration-300',
                className
            )}
            aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
            }
        >
            {isDark ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    )
}
