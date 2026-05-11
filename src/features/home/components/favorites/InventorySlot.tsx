import ExportedImage from 'next-image-export-optimizer'

import { cn } from '@/lib/utils'

import type { Variant } from './types'
import type { FavoriteItem } from '../../data/favorites'

type Props = {
    item: FavoriteItem
    variant: Variant
    isActive: boolean
    onSelect: () => void
    onHover: () => void
}

export default function InventorySlot({ item, variant, isActive, onSelect, onHover }: Props) {
    return (
        <button
            className={cn(
                'relative bg-background overflow-hidden',
                variant === 'movie' ? 'aspect-[2/3]' : 'aspect-square',
                isActive ? 'ring-2 ring-accent1 z-10' : '',
            )}
            onClick={onSelect}
            onMouseEnter={onHover}
            onFocus={onHover}
        >
            <ExportedImage
                src={item.cover}
                alt={item.title}
                fill
                className={cn(
                    'object-cover transition-[filter] duration-200',
                    isActive ? '' : 'grayscale',
                )}
                sizes="80px"
            />
        </button>
    )
}
