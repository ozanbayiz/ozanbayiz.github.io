/*
  MDX <img> mapping with sane defaults:
  - Removes default prose <p> margins inside grids by being a direct img
  - Adds consistent styling so markdown images in ImageGrid look like tiles
  - Keeps alt for accessibility
*/
'use client'

import React from 'react'

type MdxImgProps = React.ImgHTMLAttributes<HTMLImageElement>

export default function MdxImg(props: MdxImgProps) {
  const { className, ...rest } = props
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={props.alt ?? ''}
      className={[
        'block h-auto max-w-full m-0 align-middle',
        'border border-transparent hover:border-accent transition-colors',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}


