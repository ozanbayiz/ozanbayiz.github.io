'use client'

import { useMounted } from '@/hooks/useMounted'
import { useModeContext } from '@/lib/mode-context'
import { cn } from '@/lib/utils'

const LABELS = { ink: 'b&w', color: 'color', clean: 'clean' } as const

export function ModeToggle({ className }: { className?: string }) {
    const { mode, cycleMode } = useModeContext()
    const mounted = useMounted()

    return (
        <button
            onClick={cycleMode}
            className={cn(
                'text-xs uppercase tracking-widest transition-colors hover:text-accent1',
                className
            )}
            aria-label={`Style mode: ${mode}. Click to cycle.`}
        >
            [{mounted ? LABELS[mode] : LABELS.ink}]
        </button>
    )
}
