'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import Image from 'next/image'
import { useState } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Section } from '@/shared/ui/section'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

import { favoritesData, FavoriteItem } from '../data/favorites'

export default function FavoritesSection() {
    // Explicitly separate data
    const moviesCategory = favoritesData.find(c => c.title === 'Movies')
    const musicCategory = favoritesData.find(c => c.title === 'Music')

    return (
        <TooltipProvider delayDuration={0}>
            <Section className="space-y-4 overflow-hidden">
                <h1 className="relative z-10 h1 text-center sm:text-left">Things I Like</h1>
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
            </Section>
        </TooltipProvider>
    )
}

function FavoritesSubSection({ category, type }: { category: typeof favoritesData[0], type: 'movies' | 'music' }) {
    const isMusic = type === 'music'
    const isMobile = useIsMobile()

    // Configuration specific to type
    const direction = isMusic ? 'backward' : 'forward'
    const speed = 0.6 // Adjust for velocity

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            dragFree: true
        },
        [
            AutoScroll({
                playOnInit: true,
                stopOnInteraction: false,
                stopOnMouseEnter: !isMobile,
                speed,
                direction,
                startDelay: 0 // Delay in ms before scrolling resumes after drag
            }),
            // Enable two-finger trackpad scrolling on desktop
            ...(!isMobile ? [WheelGesturesPlugin({ forceWheelAxis: 'x' })] : [])
        ]
    )

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className={cn(
                "space-y-2 relative z-10",
                isMusic ? "text-right" : ""
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
                <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                    <div className="flex gap-4 px-4 touch-pan-y">
                        {/* Original Items */}
                        {category.items.map((item, idx) => (
                            <div key={`${type}-original-${idx}`} className="flex-[0_0_auto]">
                                <FavoriteCard
                                    item={item}
                                    isMusic={isMusic}
                                />
                            </div>
                        ))}
                    </div>
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
                    onMouseLeave={() => setIsOpen(false)}
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
