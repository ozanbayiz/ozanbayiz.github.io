import FavoritesSection from '@/features/home/components/FavoritesSection'
import OzanSection from '@/features/home/components/OzanSection'
import ProjectSection from '@/features/home/components/ProjectSection'
import ResearchSection from '@/features/home/components/ResearchSection'
import SocialLinks from '@/features/home/components/SocialLinks'
import TopAscii from '@/features/home/components/TopAscii'
import SectionDivider from '@/shared/ui/section-divider'

export default function Home() {
    return (
        <div className='container mx-auto flex flex-col items-center justify-center px-4 py-4' style={{ ['--inset-x' as unknown as string]: '1rem' }}>
            {/* ascii art*/}
            <TopAscii />

            <SectionDivider />
            {/* <Separator /> */}

            <SocialLinks />

            <SectionDivider />
            {/* <Separator /> */}

            <OzanSection />

            <SectionDivider />
            {/* <Separator /> */}

            <ProjectSection />

            <SectionDivider />
            {/* <Separator /> */}

            <ResearchSection />

            <SectionDivider />
            {/* <Separator /> */}

            <FavoritesSection />

            Ozan Bayiz, 2025

            {/* <BottomAscii /> */}
        </div>
    )
}
