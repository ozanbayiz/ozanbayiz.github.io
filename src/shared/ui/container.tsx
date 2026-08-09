/* The content column, in one place. */

import { cn } from '@/lib/utils'

/**
 * The padding that defines the page's content column.
 *
 * Everything that must share a left edge uses it: the inset black
 * rectangle rendered by `<Section fill>`, the research section's wrapper
 * (whose black is the full-bleed page background rather than its own
 * box), and the footer. They must agree or section headings sit on
 * different left edges — which is exactly the drift this constant exists
 * to prevent. Import it; don't retype it.
 *
 * See the SPACING SCALE note in globals.css.
 */
export const CONTENT_INSET_X = 'px-inset'

type ContainerProps = {
    children: React.ReactNode
    /** 'lg' = the homepage column (1024px);
     *  'md' = the document reading measure (768px). The divergence is
     *  deliberate — reports want a narrower measure — and this prop is
     *  where it lives, so it can never drift by copy-paste. */
    width?: 'lg' | 'md'
    /** 'md' = full-bleed on phones, gutter from md up (homepage
     *  sections: the black rectangle runs edge to edge, which removes
     *  one level of horizontal nesting on a 390px screen; the box keeps
     *  its own interior inset, so the black still frames the cards);
     *  'always' = gutter at every width (document pages, footer). */
    gutter?: 'md' | 'always'
    className?: string | undefined
}

export function Container({ children, width = 'lg', gutter = 'always', className }: ContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto w-full',
                width === 'lg' ? 'max-w-screen-lg' : 'max-w-screen-md',
                gutter === 'always' ? CONTENT_INSET_X : 'px-0 md:px-inset',
                className
            )}
        >
            {children}
        </div>
    )
}
