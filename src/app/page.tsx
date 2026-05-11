import { Divider, PageDivider } from '@/components/common/Divider'
import FavoritesSection from '@/features/home/components/favorites/FavoritesSection'
import HeroSection from '@/features/home/components/HeroSection'
import OzanSection from '@/features/home/components/OzanSection'
import Section from '@/features/home/components/Section'

const CURRENT_YEAR = new Date().getFullYear()

export default function Home() {
    return (
        <>
            <HeroSection />

            <main className="relative">
                <PageDivider />
                <Section id="about">
                    <OzanSection />
                </Section>

                <PageDivider />
                <Section id="favorites" className="pb-8 md:pb-10">
                    <FavoritesSection />
                </Section>

                <footer className="py-16 md:py-20 text-center">
                    <div className="container mx-auto max-w-screen-lg px-6 md:px-8">
                        <Divider className="mb-16" />
                        <p className="text-xs text-foreground">
                            ozanbayiz {CURRENT_YEAR}
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
