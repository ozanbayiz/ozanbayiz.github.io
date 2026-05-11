'use client'

import { useEffect, useRef, useState } from 'react'

import { useModeContext } from '@/lib/mode-context'

import SocialLinksBar from './SocialLinksBar'

/**
 * Spider sprite — 4 frames cycling at 600ms (idle twitch cadence, ~2.4s loop).
 * F1/F3 are the canonical rest pose; F2 extends the top arm one cell left,
 * F4 extends the bottom-left foot one cell right. Same total line widths so
 * the silhouette doesn't reflow. Respects prefers-reduced-motion (locks to F1).
 */
const SPIDER_FRAMES: ReadonlyArray<string> = [
    // F1 — rest
    `                     XXXXXXX
                     XXXXXXX
                    XXXXXXXX
                    XXXXXXXX
                    XX
           XXX       X
          XX X       X
         XX  XX      XX
         X    XXXXXXX X
        XX          XXX
        X
        X
XXX     X
XXX    XX
XXX  XXX
  XX X
   XXX                      `,
    // F2 — top arm tip extends one cell left
    `                     XXXXXXX
                     XXXXXXX
                    XXXXXXXX
                    XXXXXXXX
                    XX
          XXXX       X
          XX X       X
         XX  XX      XX
         X    XXXXXXX X
        XX          XXX
        X
        X
XXX     X
XXX    XX
XXX  XXX
  XX X
   XXX                      `,
    // F3 — rest
    `                     XXXXXXX
                     XXXXXXX
                    XXXXXXXX
                    XXXXXXXX
                    XX
           XXX       X
          XX X       X
         XX  XX      XX
         X    XXXXXXX X
        XX          XXX
        X
        X
XXX     X
XXX    XX
XXX  XXX
  XX X
   XXX                      `,
    // F4 — bottom-left foot extends one cell right
    `                     XXXXXXX
                     XXXXXXX
                    XXXXXXXX
                    XXXXXXXX
                    XX
           XXX       X
          XX X       X
         XX  XX      XX
         X    XXXXXXX X
        XX          XXX
        X
        X
XXXX    X
XXX    XX
XXX  XXX
  XX X
   XXX                      `,
]

const FRAME_INTERVAL_MS = 600

/* Parallax magnitudes — spider is "closer" (more reactive), name is "farther." */
const MOUSE_PARALLAX_SPIDER = { x: -18, y: -12 }     // px shift at viewport edge
const MOUSE_PARALLAX_NAME   = { x:  -8, y:  -5 }
const SCROLL_PARALLAX_SPIDER = -0.18  // 1.18x scroll speed (foreground)
const SCROLL_PARALLAX_NAME   =  0.10  // 0.90x scroll speed (background)
const MOUSE_TRANSITION = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'

export default function HeroSection() {
    const { cycleMode } = useModeContext()
    const [frame, setFrame] = useState(0)

    const spiderMouseRef = useRef<HTMLDivElement>(null)
    const nameMouseRef   = useRef<HTMLDivElement>(null)
    const spiderScrollRef = useRef<HTMLDivElement>(null)
    const nameScrollRef   = useRef<HTMLDivElement>(null)

    /* Sprite cycle. */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const id = setInterval(
            () => setFrame(f => (f + 1) % SPIDER_FRAMES.length),
            FRAME_INTERVAL_MS,
        )
        return () => clearInterval(id)
    }, [])

    /* Mouse-driven parallax — eased via CSS transition on each plane. */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        let raf = 0
        const onMove = (e: MouseEvent) => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                const nx = (e.clientX / window.innerWidth  - 0.5) * 2  // -1 to 1
                const ny = (e.clientY / window.innerHeight - 0.5) * 2
                if (spiderMouseRef.current) {
                    spiderMouseRef.current.style.transform =
                        `translate3d(${nx * MOUSE_PARALLAX_SPIDER.x}px, ${ny * MOUSE_PARALLAX_SPIDER.y}px, 0)`
                }
                if (nameMouseRef.current) {
                    nameMouseRef.current.style.transform =
                        `translate3d(${nx * MOUSE_PARALLAX_NAME.x}px, ${ny * MOUSE_PARALLAX_NAME.y}px, 0)`
                }
            })
        }
        window.addEventListener('mousemove', onMove)
        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(raf)
        }
    }, [])

    /* Scroll-driven parallax — instant tracking (no transition; would feel laggy). */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        let raf = 0
        const apply = () => {
            const y = window.scrollY
            if (spiderScrollRef.current) {
                spiderScrollRef.current.style.transform =
                    `translate3d(0, ${y * SCROLL_PARALLAX_SPIDER}px, 0)`
            }
            if (nameScrollRef.current) {
                nameScrollRef.current.style.transform =
                    `translate3d(0, ${y * SCROLL_PARALLAX_NAME}px, 0)`
            }
        }
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(apply)
        }
        apply()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            cancelAnimationFrame(raf)
        }
    }, [])

    return (
        <section className="relative flex flex-col items-center justify-center pt-20 pb-10 md:pt-32 md:pb-16">
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 md:px-8">
                {/* ASCII Art — the centerpiece */}
                <div
                    className="cursor-pointer text-2xs leading-tight transition-[filter] duration-300 hover:brightness-125 lg:text-sm lg:leading-tight"
                    onClick={cycleMode}
                >
                    <div className="flex flex-wrap items-center justify-around gap-x-4">
                        {/* Spider — foreground plane (faster scroll, larger mouse shift). */}
                        <div ref={spiderScrollRef} style={{ willChange: 'transform' }}>
                            <div
                                ref={spiderMouseRef}
                                style={{ willChange: 'transform', transition: MOUSE_TRANSITION }}
                            >
                                <pre className="ascii-gradient mb-4">{SPIDER_FRAMES[frame]}</pre>
                            </div>
                        </div>
                        {/* Name — background plane (slower scroll, smaller mouse shift). */}
                        <div ref={nameScrollRef} style={{ willChange: 'transform' }}>
                            <div
                                ref={nameMouseRef}
                                style={{ willChange: 'transform', transition: MOUSE_TRANSITION }}
                            >
                                <pre className="ascii-gradient mb-4">
                                    {' '}
                                    XXX XXX{'    '}XXX XXX{'        '}XXX{'      '}XXX XXX
                                    {'              '}
                                    {'\n'}XXX{'   '}XXX{'        '}XXX{'     '}XXX XXX{'    '}XXX
                                    {'   '}XXX{'            '}
                                    {'\n'}XXX{'   '}XXX{'       '}XXX{'     '}XXX{'   '}XXX{'   '}
                                    XXX{'   '}XXX{'            '}
                                    {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'     '}XXX XXX{'    '}XXX
                                    {'   '}XXX{'            '}
                                    {'\n'}XXX{'   '}XXX{'     '}XXX{'       '}XXX{'   '}XXX{'   '}
                                    XXX{'   '}XXX{'            '}
                                    {'\n'}XXX{'   '}XXX{'    '}XXX{'        '}XXX{'   '}XXX{'   '}
                                    XXX{'   '}XXX{'            '}
                                    {'\n'} XXX XXX{'      '}XXX XXX{'   '}XXX{'   '}XXX{'   '}XXX
                                    {'   '}XXX{'            '}
                                    {'\n'}
                                    {'\n'} XXX XXX{'       '}XXX{'      '}XXX{'   '}XXX{'    '}XXX
                                    XXX{'    '}XXX XXX{'  '}
                                    {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'    '}XXX{'   '}XXX
                                    {'      '}XXX{'           '}XXX {'\n'}XXX{'   '}XXX{'   '}XXX
                                    {'   '}XXX{'    '}XXX XXX{'       '}XXX{'          '}XXX{'  '}
                                    {'\n'} XXX XXX{'     '}XXX XXX{'       '}XXX{'         '}XXX
                                    {'       '}XXX XXX {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                                    {'         '}XXX{'        '}XXX{'    '}
                                    {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                                    {'         '}XXX{'       '}XXX{'     '}
                                    {'\n'} XXX XXX{'    '}XXX{'   '}XXX{'      '}XXX{'       '}XXX
                                    XXX{'      '}XXX XXX{'\n'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-sm text-foreground">
                    CS @ Berkeley
                </p>

                <SocialLinksBar variant="gradient" />
            </div>
        </section>
    )
}
