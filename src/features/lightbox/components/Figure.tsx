"use client"

import renderMathInElement from 'katex/contrib/auto-render'
import Image from 'next/image'
import React from 'react'

import { useLightboxOptional } from '../lightbox/LightboxProvider'

type FigureProps = {
  src: string
  alt: string

  // Sizing controls (number interpreted as px, string allows any CSS unit like '66%')
  width?: number | string
  height?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  aspectRatio?: number | `${number}/${number}`

  // Layout and presentation
  align?: 'left' | 'center' | 'right'
  caption?: React.ReactNode // or provide caption via children
  children?: React.ReactNode
  className?: string
  imgClassName?: string

  // Optional Next.js optimization (only used when width & height are numbers)
  optimize?: boolean
  sizes?: string
  priority?: boolean
  quality?: number
}

export default function Figure({
  src,
  alt,
  width,
  height,
  maxWidth,
  maxHeight,
  aspectRatio,
  align = 'center',
  caption,
  children,
  className,
  imgClassName,
  optimize = true,
  sizes,
  priority,
  quality
}: FigureProps) {
  const containerClasses = ['my-6', className].filter(Boolean).join(' ')
  const rootRef = React.useRef<HTMLElement | null>(null)

  const alignmentImgClass =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
  const captionAlignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  const resolvedWidth =
    typeof width === 'number' ? `${width}px` : width
  const resolvedHeight =
    typeof height === 'number' ? `${height}px` : height
  const resolvedMaxWidth =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
  const resolvedMaxHeight =
    typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

  const imgStyle: React.CSSProperties = {
    width: resolvedWidth,
    height: resolvedHeight,
    maxWidth: resolvedMaxWidth ?? '100%',
    maxHeight: resolvedMaxHeight,
    aspectRatio:
      typeof aspectRatio === 'number' ? String(aspectRatio) : aspectRatio
  }

  const shouldOptimize =
    Boolean(optimize) && typeof width === 'number' && typeof height === 'number'

  const figureContent = shouldOptimize ? (
    <Image
      src={src}
      alt={alt}
      width={width as number}
      height={height as number}
      className={[
        'block h-auto max-w-full m-0 align-middle',
        'border border-transparent hover:border-accent transition-colors',
        alignmentImgClass,
        imgClassName
      ]
        .filter(Boolean)
        .join(' ')}
      style={imgStyle}
      {...(sizes ? { sizes } : {})}
      {...(priority !== undefined ? { priority } : {})}
      {...(quality !== undefined ? { quality } : {})}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={[
        'block h-auto max-w-full m-0 align-middle',
        'border border-transparent hover:border-accent transition-colors',
        alignmentImgClass,
        imgClassName
      ]
        .filter(Boolean)
        .join(' ')}
      style={imgStyle}
    />
  )

  const captionContent = caption ?? children

  // Render LaTeX inside caption/content provided via props/children (not processed by MDX plugins)
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      })
    } catch {}
  }, [captionContent, src, alt])

  // Lightbox registration
  const lightbox = useLightboxOptional()
  const idRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!lightbox) return
    const id = lightbox.registerItem({ src, alt, caption: captionContent })
    idRef.current = id
    // derive index on open; registration order defines index
    return () => {
      lightbox.unregisterItem(id)
      idRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, alt, captionContent, !!lightbox])

  const handleOpen = React.useCallback(() => {
    if (!lightbox || !idRef.current) return
    lightbox.openById(idRef.current)
  }, [lightbox])

  return (
    <figure ref={rootRef} className={containerClasses}>
      <div
        role={lightbox ? 'button' : undefined}
        tabIndex={lightbox ? 0 : undefined}
        onClick={lightbox ? handleOpen : undefined}
        onKeyDown={lightbox ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } } : undefined}
      >
        {figureContent}
      </div>
      {captionContent ? (
        <figcaption className={[
          'mt-2 text-sm text-foreground',
          captionAlignClass
        ].join(' ')}>
          {captionContent}
        </figcaption>
      ) : null}
    </figure>
  )
}


