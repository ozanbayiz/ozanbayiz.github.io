'use client'

import React from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

import { useLightboxOptional } from '../lightbox/LightboxProvider'


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
  const lightbox = useLightboxOptional()
  const idRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!lightbox) return
    const args: { src: string; alt?: string; caption?: React.ReactNode } = { src }
    if (typeof alt === 'string' && alt.length > 0) args.alt = alt
    if (children) args.caption = children
    else if (args.alt) args.caption = args.alt
    const id = lightbox.registerItem(args)
    idRef.current = id
    return () => {
      lightbox.unregisterItem(id)
      idRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, alt, children, !!lightbox])
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
              onClick={lightbox ? () => { if (idRef.current) lightbox.openById(idRef.current) } : undefined}
              role={lightbox ? 'button' : undefined}
              tabIndex={lightbox ? 0 : undefined}
              onKeyDown={lightbox ? (e) => { if ((e.key === 'Enter' || e.key === ' ') && idRef.current) { e.preventDefault(); lightbox.openById(idRef.current) } } : undefined}
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


