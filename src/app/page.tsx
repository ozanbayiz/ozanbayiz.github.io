import FavoritesSection from '@/features/home/components/FavoritesSection'
import HeroSection from '@/features/home/components/HeroSection'
import OzanSection from '@/features/home/components/OzanSection'
import ProjectSection from '@/features/home/components/ProjectSection'
import Section from '@/features/home/components/Section'

const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ozan Bayiz',
    url: 'https://ozanbayiz.github.io',
    email: 'mailto:ozanbayiz@berkeley.edu',
    jobTitle: 'CS for Education @ Berkeley',
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
                <div className="mx-auto max-w-screen-lg px-6 md:px-8"><div className="h-px w-full bg-foreground" /></div>
                <Section id="about">
                    <OzanSection />
                </Section>

                <div className="mx-auto max-w-screen-lg px-6 md:px-8"><div className="h-px w-full bg-foreground" /></div>
                <Section id="projects">
                    <ProjectSection />
                </Section>

                <div className="mx-auto max-w-screen-lg px-6 md:px-8"><div className="h-px w-full bg-foreground" /></div>
                <Section id="favorites" className="pb-8 md:pb-10">
                    <FavoritesSection />
                </Section>

                <footer className="py-16 md:py-20 text-center">
                    <div className="container mx-auto max-w-screen-lg px-6 md:px-8">
                        <div className="h-px w-full bg-foreground mb-16" />
                        <p>
                            ozanbayiz {new Date().getFullYear()}
                            <span className="animate-blink ml-1">
                                _
                            </span>
                        </p>
                    </div>
                </footer>
            </main>
        </>
    )
}
