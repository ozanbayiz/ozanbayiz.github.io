'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/shared/ui/tooltip'

import { useLightboxItem } from '../lightbox/useLightboxItem'
import { MEDIA_BASE, MEDIA_HOVER } from '../styles'

type ImageTileProps = {
    src: string
    alt: string
    children?: React.ReactNode // tooltip content (MDX allowed)
    side?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
    imgClassName?: string
}

export default function ImageTile({
    src,
    alt,
    children,
    side = 'top',
    className,
    imgClassName
}: ImageTileProps) {
    const { interactiveProps } = useLightboxItem({
        src,
        alt,
        caption: children ?? alt
    })

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'group relative inline-block leading-none cursor-default select-none',
                            MEDIA_HOVER,
                            className
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            className={cn(MEDIA_BASE, imgClassName)}
                            {...interactiveProps}
                        />
                    </div>
                </TooltipTrigger>
                {children ? (
                    <TooltipContent
                        side={side}
                        className="max-w-[320px]"
                    >
                        <div className="prose prose-sm prose-neutral dark:prose-invert prose-headings:mb-1 prose-hr:my-2 prose-p:my-0">
                            {children}
                        </div>
                    </TooltipContent>
                ) : null}
            </Tooltip>
        </TooltipProvider>
    )
}
