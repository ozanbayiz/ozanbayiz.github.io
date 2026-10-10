/* Components available inside research MDX reports (passed to the
 * compiled report via its `components` prop — see
 * src/app/research/[slug]/page.tsx). Keep this set small: reports should
 * be mostly prose, math, and figures. Article typography lives in the
 * `.paper` block in globals.css.
 *
 * Also available: plain <mark>…</mark> — the chartreuse highlighter, for
 * a report's single load-bearing sentence. Use at most once per report. */

import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

/* Section spacing is owned entirely by the .paper heading margins;
 * SectionDivider is kept only so existing reports keep compiling. */
const SectionDivider = () => null

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-link link-marked"
    >
        {children}
    </a>
)

/* `narrow` sets the image to a fixed height — for square or portrait
 * figures (a scatter plot, a stack of text renders) that would otherwise
 * fill the column. A fixed height, not a max: the figure shrink-wraps its
 * image so the caption is no wider than the plate (.paper figure in
 * globals.css), and only a definite height feeds the scaled width back
 * into that shrink-wrap. */
const Figure = ({ src, alt, caption, narrow }: { src: string; alt: string; caption?: string; narrow?: boolean }) => (
    <figure>
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={narrow ? 'h-96 w-auto' : undefined}
        />
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
)

const ImageGrid = ({ children }: { children: ReactNode }) => (
    <div className="my-stack grid gap-stack sm:grid-cols-2 [&_figure]:my-0">{children}</div>
)

export const mdxComponents: MDXComponents = {
    a: props => <a {...props} className="flex-link link-marked" />,
    SectionDivider,
    ExternalLink,
    Figure,
    ImageGrid
}
