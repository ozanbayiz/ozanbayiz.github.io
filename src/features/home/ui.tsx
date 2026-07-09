/* Shared section chrome: the outer wrapper and the blackletter heading. */

import { cn } from '@/lib/utils'

type SectionProps = {
    children: React.ReactNode
    id?: string
    className?: string
    containerClassName?: string
    /** Wrap the content in an inset black rectangle (.section-fill) —
     * contained within the content column, not full-bleed. */
    fill?: boolean
}

export function Section({ children, id, className, containerClassName, fill }: SectionProps) {
    return (
        <section id={id} className={cn('py-8 md:py-10', className)}>
            <div className={cn('container mx-auto max-w-screen-lg px-6 md:px-8', containerClassName)}>
                {fill ? (
                    <div className="section-fill p-6 md:p-10">{children}</div>
                ) : (
                    children
                )}
            </div>
        </section>
    )
}

/**
 * Section label in blackletter display type, in the section's own color
 * (each homepage section owns a hue: ozanbayiz? = fuchsia [default],
 * research = cyan via className, favorites = chartreuse when it returns).
 * Document pages stay monochrome.
 * Title-case is fine — Prescius capitals stay legible; avoid full
 * `uppercase` transforms, which trade away the textura rhythm.
 */
export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn('font-display text-4xl md:text-5xl text-accent1-text', className)}>
            {children}
        </h2>
    )
}
