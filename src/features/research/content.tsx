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

export type ResearchEntry = {
    slug: string
    title: string
    /** Venue-style context line, e.g. 'UC Berkeley · CS 280' */
    context: string
    year: string
    /** 1–2 sentence card summary. */
    tldr: string
    /** Card/cover image (public path). */
    cover?: string
    /** Hero plate atop the report page — rendered as captioned figures.
     * Defaults to the cover (caption-less); two images render side by
     * side (e.g. a pair of gameplay gifs). */
    hero?: { src: string; caption?: string }[]
    /* Document actions — the predictable suite every project may carry.
     * Rendered as an icon-chip toolbar in the page letterhead, always in
     * this order: Code · PDF · Demo. Just set the URLs that exist. */
    code?: string
    pdf?: string
    demo?: string
}

export const research: { heading: string; entries: ResearchEntry[] } = {
    heading: 'research',
    entries: [
        {
            slug: 'offline-rl-teaching',
            title: 'When Offline RL Cannot Evaluate Teaching: A Diagnostic Case Study',
            context: 'UC Berkeley · CS 185/285',
            year: '2026',
            tldr: 'Decision Transformer tutoring policies over a knowledge-tracing world model, screened by a four-diagnostic OPE protocol — every comparison between pedagogically-grounded reward shapes and the immediate-correctness baseline was caught, each catch tracing to a concrete data-infrastructure gap.',
            cover: '/projects/offline-rl-teaching/system-figure.png',
            hero: [
                {
                    src: '/projects/offline-rl-teaching/system-figure.png',
                    caption:
                        'The two-policy tutoring system. The high-level pedagogical policy (this paper) selects knowledge-graph nodes; the low-level interaction policy (future work) executes teaching turns with the student.'
                }
            ],
            pdf: '/projects/offline-rl-teaching/paper.pdf'
        },
        {
            slug: 'vizdoom-dqn',
            title: 'Frozen Vision Encoders for Deep RL in VizDoom',
            context: 'Personal research',
            year: '2026',
            tldr: 'Double DQN over frozen self-supervised vision features (AIMv2, V-JEPA 2) with PCA whitening — decoupling representation from policy learning makes training fast, memory-efficient, and stable.',
            cover: '/projects/vizdoom-dqn/thumbnail.png',
            hero: [
                {
                    src: '/projects/vizdoom-dqn/gameplay_trained.gif',
                    caption: 'Trained agent (500k steps). Return: 5.'
                },
                {
                    src: '/projects/vizdoom-dqn/gameplay_best.gif',
                    caption: 'Best recorded episode. Return: 9.'
                }
            ],
            code: 'https://github.com/ozanbayiz/vizdoom-dqn'
        },
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
