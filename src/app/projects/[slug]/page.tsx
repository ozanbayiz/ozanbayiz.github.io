import { notFound } from 'next/navigation'
import ExportedImage from 'next-image-export-optimizer'

import { LightboxProvider } from '@/features/lightbox'
import { projectsData } from '@/features/projects'
import InlineToc from '@/features/projects/components/InlineToc'
import ProjectHeader from '@/features/projects/components/ProjectHeader'
import ProjectMetaSetter from '@/features/projects/components/ProjectMetaSetter'
import { SidebarToc } from '@/features/projects/components/SidebarToc'
import ProjectsMdx from '@/features/projects/mdx/ProjectsMdx'

type Params = { slug: string }

export function generateStaticParams() {
    return projectsData
        .filter(p => !!p.slug)
        .map(p => ({ slug: p.slug! }))
}

const byDateDesc = (a?: string, b?: string) => {
    const ad = a ? Date.parse(a) : 0
    const bd = b ? Date.parse(b) : 0
    return bd - ad
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params
    const project = projectsData.find(p => p.slug === slug)
    if (!project) return notFound()

    const sorted = [...projectsData].sort((a, b) => byDateDesc(a.date, b.date))
    const idx = sorted.findIndex(p => p.slug === slug)
    const prevProject = idx > 0 ? sorted[idx - 1] : null
    const nextProject = idx < sorted.length - 1 ? sorted[idx + 1] : null
    const prev = prevProject ? { slug: prevProject.slug, title: prevProject.shortTitle ?? prevProject.title } : null
    const next = nextProject ? { slug: nextProject.slug, title: nextProject.shortTitle ?? nextProject.title } : null

    const heroSrc = project.heroImageSrc ?? project.imageUrl
    const showHero = !project.hideHero && heroSrc

    return (
        <>
            <ProjectMetaSetter
                title={project.shortTitle ?? project.title}
                prev={prev}
                next={next}
            />
            {showHero ? (
                <div className='w-full aspect-video max-h-[50vh] overflow-hidden relative'>
                    <ExportedImage
                        src={heroSrc}
                        alt={project.heroAlt ?? project.title}
                        fill
                        className='object-cover'
                        sizes='100vw'
                        priority
                    />
                    <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent' />
                </div>
            ) : (
                <div className='pt-24 md:pt-28' />
            )}

            <div className='max-w-screen-md mx-auto px-6 md:px-8 mt-12 space-y-6'>
                <ProjectHeader
                    title={project.title}
                    description={project.description}
                    repoUrl={project.gitUrl}
                    date={project.date}
                    authors={project.authors}
                    pdfUrl={project.pdfUrl}
                    demoUrl={project.demoUrl}
                />

                <div className='h-px w-full bg-foreground' />

                <InlineToc />
            </div>

            <div className='max-w-screen-md mx-auto px-6 md:px-8 pt-10 pb-16 relative'>
                <SidebarToc />
                <div className='prose prose-sm prose-neutral dark:prose-invert max-w-none [&_figure]:max-w-none [&_.grid]:max-w-none [&_video]:max-w-none [&_pre]:text-[1em] [&_code]:text-[1em] [&_table]:text-[1em] [&_pre]:border [&_pre]:bg-background [&_blockquote]:border-l-2 [&_blockquote]:border-foreground [&_blockquote]:pl-4 [&_hr]:border-foreground [&_hr]:my-8'>
                    <LightboxProvider>
                        <ProjectsMdx slug={slug} />
                    </LightboxProvider>
                </div>
            </div>
        </>
    )
}
