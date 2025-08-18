import SectionDivider from '@/components/common/SectionDivider'
import TopAscii from '@/components/layout/TopAscii'
import OzanSection from '@/features/home/components/OzanSection'
import ProjectSection from '@/features/home/components/ProjectSection'
import ResearchSection from '@/features/home/components/ResearchSection'
import SocialLinks from '@/features/home/components/SocialLinks'

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

            Ozan Bayiz, 2025

            {/* <BottomAscii /> */}
        </div>
    )
}
