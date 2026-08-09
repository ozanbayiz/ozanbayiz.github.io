import { footer } from '@/features/home/content'
import AboutSection from '@/features/home/sections/About'
import HeroSection from '@/features/home/sections/Hero'
import ResearchSection from '@/features/home/sections/Research'
import { CONTENT_INSET_X, Section } from '@/features/home/ui'
import { Container } from '@/shared/ui/container'

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
                {/* THE RHYTHM RULE — every major block carries its own top
                  * seam (pt-seam); interior frames are inset; contents are
                  * stack. The about rectangle carries BOTH seams (py-seam)
                  * because both of its bands must be white. So each block
                  * reads, at every width, as: seam / inset-frame /
                  * stack-contents — a self-contained view. */}
                <Section id="about" fill className="py-seam">
                    <AboutSection />
                </Section>

                {/* From here down the page goes full-bleed black:
                  * .section-fill (and its light accent variants) run
                  * through the footer. `grow` keeps the black running to
                  * the bottom on tall viewports instead of stopping and
                  * showing white beneath. */}
                <div className="section-fill grow">
                {/* pt-inset, not a seam: this section sits INSIDE a filled
                  * region, so its vertical space is that region's interior
                  * frame. The seam before it is the about rectangle's white
                  * band; the seam after it belongs to the footer. */}
                <Section id="research" className="pt-inset">
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

                {/* pt-seam above the signature; pb-inset beneath it — the
                  * region's interior bottom frame, mirroring its pt-inset
                  * top (the black itself extends past it via `grow`). */}
                <footer className="pt-seam pb-inset text-center">
                    <Container width="lg" gutter="always">
                        <p className="font-script text-5xl md:text-6xl leading-none text-foreground">
                            {footer.signature} {CURRENT_YEAR}
                        </p>
                    </Container>
                </footer>
                </div>
            </main>
        </>
    )
}
