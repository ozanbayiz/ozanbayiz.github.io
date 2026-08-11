/* Research: publication-style project cards linking to report pages.
 * Entries live in src/features/research/content.tsx. */

import Link from 'next/link'

import { research } from '@/features/research/content'

import { SectionHeading } from '../ui'

export default function ResearchSection() {
    return (
        <div className="w-full flex flex-col gap-stack">
            {/* White heading on the black region. */}
            <SectionHeading className="text-foreground">{research.heading}</SectionHeading>
            <div className="grid grid-cols-1 gap-inset md:grid-cols-2">
                {/* Each card is its own black rectangle — .section-fill
                  * swaps bg/fg locally, so text and borders flip. */}
                {research.entries.map(entry => (
                    <Link
                        key={entry.slug}
                        href={`/research/${entry.slug}/`}
                        className="section-fill flex-border-hover group flex flex-col"
                    >
                        {entry.cover && (
                            <div className="relative aspect-[16/9] overflow-hidden border-b border-foreground/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {/* In colour at rest: the grayscale-until-hover
                                  * treatment was invisible on touch devices,
                                  * where the figures simply read as dead grey. */}
                                <img
                                    src={entry.cover}
                                    alt=""
                                    aria-hidden
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-inline p-stack">
                            <p className="text-base font-bold leading-snug">
                                {entry.title}
                            </p>
                            <p className="text-sm leading-relaxed">
                                {entry.tldr}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
