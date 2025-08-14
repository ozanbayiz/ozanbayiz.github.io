import SectionDivider from '@/components/SectionDivider'

import OzanSection from '../components/OzanSection'
import ProjectSection from '../components/ProjectSection'
import ResearchSection from '../components/ResearchSection'
import SocialLinks from '../components/SocialLinks'
import TopAscii from '../components/TopAscii'

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
