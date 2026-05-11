import ExportedImage from 'next-image-export-optimizer'

import { cn } from '@/lib/utils'

import type { ActiveItem } from './types'

type Props = {
    activeItem: ActiveItem
}

export default function InspectionPanel({ activeItem }: Props) {
    return (
        <div
            role='region'
            aria-label='Selected favorite'
            aria-live='polite'
            className="sticky top-0 md:top-20 z-20 bg-background max-h-[calc(100vh-6rem)] overflow-y-auto"
        >
            <p className="text-2xs font-bold uppercase tracking-widest mb-2 bg-background">
                {'>'} INSPECT
            </p>
            <div className="p-3 md:p-4">
                {activeItem ? (
                    <div
                        key={activeItem.item.title}
                        className="animate-in fade-in duration-200 flex flex-row md:flex-col gap-3"
                    >
                        <div className={cn(
                            'relative shrink-0',
                            'w-16 md:w-full',
                            activeItem.variant === 'movie' ? 'aspect-[2/3]' : 'aspect-square',
                        )}>
                            <ExportedImage
                                src={activeItem.item.cover}
                                alt={activeItem.item.title}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 40vw, 80px"
                            />
                        </div>
                        <div className="flex flex-col justify-center md:justify-start">
                            <p className="text-sm font-bold">{activeItem.item.title}</p>
                            <p className="text-xs">{activeItem.item.creator}, {activeItem.item.year}</p>
                            {activeItem.item.note && (
                                <p className="text-xs mt-1 md:mt-2">{'// '}{activeItem.item.note}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-2xs font-bold uppercase tracking-widest py-3 md:py-8 text-center">
                        {'>'} SELECT ITEM<span className="animate-blink">_</span>
                    </p>
                )}
            </div>
        </div>
    )
}
