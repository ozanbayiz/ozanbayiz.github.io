import React from 'react'

import { cn } from '@/lib/utils'

import type { AnchorHTMLAttributes } from 'react'

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    newTab?: boolean
}

export default function ExternalLink({
    href,
    children,
    className,
    newTab = true,
    ...rest
}: ExternalLinkProps) {
    const rel = newTab ? 'noopener noreferrer' : undefined
    const target = newTab ? '_blank' : undefined

    return (
        <a
            href={href}
            target={target}
            rel={rel}
            className={cn('transition-colors hover:text-accent', className)}
            {...rest}
        >
            {children}
        </a>
    )
}
