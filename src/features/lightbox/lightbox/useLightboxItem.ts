'use client'

import React from 'react'

import { useLightboxOptional } from './LightboxProvider'

type UseLightboxItemArgs = {
    src: string
    alt?: string | undefined
    caption?: React.ReactNode | undefined
}

type InteractiveProps = {
    role?: 'button'
    tabIndex?: number
    onClick?: () => void
    onKeyDown?: (e: React.KeyboardEvent) => void
}

type LightboxItemResult = {
    /** Spread onto the clickable element to wire up lightbox interaction */
    interactiveProps: InteractiveProps
    /** Whether a lightbox context is available */
    active: boolean
}

/**
 * Hook that encapsulates lightbox registration, cleanup, and interactive props.
 * Use in any component that should register an image with the lightbox.
 */
export function useLightboxItem({
    src,
    alt,
    caption
}: UseLightboxItemArgs): LightboxItemResult {
    const lightbox = useLightboxOptional()
    const idRef = React.useRef<string | null>(null)

    React.useEffect(() => {
        if (!lightbox) return
        const args: { src: string; alt?: string; caption?: React.ReactNode } = { src }
        if (alt !== undefined) args.alt = alt
        if (caption !== undefined) args.caption = caption
        const id = lightbox.registerItem(args)
        idRef.current = id
        return () => {
            lightbox.unregisterItem(id)
            idRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, alt, caption, !!lightbox])

    const handleOpen = React.useCallback(() => {
        if (!lightbox) return
        if (idRef.current) {
            lightbox.openById(idRef.current)
        } else {
            const args: { src: string; alt?: string; caption?: React.ReactNode } = { src }
            if (alt !== undefined) args.alt = String(alt)
            if (caption !== undefined) args.caption = caption
            lightbox.openOrRegister(args)
        }
    }, [lightbox, src, alt, caption])

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpen()
            }
        },
        [handleOpen]
    )

    const active = !!lightbox

    const interactiveProps = React.useMemo<InteractiveProps>(() => {
        if (!active) return {}
        return {
            role: 'button',
            tabIndex: 0,
            onClick: handleOpen,
            onKeyDown
        }
    }, [active, handleOpen, onKeyDown])

    return { interactiveProps, active }
}
