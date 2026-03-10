'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

type RevealProps = {
    children: React.ReactNode
    className?: string
    variant?: 'up' | 'scale'
    delay?: number
}

export function Reveal({ children, className, variant = 'up', delay }: RevealProps) {
    const ref = useReveal()

    return (
        <div
            ref={ref}
            className={cn(`reveal-${variant}`, className)}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    )
}
