'use client'

import { useEffect, useRef, useState } from 'react'

/* ── PhysarumBackground ───────────────────────────────────────────────
 * Breathing black clouds and an ASCII slime-mold organism, inked onto
 * the page itself.
 *
 * ONE GROUND. There is no foreground and background — the canvas is a
 * single DOCUMENT-SIZED, absolutely-positioned element laid into the
 * page under the content (z -10), and the whole world — trail field,
 * blobs, breathing noise, glyph grid — lives in document coordinates
 * on it. The compositor scrolls canvas and content together as one
 * surface: scrolling involves NO JavaScript, no repaint, no chasing,
 * and therefore no possible slip, lag, or tear between the organism
 * and the content it grows around. Three things follow:
 *   · A blob has ONE silhouette, part of its element's place on the
 *     page — scrolling cannot re-cut it against a different patch of
 *     noise (screen-space sampling once made cards flash and
 *     shape-shift as you scrolled).
 *   · The colony is rooted: scroll away and back, and the mold you
 *     left is still there, frozen as painted ink until the live
 *     window returns to it.
 *   · A fixed canvas needed lvh sizing, scroll-frame repaints and
 *     latency prediction; a page canvas needs none of it.
 * The SIM runs only in a window around the viewport (WIN_MARGIN
 * viewports of margin): agents that fall outside respawn inside, the
 * diffusion pass touches only window rows, and each tick repaints
 * only the window's rows — everything else stays as valid frozen ink.
 * The backing resolution adapts (AREA_MAX) so the one canvas always
 * fits Safari's canvas-area ceiling; its height is CAPACITY, grown in
 * CAP_CHUNK steps and never shrunk at a given width, so a webfont
 * swap or a late image can't churn multi-megabyte backing stores —
 * the clipping wrapper trims the spare tail to the document.
 *
 * Three concentric bands surround every [data-cloud] element, all cut
 * per tick from ONE distance field (updateMask):
 *
 *   1. CLOUD  (d < off)                 solid black blob; the element's
 *      white text rides it. off = PAD + wobble, an eccentric cumulus
 *      isoline: three octaves of drifting sine noise, amplitude scaled
 *      to the element's size (or pinned via data-cloud-wob), biased
 *      snug with occasional puffs (LOBE_BIAS), billowing at the crest
 *      and calm at the keel (CREST/FLANK/KEEL). Corners round by
 *      construction.
 *   2. BUFFER (off <= d < off+BUFFER)   clean page — no paint, no
 *      glyphs, no agents. The moat that keeps the mold and the cloud
 *      from ever touching.
 *   3. FADE   (the next FADE cells)     mold territory begins; rendered
 *      trail density is multiplied by a 0→1 ramp across the band, so
 *      the colony's edge dissolves through the glyph ramp instead of
 *      cutting off. Render-only — the sim still sees a hard wall at
 *      the buffer's outer edge.
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
 * THE BLOB IS THE BUTTON. On a data-cloud-hover element the breathing
 * silhouette itself is the hit area: the cursor entering it (tested
 * per FRAME against the same cloudEdge isoline the paint uses)
 * ignites the whole cloud fuchsia, and the painted .cloud-zone anchor
 * flips with it in the same frame via the data-cloud-hot attribute
 * (see globals.css). A breath that slips the edge out from under a
 * parked cursor un-ignites it just as fast. A plain click inside the
 * blob activates the anchor; keyboard focus ignites through the same
 * path.
 *
 * PAINTED ANCHOR. .cloud-zone elements keep their painted black
 * rectangle even while the canvas runs: the blob always reaches at
 * least PAD beyond it, so at rest the eye only ever sees the blob's
 * curved edge. The rectangle bridges the first tick before the sheet
 * is inked, and it is the whole no-JS / reduced-motion fallback.
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
 * Fixed timestep. The sim advances exactly STEP_HZ tuned steps per
 * second on EVERY display, so a 120Hz screen doesn't run the organism
 * at double speed and a struggling one only slows gracefully. Ticks
 * batch those steps and re-ink the live window: 30 ticks/s on
 * fine-pointer machines, 20 on touch devices — the same organism at
 * a third less painting and texture upload, invisible for a
 * glyph-quantized render. Every other frame costs nothing, and
 * scrolling costs nothing on ANY frame — the canvas is part of the
 * page. */
const STEP_HZ = 60 /* the sim's parameters are tuned per 60Hz step */
const TICK_HZ = 30
const TICK_HZ_COARSE = 20
const MAX_TICKS = 2 /* cap catch-up after jank — drop time, don't spiral */
const DT_CLAMP = 100 /* ms — returning from a hidden tab isn't jank */

/* ── Document grid ───────────────────────────────────────────────────
 * The field spans the whole page: gw columns (the page never scrolls
 * horizontally) by up to DOC_ROWS_MAX document rows — a hard cap so a
 * pathological page height can't allocate unbounded arrays (~1MB of
 * Float32 at the cap; the homepage needs a few hundred rows). The sim
 * is ALIVE only inside a window of the viewport ± WIN_MARGIN
 * viewports; everything outside is frozen in place.
 *
 * AREA_MAX bounds the one canvas's backing pixels: Safari (iOS and
 * macOS alike) refuses canvases past ~16.7M px². The render density
 * is derived from it — a phone page fits at full density; a very wide
 * or very long page softens slightly instead of failing. */
const DOC_ROWS_MAX = 4096
const WIN_MARGIN = 0.5 /* viewports of live-sim margin above and below */
const AREA_MAX = 14_000_000 /* device px² — safely under Safari's limit */
const CAP_CHUNK = 256 /* CSS px — canvas height granularity and headroom */

/* renderer */
const RENDER_DIV = 4.5 /* trail -> glyph density divisor (sparsity) */
const CUT = 0.06 /* below this, cells render as true whitespace */

/* palette — color means alive; black-and-white means content */
const INK = 'rgba(255, 0, 204, 0.9)' /* fuchsia mold on the white page */
const CLOUD_FILL = '#000000' /* clouds are black; text on them is white */
/* fuchsia — the site-wide interaction color. Hovering (or keyboard-
 * focusing) an element marked data-cloud-hover ignites its whole
 * cloud; the painted .cloud-zone anchor under it flips via CSS in the
 * same frame (see globals.css — the two must stay in lockstep). */
const CLOUD_HOT = '#ff00cc'

type Zone = {
    el: Element
    hoverable: boolean
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
}

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
        if (!canvas || reduced) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        /* the `reduced` state lags one commit behind the media query on
         * first mount — read the query directly too, so a reduced-motion
         * visit never allocates the world or flips data-organism at all */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return
        /* announce the running organism — globals.css keys canvas-only
         * styles off this attribute, so no-JS and reduced-motion pages
         * (which never set it) keep their painted-fallback layout. Set
         * BEFORE the first measure: it changes card padding. */
        document.documentElement.setAttribute('data-organism', '')
        let raf = 0
        let running = true

        /* touch devices tick at 20Hz instead of 30 — same STEP_HZ sim
         * speed, a third less painting */
        const tickHz = window.matchMedia('(pointer: coarse)').matches
            ? TICK_HZ_COARSE
            : TICK_HZ
        const tickMs = 1000 / tickHz
        const stepsPerTick = Math.round(STEP_HZ / tickHz)

        /* render density: the device ratio, capped, then reduced if the
         * document-sized canvas would exceed AREA_MAX — set in resize() */
        let dprC = Math.min(window.devicePixelRatio || 1, DPR_CAP)
        let CH = CELL_H * dprC /* cell height, device px */
        let CW = CH * 0.6 /* replaced by measured advance in resize() */

        let gw = 0 /* columns — the page never scrolls horizontally */
        let gh = 0 /* VIEWPORT rows — the render window's height */
        let dh = 0 /* CAPACITY rows — the world's height; the content's
         * own bottom edge is contentRows */
        /* the live-sim window, in document rows — set by updateWindow */
        let winTop = 0
        let winBot = 0
        /* all field arrays span the DOCUMENT: gw × dh */
        let cloudM = new Uint8Array(0) /* 0 none, 1 black cloud, 2 hot cloud */
        let mask = new Uint8Array(0) /* 1 = sim exclusion (cloud + buffer) */
        let fadeF = new Float32Array(0) /* render attenuation outside buffer */
        const zoneRects: Zone[] = []

        /* layout bookkeeping: the document height last seen (the
         * loop's cheap per-tick growth check), the width the current
         * capacity was allocated at, and that capacity in CSS px */
        let lastContentH = 0
        let lastCssW = 0
        let capH = 0
        /* rows the CONTENT occupies — the capacity tail below them is
         * clipped by the wrapper, so the live window, spawning and
         * painting all stop here instead of simulating invisible rows */
        let contentRows = 0
        const updateWindow = () => {
            /* INTEGER rows only — a fractional bound would index off
             * every array (typed arrays silently drop non-integer
             * writes and read undefined) */
            winTop = Math.max(
                0,
                Math.floor((window.scrollY * dprC) / CH - gh * WIN_MARGIN)
            )
            winBot = Math.min(
                contentRows,
                winTop + Math.ceil(gh * (1 + 2 * WIN_MARGIN))
            )
            winTop = Math.max(0, Math.min(winTop, winBot - 1))
        }

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

        /* Zones live in DOCUMENT cells, and scrolling moves nothing in
         * document space — so their rects are measured once and
         * CACHED, re-measured only when layout can actually have moved
         * them: a document height change, a window resize, webfont
         * arrival, a DOM mutation, a per-element resize. (Measuring
         * per frame would cost hundreds of getClientRects calls a
         * second — the hero art alone is ~140 glyph runs — main-thread
         * load that helps get a phone tab killed.) Stale nodes measure
         * 0×0 and are skipped; hover/focus is live state, not layout,
         * and is refreshed per tick on the cached zones. */
        let zonesDirty = false
        /* observe() always delivers one initial size report — right
         * after measureZones just measured that element. Swallow the
         * first delivery per element (roPrimed) so startup and every
         * resize don't schedule a second full-document re-ink; a real
         * size change fires again and flags normally. (observe() on an
         * already-observed element is a spec no-op, so the measure
         * walk below needs no observed-set of its own.) */
        const roPrimed = new WeakSet<Element>()
        const zoneRO = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (roPrimed.has(entry.target)) zonesDirty = true
                else roPrimed.add(entry.target)
            }
        })
        const measureZones = () => {
            zoneRects.length = 0
            const sx = window.scrollX
            const sy = window.scrollY
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
                const hoverable = el.hasAttribute('data-cloud-hover')
                /* carry live hover through the rebuild: the attribute
                 * is the canvas's own last decision, and refreshHot
                 * only writes on TRANSITIONS — rebuilding with a fresh
                 * hot=false under a set attribute would strand the
                 * anchor fuchsia forever */
                const hot =
                    hoverable &&
                    (el.hasAttribute('data-cloud-hot') ||
                        el.matches(':hover, :focus-visible'))
                zoneRO.observe(el)
                /* painted clouds need their whole block — the blob must
                 * cover the painted .cloud-zone anchor. Dead zones hug
                 * their content instead. */
                const rects: Box[] = []
                if (paint) rects.push(el.getBoundingClientRect())
                else contentRects(el, rects)
                for (const r of rects) {
                    /* skip degenerate boxes: stale nodes, sr-only text */
                    if (r.width < 2 || r.height < 2) continue
                    /* breathing amplitude: the element's data-cloud-wob
                     * override, else scaled from this rect's minor
                     * dimension — big blobs get big lobes, a single
                     * text line stays modest */
                    const minDim = Math.min(
                        (r.width * dprC) / CW,
                        (r.height * dprC) / CH
                    )
                    zoneRects.push({
                        el,
                        hoverable,
                        /* DOCUMENT cells — stable across any scroll */
                        x0: ((r.left + sx) * dprC) / CW,
                        x1: ((r.right + sx) * dprC) / CW,
                        y0: ((r.top + sy) * dprC) / CH,
                        y1: ((r.bottom + sy) * dprC) / CH,
                        /* per ELEMENT, so one zone's lines breathe as one */
                        phase: k * 2.39,
                        wob:
                            wobOverride ??
                            Math.min(
                                WOB_MAX,
                                Math.max(
                                    paint ? WOB_MIN : DEAD_WOB_MIN,
                                    minDim * WOB_SCALE
                                )
                            ),
                        pad,
                        buffer,
                        fade: paint ? FADE : DEAD_FADE,
                        paint,
                        hot
                    })
                }
            })
        }

        /* re-measure the zones and re-ink the WHOLE sheet once. Layout
         * moved, so bands may have shifted anywhere on the page — the
         * frozen rows outside the live window are WRONG now, not just
         * dormant. Rare (webfont arrival, a DOM swap, a height
         * change); ticks maintain only the live window otherwise. */
        const remeasure = (t: number) => {
            measureZones()
            zonesDirty = false
            updateWindow()
            updateMask(t, 0, contentRows)
            paintRows(0, contentRows)
        }

        const resize = () => {
            const cssW = document.documentElement.clientWidth
            const contentH = document.documentElement.scrollHeight
            /* a document-height change can move zones ANYWHERE on the
             * page even when the canvas allocation is untouched — flag
             * them for the loop's sweep (the full path below clears
             * the flag by re-measuring immediately). Height-neutral
             * resize events (iOS fires them as its URL bar settles,
             * every scroll direction change) move nothing in document
             * space and must stay free — the DOM observers catch every
             * other way zones can move. */
            if (contentH !== lastContentH) zonesDirty = true
            lastContentH = contentH
            /* the canvas height is CAPACITY, not the exact document
             * height: quantized up to CAP_CHUNK and, at a given width,
             * only ever grown. Sub-chunk growth (a webfont swap, a
             * late image) lands inside the headroom instead of
             * discarding and reallocating a multi-megabyte backing
             * store — iOS frees the old one lazily, and stacked-up
             * churn is what gets a tab killed. A width change
             * (rotation) reflows the whole world anyway, so capacity
             * restarts and may shrink. The clipping wrapper keeps the
             * spare tail from adding scrollable space. */
            if (cssW !== lastCssW) capH = 0
            lastCssW = cssW
            capH = Math.max(capH, Math.ceil(contentH / CAP_CHUNK) * CAP_CHUNK)
            /* density: device ratio, capped, reduced until the one
             * document-sized canvas fits Safari's area ceiling */
            const cand = Math.min(
                window.devicePixelRatio || 1,
                DPR_CAP,
                Math.sqrt(AREA_MAX / Math.max(1, cssW * capH))
            )
            const w = Math.floor(cssW * cand)
            const h = Math.floor(capH * cand)
            /* same capacity grid — iOS URL-bar resize events and
             * sub-chunk document changes all bail here; the content's
             * bottom edge may still have moved inside the capacity */
            if (w === canvas.width && h === canvas.height && gw > 0) {
                /* the VIEWPORT height can still have changed (vertical
                 * window resize, docked devtools) with the allocation
                 * untouched — re-fit the live window's height so a
                 * taller viewport never scrolls past frozen rows */
                gh = Math.max(4, Math.ceil((window.innerHeight * dprC) / CH))
                contentRows = Math.min(dh, Math.ceil(contentH / CELL_H))
                return
            }
            dprC = cand
            CH = CELL_H * dprC
            canvas.width = w
            canvas.height = h
            canvas.style.width = `${cssW}px`
            canvas.style.height = `${capH}px`
            ctx.font = `${CH * 0.9}px ui-monospace, Menlo, monospace`
            ctx.textBaseline = 'top'
            CW = ctx.measureText('M').width /* measured, never assumed */
            if (!(CW > 0)) CW = CH * 0.6 /* a 0 would make the grid infinite */
            const oldGw = gw
            const oldDh = dh
            /* ceil: the cell grid covers the full canvas, so a blob can
             * reach the right and bottom edges without a flat clip */
            gw = Math.max(4, Math.ceil(canvas.width / CW))
            gh = Math.max(4, Math.ceil((window.innerHeight * dprC) / CH))
            /* dh spans the CAPACITY — the field arrays share its
             * headroom, so sub-chunk growth costs no realloc anywhere */
            dh = Math.max(gh, Math.min(DOC_ROWS_MAX, Math.ceil(h / CH)))
            contentRows = Math.min(dh, Math.ceil(contentH / CELL_H))
            cloudM = new Uint8Array(gw * dh)
            mask = new Uint8Array(gw * dh)
            fadeF = new Float32Array(gw * dh)
            updateWindow()
            remap(oldGw, oldDh) /* the colony survives the new grid */
            /* the stored client point predates the reflow (browser
             * zoom, rotation) — wait for the next move */
            pointer.active = false
            remeasure(performance.now() / 1000)
        }

        /* DEAD zones measure distance isotropically in PIXELS (row
         * units): a cell is only ~0.6× as wide as it is tall, so raw
         * cell-unit distance gave text ~40% less horizontal clearance
         * than vertical — the mold visibly crowded the ends of lines
         * while wasting space above and below. kxOf converts a
         * horizontal cell distance into row units. Painted clouds keep
         * the cell-metric field their look and spacing scale were
         * tuned on. ONE definition: cloudEdge's field and updateMask's
         * bounding box must never disagree, or blobs clip flat where
         * the box falls short of the shape. */
        const kxOf = (z: Zone) => (z.paint ? 1 : CW / CH)

        /* Signed distance from zone z's breathing cloud EDGE at cell
         * (x, y): negative inside the blob, 0 at the silhouette,
         * positive out in the moat and beyond. This is the one place
         * the shape is defined — updateMask paints from it and the
         * hover hit test below reads it, so paint and hit test share
         * ONE field: they can differ only by the render's half-cell
         * quantization (a cell inks by its center), never drift. */
        const cloudEdge = (z: Zone, x: number, y: number, t: number) => {
            /* distances from the CELL CENTER — measuring from the
             * top-left corner would bias every blob one cell down
             * and right */
            const yc = y + 0.5
            const xc = x + 0.5
            const dy = yc < z.y0 ? z.y0 - yc : yc > z.y1 ? yc - z.y1 : 0
            const dx =
                (xc < z.x0 ? z.x0 - xc : xc > z.x1 ? xc - z.x1 : 0) * kxOf(z)
            const d = Math.sqrt(dx * dx + dy * dy)
            /* three octaves, diagonal wave directions so every
             * edge orientation undulates: swell, wave, ripple */
            const w =
                Math.sin(x * 0.12 + y * 0.1 + t * WOB_SPEED * 0.55 + z.phase) *
                    0.6 +
                Math.sin(
                    x * 0.27 - y * 0.22 - t * WOB_SPEED * 0.45 + z.phase * 1.7
                ) *
                    0.25 +
                Math.sin(
                    x * 0.55 + y * 0.8 + t * WOB_SPEED * 1.2 + z.phase * 2.3
                ) *
                    0.15
            /* bias toward the inner radius: mostly snug, with
             * occasional outward puffs */
            const puff = Math.pow((w + 1) / 2, LOBE_BIAS)
            /* cumulus: blend the amplitude by how far above (crest) or
             * below (keel) the element this cell sits; vert is 0
             * beside it, 1 straight over/under */
            const vert = d > 0 ? dy / d : 0
            const amp =
                yc < z.y0
                    ? FLANK + (CREST - FLANK) * vert
                    : yc > z.y1
                      ? FLANK + (KEEL - FLANK) * vert
                      : FLANK
            return d - (z.pad + z.wob * amp * puff)
        }

        /* Rebuilt every TICK, window rows only — everything breathes
         * together. One edge evaluation per cell feeds all three
         * bands: cloud, buffer, fade. Everything is document-anchored,
         * so a blob's silhouette is a pure function of its position on
         * the PAGE (plus slow breathing time) — scrolling cannot re-cut
         * it against a different patch of noise. Rows outside the
         * window keep their last state: the frozen colony's bands
         * simply stop breathing offscreen. */
        const updateMask = (t: number, top = winTop, bot = winBot) => {
            cloudM.fill(0, top * gw, bot * gw)
            mask.fill(0, top * gw, bot * gw)
            fadeF.fill(1, top * gw, bot * gw)
            for (const z of zoneRects) {
                const kx = kxOf(z)
                const reach = z.pad + z.wob * CREST + z.buffer + z.fade + 1
                const bx0 = Math.max(0, Math.floor(z.x0 - reach / kx))
                const bx1 = Math.min(gw - 1, Math.ceil(z.x1 + reach / kx))
                const by0 = Math.max(top, Math.floor(z.y0 - reach))
                const by1 = Math.min(bot - 1, Math.ceil(z.y1 + reach))
                for (let y = by0; y <= by1; y++) {
                    for (let x = bx0; x <= bx1; x++) {
                        const e = cloudEdge(z, x, y, t)
                        const i = y * gw + x
                        if (e < 0) {
                            if (z.paint) cloudM[i] = z.hot ? 2 : 1
                            mask[i] = 1
                            fadeF[i] = 0
                        } else if (e < z.buffer) {
                            /* moat: no mold, no paint — clean page */
                            mask[i] = 1
                            fadeF[i] = 0
                        } else {
                            const f = Math.min(1, (e - z.buffer) / z.fade)
                            if (f < fadeF[i]!) fadeF[i] = f
                        }
                    }
                }
            }
        }

        /* window-level pointer tracking — the canvas never gets events.
         * VIEWPORT coordinates are stored and converted to document
         * cells at feed time: a stationary cursor's page position
         * changes as the page scrolls under it. active goes false the
         * moment the pointer stops EXISTING as a hover — a finger
         * lifting or cancelling into a scroll, the mouse leaving the
         * window, the window losing focus — otherwise the last stored
         * point would haunt the page as a phantom cursor, feeding the
         * mold and igniting every blob that scrolls under it. */
        const pointer = { cx: -1, cy: -1, active: false, fine: false }
        const onMove = (e: PointerEvent) => {
            if (
                e.clientX < 0 ||
                e.clientY < 0 ||
                e.clientX >= window.innerWidth ||
                e.clientY >= window.innerHeight
            ) {
                pointer.active = false
                return
            }
            pointer.active = true
            /* only a hovering pointer type may ignite blobs: a touch
             * drag's first moves arrive BEFORE the scroll takeover
             * cancels them, and must not flash the card fuchsia on
             * every scroll that starts over a blob (the finger still
             * feeds the mold — food is not hover) */
            pointer.fine = e.pointerType !== 'touch'
            pointer.cx = e.clientX
            pointer.cy = e.clientY
        }
        const onPointerEnd = (e: PointerEvent) => {
            /* a lifted mouse still hovers; a lifted finger doesn't,
             * and a cancel (scroll takeover) ends the touch too */
            if (e.type === 'pointercancel' || e.pointerType !== 'mouse') {
                pointer.active = false
            }
        }
        const onPointerOut = (e: PointerEvent) => {
            /* no relatedTarget: the pointer left the document */
            if (!e.relatedTarget) pointer.active = false
        }
        const onBlur = () => {
            pointer.active = false
        }

        /* a viewport point's document grid cell — fractional, measured
         * from cell centers (cloudEdge's convention). Every consumer
         * (hover, click, cursor food) converts through here, so no two
         * of them can ever read different points off the same isoline. */
        const docCell = (
            clientX: number,
            clientY: number,
            scrollY = window.scrollY
        ): [number, number] => [
            (clientX * dprC) / CW - 0.5,
            ((clientY + scrollY) * dprC) / CH - 0.5
        ]

        /* ── Blob hover ──────────────────────────────────────────────
         * The hover decision, made per FRAME (not per tick): a
         * hoverable zone is hot while the cursor sits inside its
         * breathing silhouette — cloudEdge, the exact isoline the
         * paint fills — or while its anchor matches :hover (cursor
         * over the rectangle, which the blob always covers) or
         * :focus-visible (keyboard). The state is mirrored onto the
         * element as data-cloud-hot so the CSS anchor and the canvas
         * ink flip in the SAME frame, and the cursor turns into a
         * pointer wherever the page under it is blob. */
        let blobCursor = false
        const refreshHot = (t: number) => {
            const [px, py] = docCell(pointer.cx, pointer.cy)
            let changed = false
            let inBlob = false
            for (const z of zoneRects) {
                if (!z.hoverable) continue
                const cursorIn =
                    pointer.active &&
                    pointer.fine &&
                    z.paint &&
                    cloudEdge(z, px, py, t) < 0
                if (cursorIn) inBlob = true
                const hot = cursorIn || z.el.matches(':hover, :focus-visible')
                if (hot !== z.hot) {
                    z.hot = hot
                    changed = true
                    if (hot) z.el.setAttribute('data-cloud-hot', '')
                    else z.el.removeAttribute('data-cloud-hot')
                }
            }
            if (inBlob !== blobCursor) {
                blobCursor = inBlob
                document.documentElement.style.cursor = inBlob ? 'pointer' : ''
            }
            return changed
        }

        /* the blob is also the card's CLICK target: a plain left click
         * inside a hoverable blob, outside its anchor, activates the
         * anchor — CloudLink then runs the same grow transition a
         * direct click gets. Modified clicks (new tab, …) fall through
         * to the page: the synthetic click couldn't carry them. Three
         * things that LOOK like background clicks are not: keyboard
         * activations (no coordinates), the release of a text-
         * selection drag (a click retargeted to a common ancestor),
         * and clicks on interactive UI floating over blob territory
         * (the focused skip link). And like any native button, press
         * and release must BOTH land inside the blob. */
        const down = { cx: -1, cy: -1, sy: 0 }
        const onDown = (e: PointerEvent) => {
            down.cx = e.clientX
            down.cy = e.clientY
            /* the press's OWN scroll offset: the page can scroll (a
             * smooth scroll still settling, a wheel with the button
             * held) between press and release, and the press must be
             * judged where it actually landed */
            down.sy = window.scrollY
        }
        const onClick = (e: MouseEvent) => {
            /* !isTrusted is also what makes the synthetic click below
             * terminal */
            if (!e.isTrusted || e.defaultPrevented || e.button !== 0) return
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            if (e.detail === 0) return /* keyboard — no coordinates */
            const sel = document.getSelection()
            if (sel && !sel.isCollapsed) return
            /* anything interactive handles its own clicks — err WIDE:
             * swallowing a background click costs one blob shortcut,
             * routing a widget's click into a navigation breaks the
             * widget */
            if (
                e.target instanceof Element &&
                e.target.closest(
                    'a, button, input, select, textarea, label, summary, ' +
                        'details, iframe, embed, object, video, audio, ' +
                        '[contenteditable], [tabindex], [role="button"], ' +
                        '[role="link"]'
                )
            ) {
                return
            }
            /* clicks inside a zone element handle themselves */
            if (e.target instanceof Node) {
                for (const z of zoneRects) {
                    if (z.el.contains(e.target)) return
                }
            }
            const t = performance.now() / 1000
            const [px, py] = docCell(e.clientX, e.clientY)
            const [dx, dy] = docCell(down.cx, down.cy, down.sy)
            for (const z of zoneRects) {
                if (!z.hoverable || !z.paint) continue
                if (cloudEdge(z, px, py, t) < 0) {
                    if (cloudEdge(z, dx, dy, t) < 0) {
                        ;(z.el as HTMLElement).click()
                    }
                    return
                }
            }
        }

        const hash = (x: number, y: number) => {
            const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
            return h - Math.floor(h)
        }

        const paintRows = (y0: number, y1: number) => {
            /* transparent canvas: the page's own white shows wherever
             * nothing is painted. Rows are inked at their ABSOLUTE
             * document positions — the canvas IS the page, so there is
             * no scroll offset, no translate, nothing to chase. Rows
             * outside [y0, y1) keep their existing ink. */
            const top = Math.max(0, y0)
            const bot = Math.min(dh, y1)
            if (bot <= top) return
            ctx.clearRect(0, top * CH, canvas.width, (bot - top) * CH)
            /* cloud pass: solid cells, row runs batched into single
             * rects (+1px overlap so no seams), colored per run */
            for (let y = top; y < bot; y++) {
                for (let x = 0; x < gw; x++) {
                    const v = cloudM[y * gw + x]
                    if (!v) continue
                    /* a run ends where the value changes (black → hot),
                     * so step back one: the outer x++ lands on the next
                     * run's first cell, which still needs painting */
                    let xEnd = x
                    while (xEnd < gw && cloudM[y * gw + xEnd] === v) xEnd++
                    ctx.fillStyle = v === 2 ? CLOUD_HOT : CLOUD_FILL
                    ctx.fillRect(x * CW, y * CH, (xEnd - x) * CW + 1, CH + 1)
                    x = xEnd - 1
                }
            }
            /* glyph pass — fade is 0 in cloud and buffer, so both go
             * blank through the same path; mold density feathers up
             * across FADE */
            ctx.fillStyle = INK
            for (let y = top; y < bot; y++) {
                let line = ''
                for (let x = 0; x < gw; x++) {
                    let v = Math.max(
                        0,
                        Math.min(
                            1,
                            (trail[y * gw + x]! / RENDER_DIV) *
                                fadeF[y * gw + x]!
                        )
                    )
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

        /* spawn helper: never place an agent inside cloud or buffer —
         * always inside the live window */
        const freeSpot = (): [number, number] => {
            for (let tries = 0; tries < 20; tries++) {
                const x = Math.random() * gw
                const y = winTop + Math.random() * (winBot - winTop)
                if (!mask[Math.floor(y) * gw + Math.floor(x)]) return [x, y]
            }
            return [0, winTop]
        }

        /* ---- simulation ------------------------------------------------ */
        const ax = new Float32Array(N)
        const ay = new Float32Array(N)
        const aa = new Float32Array(N)
        let trail = new Float32Array(0)
        let next = new Float32Array(0)
        const init = () => {
            trail = new Float32Array(gw * dh)
            next = new Float32Array(gw * dh)
            for (let i = 0; i < N; i++) {
                const [x, y] = freeSpot()
                ax[i] = x
                ay[i] = y
                aa[i] = Math.random() * Math.PI * 2
            }
        }
        /* carry the colony across a grid change (rotation, a window
         * resize, the document growing as images load): copy the
         * overlapping region of the trail field instead of resetting
         * the organism */
        const remap = (oldGw: number, oldDh: number) => {
            if (oldGw === 0 || trail.length !== oldGw * oldDh) {
                init()
                return
            }
            const nt = new Float32Array(gw * dh)
            const cw = Math.min(gw, oldGw)
            const ch = Math.min(dh, oldDh)
            for (let y = 0; y < ch; y++) {
                for (let x = 0; x < cw; x++) {
                    nt[y * gw + x] = trail[y * oldGw + x]!
                }
            }
            trail = nt
            next = new Float32Array(gw * dh)
            for (let i = 0; i < N; i++) {
                if (ax[i]! >= gw) ax[i] = Math.random() * gw
                if (ay[i]! < winTop || ay[i]! >= winBot) {
                    ay[i] = winTop + Math.random() * (winBot - winTop)
                }
            }
        }

        resize() /* first call reaches init() through remap */

        /* overcrowding aversion: preference peaks at SAT and falls off
         * above, so saturated highways repel their own traffic — no
         * stable fixed point */
        const pref = (v: number) => (v <= SAT ? v : Math.max(0, SAT * 2 - v))

        /* toroidal within the LIVE WINDOW: horizontal wrap at the page
         * edges, vertical wrap at the window's (offscreen) rims */
        const cellAt = (x: number, y: number) => {
            const xi = ((Math.floor(x) % gw) + gw) % gw
            const wh = winBot - winTop
            const yi = winTop + ((((Math.floor(y) - winTop) % wh) + wh) % wh)
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
            if (pointer.active) {
                /* the cursor's DOCUMENT cell, right now — round undoes
                 * docCell's half-cell centering: round(v − ½) ≡ floor(v) */
                const [fx, fy] = docCell(pointer.cx, pointer.cy)
                const px = Math.round(fx)
                const py = Math.round(fy)
                if (
                    px >= 0 &&
                    px < gw &&
                    py >= winTop &&
                    py < winBot &&
                    !mask[py * gw + px]
                ) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const x = px + dx
                            const y = py + dy
                            if (
                                x >= 0 &&
                                x < gw &&
                                y >= winTop &&
                                y < winBot &&
                                !mask[y * gw + x]
                            ) {
                                trail[y * gw + x] = trail[y * gw + x]! + FOOD
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < N; i++) {
                /* left behind by a moving window (the user scrolled):
                 * rejoin the live region — the trail stays where it was */
                if (
                    ay[i]! < winTop ||
                    ay[i]! >= winBot ||
                    Math.random() < TURNOVER
                ) {
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
                if (ny < winTop) ny += winBot - winTop
                if (ny >= winBot) ny -= winBot - winTop

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

            /* diffuse + decay the LIVE WINDOW only; rows outside stay
             * frozen in trail — the rooted colony persists wherever
             * the reader isn't */
            for (let y = winTop; y < winBot; y++) {
                const yU = y === winTop ? winBot - 1 : y - 1
                const yD = y === winBot - 1 ? winTop : y + 1
                for (let x = 0; x < gw; x++) {
                    /* trails PERSIST under the exclusion (they only
                     * decay): agents are still barred and rendering is
                     * still suppressed by fadeF, so the mask never
                     * strip-mines the colony */
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
            /* copy the diffused window back — no buffer swap: a swap
             * would resurrect two-tick-old values in the frozen rows */
            trail.set(next.subarray(winTop * gw, winBot * gw), winTop * gw)
        }

        /* fixed-timestep loop — see the Cadence note by the tunables.
         * Scrolling never enters this loop: the canvas is part of the
         * page and the compositor moves it with the content. Ticks
         * advance the sim and re-ink the live window's rows; every
         * other frame costs nothing at all. */
        let acc = 0
        let lastT = 0

        const loop = (tMs: number) => {
            if (!running) return
            raf = requestAnimationFrame(loop)

            const t = tMs / 1000
            acc += lastT ? Math.min(tMs - lastT, DT_CLAMP) : tickMs
            lastT = tMs
            if (acc < tickMs) {
                /* idle frame — near-free, EXCEPT that hover is a
                 * per-frame decision: crossing the blob's edge (or the
                 * edge breathing out from under a parked cursor) must
                 * flip blob and anchor NOW, together, not at the next
                 * tick. And the decision needs CURRENT zones and a
                 * CURRENT window — a DOM swap or a focus-driven scroll
                 * can't wait a tick either. A change re-inks the
                 * window without advancing the sim. */
                if (zonesDirty) remeasure(t)
                if (refreshHot(t)) {
                    updateWindow()
                    updateMask(t)
                    paintRows(winTop, winBot)
                }
                return
            }

            let ticks = Math.floor(acc / tickMs)
            acc -= ticks * tickMs
            ticks = Math.min(ticks, MAX_TICKS)

            /* the document can grow under us (images, fonts) — cheap
             * height compare; the canvas reallocates only on a chunk
             * crossing, but ANY height change can move zones */
            if (document.documentElement.scrollHeight !== lastContentH) {
                resize()
            }
            if (zonesDirty) remeasure(t)
            refreshHot(t)
            updateWindow()
            updateMask(t) /* everything breathes together */
            for (let k = 0; k < ticks * stepsPerTick; k++) step()
            paintRows(winTop, winBot)
        }
        raf = requestAnimationFrame(loop)

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerdown', onDown, { passive: true })
        window.addEventListener('pointerup', onPointerEnd, { passive: true })
        window.addEventListener('pointercancel', onPointerEnd, {
            passive: true
        })
        window.addEventListener('pointerout', onPointerOut, { passive: true })
        window.addEventListener('blur', onBlur)
        window.addEventListener('click', onClick)
        window.addEventListener('resize', resize)

        /* DOM swaps (client-side navigations rendering under the
         * transition cover), class/style toggles, late images (src),
         * and runtime flips of the data-cloud* layout attributes can
         * all move zones without changing the document height —
         * invalidate the cache. data-cloud-hot stays OFF the filter:
         * refreshHot writes it into this subtree every hover flip, and
         * observing it would re-run the full measure walk continuously.
         * Records from inside the canvas's own wrapper are skipped for
         * the same reason — resize() writes the canvas style and
         * always remeasures right afterward, so reacting to its own
         * writes would only double the full re-ink. */
        const wrap = canvas.parentElement
        const mo = new MutationObserver(records => {
            for (const record of records) {
                if (wrap?.contains(record.target)) continue
                zonesDirty = true
                return
            }
        })
        mo.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: [
                'class',
                'style',
                'hidden',
                'open',
                'src',
                'data-cloud',
                'data-cloud-pad',
                'data-cloud-buffer',
                'data-cloud-wob',
                'data-cloud-hover'
            ]
        })

        /* webfonts swap in after first paint — retire ink trims measured
         * against fallback faces and re-measure against the real ones */
        document.fonts?.ready.then(() => {
            resetInkTrims()
            zonesDirty = true
        })

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
            window.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointerup', onPointerEnd)
            window.removeEventListener('pointercancel', onPointerEnd)
            window.removeEventListener('pointerout', onPointerOut)
            window.removeEventListener('blur', onBlur)
            window.removeEventListener('click', onClick)
            window.removeEventListener('resize', resize)
            document.removeEventListener('visibilitychange', onVisibility)
            mo.disconnect()
            zoneRO.disconnect()
            for (const z of zoneRects) z.el.removeAttribute('data-cloud-hot')
            document.documentElement.style.cursor = ''
            document.documentElement.removeAttribute('data-organism')
        }
    }, [reduced])

    /* Reduced motion: no canvas — the painted .cloud-zone rectangles
     * carry the content. A static page, no movement. */
    if (reduced) return null

    return (
        /* The wrapper is absolutely positioned against the BODY (made
         * relative in the root layout for exactly this), so inset-0
         * spans the whole document, and overflow-hidden trims the
         * canvas's spare capacity rows — the canvas may run taller
         * than the page without adding scrollable space. (hidden, not
         * clip: old Safari — precisely the memory-constrained cohort
         * the capacity design serves — drops `clip` as invalid and
         * would show the tail; nothing can scroll this wrapper, so
         * the two behave identically here.) The canvas sits at the
         * document origin inside it; the compositor scrolls canvas
         * and content together as one surface. The base stylesheet's
         * responsive canvas{max-width:100%} is satisfied trivially:
         * the canvas is exactly the page's width. */
        <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'
        >
            <canvas ref={canvasRef} className='absolute left-0 top-0' />
        </div>
    )
}
