import { footer } from '@/features/home/content'
import AboutSection from '@/features/home/sections/About'
import HeroSection from '@/features/home/sections/Hero'
import ResearchSection from '@/features/home/sections/Research'
import { Section } from '@/features/home/ui'

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

            <main id='main' className="relative">
                <Section id="about" fill>
                    <AboutSection />
                </Section>

                {/* From here down the page goes full-bleed black: a small
                  * white gap after the about rectangle, then .section-fill
                  * (and its light accent variants) through the footer. */}
                <div className="section-fill mt-8 md:mt-10">
                <Section id="research">
                    <ResearchSection />
                </Section>

                {/* Favorites parked for now — re-add with:
                    <Section id="favorites"><FavoritesSection /></Section>
                    (component: sections/Favorites.tsx, data: data/favorites.ts) */}

                <footer className="py-10 md:py-12 text-center">
                    <div className="container mx-auto max-w-screen-lg px-6 md:px-8 flex flex-col items-center gap-2">
                        <p className="font-script text-5xl md:text-6xl leading-none text-foreground">
                            {footer.signature}
                        </p>
                        <p className="text-xs text-foreground">
                            {CURRENT_YEAR}
                            <span className="animate-blink ml-1">
                                _
                            </span>
                        </p>
                    </div>
                </footer>
                </div>
            </main>
        </>
    )
}
