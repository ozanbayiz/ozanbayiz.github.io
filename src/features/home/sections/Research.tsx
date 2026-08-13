/* Research: publication-style project cards linking to report pages.
 * Entries live in src/features/research/content.tsx. */

import Link from 'next/link'

import { research } from '@/features/research/content'

/* No section heading — the cards announce themselves (paper figures,
 * academic titles); nothing on the homepage introduces anything. */
export default function ResearchSection() {
    return (
        <div className="w-full">
            {/* items-start: each card hugs its own content like the About
              * paragraphs — no stretching to match its row neighbor. */}
            <div className="grid grid-cols-1 items-start gap-inset md:grid-cols-2">
                {/* Each card is a white rectangle on the black fill — the
                  * same .section-card recipe as the About paragraphs, with
                  * the thumbnail inside the padding like a small figure. */}
                {research.entries.map(entry => (
                    <Link
                        key={entry.slug}
                        href={`/research/${entry.slug}/`}
                        className="section-card flex-border-hover flex flex-col gap-stack p-stack"
                    >
                        {entry.cover && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={entry.cover}
                                alt=""
                                aria-hidden
                                loading="lazy"
                                decoding="async"
                                /* A uniform 16:9 plate spanning the card
                                 * width inside the padding. object-contain
                                 * shows the whole figure — never cropped —
                                 * and any letterboxing is white-on-white,
                                 * so the plate stays seamless. */
                                className="aspect-video w-full object-contain"
                            />
                        )}
                        {/* Title only — it does the talking; the tldr's
                          * job moved to the report page itself. */}
                        <p className="text-sm font-bold leading-snug">
                            {entry.shortTitle ?? entry.title}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
