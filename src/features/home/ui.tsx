/* Shared section chrome: the outer wrapper and the blackletter heading. */

import { cn } from '@/lib/utils'

type SectionProps = {
    children: React.ReactNode
    id?: string
    className?: string
    containerClassName?: string
}

export function Section({ children, id, className, containerClassName }: SectionProps) {
    return (
        <section id={id} className={cn('py-16 md:py-20', className)}>
            <div className={cn('container mx-auto max-w-screen-lg px-6 md:px-8', containerClassName)}>
                {children}
            </div>
        </section>
    )
}

/**
 * Section label rendered in blackletter display type.
 * Lowercase-led — all-caps textura is illegible; blackletter capitals are
 * decorative initials only.
 * Inherits foreground color so contrast is AA-safe across every (bg, fg) pair.
 */
export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn('font-display text-4xl md:text-5xl', className)}>
            {children}
        </h2>
    )
}
