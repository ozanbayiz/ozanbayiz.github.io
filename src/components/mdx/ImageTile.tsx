'use client'

import React from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={[
              'group relative inline-block leading-none cursor-default select-none border border-transparent hover:border-accent transition-colors',
              className
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className={['block h-auto max-w-full m-0 align-middle', imgClassName].filter(Boolean).join(' ')}
            />
          </div>
        </TooltipTrigger>
        {children ? (
          <TooltipContent side={side} className="max-w-[320px]">
            <div className="prose prose-sm prose-neutral dark:prose-invert prose-headings:mb-1 prose-hr:my-2 prose-p:my-0">
              {children}
            </div>
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  )
}


