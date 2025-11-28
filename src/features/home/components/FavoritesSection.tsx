'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

import { favoritesData, FavoriteItem } from '../data/favorites'

export default function FavoritesSection() {
    // Explicitly separate data
    const moviesCategory = favoritesData.find(c => c.title === 'Movies')
    const musicCategory = favoritesData.find(c => c.title === 'Music')

    return (
        <TooltipProvider delayDuration={0}>
            <section className="my-12 space-y-4 w-full max-w-full overflow-hidden">
                <h1 className="relative z-10 mx-4 h1">Things Ozan Likes</h1>
                {/* <p className="body-text mx-4 mb-8">I like some things enough to tell other people about. This section doesn&apos;t get updated too often...</p> */}
                {/* MOVIES SUB-SECTION */}
                {moviesCategory && (
                    <FavoritesSubSection
                        category={moviesCategory}
                        type="movies"
                    />
                )}

                {/* MUSIC SUB-SECTION */}
                {musicCategory && (
                    <FavoritesSubSection
                        category={musicCategory}
                        type="music"
                    />
                )}
            </section>
        </TooltipProvider>
    )
}

function FavoritesSubSection({ category, type }: { category: typeof favoritesData[0], type: 'movies' | 'music' }) {
    const isMusic = type === 'music'

    // Configuration specific to type
    const direction = isMusic ? 'reverse' : 'normal'

    // Velocity Calc
    const VELOCITY_REM_PER_SEC = 1.5
    const itemWidthRem = isMusic ? 13 : 11 // 12+1 vs 10+1
    const totalWidthRem = category.items.length * itemWidthRem
    const durationSec = totalWidthRem / VELOCITY_REM_PER_SEC

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className={cn(
                "space-y-2 relative z-10",
                isMusic ? "text-right pr-4" : "pl-4"
            )}>
                <h2 className="h2 text-black dark:text-white">{category.title}</h2>
                {category.description && (
                    <p className={cn(
                        "body-text max-w-prose leading-relaxed",
                        isMusic && "ml-auto"
                    )}>{category.description}</p>
                )}
            </div>

            {/* Scroll Container */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div
                    className="flex w-max min-w-full animate-scroll gap-4 px-4 hover:[animation-play-state:paused]"
                    style={{
                        '--animation-duration': `${durationSec}s`,
                        '--animation-direction': direction,
                    } as React.CSSProperties}
                >
                    {/* Original Items */}
                    {category.items.map((item, idx) => (
                        <FavoriteCard
                            key={`${type}-original-${idx}`}
                            item={item}
                            isMusic={isMusic}
                        />
                    ))}

                    {/* Duplicate Items */}
                    {category.items.map((item, idx) => (
                        <FavoriteCard
                            key={`${type}-duplicate-${idx}`}
                            item={item}
                            isMusic={isMusic}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function FavoriteCard({ item, isMusic }: { item: FavoriteItem; isMusic: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger asChild>
                <div
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={cn(
                        'relative shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-300 hover:border-accent hover:shadow-[0_0_0_1px_hsl(var(--accent))]',
                        'bg-neutral-100 dark:bg-neutral-800',
                        // Fixed Dimensions
                        isMusic ? 'h-48 w-48' : 'h-64 w-40',
                        // Border fix
                        'border-border/0 hover:border-accent'
                    )}
                >
                    <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes={isMusic ? '192px' : '160px'}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-10 transition-opacity" />
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] text-center">
                <p className="font-bold italic">
                    {item.title} <span className="not-italic text-xs text-muted-foreground">({item.year})</span>
                </p>
                <p className="text-xs text-muted-foreground">{item.creator}</p>
                {item.note && <p className="mt-1 text-xs text-accent">{item.note}</p>}
            </TooltipContent>
        </Tooltip>
    )
}
