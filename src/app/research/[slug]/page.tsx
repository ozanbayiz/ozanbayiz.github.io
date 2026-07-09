import 'katex/dist/katex.min.css'

import { readFile } from 'fs/promises'
import path from 'path'
// eslint-disable-next-line import/no-namespace
import * as jsxRuntime from 'react/jsx-runtime'

import { evaluate } from '@mdx-js/mdx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { research } from '@/features/research/content'
import { mdxComponents } from '@/mdx-components'

import type { ResearchEntry } from '@/features/research/content'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* ── Document-action toolbar ───────────────────────────────────────────
 * Every project carries a predictable suite of links (Code · PDF · Demo),
 * rendered as bare icons under the title — no borders, no labels. */

const strokeProps = {
    className: 'h-7 w-7',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
} as const

const DOCUMENT_ACTIONS: {
    key: 'code' | 'pdf' | 'demo'
    aria: string
    icon: ReactNode
}[] = [
    {
        key: 'code',
        aria: 'GitHub repository',
        /* The GitHub mark. */
        icon: (
            <svg aria-hidden className="h-7 w-7 fill-current" viewBox="0 0 32 32">
                <path d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z" />
            </svg>
        )
    },
    {
        key: 'pdf',
        aria: 'PDF document',
        /* Sibling of the homepage CV icon: same double-frame document and
         * text lines, with "PDF" letterforms traced from IBM Plex Mono
         * Text (vector paths — crisp at any size, no font dependency).
         * Letters sit above the text lines (y 5.3–9.3; lines at 11/14/17). */
        icon: (
            <svg
                aria-hidden
                className="h-7 w-7 fill-current"
                viewBox="0 0 26 28"
                fillRule="evenodd"
            >
                <path d="M3 24h19v-23h-1v22h-18v1zm17-24h-18v22h18v-22zm-1 1h-16v20h16v-20zm-2 16h-12v1h12v-1zm0-3h-12v1h12v-1zm0-3h-12v1h12v-1z M6.34 9.30V5.30H7.81Q8.38 5.30 8.68 5.61Q8.97 5.92 8.97 6.47Q8.97 7.03 8.68 7.34Q8.38 7.65 7.81 7.65H6.90V9.30ZM6.90 7.18H7.76Q8.07 7.18 8.23 7.03Q8.39 6.89 8.39 6.61V6.34Q8.39 6.06 8.23 5.92Q8.07 5.77 7.76 5.77H6.90Z M9.79 5.30H10.94Q11.69 5.30 12.06 5.81Q12.42 6.31 12.42 7.30Q12.42 8.29 12.06 8.79Q11.69 9.30 10.94 9.30H9.79ZM10.91 8.83Q11.37 8.83 11.60 8.51Q11.84 8.20 11.84 7.62V6.98Q11.84 6.40 11.60 6.09Q11.37 5.77 10.91 5.77H10.34V8.83Z M13.22 9.30V5.30H15.77V5.78H13.78V7.04H15.60V7.51H13.78V9.30Z" />
            </svg>
        )
    },
    {
        key: 'demo',
        aria: 'Live demo',
        icon: (
            <svg {...strokeProps} aria-hidden>
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
        )
    }
]

function DocumentActions({ entry }: { entry: ResearchEntry }) {
    const actions = DOCUMENT_ACTIONS.filter(action => entry[action.key])
    if (actions.length === 0) return null
    return (
        <span className="flex flex-wrap items-center gap-4">
            {actions.map(action => (
                <a
                    key={action.key}
                    href={entry[action.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={action.aria}
                    title={action.aria}
                    className="text-foreground transition-colors hover:text-accent3-text"
                >
                    {action.icon}
                </a>
            ))}
        </span>
    )
}

export function generateStaticParams() {
    return research.entries.map(entry => ({ slug: entry.slug }))
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const entry = research.entries.find(e => e.slug === slug)
    if (!entry) return {}
    return { title: entry.title, description: entry.tldr }
}

/* Reports are read from disk and compiled server-side (at build time for
 * the static export) — see the note in next.config.ts. */
async function compileReport(slug: string) {
    const file = path.join(process.cwd(), 'src/content/research', `${slug}.mdx`)
    const source = await readFile(file, 'utf8')
    const { default: Report } = await evaluate(source, {
        ...jsxRuntime,
        remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
        rehypePlugins: [rehypeSlug, rehypeKatex]
    })
    return Report
}

export default async function ResearchReportPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const entry = research.entries.find(e => e.slug === slug)
    if (!entry) notFound()

    const Report = await compileReport(slug)

    return (
        <main className="container mx-auto max-w-screen-md px-6 md:px-8 py-8 md:py-10">
            {/* Letterhead — the site signs its pages in script. */}
            <nav>
                <Link href="/" className="text-foreground inline-flex items-center gap-2">
                    <span aria-hidden className="font-mono text-lg md:text-xl leading-none">←</span>
                    <span className="font-script text-2xl md:text-3xl leading-none">ozanbayiz</span>
                </Link>
            </nav>

            {/* Title, with the document-action toolbar directly beneath. */}
            <header className="mt-6 mb-3 flex flex-col gap-3">
                <h1 className="text-4xl md:text-5xl leading-tight">{entry.title}</h1>
                <DocumentActions entry={entry} />
            </header>

            <article className="paper">
                <Report components={mdxComponents} />
            </article>

            <footer className="mt-14 text-center">
                <Link href="/" className="font-script text-4xl leading-none text-foreground">
                    ozanbayiz
                </Link>
            </footer>
        </main>
    )
}
