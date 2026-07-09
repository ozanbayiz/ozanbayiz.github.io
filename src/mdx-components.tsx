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

const Figure = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
)

const ImageGrid = ({ children }: { children: ReactNode }) => (
    <div className="my-6 grid gap-4 sm:grid-cols-2 [&_figure]:my-0">{children}</div>
)

export const mdxComponents: MDXComponents = {
    a: props => <a {...props} className="flex-link link-marked" />,
    SectionDivider,
    ExternalLink,
    Figure,
    ImageGrid
}
