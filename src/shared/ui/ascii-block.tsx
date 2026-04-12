import { cn } from '@/lib/utils'

/**
 * Renders ASCII art using Google Sans Flex with fixed-width character cells.
 * Each character sits in an inline-block cell of equal width, preserving
 * grid alignment while gaining all 6 variable font axes.
 */
export default function AsciiBlock({
    art,
    className
}: {
    art: string
    className?: string
}) {
    const lines = art.split('\n')

    return (
        <div
            className={cn('leading-tight select-none', className)}
            aria-hidden="true"
        >
            {lines.map((line, i) => (
                <div key={i} className="whitespace-nowrap">
                    {Array.from(line).map((char, j) => (
                        <span key={j} className="ascii-cell">
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}
