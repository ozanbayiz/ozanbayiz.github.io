# Spacing redesign — brainstorming handoff

*August 2026. A session diagnosed the spacing scheme, designed and shipped an
overhaul, and reverted it the same day because the author preferred the
original feel. This document preserves the thought process so a future
session can refine it instead of re-deriving it.*

**The implementation lives on branch `spacing-overhaul-archive`**
(commit `71e3cdd`, reverted on main by `d126a64`). Everything below is the
reasoning around it.

---

## 1. Diagnosis — why the scheme *feels* uneven

The five-token vocabulary (`inline/stack/inset-x/inset-y/section`) is used
with near-perfect discipline — almost no raw numeric spacing utilities
anywhere. The unease is structural, not sloppiness:

1. **`section` never does the job its name promises.** Both homepage
   `<Section>`s override the `py-section` default (`py-stack`,
   `py-inset-y`), so mobile inter-block gaps run 48/16/16/32/48px —
   four different values, none of them the "section rhythm."
2. **The "seam" has no token.** The white band around the inset black
   rectangle is a real design concept that exists only in comments;
   `stack` moonlights as it, patched with apology comments at every use.
3. **`inset-x` moonlights as grid gap.** When About's grid collapses to
   one column on a phone, photo↔paragraph = 24px while
   paragraph↔paragraph = 16px — adjacent siblings, different gaps, no
   visible logic.
4. **The scale has no consistent ratio and changes shape at `md`.**
   8/16/24/32/48 on phones (steps ×2, ×1.5, ×1.33, ×1.5) becomes
   8/16/40/40/64 on desktop — `inset-x` and `inset-y` collapse into the
   same value, so five tokens silently become four.
5. **Parallel systems.** The research page hand-rolls its own container
   (`max-w-screen-md`, different gutter behavior) instead of sharing the
   homepage's; the footer repeats the container classes by hand;
   `tailwind.config.ts` carries a vestigial `container.padding: '1rem'`
   that always loses; `scroll-margin-top: 4rem` and the report image caps
   (`max-h-72 md:max-h-80`) are off-scale. (The `.paper` em-based prose
   margins are a *deliberate* second system — a document, not a poster —
   and were kept.)

One-sentence version: **a five-token system for a design with roughly
seven or eight distinct spacing relationships, so tokens get reused
across roles, and the reuse is what the eye registers as inconsistency.**

## 2. Goals and decisions

Aesthetic goal: spacing that is deliberate and blocky (mono / ASCII /
blackletter / hard edges), designed so that **screenshots at various
device dimensions produce nice, self-contained views of content blocks**
("composed views").

Decisions taken (each was an explicit choice among alternatives):

- **Rhythm-only.** No viewport-height sizing, no scroll-snap. Composed
  views come purely from consistent seams and gap hierarchy.
  (Alternatives considered: `min-h-[100svh]` centered sections; hard
  CSS scroll-snap.)
- **Powers-of-two fluid scale.** Geometric ×2 ladder (8/16/32/64 at the
  desktop ceiling), `clamp()` interpolation between a 390px floor and a
  1024px ceiling (where `max-w-screen-lg` stops growing) instead of the
  `md:` jump. No two tokens equal at any width.
  (Alternatives: keep current values and fix roles only; ×1.5 modular.)
- **Site-wide scope, `.paper` stays em-based.** Unify the research page
  onto shared primitives, but keep the document rhythm separate.

## 3. The design (as implemented at `71e3cdd`)

Four tokens, one job each:

```css
--space-inline: 0.5rem;                                  /*  8px — gaps inside a cluster */
--space-stack: 1rem;                                     /* 16px — stacked siblings; card padding; grid gaps */
--space-inset: clamp(1.5rem, 1.192rem + 1.262vw, 2rem);  /* 24→32px — interior frame of filled regions + page gutter */
--space-seam: clamp(3rem, 2.385rem + 2.524vw, 4rem);     /* 48→64px — the band between major blocks, ALL of them */
```

Clamp math: slope = (ceiling−floor)/(1024−390) per viewport px.
`inset`: 8/634 = 1.262vw, intercept 24 − 390·slope = 1.192rem.
`seam`: 16/634 = 2.524vw, intercept 2.385rem. Both hit their endpoints
exactly; `seam = 2 × inset` at every width.

Mapping: `inset-x`+`inset-y` → `inset` (square frame); `section` →
`seam`; grid `gap-inset-x` → `gap-stack` (Research) /
`gap-x-inset gap-y-stack` (About, so the collapsed mobile column gets
uniform 16px sibling gaps).

**The rhythm rule:** every major block carries its own top seam; the
about rectangle carries both seams (both its bands must be white);
interior frames are `inset`; contents are `stack`. Each block reads as
*seam / inset-frame / stack-contents* — a self-contained view.

Structural moves: a shared `Container` primitive (`src/shared/ui/
container.tsx` on the archive branch) with `width: 'lg' | 'md'` and
`gutter: 'md' | 'always'` as explicit props — the research page's
narrower measure becomes a stated choice, not drift; `Section` loses its
dead default padding; vestigial config and the stale `gradient-*`
aliases deleted.

Resulting homepage rhythm (only four values ever appear):

| Boundary | 390px | 1440px |
|---|---|---|
| viewport top → ascii (hero `pt-seam`) | 48 | 64 |
| ascii → social bar (`gap-stack`) | 16 | 16 |
| social bar → black rectangle (`pt-seam`) | 48 | 64 |
| rectangle interior frame (`p-inset`) | 24 | 32 |
| cards inside rectangle (`gap-y-stack`) | 16 | 16 |
| rectangle → black region (`pb-seam`) | 48 | 64 |
| region top → research heading (`pt-inset`) | 24 | 32 |
| heading → cards, card↔card (`gap-stack`) | 16 | 16 |
| cards → signature (footer `pt-seam`) | 48 | 64 |
| signature → page end (footer `pb-inset`) | 24 | 32 |

## 4. Verification results (all passed)

Headless-Chromium measurements on the built site: `--space-seam`
computed to 55.8px at a 700px viewport (fluid mid-range working);
rectangle interior frame exactly 24px at 390px; research heading and
about content left-aligned to the pixel (272px at 1440); no horizontal
overflow at any tested width. Full builds clean.

## 5. Retro — why it was reverted, and what to try next

The author's verdict on the shipped result: *"I liked it more before we
did all this."* The revert (`d126a64`) restored the original scheme,
keeping only the unrelated mobile email-wrap fix.

The diagnosis may still be right while these specific *values* were
wrong. The visible density changes — the likeliest culprits, in rough
order of suspicion:

1. **Icon row tightened** 16→8px (`gap-inline` per the token's own
   definition). Correct by the book, cramped in practice?
2. **Rectangle frame tightened and squared** — phone vertical inset
   32→24px, desktop 40→32px. The old asymmetric roominess ("vertical
   space is cheap on a phone") may have been load-bearing.
3. **Research card grid tightened** 24/40→16px.
4. **Overall density** — every one of these moves made the page tighter;
   together they may have read as a different, busier site rather than
   the same site made consistent.

Refinement directions for a future session:

- **Keep the seam, soften the density.** The uniform-seam idea (the
  48/16/16/32/48 → 48/48/48/48 fix) is independent of the tightening;
  apply it alone and screenshot-compare.
- **One change at a time, screenshot each.** The overhaul landed as a
  single commit; the author never saw which individual change bothered
  them. Cherry-pick from `spacing-overhaul-archive` file-by-file.
- **Reconsider the merged `inset`.** A ceiling of 8/16/32/64 could keep
  asymmetric x/y insets (e.g. y ≥ x on phones) without token collision —
  the collision at old-`md` was between 40 and 40, not inherent.
- **Ask first what "before" means.** The author's preference was for the
  *overall feel*; probing which screenshots diverged from it (390 vs
  1440?) would localize the disagreement fast.

Structural cleanups that were probably uncontroversial and could be
re-landed independently of any density change: the shared `Container`
primitive, the vestigial-config deletions, the `gradient-*` alias
removal, on-scale `scroll-margin-top` and image caps.
