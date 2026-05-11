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
    interactiveProps: InteractiveProps
    active: boolean
}

export function useLightboxItem({
    src,
    alt,
    caption,
}: UseLightboxItemArgs): LightboxItemResult {
    const lightbox = useLightboxOptional()
    const id = React.useId()

    React.useEffect(() => {
        if (!lightbox) return
        const args: { src: string; alt?: string; caption?: React.ReactNode } = { src }
        if (alt !== undefined) args.alt = alt
        if (caption !== undefined) args.caption = caption
        lightbox.registerItem(args, id)
        return () => {
            lightbox.unregisterItem(id)
        }
    }, [src, alt, caption, lightbox, id])

    const handleOpen = React.useCallback(() => {
        if (!lightbox) return
        lightbox.openById(id)
    }, [lightbox, id])

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpen()
            }
        },
        [handleOpen],
    )

    const active = !!lightbox

    const interactiveProps = React.useMemo<InteractiveProps>(() => {
        if (!active) return {}
        return {
            role: 'button',
            tabIndex: 0,
            onClick: handleOpen,
            onKeyDown,
        }
    }, [active, handleOpen, onKeyDown])

    return { interactiveProps, active }
}
