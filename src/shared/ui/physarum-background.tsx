'use client'

import { useEffect, useRef, useState } from 'react'

/* ── PhysarumBackground ───────────────────────────────────────────────
 * Breathing black clouds and an ASCII slime-mold organism, painted on
 * a fixed, pointer-transparent canvas behind the page.
 *
 * Three concentric bands surround every [data-cloud] element, all cut
 * per frame from ONE distance field (updateMask):
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
 * out radially, never teleported; trails inside the exclusion are
 * zeroed every diffusion pass.
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
 * rectangle even while the canvas runs: the blob always reaches at
 * least PAD beyond it, so at rest the eye only ever sees the blob's
 * curved edge — but the painted rectangle scrolls in perfect sync with
 * its text, while this canvas (repainting from a rAF) can trail the
 * compositor by a frame mid-scroll. White text is therefore never
 * caught on the white page, and the same rectangle is the whole
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
const DEAD_PAD = 0.35 /* dead zones: hard clearance hugging the text */
const DEAD_BUFFER = 0.3 /* dead zones: sliver of moat */
const DEAD_FADE = 1.2 /* dead zones: short feather — mold reads close */
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
        let raf = 0
        let running = true

        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
        const CH = CELL_H * dpr /* cell height, device px */
        let CW = CH * 0.6 /* replaced by measured advance in resize() */

        let gw = 0
        let gh = 0
        let cloudM = new Uint8Array(0) /* 0 none, 1 black cloud, 2 hot cloud */
        let mask = new Uint8Array(0) /* 1 = sim exclusion (cloud + buffer) */
        let fadeF = new Float32Array(0) /* render attenuation outside buffer */
        const zoneRects: Zone[] = []

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

        /* Re-measured EVERY FRAME, inside the same rAF that draws: layout
         * is clean by then, so the reads are cheap and the zones track
         * their elements with zero lag — even mid-scroll, and across
         * client-side navigations (stale nodes measure 0×0 and are
         * skipped). The canvas is fixed at inset 0, so client
         * coordinates ARE canvas coordinates. */
        const measureZones = () => {
            zoneRects.length = 0
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
                    el.matches(':hover, :focus-visible')
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
                        (r.width * dpr) / CW,
                        (r.height * dpr) / CH
                    )
                    zoneRects.push({
                        x0: (r.left * dpr) / CW,
                        x1: (r.right * dpr) / CW,
                        y0: (r.top * dpr) / CH,
                        y1: (r.bottom * dpr) / CH,
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

        const resize = () => {
            canvas.width = Math.floor(canvas.clientWidth * dpr)
            canvas.height = Math.floor(canvas.clientHeight * dpr)
            ctx.font = `${CH * 0.9}px ui-monospace, Menlo, monospace`
            ctx.textBaseline = 'top'
            CW = ctx.measureText('M').width /* measured, never assumed */
            /* ceil: the cell grid covers the full canvas, so a blob can
             * reach the right and bottom edges without a flat clip */
            gw = Math.max(4, Math.ceil(canvas.width / CW))
            gh = Math.max(4, Math.ceil(canvas.height / CH))
            cloudM = new Uint8Array(gw * gh)
            mask = new Uint8Array(gw * gh)
            fadeF = new Float32Array(gw * gh)
            pointer.active = false /* grid changed; wait for the next move */
            measureZones()
        }

        /* Rebuilt EVERY FRAME — everything breathes together. One
         * distance computation per cell feeds all three bands: cloud,
         * buffer, fade. */
        const updateMask = (t: number) => {
            cloudM.fill(0)
            mask.fill(0)
            fadeF.fill(1)
            for (const z of zoneRects) {
                const reach = z.pad + z.wob * CREST + z.buffer + z.fade + 1
                const bx0 = Math.max(0, Math.floor(z.x0 - reach))
                const bx1 = Math.min(gw - 1, Math.ceil(z.x1 + reach))
                const by0 = Math.max(0, Math.floor(z.y0 - reach))
                const by1 = Math.min(gh - 1, Math.ceil(z.y1 + reach))
                for (let y = by0; y <= by1; y++) {
                    /* distances from the CELL CENTER — measuring from the
                     * top-left corner would bias every blob one cell down
                     * and right */
                    const yc = y + 0.5
                    const dy = yc < z.y0 ? z.y0 - yc : yc > z.y1 ? yc - z.y1 : 0
                    for (let x = bx0; x <= bx1; x++) {
                        const xc = x + 0.5
                        const dx =
                            xc < z.x0 ? z.x0 - xc : xc > z.x1 ? xc - z.x1 : 0
                        const d = Math.sqrt(dx * dx + dy * dy)
                        /* three octaves, diagonal wave directions so every
                         * edge orientation undulates: swell, wave, ripple */
                        const w =
                            Math.sin(
                                x * 0.12 +
                                    y * 0.1 +
                                    t * WOB_SPEED * 0.55 +
                                    z.phase
                            ) *
                                0.6 +
                            Math.sin(
                                x * 0.27 -
                                    y * 0.22 -
                                    t * WOB_SPEED * 0.45 +
                                    z.phase * 1.7
                            ) *
                                0.25 +
                            Math.sin(
                                x * 0.55 +
                                    y * 0.8 +
                                    t * WOB_SPEED * 1.2 +
                                    z.phase * 2.3
                            ) *
                                0.15
                        /* bias toward the inner radius: mostly snug, with
                         * occasional outward puffs */
                        const puff = Math.pow((w + 1) / 2, LOBE_BIAS)
                        /* cumulus: blend the amplitude by how far above
                         * (crest) or below (keel) the element this cell
                         * sits; vert is 0 beside it, 1 straight over/under */
                        const vert = d > 0 ? dy / d : 0
                        const amp =
                            yc < z.y0
                                ? FLANK + (CREST - FLANK) * vert
                                : yc > z.y1
                                  ? FLANK + (KEEL - FLANK) * vert
                                  : FLANK
                        const off = z.pad + z.wob * amp * puff
                        const i = y * gw + x
                        if (d < off) {
                            if (z.paint) cloudM[i] = z.hot ? 2 : 1
                            mask[i] = 1
                            fadeF[i] = 0
                        } else if (d < off + z.buffer) {
                            /* moat: no mold, no paint — clean page */
                            mask[i] = 1
                            fadeF[i] = 0
                        } else {
                            const f = Math.min(1, (d - off - z.buffer) / z.fade)
                            if (f < fadeF[i]!) fadeF[i] = f
                        }
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
             * nothing is painted */
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            /* cloud pass: solid cells, row runs batched into single
             * rects (+1px overlap so no seams), colored per run */
            for (let y = 0; y < gh; y++) {
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
            for (let y = 0; y < gh; y++) {
                let line = ''
                for (let x = 0; x < gw; x++) {
                    let v = Math.max(
                        0,
                        Math.min(1, get(x, y) * fadeF[y * gw + x]!)
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
        resize()
        init()

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

        const loop = (tMs: number) => {
            if (!running) return
            if (trail.length !== gw * gh) init() /* window resized */

            measureZones()
            updateMask(tMs / 1000) /* everything breathes: bands per-frame */

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
                    const i = y * gw + x
                    if (mask[i]) {
                        /* trails never survive inside cloud or buffer */
                        next[i] = 0
                        continue
                    }
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

            drawField((x, y) => trail[y * gw + x]! / RENDER_DIV)

            raf = requestAnimationFrame(loop)
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
        }
    }, [reduced])

    /* Reduced motion: no canvas — the painted .cloud-zone rectangles
     * carry the content. A static page, no movement. */
    if (reduced) return null

    return (
        <canvas
            ref={canvasRef}
            aria-hidden='true'
            className='pointer-events-none fixed inset-0 -z-10 h-full w-full'
        />
    )
}
