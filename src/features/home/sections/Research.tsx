/* Research: publication-style project cards linking to report pages.
 * Entries live in src/features/research/content.tsx. */

import { research } from '@/features/research/content'
import CloudLink from '@/shared/ui/cloud-link'

/* No section heading — the cards announce themselves (paper figures,
 * academic titles); nothing on the homepage introduces anything. */
export default function ResearchSection() {
    return (
        <div className="w-full">
            {/* items-start: each card hugs its own content like the About
              * paragraphs — no stretching to match its row neighbor. */}
            {/* gap-y-chasm: the cards' clouds billow upward (crest) and
              * drift downward (keel) — stacked cards need the full
              * chasm so their blobs never touch; side by side, a gulf
              * is enough for two flanks. */}
            <div className="grid grid-cols-1 items-start gap-x-gulf gap-y-chasm md:grid-cols-2">
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
                        className="cloud-zone flex flex-col gap-stack p-inline"
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
                                 * and bg-white keeps the plate (letterbox
                                 * included) a clean white figure on the
                                 * black cloud. */
                                className="aspect-video w-full bg-white object-contain"
                            />
                        )}
                        {/* Title only — it does the talking; the tldr's
                          * job moved to the report page itself. */}
                        <p className="text-sm font-bold leading-snug">
                            {entry.shortTitle ?? entry.title}
                        </p>
                    </CloudLink>
                ))}
            </div>
        </div>
    )
}
