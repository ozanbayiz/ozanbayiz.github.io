'use client'

import { cn } from '@/lib/utils'

import type { TocItem } from '../../utils/toc'

type Variant = 'inline' | 'sidebar'

const ENTRY_CLASSES: Record<Variant, string> = {
    inline: 'gradient-link text-sm',
    sidebar: 'block pl-3 py-0.5 text-xs transition-colors gradient-link',
}

const ACTIVE_CLASSES: Record<Variant, string> = {
    inline: '[animation-play-state:running]',
    sidebar: 'border-l-2 border-accent1 -ml-px [animation-play-state:running]',
}

const NESTED_LIST_CLASSES: Record<Variant, string> = {
    inline: 'ml-4 border-l pl-3 space-y-1 mt-1',
    sidebar: 'ml-3 space-y-0.5',
}

type TocEntryProps = {
    item: TocItem
    variant: Variant
    activeId: string | null
    navigateTo: (id: string) => void
}

function TocEntry({ item, variant, activeId, navigateTo }: TocEntryProps) {
    const isActive = activeId === item.id

    return (
        <li>
            <a
                href={`#${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={cn(ENTRY_CLASSES[variant], isActive && ACTIVE_CLASSES[variant])}
            >
                {item.title}
            </a>
            {item.children.length > 0 && (
                <ul className={NESTED_LIST_CLASSES[variant]}>
                    {item.children.map(child => (
                        <TocEntry
                            key={child.id}
                            item={child}
                            variant={variant}
                            activeId={activeId}
                            navigateTo={navigateTo}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}

type TocListProps = {
    items: TocItem[]
    variant: Variant
    activeId: string | null
    navigateTo: (id: string) => void
    className?: string
}

export default function TocList({ items, variant, activeId, navigateTo, className }: TocListProps) {
    return (
        <ul className={className}>
            {items.map(item => (
                <TocEntry
                    key={item.id}
                    item={item}
                    variant={variant}
                    activeId={activeId}
                    navigateTo={navigateTo}
                />
            ))}
        </ul>
    )
}
