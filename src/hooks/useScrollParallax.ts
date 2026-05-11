'use client'

import { useEffect } from 'react'

import type { RefObject } from 'react'

/**
 * Viewport-relative scroll parallax. Translates the element on Y by
 * `(elementCenterY - viewportCenterY) * multiplier`, so motion activates
 * naturally as the section crosses the screen rather than from absolute scrollY.
 *
 *   multiplier > 0 → "foreground" (moves faster than scroll, leaves view first)
 *   multiplier < 0 → "background" (moves slower, lingers in view)
 *
 * Updates via rAF + direct style.transform — no React re-renders. Skipped
 * entirely when prefers-reduced-motion is set.
 */
export function useScrollParallax(
    ref: RefObject<HTMLElement | null>,
    multiplier: number,
) {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let raf = 0
        const apply = () => {
            const el = ref.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elCenter = rect.top + rect.height / 2
            const offset = elCenter - window.innerHeight / 2
            el.style.transform = `translate3d(0, ${offset * multiplier}px, 0)`
        }
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(apply)
        }

        apply()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            cancelAnimationFrame(raf)
        }
    }, [ref, multiplier])
}
