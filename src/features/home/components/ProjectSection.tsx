import Link from 'next/link'

import { projectsData } from '@/features/projects'
import ProjectCard from '@/features/projects/components/ProjectCard'
import { Button } from '@/shared/ui/button'
import { Section } from '@/shared/ui/section'

export default function ProjectSection() {
    return (
        <Section>
            <div className='grid grid-cols-1 justify-stretch gap-8'>
                <div className='text-center sm:text-left'>
                    <div className='mb-4 flex items-center justify-between gap-2'>
                        <h1 className='h2'>Featured Projects</h1>
                        <Button variant='outline' size='sm' asChild>
                            <Link href='/projects/' prefetch={false}>
                                all projects
                            </Link>
                        </Button>
                    </div>
                    <ul className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {[...projectsData]
                            .filter(p => p.featured)
                            .sort((a, b) => (Date.parse(b.date ?? '') || 0) - (Date.parse(a.date ?? '') || 0))
                            .map((project, index) => (
                                <li key={index}>
                                    <ProjectCard
                                        slug={project.slug}
                                        title={project.title}
                                        description={project.description}
                                        imageUrl={project.imageUrl}
                                        gitUrl={project.gitUrl}
                                        pdfUrl={project.pdfUrl}
                                        date={project.date}
                                    />
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </Section>
    )
}


