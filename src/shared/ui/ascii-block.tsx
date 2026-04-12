import { cn } from '@/lib/utils'

/**
 * Renders ASCII art using Google Sans Flex with fixed-width character cells.
 * Each character sits in an inline-block cell of equal width, preserving
 * grid alignment while gaining all 6 variable font axes.
 *
 * Use `dense` for tighter packing (smaller cells, tighter line-height).
 */
export default function AsciiBlock({
    art,
    className,
    dense
}: {
    art: string
    className?: string
    dense?: boolean
}) {
    const lines = art.split('\n')

    return (
        <div
            className={cn('select-none', className)}
            style={{
                lineHeight: dense ? 1.1 : 1.3,
                ['--ascii-ch' as string]: dense ? '0.55em' : '0.64em',
            }}
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
