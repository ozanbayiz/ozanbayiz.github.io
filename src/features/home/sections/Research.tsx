/* Research: publication-style project cards linking to report pages.
 * Entries live in src/features/research/content.tsx. */

import { research } from '@/features/research/content'
import Byline from '@/shared/ui/byline'
import CloudLink from '@/shared/ui/cloud-link'

/* No section heading — the cards announce themselves (paper figures,
 * academic titles); nothing on the homepage introduces anything. */
export default function ResearchSection() {
    return (
        <div className='w-full'>
            {/* items-start: each card hugs its own content like the About
             * paragraphs — no stretching to match its row neighbor. */}
            {/* gap-y-chasm: the cards' clouds billow upward (crest) and
             * drift downward (keel) — stacked cards need the full
             * chasm so their blobs never touch; side by side, a gulf
             * is enough for two flanks. */}
            <div className='grid grid-cols-1 items-start gap-x-gulf gap-y-chasm md:grid-cols-2'>
                {/* Each card rides its own DETACHED cloud (data-cloud):
                 * black blob behind, white title, the figure as a white
                 * plate. gap-gulf is the white channel that keeps
                 * neighboring blobs from bridging. data-cloud-hover:
                 * hover/focus ignites the whole cloud fuchsia — that IS
                 * the card's hover feedback, so the title carries no
                 * underline affordance of its own. */}
                {research.entries.map(entry => (
                    <CloudLink
                        key={entry.slug}
                        data-cloud
                        data-cloud-hover
                        href={`/research/${entry.slug}/`}
                        /* A stack of frame on the sides and bottom.
                         * cloud-lift (globals.css): while the organism
                         * runs, the card sheds its top frame — the
                         * blob's crest billows plenty of black above
                         * the figure, so the plate rides high in its
                         * cloud. The painted fallback (no JS, reduced
                         * motion) keeps the full symmetric frame. */
                        className='cloud-zone cloud-lift flex flex-col gap-stack p-stack'
                    >
                        {entry.cover && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={entry.cover}
                                alt=''
                                aria-hidden
                                loading='lazy'
                                decoding='async'
                                /* A uniform 16:9 plate spanning the card
                                 * width inside the padding. object-contain
                                 * shows the whole figure — never cropped —
                                 * and bg-white keeps the plate (letterbox
                                 * included) a clean white figure on the
                                 * black cloud. */
                                className='aspect-video w-full bg-white object-contain'
                            />
                        )}
                        {/* Title, byline, venue — the card is a citation.
                         * The tldr's job moved to the report page itself.
                         * Inline gap inside the block: the byline belongs
                         * to its title, tighter than the card's stack. */}
                        <div className='flex flex-col gap-inline'>
                            <p className='text-sm font-bold leading-snug'>
                                {entry.shortTitle ?? entry.title}
                            </p>
                            {/* Byline (names only — the marks stay on
                             * the report page, where the note explaining
                             * them lives) over the context line; the
                             * context renders whether or not the entry
                             * carries authors. */}
                            <p className='text-xs leading-snug'>
                                {entry.authors && (
                                    <>
                                        <Byline
                                            authors={entry.authors}
                                            offset='underline-offset-2'
                                        />
                                        <br />
                                    </>
                                )}
                                {entry.context}
                            </p>
                        </div>
                    </CloudLink>
                ))}
            </div>
        </div>
    )
}
