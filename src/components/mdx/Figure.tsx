import React from 'react'

type FigureProps = {
  src: string
  alt: string
  children?: React.ReactNode // caption
  className?: string
  imgClassName?: string
}

export default function Figure({ src, alt, children, className, imgClassName }: FigureProps) {
  return (
    <figure className={['my-6', className].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={['mx-auto h-auto max-w-full', imgClassName].filter(Boolean).join(' ')} />
      {children ? (
        <figcaption className="mt-2 text-center text-sm text-foreground/70">{children}</figcaption>
      ) : null}
    </figure>
  )
}


