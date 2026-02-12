/** Base classes applied to all media elements (img / video) inside lightbox components. */
export const MEDIA_BASE = 'block h-auto max-w-full m-0 align-middle'

/** Hover-border treatment shared by Figure, MdxImg, and ImageTile. */
export const MEDIA_HOVER = 'border border-transparent hover:border-accent transition-colors'

/** Standard figcaption styling. */
export const CAPTION = 'mt-3 text-sm italic text-muted-foreground'

/** Returns alignment utility classes for the media element and caption. */
export function getAlignmentClasses(align: 'left' | 'center' | 'right') {
    return {
        media:
            align === 'center'
                ? 'mx-auto'
                : align === 'right'
                  ? 'ml-auto'
                  : '',
        caption:
            align === 'center'
                ? 'text-center'
                : align === 'right'
                  ? 'text-right'
                  : 'text-left'
    }
}

/** Normalise a dimension value to a CSS string. */
export function resolveDimension(
    value?: number | string
): string | undefined {
    if (value === undefined) return undefined
    return typeof value === 'number' ? `${value}px` : value
}
