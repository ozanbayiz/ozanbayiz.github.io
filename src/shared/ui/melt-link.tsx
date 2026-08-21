'use client'

import Link from 'next/link'

import { meltIntoPage } from '@/shared/ui/mold-transition'

import type { ComponentProps, MouseEvent } from 'react'

/* A link home that navigates by MELTING: the page dissolves into the
 * white and the destination fades back in under it (see
 * mold-transition.tsx). Falls back to a plain <Link> navigation
 * whenever the overlay isn't available — no JS never reaches onClick,
 * and reduced motion never registers the overlay. Modified clicks
 * (new tab, …) keep their normal meaning. */
export default function MeltLink({
    onClick,
    ...props
}: ComponentProps<typeof Link>) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
            return
        const href = typeof props.href === 'string' ? props.href : ''
        if (!href) return
        if (meltIntoPage(href)) {
            e.preventDefault()
        }
    }
    return <Link {...props} onClick={handleClick} />
}
