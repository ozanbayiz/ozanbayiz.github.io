/* Shared section chrome: the outer wrapper and the blackletter heading. */

import { cn } from '@/lib/utils'

/**
 * The padding that defines the page's content column, in one place.
 *
 * Two things use it: the inset black rectangle rendered by `<Section fill>`,
 * and the research section's wrapper in app/page.tsx (whose black is the
 * full-bleed page background rather than its own box). They must agree or
 * the two section headings sit on different left edges — which is exactly
 * the drift this constant exists to prevent. Import it; don't retype it.
 *
 * See the SPACING SCALE note in globals.css.
 *
 * Only the HORIZONTAL half is shared, because only it is alignment-critical.
 * Vertical padding belongs to the filled box alone: a section whose black is
 * the page background already gets its vertical rhythm from `py-section`, and
 * adding `py-inset-y` on top of that stacks into a conspicuous gap.
 */
export const CONTENT_INSET_X = 'px-inset-x'
export const CONTENT_INSET = `${CONTENT_INSET_X} py-inset-y`

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
        <section id={id} className={cn('py-section', className)}>
            <div
                className={cn(
                    'container mx-auto max-w-screen-lg',
                    /* No page gutter on phones: the black rectangle runs
                     * edge to edge, which removes one level of horizontal
                     * nesting (page gutter + box padding + card padding was
                     * eating a third of a 390px screen). The box keeps its
                     * own CONTENT_INSET, so the black still frames the cards.
                     * The gutter returns at md, where the width exists. */
                    'px-0 md:px-inset-x',
                    containerClassName
                )}
            >
                {fill ? (
                    <div className={cn('section-fill', CONTENT_INSET)}>{children}</div>
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
