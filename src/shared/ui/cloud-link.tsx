'use client'

import Link from 'next/link'

import { growIntoPage } from '@/shared/ui/mold-transition'

import type { ComponentProps, MouseEvent } from 'react'

/* A card link that navigates by GROWING: its cloud floods the screen
 * like mold (see mold-transition.tsx) and the destination is revealed
 * under it. Falls back to a plain <Link> navigation whenever the
 * overlay isn't available — no JS never reaches onClick, and reduced
 * motion never registers the overlay. Modified clicks (new tab, …)
 * keep their normal meaning. */
export default function CloudLink({
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
        if (growIntoPage(e.currentTarget.getBoundingClientRect(), href)) {
            e.preventDefault()
        }
    }
    return <Link {...props} onClick={handleClick} />
}
