import Link from 'next/link'

import { projectsData, type Project } from '@/features/projects'
import ProjectCard from '@/features/projects/components/ProjectCard'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/ui/breadcrumb'
import ExternalLink from '@/shared/ui/external-link'
import { Separator } from '@/shared/ui/separator'

const byDateDesc = (a?: string, b?: string) => {
    const ad = a ? Date.parse(a) : 0
    const bd = b ? Date.parse(b) : 0
    return bd - ad
}

function Section({ items }: { items: Project[] }) {
    return (
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'>
            {items.map(p => (
                <ProjectCard
                    key={`${p.collection}:${p.slug ?? p.title}`}
                    slug={p.slug}
                    title={p.title}
                    description={p.description}
                    imageUrl={p.imageUrl}
                    gitUrl={p.gitUrl}
                    pdfUrl={p.pdfUrl}
                    date={p.date}
                />
            ))}
        </div>
    )
}

export default function ProjectsListPage() {
    const all = [...projectsData].sort((a, b) => byDateDesc(a.date, b.date))
    const cs180 = all.filter(p => p.collection === 'cs180')
    const research = all.filter(p => p.collection === 'misc-academic')
    const personal = all.filter(p => p.collection === 'personal')
    return (
        <div className='mx-auto w-full max-w-screen-lg px-4 pb-8'>
            <div className='my-4'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href='/'>Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Projects</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <section className='space-y-4'>
                <h1 className='h1'>Projects</h1>
                <div className='flex flex-col gap-12'>
                    <div className='space-y-3'>
                        <h2 className='h2'>CS180 Projects</h2>
                        <p className='body-text text-foreground'>
                            Fall 2024 I took{' '}
                            <ExternalLink href='https://cal-cs180.github.io/fa24/index.html' className='underline hover:text-accent' aria-label='CS 180/280A' newTab={false}>
                                CS180/280A: Intro to Computer Vision and Computational Photography
                            </ExternalLink>
                            , taught by Prof. Alexei Efros.
                            I got to work on some pretty neat projects which you can check out below.
                        </p>
                        <Section items={cs180} />
                    </div>
                    <Separator />
                    <div className='space-y-3'>
                        <h2 className='h2'>Misc Academic Projects</h2>
                        <p className='body-text text-foreground'>Projects from classes at Berkeley.</p>
                        <Section items={research} />
                    </div>
                    <Separator />
                    <div className='space-y-3'>
                        <h2 className='h2'>Personal Projects</h2>
                        <p className='body-text text-foreground'>Smaller experiments and things I built for fun or learning.</p>
                        <Section items={personal} />
                    </div>
                </div>
            </section>
        </div>
    )
}
