'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import ExportedImage from 'next-image-export-optimizer'
import { useCallback } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

import { favoritesData, FavoriteItem } from '../data/favorites'

export default function FavoritesSection() {
    const moviesCategory = favoritesData.find(c => c.title === 'Movies')
    const musicCategory = favoritesData.find(c => c.title === 'Music')

    return (
        <div className="w-full flex flex-col space-y-6 overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest">Things I Like</h2>
            <div className="h-px w-full bg-foreground" />
            {moviesCategory && (
                <FavoritesSubSection
                    category={moviesCategory}
                    type="movies"
                />
            )}
            <div className="h-px w-full bg-foreground" />
            {musicCategory && (
                <FavoritesSubSection
                    category={musicCategory}
                    type="music"
                />
            )}
        </div>
    )
}

function FavoritesSubSection({ category, type }: { category: typeof favoritesData[0], type: 'movies' | 'music' }) {
    const isMusic = type === 'music'
    const isMobile = useIsMobile()
    const prefersReducedMotion = usePrefersReducedMotion()

    const direction = isMusic ? 'backward' : 'forward'
    const speed = 0.4

    const plugins = [
        ...(!prefersReducedMotion ? [AutoScroll({
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: !isMobile,
            speed,
            direction,
            startDelay: 500
        })] : []),
        ...(!isMobile ? [WheelGesturesPlugin({ forceWheelAxis: 'x' })] : [])
    ]

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, dragFree: true },
        plugins
    )

    const ariaLabel = isMusic ? 'Favorite music albums' : 'Favorite movies'

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!emblaApi) return
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            emblaApi.scrollPrev()
        } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            emblaApi.scrollNext()
        }
    }, [emblaApi])

    const handleFocus = useCallback(() => {
        if (!emblaApi) return
        const autoScroll = emblaApi.plugins()?.autoScroll
        if (autoScroll) (autoScroll as ReturnType<typeof AutoScroll>).stop()
    }, [emblaApi])

    const handleBlur = useCallback(() => {
        if (!emblaApi) return
        const autoScroll = emblaApi.plugins()?.autoScroll
        if (autoScroll) (autoScroll as ReturnType<typeof AutoScroll>).play()
    }, [emblaApi])

    return (
        <div className="w-full">
            {/* Scroll Container */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div
                    ref={emblaRef}
                    className="overflow-hidden cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-accent1 focus-visible:outline-offset-2"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label={ariaLabel}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    <div className="flex gap-4 px-4 touch-pan-y">
                        {category.items.map((item, idx) => (
                            <div
                                key={`${type}-original-${idx}`}
                                className="flex-[0_0_auto]"
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${item.title} by ${item.creator}, ${item.year}`}
                            >
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
    return (
        <div className="group">
            <div
                className={cn(
                    'relative shrink-0 overflow-hidden rounded-md border transition-all duration-300',
                    'bg-background',
                    'gradient-border-group',
                    isMusic ? 'h-48 w-48' : 'h-64 w-40',
                )}
            >
                <ExportedImage
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes={isMusic ? '192px' : '160px'}
                />
            </div>
            <div className={cn('mt-1.5', isMusic ? 'w-48' : 'w-40')}>
                <p className="text-xs font-bold truncate">
                    {item.title}
                    {' '}
                    <span className="text-[10px] text-foreground font-normal">{item.year}</span>
                </p>
                <p className="text-[10px] text-foreground truncate">{item.creator}</p>
            </div>
        </div>
    )
}
