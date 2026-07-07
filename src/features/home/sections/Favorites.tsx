'use client'

/* Favorites: inventory grids (movies, music) + sticky inspection panel.
 * Panel labels live in ../content.tsx; the items themselves (covers,
 * titles, notes) live in ../data/favorites.ts. */

import ExportedImage from 'next-image-export-optimizer'
import { useRef, useState } from 'react'

import { useScrollParallax } from '@/hooks/useScrollParallax'
import { cn } from '@/lib/utils'

import { favorites } from '../content'
import { favoritesData } from '../data/favorites'
import { SectionHeading } from '../ui'

import type { FavoriteItem } from '../data/favorites'

/* ── Style knobs ─────────────────────────────────────────────────── */
const PARALLAX_INVENTORY = -0.03
const PARALLAX_INSPECTION = 0.05
/* Fixed image-area height keeps layout stable when switching between
 * 2:3 movie posters and 1:1 album covers (both rendered via object-contain). */
const COVER_BOX_MOBILE = 'h-[96px] w-[64px]'
const COVER_BOX_DESKTOP = 'md:h-[320px] md:w-full'

type Variant = 'movie' | 'music'
type ActiveItem = { item: FavoriteItem; variant: Variant } | null
type SelectHandler = (item: FavoriteItem, variant: Variant) => void

/* ── Inventory (cover grid) ────────────────────────────────────────── */

function InventorySlot({
    item,
    variant,
    isActive,
    onSelect,
    onHover,
}: {
    item: FavoriteItem
    variant: Variant
    isActive: boolean
    onSelect: () => void
    onHover: () => void
}) {
    const label = `${item.title} by ${item.creator} (${item.year})`
    return (
        <button
            type='button'
            aria-label={label}
            aria-pressed={isActive}
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
                alt=''
                fill
                aria-hidden='true'
                className={cn(
                    'object-cover transition-[filter] duration-200',
                    isActive ? '' : 'grayscale',
                )}
                sizes="80px"
            />
        </button>
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
    variant: Variant
    cols: string
    activeItem: ActiveItem
    onSelect: SelectHandler
    onHover: SelectHandler
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

/* ── Inspection (detail panel) ─────────────────────────────────────── */

function InspectionPanel({ activeItem }: { activeItem: ActiveItem }) {
    return (
        <div
            role='region'
            aria-label='Selected favorite'
            aria-live='polite'
            className="sticky top-4 md:top-20 z-20 bg-background"
        >
            <p className="text-2xs font-bold uppercase tracking-widest mb-2">
                {'>'} INSPECT
            </p>
            <div className="p-3 md:p-4 flex flex-row md:flex-col gap-3 min-h-[140px] md:min-h-[440px]">
                <div className={`relative shrink-0 ${COVER_BOX_MOBILE} ${COVER_BOX_DESKTOP}`}>
                    {activeItem ? (
                        <ExportedImage
                            key={`${activeItem.variant}-${activeItem.item.cover}`}
                            src={activeItem.item.cover}
                            alt={activeItem.item.title}
                            fill
                            className="object-contain animate-in fade-in duration-200"
                            sizes="(min-width: 768px) 420px, 96px"
                        />
                    ) : (
                        <div
                            aria-hidden
                            className="absolute inset-0 border border-dashed border-foreground/30"
                        />
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-center md:justify-start min-w-0">
                    {activeItem ? (
                        <div
                            key={`${activeItem.variant}-${activeItem.item.title}`}
                            className="animate-in fade-in duration-200 flex flex-col gap-1"
                        >
                            <p className="text-sm font-bold leading-tight">{activeItem.item.title}</p>
                            <p className="text-xs leading-tight text-foreground">
                                {activeItem.item.creator} <span aria-hidden className="opacity-50">·</span> {activeItem.item.year}
                            </p>
                            {activeItem.item.note && (
                                <p className="text-xs mt-2 leading-relaxed text-foreground">{'// '}{activeItem.item.note}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-2xs font-bold uppercase tracking-widest text-foreground/60">
                            {'>'} SELECT ITEM<span className="animate-blink">_</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Section ───────────────────────────────────────────────────────── */

export default function FavoritesSection() {
    const [activeItem, setActiveItem] = useState<ActiveItem>(null)
    const inventoryRef = useRef<HTMLDivElement>(null)
    const inspectionRef = useRef<HTMLDivElement>(null)
    useScrollParallax(inventoryRef, PARALLAX_INVENTORY)
    useScrollParallax(inspectionRef, PARALLAX_INSPECTION)

    const handleSelect: SelectHandler = (item, variant) => {
        setActiveItem(prev => (prev?.item === item ? null : { item, variant }))
    }

    const handleHover: SelectHandler = (item, variant) => {
        setActiveItem({ item, variant })
    }

    const panels = favorites.panels.map(p => {
        const category = favoritesData.find(c => c.title === p.dataTitle)
        if (!category) {
            throw new Error(`FavoritesSection: missing category "${p.dataTitle}" in favoritesData`)
        }
        return { ...p, items: category.items }
    })

    return (
        <div className="w-full flex flex-col space-y-6">
            <SectionHeading>{favorites.heading}</SectionHeading>
            <div className="flex flex-col md:flex-row md:gap-8">
                <div
                    ref={inventoryRef}
                    className="md:w-[55%] flex flex-col gap-6"
                    style={{ willChange: 'transform' }}
                >
                    {panels.map(p => (
                        <InventoryPanel
                            key={p.dataTitle}
                            label={p.label}
                            items={p.items}
                            variant={p.variant}
                            cols={p.cols}
                            activeItem={activeItem}
                            onSelect={handleSelect}
                            onHover={handleHover}
                        />
                    ))}
                </div>

                <div
                    ref={inspectionRef}
                    className="order-first md:order-none mb-4 md:mb-0 md:w-[45%]"
                    style={{ willChange: 'transform' }}
                >
                    <InspectionPanel activeItem={activeItem} />
                </div>
            </div>
        </div>
    )
}
