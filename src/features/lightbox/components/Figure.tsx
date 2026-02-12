'use client'

import ExportedImage from 'next-image-export-optimizer'
import React from 'react'

import { renderKatex } from '@/lib/katex'
import { cn } from '@/lib/utils'

import { useLightboxItem } from '../lightbox/useLightboxItem'
import {
    MEDIA_BASE,
    MEDIA_HOVER,
    CAPTION,
    getAlignmentClasses,
    resolveDimension
} from '../styles'

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

const VIDEO_RE = /\.(mp4|webm|ogg)$/i

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
    const rootRef = React.useRef<HTMLElement | null>(null)
    const isVideo = VIDEO_RE.test(src)
    const captionContent = caption ?? children
    const { media: alignMedia, caption: alignCaption } =
        getAlignmentClasses(align)

    // --- Lightbox (images only) ---
    const { interactiveProps } = useLightboxItem(
        isVideo
            ? { src: '', alt: '' } // noop registration for video
            : { src, alt, caption: captionContent }
    )

    // --- KaTeX in captions (images only) ---
    React.useEffect(() => {
        if (isVideo) return
        const el = rootRef.current
        if (!el) return
        renderKatex(el)
    }, [isVideo, captionContent, src, alt])

    // --- Sizing ---
    const style: React.CSSProperties = {
        width: resolveDimension(width) ?? (isVideo ? '100%' : undefined),
        height: resolveDimension(height),
        maxWidth: resolveDimension(maxWidth) ?? '100%',
        maxHeight: resolveDimension(maxHeight),
        aspectRatio:
            typeof aspectRatio === 'number'
                ? String(aspectRatio)
                : aspectRatio
    }

    // --- Media element ---
    let media: React.ReactNode

    if (isVideo) {
        media = (
            <video
                autoPlay
                loop
                muted
                playsInline
                controls
                className={cn(MEDIA_BASE, 'rounded', alignMedia)}
                style={style}
                aria-label={alt}
            >
                <source src={src} type={`video/${src.split('.').pop()}`} />
            </video>
        )
    } else {
        const shouldOptimize =
            Boolean(optimize) &&
            typeof width === 'number' &&
            typeof height === 'number'

        const imgClasses = cn(
            MEDIA_BASE,
            MEDIA_HOVER,
            alignMedia,
            imgClassName
        )

        media = shouldOptimize ? (
            <ExportedImage
                src={src}
                alt={alt}
                width={width as number}
                height={height as number}
                className={imgClasses}
                style={style}
                {...(sizes ? { sizes } : {})}
                {...(priority !== undefined ? { priority } : {})}
                {...(quality !== undefined ? { quality } : {})}
            />
        ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                loading="lazy"
                src={src}
                alt={alt}
                className={imgClasses}
                style={style}
            />
        )
    }

    return (
        <figure ref={rootRef} className={cn('my-8', className)}>
            {isVideo ? (
                media
            ) : (
                <div {...interactiveProps}>{media}</div>
            )}
            {captionContent ? (
                <figcaption className={cn(CAPTION, alignCaption)}>
                    {captionContent}
                </figcaption>
            ) : null}
        </figure>
    )
}
