/*
  MDX <img> mapping with sane defaults:
  - Removes default prose <p> margins inside grids by being a direct img
  - Adds consistent styling so markdown images in ImageGrid look like tiles
  - Keeps alt for accessibility
*/
'use client'

import React from 'react'

import { useLightboxOptional } from '../lightbox/LightboxProvider'

type MdxImgProps = React.ImgHTMLAttributes<HTMLImageElement>

export default function MdxImg(props: MdxImgProps) {
  const { className, ...rest } = props
  const lightbox = useLightboxOptional()
  const idRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!lightbox) return
    const args: { src: string; alt?: string; caption?: React.ReactNode } = { src: String(rest.src ?? '') }
    if (typeof rest.alt === 'string' && rest.alt.length > 0) {
      args.alt = rest.alt
      args.caption = rest.alt
    }
    const id = lightbox.registerItem(args)
    idRef.current = id
    return () => {
      lightbox.unregisterItem(id)
      idRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [String(rest.src ?? ''), rest.alt, !!lightbox])
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      {...rest}
      alt={props.alt ?? ''}
      className={[
        'block h-auto max-w-full m-0 align-middle',
        'border border-transparent hover:border-accent transition-colors',
        className
      ].filter(Boolean).join(' ')}
      onClick={lightbox ? () => { if (idRef.current) lightbox.openById(idRef.current) } : undefined}
      role={lightbox ? 'button' : undefined}
      tabIndex={lightbox ? 0 : undefined}
      onKeyDown={lightbox ? (e) => { if ((e.key === 'Enter' || e.key === ' ') && idRef.current) { e.preventDefault(); lightbox.openById(idRef.current) } } : undefined}
    />
  )
}


