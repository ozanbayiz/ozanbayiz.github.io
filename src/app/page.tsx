import { footer } from '@/features/home/content'
import AboutSection from '@/features/home/sections/About'
import HeroSection from '@/features/home/sections/Hero'
import ResearchSection from '@/features/home/sections/Research'
import { CONTENT_INSET_X, Section } from '@/features/home/ui'
import PhysarumBackground from '@/shared/ui/physarum-background'

const CURRENT_YEAR = new Date().getFullYear()

const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ozan Bayiz',
    url: 'https://ozanbayiz.github.io',
    email: 'mailto:ozanbayiz@berkeley.edu',
    affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'UC Berkeley'
    },
    sameAs: [
        'https://github.com/ozanbayiz',
        'https://linkedin.com/in/ozanbayiz'
    ]
}

export default function Home() {
    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />
            {/* The living background: breathing black clouds behind the
              * data-cloud blocks, and an ASCII slime-mold sim crawling
              * the space between them — a fixed canvas behind all
              * content, pointer-transparent. Mounted HERE, not in the
              * layout: the organism belongs to the homepage; the paper
              * pages stay plain documents. */}
            <PhysarumBackground />
            <HeroSection />

            <main id='main' className="relative flex grow flex-col">
                {/* Stripped-down base: a white page, each content block
                  * riding its own breathing black cloud painted by
                  * CloudBackground (see shared/ui/cloud-background.tsx).
                  * The old black rectangles and full-bleed black region
                  * are gone; the physarum organism arrives later in the
                  * space between the clouds. */}

                {/* Every bio item inside is its own dead zone (see
                  * sections/About.tsx); same horizontal inset as
                  * research, from the shared constant. */}
                <Section id="about">
                    <div className={CONTENT_INSET_X}>
                        <AboutSection />
                    </div>
                </Section>

                {/* pt-gulf: the first cards' clouds billow upward ~50px;
                  * a plain seam would let them bleed into the bio text
                  * above (twMerge keeps the seam below). */}
                <Section id="research" className="pt-gulf">
                    {/* Same horizontal inset as the about section, from
                      * one shared constant — the research cards' clouds
                      * are painted per card, so there's no box here. */}
                    <div className={CONTENT_INSET_X}>
                        <ResearchSection />
                    </div>
                </Section>

                {/* Favorites parked for now — re-add with:
                    <Section id="favorites"><FavoritesSection /></Section>
                    (component: sections/Favorites.tsx, data: data/favorites.ts) */}

                {/* pt-gulf: the research cards' clouds breathe downward,
                  * so the bare signature keeps a full gulf of white
                  * between itself and them. */}
                <footer className="pt-gulf pb-seam text-center">
                    <div className="container mx-auto max-w-[64rem] px-inset">
                        {/* The signature is a dead zone: plain ink, no
                          * cloud, and the mold keeps its distance. w-fit
                          * so the zone hugs the script, not the column. */}
                        <p data-cloud="dead" className="mx-auto w-fit font-script text-4xl leading-none text-foreground">
                            {footer.signature} {CURRENT_YEAR}
                        </p>
                    </div>
                </footer>
            </main>
        </>
    )
}
