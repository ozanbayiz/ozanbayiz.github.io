/*
  MDX <img> mapping with sane defaults:
  - Removes default prose <p> margins inside grids by being a direct img
  - Adds consistent styling so markdown images in ImageGrid look like tiles
  - Keeps alt for accessibility
*/
'use client'

import React from 'react'

import { cn } from '@/lib/utils'

import { useLightboxItem } from '../lightbox/useLightboxItem'
import { MEDIA_BASE, MEDIA_HOVER } from '../styles'

type MdxImgProps = React.ImgHTMLAttributes<HTMLImageElement>

export default function MdxImg(props: MdxImgProps) {
    const { className, src, alt, ...rest } = props

    const { interactiveProps } = useLightboxItem({
        src: String(src ?? ''),
        alt: alt || undefined,
        caption: alt || undefined
    })

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            loading="lazy"
            {...rest}
            src={src}
            alt={alt ?? ''}
            className={cn(MEDIA_BASE, MEDIA_HOVER, className)}
            {...interactiveProps}
        />
    )
}
