/* Research: publication-style project cards linking to report pages.
 * Entries live in src/features/research/content.tsx. */

import Link from 'next/link'

import { research } from '@/features/research/content'

import { SectionHeading } from '../ui'

export default function ResearchSection() {
    return (
        <div className="w-full flex flex-col space-y-6">
            {/* Cyan heading — light variant on the black region. */}
            <SectionHeading className="text-accent3-text">{research.heading}</SectionHeading>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                <img
                                    src={entry.cover}
                                    alt=""
                                    aria-hidden
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover grayscale transition-[filter] duration-200 group-hover:grayscale-0"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2 p-4">
                            <p className="text-base font-bold leading-snug">
                                {entry.title}
                            </p>
                            <p className="clamp-2 text-sm leading-relaxed">
                                {entry.tldr}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
