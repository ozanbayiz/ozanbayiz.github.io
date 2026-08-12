import { footer } from '@/features/home/content'
import AboutSection from '@/features/home/sections/About'
import HeroSection from '@/features/home/sections/Hero'
import ResearchSection from '@/features/home/sections/Research'
import { CONTENT_INSET_X, Section } from '@/features/home/ui'

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
            <HeroSection />

            <main id='main' className="relative flex grow flex-col">
                {/* Default py-seam: the white bands above and below the
                  * rectangle are the same size, so it sits centered
                  * between the hero and the black region. */}
                <Section id="about" fill>
                    <AboutSection />
                </Section>

                {/* From here down the page goes full-bleed black: the
                  * section rhythm supplies the white gap after the about
                  * rectangle, then .section-fill (and its light accent
                  * variants) run through the footer. `grow` keeps the black
                  * running to the bottom on tall viewports instead of
                  * stopping and showing white beneath. */}
                <div className="section-fill grow">
                {/* py-inset: the same 24px frame every black area gets,
                  * so this region's top edge matches the about rectangle's
                  * frame exactly. */}
                <Section id="research" className="py-inset">
                    {/* Same horizontal inset as the about rectangle, from one
                      * shared constant — this section's black is the page
                      * background, not its own box, so the padding has to
                      * be applied here to land on the same left edge. */}
                    <div className={CONTENT_INSET_X}>
                        <ResearchSection />
                    </div>
                </Section>

                {/* Favorites parked for now — re-add with:
                    <Section id="favorites"><FavoritesSection /></Section>
                    (component: sections/Favorites.tsx, data: data/favorites.ts) */}

                <footer className="pb-seam text-center">
                    <div className="container mx-auto max-w-[64rem] px-inset">
                        <p className="font-script text-4xl leading-none text-foreground">
                            {footer.signature} {CURRENT_YEAR}
                        </p>
                    </div>
                </footer>
                </div>
            </main>
        </>
    )
}
