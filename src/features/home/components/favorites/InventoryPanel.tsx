import { cn } from '@/lib/utils'

import InventorySlot from './InventorySlot'

import type { ActiveItem, SelectHandler, Variant } from './types'
import type { FavoriteItem } from '../../data/favorites'

type Props = {
    label: string
    items: FavoriteItem[]
    variant: Variant
    cols: string
    activeItem: ActiveItem
    onSelect: SelectHandler
    onHover: SelectHandler
}

export default function InventoryPanel({
    label,
    items,
    variant,
    cols,
    activeItem,
    onSelect,
    onHover,
}: Props) {
    return (
        <div>
            <p className="text-2xs font-bold uppercase tracking-widest mb-2">
                {label} [{items.length}/{items.length}]
            </p>
            <div className={cn('grid gap-px bg-foreground border border-foreground', cols)}>
                {items.map((item, idx) => (
                    <InventorySlot
                        key={idx}
                        item={item}
                        variant={variant}
                        isActive={activeItem?.item === item}
                        onSelect={() => onSelect(item, variant)}
                        onHover={() => onHover(item, variant)}
                    />
                ))}
            </div>
        </div>
    )
}
