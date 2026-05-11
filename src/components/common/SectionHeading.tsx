import { cn } from '@/lib/utils'

type SectionHeadingProps = {
    children: React.ReactNode
    className?: string
}

/**
 * Deck-style section label: `<NAME>` rendered in Silkscreen pixel.
 * Inherits foreground color so contrast is AA-safe across every (bg, fg) pair.
 */
export default function SectionHeading({ children, className }: SectionHeadingProps) {
    return (
        <h2 className={cn(
            'font-display text-base md:text-lg uppercase',
            className,
        )}>
            <span aria-hidden className="opacity-60">&lt;</span>
            {children}
            <span aria-hidden className="opacity-60">&gt;</span>
        </h2>
    )
}
