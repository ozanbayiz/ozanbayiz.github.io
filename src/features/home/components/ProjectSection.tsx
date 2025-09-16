import Link from 'next/link'

import ProjectCard from '@/features/projects/components/ProjectCard'
import { projectsData } from '@/features/projects/data/projects'

export default function ProjectSection() {
    return (
        <section>
            <div className='mx-0 my-4 grid grid-cols-1 justify-stretch gap-8 sm:mx-4'>
                <div className='text-center sm:text-left'>
                    <div className='mb-4 flex items-center justify-between gap-2'>
                        <h1 className='text-xl font-bold sm:text-2xl'>Featured Projects</h1>
                        <Link href='/projects/' className='text-sm underline hover:text-accent' prefetch={false}>
                            View all projects
                        </Link>
                    </div>
                    <ul className='mb-4 grid grid-cols-1 sm:grid-cols-2 gap-8'>
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
        </section>
    )
}


