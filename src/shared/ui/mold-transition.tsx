'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/* ── MoldTransition ───────────────────────────────────────────────────
 * Two organic page transitions on one overlay canvas.
 *
 * GROW (card → project page): the card's cloud GROWS across the screen
 * like spreading mold — a solid black mass with a ragged, fuchsia
 * glyph fringe advancing ahead of it — until it swallows the viewport.
 * The navigation happens under the cover, and the black then dissolves
 * away in organic patches, revealing the project page. The card "turns
 * into" the page.
 *
 * MELT (project page → home): the document MELTS into the white — the
 * page disappears under white patches accumulating in the same noise
 * field, with a faint gray glyph fringe where the content is still
 * decomposing — then the homepage fades back in under the whiteness.
 *
 * Mounted once in the root layout (it must survive the navigation it
 * covers). It renders a fixed, pointer-transparent canvas ABOVE all
 * content, transparent except while a transition runs. Trigger with
 * growIntoPage(rect, href) / meltIntoPage(href) — CloudLink and
 * MeltLink do this on clicks; when the trigger returns false (overlay
 * unmounted, reduced motion), the caller lets the plain <Link>
 * navigation happen instead.
 *
 * Same cell grid and glyph ramp as the physarum background, so both
 * fronts read as the same organism. */

/* density ramp, sparse -> dense — same as the physarum background */
const RAMP =
    ' .`\'^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCQ0OZmwqpdbkhao*#MW&8%B@$'

const CELL_H = 11 /* cell height, CSS px; width measured from the font */
const DPR_CAP = 2
const GROW_MS = 700 /* mold flood duration */
const REVEAL_MS = 650 /* black dissolve duration */
const MELT_MS = 600 /* melt-to-white duration */
const FADE_MS = 500 /* white fade-out duration */
const HOLD_MAX_MS = 4000 /* give up waiting for the route and reveal */
const FRINGE = 3 /* cells of glyph fringe ahead of the solid front */
const RAG = 10 /* cells of raggedness on the fronts */
const INK = 'rgba(255, 0, 204, 0.9)' /* fuchsia fringe on the mold */
const FILL = '#000000'
const MELT_FILL = '#ffffff'
const MELT_INK = 'rgba(0, 0, 0, 0.3)' /* decomposing-text fringe */

type Phase = 'idle' | 'grow' | 'melt' | 'wait' | 'reveal' | 'fade'
type Kind = 'grow' | 'melt'

let triggerGrow: ((rect: DOMRect, href: string) => void) | null = null
let triggerMelt: ((href: string) => void) | null = null

/** Swallow the screen from `rect` with black mold, navigate to `href`
 * under the cover, dissolve to reveal it. Returns false when the
 * overlay isn't available (unmounted, reduced motion) — fall back to
 * normal navigation. */
export function growIntoPage(rect: DOMRect, href: string): boolean {
    if (!triggerGrow) return false
    triggerGrow(rect, href)
    return true
}

/** Melt the page into white, navigate to `href` under the cover, fade
 * the white out over the destination. Returns false when the overlay
 * isn't available — fall back to normal navigation. */
export function meltIntoPage(href: string): boolean {
    if (!triggerMelt) return false
    triggerMelt(href)
    return true
}

/* ── The entropic field ──────────────────────────────────────────────
 * Sines interfere into lattices — patches arrive in orderly ranks.
 * Decay doesn't. The field below is built from:
 *   · fractal VALUE NOISE with golden-ratio octave scaling — feature
 *     sizes walk down the Fibonacci sequence (13 → 8 → 5 cells, since
 *     13/φ ≈ 8 and 13/φ² ≈ 5), and φ being maximally irrational means
 *     the octaves never align into a repeat
 *   · raw per-cell grain, so edges crumble instead of curving
 *   · (mixed in per transition) a whisper of sunflower — a faint
 *     13-armed golden spiral, phyllotaxis instead of concentric rings
 */

const PHI = 1.618033988749895

/* deterministic per-cell white noise in [0,1) */
const hash2 = (x: number, y: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return h - Math.floor(h)
}

/* one octave of smoothed value noise: bilinear lattice interpolation */
const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const fx = x - xi
    const fy = y - yi
    const sx = fx * fx * (3 - 2 * fx)
    const sy = fy * fy * (3 - 2 * fy)
    const a = hash2(xi, yi)
    const b = hash2(xi + 1, yi)
    const c = hash2(xi, yi + 1)
    const d = hash2(xi + 1, yi + 1)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

export default function MoldTransition() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const st = useRef({
        phase: 'idle' as Phase,
        kind: 'grow' as Kind,
        raf: 0,
        t0: 0,
        holdT0: 0,
        href: '',
        fromPath: '',
        /* card rect in cell coordinates */
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
        /* grid */
        gw: 0,
        gh: 0,
        cw: 7,
        ch: 22,
        maxD: 0,
        /* spiral origin, cells: the card for grow, the screen center
         * for melt */
        cx: 0,
        cy: 0
    })

    /* the route changed during a transition — reveal (if we aren't
     * already: a slow route can outlast HOLD_MAX_MS and force-reveal
     * first, e.g. dev-server compiles). Either way the new page must
     * show from its top: the homepage's scroll position sometimes
     * survives the push, and under the cover the jump is invisible. */
    useEffect(() => {
        const s = st.current
        if (s.phase === 'idle' || pathname === s.fromPath) return
        /* instant, not smooth (html sets scroll-behavior: smooth), and
         * the push used scroll: false — this is the ONE scroll owner */
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        if (s.phase === 'wait') {
            s.phase = s.kind === 'melt' ? 'fade' : 'reveal'
            s.t0 = performance.now()
        }
    }, [pathname])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const s = st.current

        const cellDist = (xc: number, yc: number) => {
            const dx = xc < s.x0 ? s.x0 - xc : xc > s.x1 ? xc - s.x1 : 0
            const dy = yc < s.y0 ? s.y0 - yc : yc > s.y1 ? yc - s.y1 : 0
            return Math.sqrt(dx * dx + dy * dy)
        }

        /* the entropic field in [0,1] — see the note above. Mostly
         * aperiodic noise and grain; the sunflower spiral is a quiet
         * undertone around the transition's origin. */
        const field = (x: number, y: number) => {
            const n =
                vnoise(x / 13, y / 13) * 0.45 +
                vnoise((x / 13) * PHI, (y / 13) * PHI) * 0.28 +
                vnoise((x / 13) * PHI * PHI, (y / 13) * PHI * PHI) * 0.17 +
                hash2(x, y) * 0.1
            const dx = x - s.cx
            const dy = y - s.cy
            const spiral =
                0.5 +
                0.5 *
                    Math.sin(Math.atan2(dy, dx) * 13 + Math.hypot(dx, dy) / PHI)
            return n * 0.82 + spiral * 0.18
        }

        /* draw the field: cells where `edge` > FRINGE are solid `fill`,
         * cells where 0 < edge <= FRINGE get a ramp glyph in `ink`
         * (denser near the solid mass) — one solid pass with row runs,
         * one glyph pass with row strings */
        const drawField = (
            edge: (x: number, y: number) => number,
            fill: string,
            ink: string
        ) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = fill
            for (let y = 0; y < s.gh; y++) {
                for (let x = 0; x < s.gw; x++) {
                    if (edge(x, y) <= FRINGE) continue
                    let xEnd = x
                    while (xEnd < s.gw && edge(xEnd, y) > FRINGE) xEnd++
                    ctx.fillRect(
                        x * s.cw,
                        y * s.ch,
                        (xEnd - x) * s.cw + 1,
                        s.ch + 1
                    )
                    x = xEnd
                }
            }
            ctx.fillStyle = ink
            for (let y = 0; y < s.gh; y++) {
                let line = ''
                for (let x = 0; x < s.gw; x++) {
                    const e = edge(x, y)
                    if (e <= 0 || e > FRINGE) {
                        line += ' '
                        continue
                    }
                    /* per-cell grain in the glyph choice — the fringe
                     * crumbles instead of grading smoothly */
                    const v = Math.max(
                        0,
                        Math.min(1, e / FRINGE + (hash2(x, y) - 0.5) * 0.45)
                    )
                    line +=
                        RAMP[
                            Math.min(
                                RAMP.length - 1,
                                Math.floor(v * RAMP.length)
                            )
                        ]!
                }
                ctx.fillText(line, 0, y * s.ch)
            }
        }

        const loop = () => {
            const now = performance.now()
            if (s.phase === 'grow') {
                const p = Math.min(1, (now - s.t0) / GROW_MS)
                /* ease-in: the mold creeps, then floods */
                const R = p * p * (s.maxD + RAG + FRINGE)
                drawField(
                    (x, y) =>
                        R - field(x, y) * RAG - cellDist(x + 0.5, y + 0.5),
                    FILL,
                    INK
                )
                if (p >= 1) toWait(now)
            } else if (s.phase === 'melt') {
                const p = Math.min(1, (now - s.t0) / MELT_MS)
                /* the noise field rises past the threshold in organic
                 * patches — the page melts into the white */
                const T = p * (1 + FRINGE / RAG)
                drawField(
                    (x, y) => (T - field(x, y)) * RAG,
                    MELT_FILL,
                    MELT_INK
                )
                if (p >= 1) toWait(now)
            } else if (s.phase === 'wait') {
                /* fully covered; hold the cover while the route loads */
                ctx.fillStyle = s.kind === 'melt' ? MELT_FILL : FILL
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                if (now - s.holdT0 > HOLD_MAX_MS) {
                    s.phase = s.kind === 'melt' ? 'fade' : 'reveal'
                    s.t0 = now
                }
            } else if (s.phase === 'reveal') {
                const p = Math.min(1, (now - s.t0) / REVEAL_MS)
                /* dissolve: the noise field sinks below the threshold in
                 * organic patches until nothing is left */
                const T = p * (1 + FRINGE / RAG)
                drawField((x, y) => (field(x, y) - T) * RAG + FRINGE, FILL, INK)
                if (p >= 1) return finish()
            } else if (s.phase === 'fade') {
                const p = Math.min(1, (now - s.t0) / FADE_MS)
                /* the homepage fades back in under the whiteness */
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.globalAlpha = 1 - p
                ctx.fillStyle = MELT_FILL
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.globalAlpha = 1
                if (p >= 1) return finish()
            } else {
                return
            }
            s.raf = requestAnimationFrame(loop)
        }

        const toWait = (now: number) => {
            s.phase = 'wait'
            s.holdT0 = now
            /* scroll: false — the pathname effect above resets scroll
             * itself, instantly, under the cover; letting Next also
             * scroll makes the two race (and the CSS smooth behavior
             * turns the race visible). */
            router.push(s.href, { scroll: false })
        }

        const finish = () => {
            s.phase = 'idle'
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        /* size the canvas and grid for a fresh transition */
        const initGrid = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
            canvas.width = Math.floor(canvas.clientWidth * dpr)
            canvas.height = Math.floor(canvas.clientHeight * dpr)
            s.ch = CELL_H * dpr
            ctx.font = `${s.ch * 0.9}px ui-monospace, Menlo, monospace`
            ctx.textBaseline = 'top'
            s.cw = ctx.measureText('M').width
            s.gw = Math.max(4, Math.ceil(canvas.width / s.cw))
            s.gh = Math.max(4, Math.ceil(canvas.height / s.ch))
            return dpr
        }

        const begin = (kind: Kind, href: string) => {
            s.kind = kind
            s.href = href
            s.fromPath = window.location.pathname
            s.phase = kind === 'melt' ? 'melt' : 'grow'
            s.t0 = performance.now()
            cancelAnimationFrame(s.raf)
            s.raf = requestAnimationFrame(loop)
        }

        const startGrow = (rect: DOMRect, href: string) => {
            if (s.phase !== 'idle') return
            const dpr = initGrid()
            s.x0 = (rect.left * dpr) / s.cw
            s.x1 = (rect.right * dpr) / s.cw
            s.y0 = (rect.top * dpr) / s.ch
            s.y1 = (rect.bottom * dpr) / s.ch
            /* farthest viewport corner from the card — full cover */
            s.maxD = Math.max(
                cellDist(0, 0),
                cellDist(s.gw, 0),
                cellDist(0, s.gh),
                cellDist(s.gw, s.gh)
            )
            /* the sunflower unwinds from the card */
            s.cx = (s.x0 + s.x1) / 2
            s.cy = (s.y0 + s.y1) / 2
            begin('grow', href)
        }

        const startMelt = (href: string) => {
            if (s.phase !== 'idle') return
            initGrid()
            /* the sunflower unwinds from the screen center */
            s.cx = s.gw / 2
            s.cy = s.gh / 2
            begin('melt', href)
        }

        /* under reduced motion the overlay never registers — the links
         * fall back to plain navigation */
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            triggerGrow = startGrow
            triggerMelt = startMelt
        }
        return () => {
            triggerGrow = null
            triggerMelt = null
            cancelAnimationFrame(s.raf)
        }
        /* router is stable across renders; pathname is watched above */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        /* 100lvh keeps the overlay one stable size while mobile browser
         * chrome collapses/expands; h-full is the fallback. */
        <canvas
            ref={canvasRef}
            aria-hidden='true'
            className='pointer-events-none fixed left-0 top-0 z-50 h-full w-full'
            style={{ height: '100lvh' }}
        />
    )
}
