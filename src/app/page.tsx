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
                {/* py-stack: both gaps around the rectangle are seams, not
                  * full section breaks — the hero's own bottom space plus a
                  * seam above, and the surface change below. Keeping them
                  * equal stops the rectangle from looking like it drifted
                  * down the page. */}
                <Section id="about" fill className="py-stack">
                    <AboutSection />
                </Section>

                {/* From here down the page goes full-bleed black: the
                  * section rhythm supplies the white gap after the about
                  * rectangle, then .section-fill (and its light accent
                  * variants) run through the footer. `grow` keeps the black
                  * running to the bottom on tall viewports instead of
                  * stopping and showing white beneath. */}
                <div className="section-fill grow">
                {/* py-inset-y, not py-section: this section sits INSIDE a
                  * filled region, so its vertical space is that region's
                  * interior padding. Using the section rhythm here stacked
                  * on top of the region's own edge and left a dead band. */}
                <Section id="research" className="py-inset-y">
                    {/* Same horizontal inset as the about rectangle, from one
                      * shared constant — this section's black is the page
                      * background, not its own box, so the padding has to
                      * be applied here to land on the same left edge. The
                      * vertical rhythm comes from the Section's py-section. */}
                    <div className={CONTENT_INSET_X}>
                        <ResearchSection />
                    </div>
                </Section>

                {/* Favorites parked for now — re-add with:
                    <Section id="favorites"><FavoritesSection /></Section>
                    (component: sections/Favorites.tsx, data: data/favorites.ts) */}

                <footer className="pb-section text-center">
                    <div className="container mx-auto max-w-screen-lg px-inset-x">
                        <p className="font-script text-5xl md:text-6xl leading-none text-foreground">
                            {footer.signature} {CURRENT_YEAR}
                        </p>
                    </div>
                </footer>
                </div>
            </main>
        </>
    )
}
