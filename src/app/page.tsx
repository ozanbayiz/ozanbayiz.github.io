import LazyFavoritesSection from '@/features/home/components/LazyFavoritesSection'
import OzanSection from '@/features/home/components/OzanSection'
import ProjectSection from '@/features/home/components/ProjectSection'
import ResearchSection from '@/features/home/components/ResearchSection'
import SocialLinks from '@/features/home/components/SocialLinks'
import TopAscii from '@/features/home/components/TopAscii'

export default function Home() {
    return (
        <div className='container mx-auto flex max-w-screen-lg flex-col items-center justify-center px-6 py-8 md:px-8 md:py-12' style={{ ['--inset-x' as unknown as string]: '1rem' }}>
            {/* ascii art*/}
            <TopAscii />
            <hr className="w-full my-8 border-foreground" />

            <SocialLinks />
            <hr className="w-full my-8 border-foreground" />

            <OzanSection />
            <hr className="w-full my-8 border-foreground" />

            <ProjectSection />
            <hr className="w-full my-8 border-foreground" />

            <ResearchSection />
            <hr className="w-full my-8 border-foreground" />

            <LazyFavoritesSection />

            <footer className='py-8 text-xs text-foreground'>
                Ozan Bayiz, {new Date().getFullYear()}
            </footer>
        </div>
    )
}
