/**
 * ── RESEARCH CONTENT ─────────────────────────────────────────────────
 * One entry per research project. Each entry becomes a card in the
 * homepage research section and (if `slug` matches an MDX file in
 * src/content/research/) a full report page at /research/<slug>/.
 *
 * To add a project:
 *   1. Add an entry here (newest first — order here is display order).
 *   2. Optional full report: src/content/research/<slug>.mdx
 *      (prose + math + <Figure>/<ImageGrid>; see existing reports).
 *   3. Optional card image in public/projects/<slug>/.
 */

import type { ReactNode } from 'react'

import ExternalLink from '@/shared/ui/external-link'
import type { BylineAuthor } from '@/shared/ui/byline'

export type ResearchEntry = {
    slug: string
    title: string
    /** Card-sized title; the homepage card uses this when the full
     * title is a mouthful. The report page always shows `title`. */
    shortTitle?: string
    /** Venue-style context line, e.g. 'UC Berkeley · CS 280' */
    context: string
    /** Publication byline, in paper order. `self` marks the site
     * owner — underlined on the report page. `mark` renders after the
     * name (outside the underline), e.g. '*' for equal contribution. */
    authors?: BylineAuthor[]
    /** Quiet fragment closing the authors line, e.g. '*equal contribution'. */
    authorsNote?: string
    /** Venue line under the byline — the workshop/conference sentence;
     * ReactNode so the venue name can carry a link. */
    venue?: ReactNode
    year: string
    /** 1–2 sentence card summary. */
    tldr: string
    /** Card/cover image (public path). The report page shows no plate of
     * its own: the MDX places its figures where the text needs them. */
    cover?: string
    /* Document actions — the predictable suite every project may carry.
     * Rendered as an icon-chip toolbar in the page letterhead, always in
     * this order: Code · PDF · Demo. Just set the URLs that exist. */
    code?: string
    pdf?: string
    demo?: string
}

export const research: { entries: ResearchEntry[] } = {
    entries: [
        {
            slug: 'multilingual-vision-and-text',
            title: 'A Compositional Analysis of Cross-Lingual Math Reasoning in Efficient Vision-Language Models',
            shortTitle: 'Cross-Lingual Math Reasoning in Efficient VLMs',
            context: 'ECCV 2026 · FAILED workshop',
            authors: [
                { name: 'Kerem Tuzel', mark: '*' },
                { name: 'Ozan Bayiz', self: true, mark: '*' }
            ],
            authorsNote: '*equal contribution',
            venue: (
                <>
                    <ExternalLink
                        href='https://3rd-failed-workshop-eccv-2026.github.io/'
                        className='link-marked'
                    >
                        FAILED
                    </ExternalLink>
                    , the 3rd Workshop on Fairness and Ethics in AI: facing the
                    ChalLEnge through Model Debiasing, at ECCV 2026 in Malmö
                </>
            ),
            year: '2026',
            tldr: 'Small vision-language models read a math problem and reason about it with separable skills, and monolingual scores alone predict their cross-lingual accuracy.',
            /* Card-only 16:9 crop (top three language blocks) so the
             * cover fills the card plate without letterboxing; the
             * report's Figure 1 keeps the full five-language figure. */
            cover: '/projects/multilingual-vision-and-text/questions_all_languages_cover.webp',
            code: 'https://github.com/keremtuzel49/multilingual_vision_and_text'
            /* pdf: add '/projects/multilingual-vision-and-text/paper.pdf'
             * once the file lands in public/projects/… — it is referenced
             * by the writeup but was not in _new_proj. */
        }
        /* Parked 2026-08-24 at the author's request — off the public
         * site for now. The page, MDX, and assets are all preserved;
         * re-enable by uncommenting.
        {
            slug: 'offline-rl-teaching',
            title: 'When Offline RL Cannot Evaluate Teaching: A Diagnostic Case Study',
            shortTitle: 'When Offline RL Cannot Evaluate Teaching',
            context: 'UC Berkeley · CS 185/285',
            year: '2026',
            tldr: 'A four-diagnostic screening protocol for offline RL in education — and the catalogue of comparisons it caught before they could ship as findings.',
            cover: '/projects/offline-rl-teaching/system-figure.webp',
            pdf: '/projects/offline-rl-teaching/paper.pdf'
        },
        */
        /* Parked 2026-08-11 at the author's request — he'd rather not
         * showcase AI harming anything, even fictitious monsters. The
         * page, rewritten MDX, and images are all preserved; re-enable
         * by uncommenting.
        {
            slug: 'vizdoom-dqn',
            title: 'Frozen Vision Encoders for Deep RL in VizDoom',
            context: 'Personal research',
            year: '2026',
            tldr: 'Double DQN on frozen AIMv2 and V-JEPA 2 features: the agent never learns to see, only to act — and one encoder diverges spectacularly.',
            cover: '/projects/vizdoom-dqn/thumbnail.png',
            code: 'https://github.com/ozanbayiz/vizdoom-dqn'
        },
        */
        /* Parked until its artifacts clear the quality bar — re-enable
         * by uncommenting (page, MDX, and images are all preserved).
        {
            slug: 'vista',
            title: 'VISTA: Vision Intersectional Sparse Trait Analysis',
            context: 'UC Berkeley',
            year: '2025',
            tldr: 'Sparse-autoencoder probing of demographic traits in VLM vision encoders — showing that prior SAE-based "debiasing" is largely an artifact of reconstruction error, not targeted concept removal.',
            cover: '/projects/vista/thumbnail.jpg',
            code: 'https://github.com/ozanbayiz/vista',
            pdf: 'https://drive.google.com/file/d/1GGZpM5Wz_wwaz6jEWMMBS_Ixga-qs3XV/view?usp=drive_link'
        }
        */
    ]
}
