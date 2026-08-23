'use client'

import { useEffect, useRef, useState } from 'react'

/* ── PhysarumBackground ───────────────────────────────────────────────
 * Breathing black clouds and an ASCII slime-mold organism behind the
 * page, split across two kinds of surface so nothing tears during a
 * scroll:
 *
 *   · The GLYPH FIELD (the mold) lives on a fixed, pointer-transparent
 *     canvas behind everything. It is a pure viewport-anchored
 *     backdrop — it tracks no content, so no scroll can misalign it,
 *     and it repaints on 30Hz ticks only, scrolling or not.
 *   · The BANDS around every [data-cloud] element — blob, moat,
 *     feather — live on ONE small canvas set per element, parked in
 *     two DOCUMENT-anchored overlay layers (whites at z -6, blobs at
 *     z -4, both under the content). The compositor scrolls them WITH
 *     their content, so a blob is glued to its card at any flick
 *     speed. A fixed canvas rastered from rAF lands a frame or two
 *     behind a compositor-driven scroll — 20–60px at iOS flick speeds,
 *     an offset no repaint cadence can close; anchoring the bands to
 *     the document removes the chase entirely. Whites sit below blobs
 *     so one card's feather can never wash a neighbor's blob edge.
 *
 * Three concentric bands surround every [data-cloud] element, cut per
 * tick from ONE distance field per zone (paintOverlays; updateMask
 * cuts the same bands on the viewport grid for the sim):
 *
 *   1. CLOUD  (d < off)                 solid black blob; the element's
 *      white text rides it. off = PAD + wobble, an eccentric cumulus
 *      isoline: three octaves of drifting sine noise, amplitude scaled
 *      to the element's size (or pinned via data-cloud-wob), biased
 *      snug with occasional puffs (LOBE_BIAS), billowing at the crest
 *      and calm at the keel (CREST/FLANK/KEEL). Corners round by
 *      construction.
 *   2. BUFFER (off <= d < off+BUFFER)   clean page — painted page-
 *      white over the glyph field, no agents. The moat that keeps the
 *      mold and the cloud from ever touching.
 *   3. FADE   (the next FADE cells)     mold territory begins; a white
 *      feather whose alpha ramps 1→0 across the band, so the colony's
 *      edge dissolves toward the moat instead of cutting off.
 *      Render-only — the sim still sees a hard wall at the buffer's
 *      outer edge.
 *
 * The organism is a classic Physarum sim — agents that sense, turn,
 * deposit; a trail field that diffuses and decays — drawn as ASCII
 * glyphs, fuchsia on the white page: color means alive, black-and-
 * white means content. The cursor is food: tracked with a window-level
 * pointermove (the canvas has pointer-events none and NEVER receives
 * events), translated into grid cells with the MEASURED character
 * advance — never a hardcoded width ratio. The exclusion senses as
 * NEUTRAL (0, not negative), which is what makes the colony accrete
 * along the moat's outer rim instead of keeping a standoff distance;
 * agents swallowed by a breathing (or scrolling) boundary are pushed
 * out radially, never teleported. Trails PERSIST under the exclusion
 * (hidden by fadeF, decaying normally) so zones scrolling across the
 * field don't strip-mine the colony.
 *
 * An element marked data-cloud="dead" keeps all three bands as pure
 * exclusion — a dead zone the mold respects, its edge breathing like
 * any cloud's — but paints NOTHING: its content sits in normal page
 * ink on the bare page, outlined only by the organism's curved
 * absence. (Such elements don't take the .cloud-zone class.)
 *
 * Hovering (or keyboard-focusing) a data-cloud-hover element ignites
 * its whole blob fuchsia; the painted .cloud-zone anchor under it
 * flips via CSS in the same frame (see globals.css).
 *
 * PAINTED ANCHOR. .cloud-zone elements keep their painted black
 * rectangle even while the overlays run: the blob always reaches at
 * least PAD beyond it, so at rest the eye only ever sees the blob's
 * curved edge. The rectangle covers the blob's interior from the
 * content layer, flips fuchsia in the same frame as the CSS hover
 * (the blob ring follows on the next tick), and is the whole
 * no-JS / reduced-motion fallback.
 *
 * Reduced motion: no canvas at all — painted rectangles, no glyphs,
 * no animation. Hidden tabs consume no frames (visibilitychange). */

/* density ramp, sparse -> dense (~70 glyphs, classic ASCII-art luminance ramp) */
const RAMP =
    ' .`\'^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCQ0OZmwqpdbkhao*#MW&8%B@$'

/* ── Tunables ───────────────────────────────────────────────────────── */

/* cell geometry: character cell height in CSS px; width is MEASURED */
const CELL_H = 11
const DPR_CAP = 2

/* band geometry (in character cells). PAD/BUFFER/FADE/WOB_MIN are the
 * PAINTED cloud's bands — a blob wants a generous moat and a soft,
 * feathered approach. Dead zones exist to sit INSIDE the colony, so
 * their DEAD_* counterparts wrap the text as tightly as legibility
 * allows: a few px of hard clearance, a short feather, and barely-
 * there breathing. */
const PAD = 1.5 /* guaranteed cloud clearance around the content rect */
const WOB_MIN = 1.0 /* smallest breathing amplitude (tiny elements) */
const WOB_MAX = 2.2 /* largest breathing amplitude (big blocks) */
const WOB_SCALE = 0.1 /* amplitude per cell of the element's minor size */
const WOB_SPEED = 0.9 /* breathing tempo */
const LOBE_BIAS = 1.25 /* >1 hugs the inner radius, puffing out rarely */
const BUFFER = 2.0 /* empty moat between cloud edge and mold territory */
const FADE = 2.5 /* render-side feather band where mold density ramps up */
/* DEAD_* are in ROW units and apply isotropically in pixels (see the
 * kx note in updateMask): 0.35 rows is ~4px of clearance on EVERY
 * side of the text, horizontal and vertical alike. */
const DEAD_PAD = 0.35 /* dead zones: hard clearance hugging the text */
const DEAD_BUFFER = 0.25 /* dead zones: sliver of moat */
const DEAD_FADE = 0.9 /* dead zones: short feather — mold reads close */
const DEAD_WOB_MIN = 0.3 /* dead zones: barely-there breathing floor */

/* per-element overrides, all in cells, all clamped to [0, OVERRIDE_MAX]:
 *   data-cloud-wob     pins the breathing amplitude (else the size
 *                      heuristic above) — deeper for clouds with room
 *                      to billow, like the hero
 *   data-cloud-pad     pins the guaranteed clearance (else PAD)
 *   data-cloud-buffer  pins the moat width (else BUFFER)
 * Tight pad/buffer/wob let the mold thread BETWEEN neighboring dead
 * zones (the about items) instead of sterilizing the whole gap. */
const OVERRIDE_MAX = 6

/* cumulus anisotropy: amplitude depends on which side of the element a
 * cell sits. Lobes billow upward from the crest, the flanks ripple
 * moderately, and the keel stays calm — the flat-ish underside that
 * makes the silhouette read as a cumulus cloud instead of a box. */
const CREST = 1.3 /* amplitude multiplier above the element */
const FLANK = 0.8 /* amplitude multiplier beside it */
const KEEL = 0.35 /* amplitude multiplier below it — the flat base */

/* simulation — tuned in the reference demo (ideas/); preserve. The
 * overcrowding aversion (SAT, tent-shaped pref) and TURNOVER are what
 * keep the sim from freezing into a static network when idle. */
const N = 900 /* agent count */
const SA = 0.5 /* sensor angle */
const SD = 4 /* sensor distance (cells) */
const TURN = 0.4 /* turn rate */
const SPEED = 0.7 /* agent speed, cells per frame */
const DECAY = 0.87 /* trail decay per diffusion pass */
const DEPOSIT = 0.8 /* trail laid per agent step */
const TRAIL_MAX = 8
const SAT = 3.5 /* preference peaks here, falls off above */
const TURNOVER = 0.004 /* fraction of agents respawned per frame */
const FOOD = 2.5 /* trail deposited per cell under the cursor */

/* ── Cadence ─────────────────────────────────────────────────────────
 * Fixed timestep. The sim advances STEPS_PER_TICK tuned steps per tick
 * (30Hz) — exactly 60 steps/s on EVERY display, so a 120Hz screen no
 * longer runs the organism at double speed and a struggling one only
 * slows gracefully. Everything repaints on ticks (30fps — invisible
 * for a glyph-quantized render, and the right tempo for breathing);
 * every other frame costs nothing. Scrolling needs no frames at all:
 * the fixed canvas is a pure backdrop and the overlays ride the page
 * on the compositor, so there is nothing to keep in sync. */
const TICK_MS = 1000 / 30
const STEPS_PER_TICK = 2 /* the sim's parameters are tuned per 60Hz step */
const MAX_TICKS = 2 /* cap catch-up after jank — drop time, don't spiral */
const DT_CLAMP = 100 /* ms — returning from a hidden tab isn't jank */
const SETTLE_MS = 150 /* a scroll is "over" this long after the last move */

/* renderer */
const RENDER_DIV = 4.5 /* trail -> glyph density divisor (sparsity) */
const CUT = 0.06 /* below this, cells render as true whitespace */
const OVERLAY_MAX_CELLS = 600 /* per-axis cap on one overlay's grid */

/* palette — color means alive; black-and-white means content */
const INK = 'rgba(255, 0, 204, 0.9)' /* fuchsia mold on the white page */
const CLOUD_FILL = '#000000' /* clouds are black; text on them is white */
/* fuchsia — the site-wide interaction color. Hovering (or keyboard-
 * focusing) an element marked data-cloud-hover ignites its whole
 * cloud; the painted .cloud-zone anchor under it flips via CSS in the
 * same frame (see globals.css — the two must stay in lockstep). */
const CLOUD_HOT = '#ff00cc'

type Zone = {
    /* rect in viewport grid cells at measure time — the sim's mask */
    x0: number
    x1: number
    y0: number
    y1: number
    phase: number
    wob: number
    pad: number
    buffer: number
    fade: number
    paint: boolean
    hot: boolean
    /* overlay geometry — CSS px, DOCUMENT coordinates */
    docL: number
    docT: number
    wpx: number
    hpx: number
    kx: number /* horizontal cell distance → row units (1 if painted) */
    reach: number /* outermost band radius, row units */
}

/* One overlay (a lo canvas, plus hi for painted zones) per [data-cloud]
 * ELEMENT — not per rect: a dead zone's dozens of line rects share one
 * canvas, keeping canvas memory and compositor layer count at "a few
 * per section" instead of hundreds of slivers (which is what iOS
 * Safari's memory watchdog kills pages over). */
type Overlay = {
    lo: HTMLCanvasElement /* whites: moat + feather */
    loCtx: CanvasRenderingContext2D | null
    hi: HTMLCanvasElement | null /* the blob — painted zones only */
    hiCtx: CanvasRenderingContext2D | null
    rastered: boolean /* painted at least once — only then may it cull */
}

/* an element's overlay paint job, rebuilt by each measure */
type OverlayJob = {
    ent: Overlay
    zones: Zone[] /* this element's rects */
    oL: number /* canvas origin, CSS px, DOCUMENT coords */
    oT: number
    gw2: number /* canvas grid, cells */
    gh2: number
}

/* The breathing noise, sampled in DOCUMENT cells: three octaves of
 * drifting sine, diagonal wave directions so every edge orientation
 * undulates — swell, wave, ripple. Shared verbatim by the sim's mask
 * (updateMask) and the visual overlays (paintOverlays), so the two
 * cuts of the field breathe as one. */
const wobble = (x: number, y: number, t: number, phase: number) =>
    Math.sin(x * 0.12 + y * 0.1 + t * WOB_SPEED * 0.55 + phase) * 0.6 +
    Math.sin(x * 0.27 - y * 0.22 - t * WOB_SPEED * 0.45 + phase * 1.7) * 0.25 +
    Math.sin(x * 0.55 + y * 0.8 + t * WOB_SPEED * 1.2 + phase * 2.3) * 0.15

/* attribute override in cells, else the given default */
const cellAttr = (el: Element, name: string, fallback: number) => {
    const v = parseFloat(el.getAttribute(name) ?? '')
    return Number.isFinite(v)
        ? Math.min(OVERRIDE_MAX, Math.max(0, v))
        : fallback
}

/* a measured rect, in CSS px — DOMRect satisfies this structurally */
type Box = {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
}

/* Font metrics pad every line rect: a range rect spans the font's
 * ascent to descent, while the visible ink sits well inside — the
 * Calligra signature carries ~10px of empty ascent alone. Measure each
 * text node's actual ink once (canvas measureText) and remember how
 * much to trim off the top and bottom of its line rects, so dead zones
 * hug what the eye sees, not the font's bounding box. The cache is
 * dropped once webfonts finish loading — metrics measured against a
 * fallback face would otherwise stick. */
type InkTrim = { top: number; bottom: number }
let inkTrims = new WeakMap<Text, InkTrim>()
function resetInkTrims() {
    inkTrims = new WeakMap()
}
let measureCtx: CanvasRenderingContext2D | null = null
const inkTrim = (node: Text): InkTrim => {
    let trim = inkTrims.get(node)
    if (!trim) {
        trim = { top: 0, bottom: 0 }
        const el = node.parentElement
        if (!measureCtx) {
            measureCtx = document.createElement('canvas').getContext('2d')
        }
        if (el && measureCtx) {
            const cs = getComputedStyle(el)
            measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
            const m = measureCtx.measureText((node.nodeValue ?? '').trim())
            /* max ink over the node's characters — per-line trims can
             * only be larger, so this never overcuts */
            if (m.fontBoundingBoxAscent !== undefined) {
                trim.top = Math.max(
                    0,
                    m.fontBoundingBoxAscent - m.actualBoundingBoxAscent
                )
                trim.bottom = Math.max(
                    0,
                    m.fontBoundingBoxDescent - m.actualBoundingBoxDescent
                )
            }
        }
        inkTrims.set(node, trim)
    }
    return trim
}

/* Non-whitespace runs per text node, cached — a node's text never
 * changes here. Needed for <pre> ASCII art: its lines are padded with
 * spaces so the silhouette never reflows, and spaces are characters,
 * so a LINE rect spans all that blank padding — walling the mold out
 * of empty cells. Measuring each glyph RUN separately lets the dead
 * zone trace the art's actual silhouette instead. */
const runCache = new WeakMap<Text, [number, number][]>()
const runsOf = (node: Text): [number, number][] => {
    let runs = runCache.get(node)
    if (!runs) {
        runs = []
        const text = node.nodeValue ?? ''
        const re = /\S+/g
        for (let m = re.exec(text); m; m = re.exec(text)) {
            runs.push([m.index, m.index + m[0].length])
        }
        runCache.set(node, runs)
    }
    return runs
}

export default function PhysarumBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const overLoRef = useRef<HTMLDivElement | null>(null)
    const overHiRef = useRef<HTMLDivElement | null>(null)
    const [reduced, setReduced] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReduced(mq.matches)
        const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const overLo = overLoRef.current
        const overHi = overHiRef.current
        if (!canvas || !overLo || !overHi || reduced) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        let raf = 0
        let running = true

        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
        const CH = CELL_H * dpr /* cell height, device px */
        let CW = CH * 0.6 /* replaced by measured advance in resize() */

        let gw = 0
        let gh = 0
        let mask = new Uint8Array(0) /* 1 = sim exclusion (cloud + buffer) */
        const zoneRects: Zone[] = []

        /* per-ELEMENT overlay canvases, reused across ticks — created
         * on first measure, swept when the element disappears
         * (client-side navigation) */
        const pool = new Map<number, Overlay>()
        const jobs: OverlayJob[] = []
        const dropPool = () => {
            for (const ent of pool.values()) {
                ent.lo.remove()
                ent.hi?.remove()
            }
            pool.clear()
            jobs.length = 0
        }
        /* shared band-composition scratch, grown to the largest overlay
         * once — no per-tick allocation */
        let sCls = new Uint8Array(0) /* 0 none, 1 white, 2 blob */
        let sF = new Float32Array(0) /* feather ramp, min over rects */

        /* One reusable Range for text measurement — no per-frame allocs */
        const range = document.createRange()

        /* A dead zone hugs its CONTENT, not its box: per-line rects for
         * every text node (via Range.getClientRects) plus the boxes of
         * images and icons. The mold can then fill the ragged margins a
         * block rectangle would sterilize — after a short last line,
         * along the ASCII art's outline, beside a caption. */
        /* push a line rect with the node's font-metric padding trimmed
         * off — the zone should trace ink, not the font bounding box */
        const pushInkRect = (r: DOMRect, t: InkTrim, out: Box[]) => {
            const top = r.top + t.top
            const bottom = r.bottom - t.bottom
            if (bottom - top < 2) return
            out.push({
                left: r.left,
                right: r.right,
                top,
                bottom,
                width: r.width,
                height: bottom - top
            })
        }

        const contentRects = (node: Node, out: Box[]): void => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (!/\S/.test(node.nodeValue ?? '')) return
                const trim = inkTrim(node as Text)
                /* inside a <pre>, whitespace is layout: measure each
                 * glyph run on its own so padding spaces stay ALIVE */
                if (node.parentElement?.closest('pre')) {
                    for (const [a, b] of runsOf(node as Text)) {
                        range.setStart(node, a)
                        range.setEnd(node, b)
                        const rects = range.getClientRects()
                        for (let i = 0; i < rects.length; i++)
                            pushInkRect(rects[i]!, trim, out)
                    }
                    return
                }
                range.selectNodeContents(node)
                const rects = range.getClientRects()
                for (let i = 0; i < rects.length; i++)
                    pushInkRect(rects[i]!, trim, out)
                return
            }
            if (!(node instanceof Element)) return
            const tag = node.tagName.toUpperCase()
            if (
                tag === 'SVG' ||
                tag === 'IMG' ||
                tag === 'CANVAS' ||
                tag === 'VIDEO'
            ) {
                out.push(node.getBoundingClientRect())
                return
            }
            node.childNodes.forEach(child => contentRects(child, out))
        }

        /* Re-measured each TICK, inside the same rAF that draws: layout
         * is clean by then, so the reads are cheap and the zones track
         * layout changes and client-side navigations (stale nodes
         * measure 0×0 and are skipped). The canvas is fixed at inset 0,
         * so client coordinates ARE canvas coordinates. */
        /* scroll position at the last measurement — between measures,
         * updateMask translates the cached zones by the scroll delta
         * instead of re-reading the DOM (Safari's Range machinery is
         * expensive at display rate; geometry only changes with layout) */
        let mzX = 0
        let mzY = 0

        /* real hover only — touch browsers synthesize :hover from taps,
         * which would ignite blobs mid-touch (globals.css gates the
         * painted anchor identically; the two must stay in lockstep) */
        const hoverable = window.matchMedia('(hover: hover)').matches

        const measureZones = () => {
            zoneRects.length = 0
            jobs.length = 0
            mzX = window.scrollX
            mzY = window.scrollY
            const used = new Set<number>()
            document.querySelectorAll('[data-cloud]').forEach((el, k) => {
                const paint = el.getAttribute('data-cloud') !== 'dead'
                const pad = cellAttr(
                    el,
                    'data-cloud-pad',
                    paint ? PAD : DEAD_PAD
                )
                const buffer = cellAttr(
                    el,
                    'data-cloud-buffer',
                    paint ? BUFFER : DEAD_BUFFER
                )
                const wobOverride =
                    el.getAttribute('data-cloud-wob') !== null
                        ? cellAttr(el, 'data-cloud-wob', WOB_MIN)
                        : null
                /* per-frame hover/focus state — no listeners needed */
                const hot =
                    el.hasAttribute('data-cloud-hover') &&
                    el.matches(
                        hoverable ? ':hover, :focus-visible' : ':focus-visible'
                    )
                /* painted clouds need their whole block — the blob must
                 * cover the painted .cloud-zone anchor. Dead zones hug
                 * their content instead. */
                const rects: Box[] = []
                if (paint) rects.push(el.getBoundingClientRect())
                else contentRects(el, rects)
                const zs: Zone[] = []
                for (const r of rects) {
                    /* skip degenerate boxes: stale nodes, sr-only text */
                    if (r.width < 2 || r.height < 2) continue
                    /* breathing amplitude: the element's data-cloud-wob
                     * override, else scaled from this rect's minor
                     * dimension — big blobs get big lobes, a single
                     * text line stays modest */
                    const minDim = Math.min(
                        (r.width * dpr) / CW,
                        (r.height * dpr) / CH
                    )
                    const wob =
                        wobOverride ??
                        Math.min(
                            WOB_MAX,
                            Math.max(
                                paint ? WOB_MIN : DEAD_WOB_MIN,
                                minDim * WOB_SCALE
                            )
                        )
                    const fade = paint ? FADE : DEAD_FADE
                    zs.push({
                        x0: (r.left * dpr) / CW,
                        x1: (r.right * dpr) / CW,
                        y0: (r.top * dpr) / CH,
                        y1: (r.bottom * dpr) / CH,
                        /* per ELEMENT, so one zone's lines breathe as one */
                        phase: k * 2.39,
                        wob,
                        pad,
                        buffer,
                        fade,
                        paint,
                        hot,
                        docL: r.left + window.scrollX,
                        docT: r.top + window.scrollY,
                        wpx: r.width,
                        hpx: r.height,
                        kx: paint ? 1 : CW / CH,
                        reach: pad + wob * CREST + buffer + fade + 1
                    })
                }
                if (!zs.length) return
                zoneRects.push(...zs)
                /* ONE overlay per element: the union bbox of its rects
                 * plus the widest pads any rect needs */
                let bL = Infinity
                let bT = Infinity
                let bR = -Infinity
                let bB = -Infinity
                let padXc = 0
                let padYc = 0
                for (const z of zs) {
                    bL = Math.min(bL, z.docL)
                    bT = Math.min(bT, z.docT)
                    bR = Math.max(bR, z.docL + z.wpx)
                    bB = Math.max(bB, z.docT + z.hpx)
                    padXc = Math.max(padXc, Math.ceil(z.reach / z.kx) + 1)
                    padYc = Math.max(padYc, Math.ceil(z.reach) + 1)
                }
                let ent = pool.get(k)
                if (!ent || (ent.hi !== null) !== paint) {
                    ent?.lo.remove()
                    ent?.hi?.remove()
                    /* maxWidth: the base stylesheet's responsive
                     * `canvas { max-width: 100% }` resolves against the
                     * zero-width overlay shell and would clamp these to
                     * nothing */
                    const mk = () => {
                        const c = document.createElement('canvas')
                        c.style.position = 'absolute'
                        c.style.maxWidth = 'none'
                        return c
                    }
                    const lo = mk()
                    overLo.appendChild(lo)
                    let hi: HTMLCanvasElement | null = null
                    if (paint) {
                        hi = mk()
                        overHi.appendChild(hi)
                    }
                    ent = {
                        lo,
                        loCtx: lo.getContext('2d'),
                        hi,
                        hiCtx: hi ? hi.getContext('2d') : null,
                        rastered: false
                    }
                    pool.set(k, ent)
                }
                used.add(k)
                /* OVERLAY_MAX_CELLS: a runaway element (a data-cloud on
                 * something page-sized) must not allocate an unbounded
                 * canvas — clamp; the blob clips rather than the page
                 * dying on canvas memory */
                jobs.push({
                    ent,
                    zones: zs,
                    oL: bL - (padXc * CW) / dpr,
                    oT: bT - (padYc * CH) / dpr,
                    gw2: Math.min(
                        OVERLAY_MAX_CELLS,
                        Math.ceil(((bR - bL) * dpr) / CW) + padXc * 2
                    ),
                    gh2: Math.min(
                        OVERLAY_MAX_CELLS,
                        Math.ceil(((bB - bT) * dpr) / CH) + padYc * 2
                    )
                })
            })
            /* sweep canvases whose element is gone (navigation, unmount
             * of a card) — stale nodes measure 0×0 and land here too */
            for (const [key, ent] of pool) {
                if (!used.has(key)) {
                    ent.lo.remove()
                    ent.hi?.remove()
                    pool.delete(key)
                }
            }
        }

        const resize = () => {
            const w = Math.floor(canvas.clientWidth * dpr)
            const h = Math.floor(canvas.clientHeight * dpr)
            /* iOS fires resize as its URL bar settles; the canvas is
             * sized in lvh so its box hasn't actually changed — bail
             * before reallocating anything */
            if (w === canvas.width && h === canvas.height && gw > 0) return
            canvas.width = w
            canvas.height = h
            ctx.font = `${CH * 0.9}px ui-monospace, Menlo, monospace`
            ctx.textBaseline = 'top'
            CW = ctx.measureText('M').width /* measured, never assumed */
            if (!(CW > 0)) CW = CH * 0.6 /* a 0 would make the grid infinite */
            const oldGw = gw
            const oldGh = gh
            /* ceil: the cell grid covers the full canvas, so a blob can
             * reach the right and bottom edges without a flat clip */
            gw = Math.max(4, Math.ceil(canvas.width / CW))
            gh = Math.max(4, Math.ceil(canvas.height / CH))
            mask = new Uint8Array(gw * gh)
            pointer.active = false /* grid changed; wait for the next move */
            remap(oldGw, oldGh) /* the colony survives the new grid */
            dropPool() /* cell metrics may have changed; re-raster fresh */
            measureZones()
            /* raster the fresh overlays in THIS frame — waiting for the
             * next tick would blank every blob for up to 33ms after a
             * rotation (paintOverlays is declared below, but resize()
             * only ever runs after full effect setup) */
            paintOverlays(performance.now() / 1000)
        }

        /* Rebuilt every tick — the SIM's view of the bands, cut on the
         * viewport grid. Visuals are the overlays' job (paintOverlays
         * cuts the same field per zone); this mask only steers agents,
         * so a tick of staleness during a scroll is invisible. */
        const updateMask = (t: number) => {
            mask.fill(0)
            /* zones were measured at (mzX, mzY); shift them by however
             * far the page has scrolled since — DOM-free tracking */
            const shX = ((mzX - window.scrollX) * dpr) / CW
            const shY = ((mzY - window.scrollY) * dpr) / CH
            /* sample the wobble in DOCUMENT cells, like the overlays
             * do — the two cuts of the field must breathe as one */
            const sox = (window.scrollX * dpr) / CW
            const soy = (window.scrollY * dpr) / CH
            for (const z of zoneRects) {
                const zx0 = z.x0 + shX
                const zx1 = z.x1 + shX
                const zy0 = z.y0 + shY
                const zy1 = z.y1 + shY
                /* DEAD zones measure distance isotropically in PIXELS
                 * (row units): a cell is only ~0.6× as wide as it is
                 * tall, so raw cell-unit distance gave text ~40% less
                 * horizontal clearance than vertical — the mold visibly
                 * crowded the ends of lines while wasting space above
                 * and below. kx converts a horizontal cell distance
                 * into row units. Painted clouds keep the cell-metric
                 * field their look and spacing scale were tuned on. */
                const kx = z.kx
                const bx0 = Math.max(0, Math.floor(zx0 - z.reach / kx))
                const bx1 = Math.min(gw - 1, Math.ceil(zx1 + z.reach / kx))
                const by0 = Math.max(0, Math.floor(zy0 - z.reach))
                const by1 = Math.min(gh - 1, Math.ceil(zy1 + z.reach))
                for (let y = by0; y <= by1; y++) {
                    /* distances from the CELL CENTER — measuring from the
                     * top-left corner would bias every blob one cell down
                     * and right */
                    const yc = y + 0.5
                    const dy = yc < zy0 ? zy0 - yc : yc > zy1 ? yc - zy1 : 0
                    for (let x = bx0; x <= bx1; x++) {
                        const xc = x + 0.5
                        const dx =
                            (xc < zx0 ? zx0 - xc : xc > zx1 ? xc - zx1 : 0) * kx
                        const d = Math.sqrt(dx * dx + dy * dy)
                        const w = wobble(x + sox, y + soy, t, z.phase)
                        /* bias toward the inner radius: mostly snug, with
                         * occasional outward puffs */
                        const puff = Math.pow((w + 1) / 2, LOBE_BIAS)
                        /* cumulus: blend the amplitude by how far above
                         * (crest) or below (keel) the element this cell
                         * sits; vert is 0 beside it, 1 straight over/under */
                        const vert = d > 0 ? dy / d : 0
                        const amp =
                            yc < zy0
                                ? FLANK + (CREST - FLANK) * vert
                                : yc > zy1
                                  ? FLANK + (KEEL - FLANK) * vert
                                  : FLANK
                        const off = z.pad + z.wob * amp * puff
                        /* cloud and moat both wall the sim out; the
                         * fade band is render-only and lives entirely
                         * on the overlays now */
                        if (d < off + z.buffer) mask[y * gw + x] = 1
                    }
                }
            }
        }

        /* window-level pointer tracking — the canvas never gets events */
        const pointer = { x: -1, y: -1, active: false }
        const onMove = (e: PointerEvent) => {
            const cx = (e.clientX * dpr) / CW
            const cy = (e.clientY * dpr) / CH
            if (cx < 0 || cy < 0 || cx >= gw || cy >= gh) {
                pointer.active = false
                return
            }
            pointer.active = true
            pointer.x = Math.floor(cx)
            pointer.y = Math.floor(cy)
        }

        const hash = (x: number, y: number) => {
            const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
            return h - Math.floor(h)
        }

        const drawField = (get: (x: number, y: number) => number) => {
            /* transparent canvas: the page's own white shows wherever
             * nothing is painted. Glyphs only — clouds, moats, and
             * feathers live on the document-anchored overlays, which
             * occlude whatever renders beneath them (trails PERSIST
             * under the exclusion, so glyphs are drawn everywhere). */
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = INK
            for (let y = 0; y < gh; y++) {
                let line = ''
                for (let x = 0; x < gw; x++) {
                    let v = Math.max(0, Math.min(1, get(x, y)))
                    if (v < CUT) {
                        line += ' '
                        continue
                    }
                    v = (v - CUT) / (1 - CUT)
                    v = Math.max(0, Math.min(1, v + (hash(x, y) - 0.5) * 0.08))
                    line +=
                        RAMP[
                            Math.min(
                                RAMP.length - 1,
                                Math.floor(v * RAMP.length)
                            )
                        ]!
                }
                ctx.fillText(line, 0, y * CH)
            }
        }

        /* ── Overlay painting ────────────────────────────────────────
         * One canvas set per element, rastered from a shared scratch:
         * every rect of the element composes its bands into the same
         * local field (solid beats feather, blob beats white, feathers
         * take the strongest ramp), then one pass paints the result.
         * The local grid is anchored to the ELEMENT, so the shape is
         * scroll-invariant — the compositor carries the canvases with
         * the content, pixel-perfect at any speed, and this only
         * repaints for the 30Hz breathing. The wobble is sampled in
         * document cells so an element's rects (a dead zone's text
         * lines) breathe as one coherent edge. */
        const PAGE = '#ffffff' /* the page's white — occludes glyphs */
        const paintOverlays = (t: number) => {
            /* offscreen overlays keep their last raster — stale
             * breathing on an invisible blob costs nothing. An overlay
             * is only culled AFTER its first raster: a never-painted
             * canvas entering mid-flick would arrive blank. The margin
             * is a full viewport each way, so even a violent flick
             * crosses it slower than the ≤33ms it takes the next tick
             * to raster what's coming. */
            const m = window.innerHeight
            const vTop = window.scrollY - m
            const vBot = window.scrollY + 2 * m
            for (const job of jobs) {
                const { ent, zones, oL, oT, gw2, gh2 } = job
                const lo = ent.loCtx
                if (!lo) continue
                const W = Math.ceil(gw2 * CW)
                const H = gh2 * CH
                if (
                    ent.rastered &&
                    (oT + H / dpr < vTop || oT > vBot)
                )
                    continue
                /* grow the shared scratch to this overlay's grid */
                const n = gw2 * gh2
                if (sCls.length < n) {
                    sCls = new Uint8Array(n)
                    sF = new Float32Array(n)
                }
                sCls.fill(0, 0, n)
                sF.fill(1, 0, n)
                /* compose every rect's bands into the scratch, each
                 * over its own bounded box — same pattern as the sim's
                 * updateMask, in the overlay's local cells */
                const xoff = (oL * dpr) / CW /* local → document cells */
                const yoff = (oT * dpr) / CH
                for (const z of zones) {
                    const zx0 = ((z.docL - oL) * dpr) / CW
                    const zx1 = zx0 + (z.wpx * dpr) / CW
                    const zy0 = ((z.docT - oT) * dpr) / CH
                    const zy1 = zy0 + (z.hpx * dpr) / CH
                    const bx0 = Math.max(0, Math.floor(zx0 - z.reach / z.kx))
                    const bx1 = Math.min(
                        gw2 - 1,
                        Math.ceil(zx1 + z.reach / z.kx)
                    )
                    const by0 = Math.max(0, Math.floor(zy0 - z.reach))
                    const by1 = Math.min(gh2 - 1, Math.ceil(zy1 + z.reach))
                    for (let y = by0; y <= by1; y++) {
                        const yc = y + 0.5
                        const dy =
                            yc < zy0 ? zy0 - yc : yc > zy1 ? yc - zy1 : 0
                        for (let x = bx0; x <= bx1; x++) {
                            const xc = x + 0.5
                            const dx =
                                (xc < zx0
                                    ? zx0 - xc
                                    : xc > zx1
                                      ? xc - zx1
                                      : 0) * z.kx
                            const d = Math.sqrt(dx * dx + dy * dy)
                            const w = wobble(x + xoff, y + yoff, t, z.phase)
                            const puff = Math.pow((w + 1) / 2, LOBE_BIAS)
                            const vert = d > 0 ? dy / d : 0
                            const amp =
                                yc < zy0
                                    ? FLANK + (CREST - FLANK) * vert
                                    : yc > zy1
                                      ? FLANK + (KEEL - FLANK) * vert
                                      : FLANK
                            const off = z.pad + z.wob * amp * puff
                            const i = y * gw2 + x
                            if (d < off) {
                                /* dead zones' "blob" is exclusion: white */
                                const cls = z.paint ? 2 : 1
                                if (cls > sCls[i]!) sCls[i] = cls
                            } else if (d < off + z.buffer) {
                                if (sCls[i]! < 1) sCls[i] = 1
                            } else {
                                const f = (d - off - z.buffer) / z.fade
                                if (f < sF[i]!) sF[i] = f
                            }
                        }
                    }
                }
                /* size + place the canvases, then raster the scratch:
                 * solid runs batched (+1px overlap, no seams), the
                 * feather's per-cell alpha painted singly */
                for (const c of [ent.lo, ent.hi]) {
                    if (!c) continue
                    if (c.width !== W || c.height !== H) {
                        c.width = W
                        c.height = H
                    }
                    c.style.left = `${oL}px`
                    c.style.top = `${oT}px`
                    c.style.width = `${W / dpr}px`
                    c.style.height = `${H / dpr}px`
                }
                const hi = ent.hiCtx
                const hot = zones[0]!.hot
                lo.clearRect(0, 0, W, H)
                hi?.clearRect(0, 0, W, H)
                for (let y = 0; y < gh2; y++) {
                    let runX = 0
                    let runCls = 0
                    /* the x === gw2 sentinel flushes the last run */
                    for (let x = 0; x <= gw2; x++) {
                        const cls = x < gw2 ? sCls[y * gw2 + x]! : 0
                        if (cls !== runCls) {
                            if (runCls) {
                                const px = runX * CW
                                const wRun = (x - runX) * CW + 1
                                if (runCls === 2 && hi) {
                                    hi.fillStyle = hot
                                        ? CLOUD_HOT
                                        : CLOUD_FILL
                                    hi.fillRect(px, y * CH, wRun, CH + 1)
                                } else {
                                    lo.globalAlpha = 1
                                    lo.fillStyle = PAGE
                                    lo.fillRect(px, y * CH, wRun, CH + 1)
                                }
                            }
                            runX = x
                            runCls = cls
                        }
                        if (x < gw2 && cls === 0) {
                            const f = sF[y * gw2 + x]!
                            if (f < 1) {
                                lo.globalAlpha = 1 - f
                                lo.fillStyle = PAGE
                                lo.fillRect(x * CW, y * CH, CW + 1, CH + 1)
                            }
                        }
                    }
                }
                lo.globalAlpha = 1
                ent.rastered = true
            }
        }

        /* spawn helper: never place an agent inside cloud or buffer */
        const freeSpot = (): [number, number] => {
            for (let tries = 0; tries < 20; tries++) {
                const x = Math.random() * gw
                const y = Math.random() * gh
                if (!mask[Math.floor(y) * gw + Math.floor(x)]) return [x, y]
            }
            return [0, 0]
        }

        /* ---- simulation ------------------------------------------------ */
        const ax = new Float32Array(N)
        const ay = new Float32Array(N)
        const aa = new Float32Array(N)
        let trail = new Float32Array(0)
        let next = new Float32Array(0)
        const init = () => {
            trail = new Float32Array(gw * gh)
            next = new Float32Array(gw * gh)
            for (let i = 0; i < N; i++) {
                const [x, y] = freeSpot()
                ax[i] = x
                ay[i] = y
                aa[i] = Math.random() * Math.PI * 2
            }
        }
        /* carry the colony across a grid change (rotation, a window
         * resize, iOS chrome settling): copy the overlapping region of
         * the trail field instead of resetting the organism */
        const remap = (oldGw: number, oldGh: number) => {
            if (oldGw === 0 || trail.length !== oldGw * oldGh) {
                init()
                return
            }
            const nt = new Float32Array(gw * gh)
            const cw = Math.min(gw, oldGw)
            const ch = Math.min(gh, oldGh)
            for (let y = 0; y < ch; y++) {
                for (let x = 0; x < cw; x++) {
                    nt[y * gw + x] = trail[y * oldGw + x]!
                }
            }
            trail = nt
            next = new Float32Array(gw * gh)
            for (let i = 0; i < N; i++) {
                if (ax[i]! >= gw) ax[i] = Math.random() * gw
                if (ay[i]! >= gh) ay[i] = Math.random() * gh
            }
        }

        resize() /* first call reaches init() through remap */

        /* overcrowding aversion: preference peaks at SAT and falls off
         * above, so saturated highways repel their own traffic — no
         * stable fixed point */
        const pref = (v: number) => (v <= SAT ? v : Math.max(0, SAT * 2 - v))

        const cellAt = (x: number, y: number) => {
            const xi = ((Math.floor(x) % gw) + gw) % gw
            const yi = ((Math.floor(y) % gh) + gh) % gh
            return yi * gw + xi
        }
        /* exclusion senses as NEUTRAL: agents wander up to the buffer's
         * outer edge, get blocked, deposit trail — the colony grows
         * around the moat instead of keeping a standoff distance */
        const sense = (x: number, y: number) => {
            const i = cellAt(x, y)
            return mask[i] ? 0 : pref(trail[i]!)
        }

        /* when a breathing boundary swallows an agent, push it out
         * radially from the nearest zone center (teleporting would look
         * like popping) */
        const pushOut = (i: number) => {
            let best: { cx: number; cy: number } | null = null
            let bestD = Infinity
            for (const z of zoneRects) {
                const cx = (z.x0 + z.x1) / 2
                const cy = (z.y0 + z.y1) / 2
                const d = (ax[i]! - cx) ** 2 + (ay[i]! - cy) ** 2
                if (d < bestD) {
                    bestD = d
                    best = { cx, cy }
                }
            }
            if (!best) return
            let dx = ax[i]! - best.cx
            let dy = ay[i]! - best.cy
            const len = Math.hypot(dx, dy) || 1
            dx /= len
            dy /= len
            for (let s = 0; s < 12; s++) {
                ax[i] = ax[i]! + dx
                ay[i] = ay[i]! + dy
                if (!mask[cellAt(ax[i]!, ay[i]!)]) return
            }
            const [x, y] = freeSpot() /* fallback: couldn't escape radially */
            ax[i] = x
            ay[i] = y
        }

        /* one tuned sim step: cursor food, agent sense/turn/move/deposit,
         * trail diffusion + decay. One step == one frame of the tuned
         * 60Hz reference demo; the loop below decides how many to run. */
        const step = () => {
            if (pointer.active && !mask[pointer.y * gw + pointer.x]) {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const x = pointer.x + dx
                        const y = pointer.y + dy
                        if (
                            x >= 0 &&
                            x < gw &&
                            y >= 0 &&
                            y < gh &&
                            !mask[y * gw + x]
                        ) {
                            trail[y * gw + x] = trail[y * gw + x]! + FOOD
                        }
                    }
                }
            }

            for (let i = 0; i < N; i++) {
                if (Math.random() < TURNOVER) {
                    const [x, y] = freeSpot()
                    ax[i] = x
                    ay[i] = y
                    aa[i] = Math.random() * Math.PI * 2
                }
                /* the buffer may have swallowed this agent as it breathed
                 * out — or as its element scrolled over the colony */
                if (mask[cellAt(ax[i]!, ay[i]!)]) pushOut(i)

                const a = aa[i]!
                const px = ax[i]!
                const py = ay[i]!
                const f = sense(px + Math.cos(a) * SD, py + Math.sin(a) * SD)
                const l = sense(
                    px + Math.cos(a - SA) * SD,
                    py + Math.sin(a - SA) * SD
                )
                const r = sense(
                    px + Math.cos(a + SA) * SD,
                    py + Math.sin(a + SA) * SD
                )
                if (f >= l && f >= r) {
                    /* hold course */
                } else if (l > r) aa[i] = a - TURN
                else if (r > l) aa[i] = a + TURN
                else aa[i] = a + (Math.random() - 0.5) * TURN

                let nx = px + Math.cos(aa[i]!) * SPEED
                let ny = py + Math.sin(aa[i]!) * SPEED
                if (nx < 0) nx += gw
                if (nx >= gw) nx -= gw
                if (ny < 0) ny += gh
                if (ny >= gh) ny -= gh

                if (mask[cellAt(nx, ny)]) {
                    /* hit the buffer's outer edge: stay put, turn away
                     * sharply */
                    aa[i] = aa[i]! + Math.PI * (0.75 + Math.random() * 0.5)
                } else {
                    ax[i] = nx
                    ay[i] = ny
                    const idx = cellAt(nx, ny)
                    trail[idx] = Math.min(trail[idx]! + DEPOSIT, TRAIL_MAX)
                }
            }

            for (let y = 0; y < gh; y++) {
                const yU = (y - 1 + gh) % gh
                const yD = (y + 1) % gh
                for (let x = 0; x < gw; x++) {
                    /* trails PERSIST under the exclusion (they only
                     * decay): agents are still barred and rendering is
                     * still suppressed by fadeF, but a zone scrolling
                     * across the field no longer strip-mines the colony
                     * — crucial on phones, where zones span the width */
                    const i = y * gw + x
                    const xL = (x - 1 + gw) % gw
                    const xR = (x + 1) % gw
                    const s =
                        trail[yU * gw + xL]! +
                        trail[yU * gw + x]! +
                        trail[yU * gw + xR]! +
                        trail[y * gw + xL]! +
                        trail[y * gw + x]! +
                        trail[y * gw + xR]! +
                        trail[yD * gw + xL]! +
                        trail[yD * gw + x]! +
                        trail[yD * gw + xR]!
                    const nv = (s / 9) * DECAY
                    next[i] = nv < 0.01 ? 0 : nv
                }
            }
            ;[trail, next] = [next, trail]
        }

        /* fixed-timestep loop — see the Cadence note by the tunables.
         * Scrolling never forces a frame: nothing painted here tracks
         * the viewport (the fixed canvas is a pure backdrop, the
         * overlays ride the page on the compositor). Scroll position
         * is watched only to spare Safari the Range re-measure while a
         * flick is still moving. */
        const coarse = window.matchMedia('(pointer: coarse)').matches
        let acc = 0
        let lastT = 0
        let lastSX = -1
        let lastSY = -1
        let settleT = -Infinity /* time of the last observed scroll move */

        const loop = (tMs: number) => {
            if (!running) return
            raf = requestAnimationFrame(loop)

            acc += lastT ? Math.min(tMs - lastT, DT_CLAMP) : TICK_MS
            lastT = tMs

            if (window.scrollY !== lastSY || window.scrollX !== lastSX) {
                settleT = tMs
                lastSY = window.scrollY
                lastSX = window.scrollX
            }
            if (acc < TICK_MS) return /* idle frame: free */

            let ticks = Math.floor(acc / TICK_MS)
            acc -= ticks * TICK_MS
            ticks = Math.min(ticks, MAX_TICKS)

            /* fresh DOM geometry each tick — except mid-scroll on
             * coarse pointers, where the cached zones translated by
             * the scroll delta are exact while layout is stable and
             * Safari's Range machinery is the one genuinely expensive
             * piece (SETTLE_MS outlasts momentum's sub-pixel coasting);
             * the first tick after the scroll settles re-measures */
            if (!(coarse && tMs - settleT < SETTLE_MS)) measureZones()
            updateMask(tMs / 1000) /* everything breathes together */
            for (let k = 0; k < ticks * STEPS_PER_TICK; k++) step()
            drawField((x, y) => trail[y * gw + x]! / RENDER_DIV)
            paintOverlays(tMs / 1000)
        }
        raf = requestAnimationFrame(loop)

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('resize', resize)

        /* webfonts swap in after first paint — retire ink trims measured
         * against fallback faces (they recompute lazily next frame) */
        document.fonts?.ready.then(resetInkTrims)

        /* no burning battery in background tabs */
        const onVisibility = () => {
            cancelAnimationFrame(raf)
            if (!document.hidden && running) raf = requestAnimationFrame(loop)
        }
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            running = false
            cancelAnimationFrame(raf)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('resize', resize)
            document.removeEventListener('visibilitychange', onVisibility)
            dropPool()
        }
    }, [reduced])

    /* Reduced motion: no canvas — the painted .cloud-zone rectangles
     * carry the content. A static page, no movement. */
    if (reduced) return null

    return (
        <>
            {/* 100lvh (large-viewport height): the canvas keeps one
              * stable size while mobile browser chrome collapses and
              * expands — no mid-scroll stretching, no resize storms.
              * h-full is the fallback where lvh isn't supported. */}
            <canvas
                ref={canvasRef}
                aria-hidden='true'
                className='pointer-events-none fixed left-0 top-0 -z-10 h-full w-full'
                style={{ height: '100lvh' }}
            />
            {/* Document-anchored overlay layers: absolutely positioned
              * at the document origin (body isn't positioned, so the
              * containing block is the initial one), zero-height shells
              * whose per-zone canvases the compositor scrolls WITH the
              * page. Whites below blobs — one card's feather can never
              * wash a neighbor's blob edge. Both sit under the content
              * and above the glyph canvas. */}
            <div
                ref={overLoRef}
                aria-hidden='true'
                className='pointer-events-none absolute left-0 top-0'
                style={{ zIndex: -6 }}
            />
            <div
                ref={overHiRef}
                aria-hidden='true'
                className='pointer-events-none absolute left-0 top-0'
                style={{ zIndex: -4 }}
            />
        </>
    )
}
