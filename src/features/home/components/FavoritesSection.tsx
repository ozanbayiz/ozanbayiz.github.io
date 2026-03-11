'use client'

import ExportedImage from 'next-image-export-optimizer'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { favoritesData, FavoriteItem } from '../data/favorites'

type ActiveItem = {
    item: FavoriteItem
    variant: 'movie' | 'music'
} | null

export default function FavoritesSection() {
    const [activeItem, setActiveItem] = useState<ActiveItem>(null)

    const moviesCategory = favoritesData.find(c => c.title === 'Movies')
    const musicCategory = favoritesData.find(c => c.title === 'Music')

    const handleSelect = (item: FavoriteItem, variant: 'movie' | 'music') => {
        setActiveItem(prev =>
            prev?.item === item ? null : { item, variant }
        )
    }

    const handleHover = (item: FavoriteItem, variant: 'movie' | 'music') => {
        setActiveItem({ item, variant })
    }

    return (
        <div className="w-full flex flex-col space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest">Things I Like</h2>
            <div className="h-px w-full bg-foreground" />
            <div className="flex flex-col md:flex-row md:gap-8">
                {/* Inventory Grids */}
                <div className="md:w-[55%] flex flex-col gap-6">
                    {moviesCategory && (
                        <InventoryPanel
                            label="MOVIES"
                            items={moviesCategory.items}
                            variant="movie"
                            cols="grid-cols-3"
                            activeItem={activeItem}
                            onSelect={handleSelect}
                            onHover={handleHover}
                        />
                    )}
                    {musicCategory && (
                        <InventoryPanel
                            label="MUSIC"
                            items={musicCategory.items}
                            variant="music"
                            cols="grid-cols-4 md:grid-cols-5"
                            activeItem={activeItem}
                            onSelect={handleSelect}
                            onHover={handleHover}
                        />
                    )}
                </div>

                {/* Inspection Panel */}
                <div className="mt-6 md:mt-0 md:w-[45%]">
                    <InspectionPanel activeItem={activeItem} />
                </div>
            </div>
        </div>
    )
}

function InventoryPanel({
    label,
    items,
    variant,
    cols,
    activeItem,
    onSelect,
    onHover,
}: {
    label: string
    items: FavoriteItem[]
    variant: 'movie' | 'music'
    cols: string
    activeItem: ActiveItem
    onSelect: (item: FavoriteItem, variant: 'movie' | 'music') => void
    onHover: (item: FavoriteItem, variant: 'movie' | 'music') => void
}) {
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

function InventorySlot({
    item,
    variant,
    isActive,
    onSelect,
    onHover,
}: {
    item: FavoriteItem
    variant: 'movie' | 'music'
    isActive: boolean
    onSelect: () => void
    onHover: () => void
}) {
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

function InspectionPanel({ activeItem }: { activeItem: ActiveItem }) {
    return (
        <div className="md:sticky md:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <p className="text-2xs font-bold uppercase tracking-widest mb-2">
                {'>'} INSPECT
            </p>
            <div className="border border-foreground p-4">
                {activeItem ? (
                    <div
                        key={activeItem.item.title}
                        className="animate-in fade-in duration-200 flex flex-col gap-3"
                    >
                        <div className={cn(
                            'relative w-full',
                            activeItem.variant === 'movie' ? 'aspect-[2/3]' : 'aspect-square',
                        )}>
                            <ExportedImage
                                src={activeItem.item.cover}
                                alt={activeItem.item.title}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 40vw, 90vw"
                            />
                        </div>
                        <div className="h-px w-full bg-foreground" />
                        <div>
                            <p className="text-sm font-bold">{activeItem.item.title}</p>
                            <p className="text-xs">{activeItem.item.creator}, {activeItem.item.year}</p>
                        </div>
                        {activeItem.item.note && (
                            <p className="text-xs">{'// '}{activeItem.item.note}</p>
                        )}
                    </div>
                ) : (
                    <p className="text-2xs font-bold uppercase tracking-widest py-8 text-center">
                        {'>'} SELECT ITEM<span className="animate-blink">_</span>
                    </p>
                )}
            </div>
        </div>
    )
}
