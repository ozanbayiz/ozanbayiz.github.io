/* Shared section chrome: the outer wrapper and the blackletter heading. */

import { cn } from '@/lib/utils'
import { CONTENT_INSET_X, Container } from '@/shared/ui/container'

export { CONTENT_INSET_X }

/** The square interior frame of a filled region — one inset on all four
 * sides. Its horizontal half IS the content column's CONTENT_INSET_X,
 * which is what keeps a fill-box's content on the page's left edge. */
export const CONTENT_INSET = 'p-inset'

type SectionProps = {
    children: React.ReactNode
    id?: string
    className?: string
    containerClassName?: string
    /** Wrap the content in an inset black rectangle (.section-fill) —
     * contained within the content column, not full-bleed. */
    fill?: boolean
}

/**
 * A Section has no intrinsic vertical rhythm; the page composes seams.
 * Every major block carries its own `pt-seam` (and the about rectangle
 * both `py-seam`, because both of its bands must be white) — pass the
 * seam classes via className. See the rhythm comment in app/page.tsx.
 */
export function Section({ children, id, className, containerClassName, fill }: SectionProps) {
    return (
        <section id={id} className={className}>
            <Container width="lg" gutter="md" className={containerClassName}>
                {fill ? (
                    <div className={cn('section-fill', CONTENT_INSET)}>{children}</div>
                ) : (
                    children
                )}
            </Container>
        </section>
    )
}

/**
 * Section label in blackletter display type, in the section's own color
 * (each homepage section owns a hue: ozanbayiz? = fuchsia [default],
 * research = cyan via className, favorites = chartreuse when it returns).
 * Document pages stay monochrome.
 * Title-case is fine — the blackletter capitals stay legible; avoid full
 * `uppercase` transforms, which trade away the textura rhythm.
 */
export function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn('font-display text-4xl md:text-5xl text-accent1-text', className)}>
            {children}
        </h2>
    )
}
