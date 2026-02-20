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
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
    const cs184 = all.filter(p => p.collection === 'cs184')
    const cs280 = all.filter(p => p.collection === 'cs280')
    const cs185 = all.filter(p => p.collection === 'cs185')
    const research = all.filter(p => p.collection === 'misc-academic')
    const personal = all.filter(p => p.collection === 'personal')
    return (
        <div className='mx-auto w-full max-w-screen-lg px-6 pb-12 md:px-8'>
            <div className='my-6'>
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
            <section className='space-y-6'>
                <h1 className='text-2xl font-bold sm:text-3xl md:text-4xl tracking-tight'>Projects</h1>
                <div className='flex flex-col gap-14'>
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>CS185 Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>
                            Spring 2026 I&apos;m taking{' '}
                            <ExternalLink href='https://rail.eecs.berkeley.edu/deeprlcourse/' className='italic hover:text-accent1' aria-label='CS 185' newTab={false}>
                                CS 185/285: Deep Reinforcement Learning, Decision Making, and Control
                            </ExternalLink>.
                            {' '} with Prof. <ExternalLink href='https://people.eecs.berkeley.edu/~svlevine/' className='italic hover:text-accent1' aria-label='CS 185' newTab={false}>
                                Prof. Sergey Levine
                            </ExternalLink>.
                        </p>

                        <Section items={cs185} />
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>CS184 Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>
                            Spring 2026 I&apos;m taking{' '}
                            <ExternalLink href='https://cs184.eecs.berkeley.edu/sp26' className='italic hover:text-accent1' aria-label='CS 184' newTab={false}>
                                CS 184/284A: Computer Graphics and Imaging
                            </ExternalLink>
                            , taught by Professor <ExternalLink href='https://obrien.cs.berkeley.edu/' className='font-bold hover:text-accent1' aria-label="James O'Brien" newTab={false}>James O&apos;Brien</ExternalLink>.
                        </p>
                        <Section items={cs184} />
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>CS280 Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>
                            Spring 2026 I&apos;m taking{' '}
                            <ExternalLink href='https://cs280-berkeley.github.io/' className='italic hover:text-accent1' aria-label='CS 280' newTab={false}>
                                CS C280: Computer Vision
                            </ExternalLink>
                            , taught by Professors
                            <ExternalLink href='https://people.eecs.berkeley.edu/~kanazawa/' className='font-bold hover:text-accent1' aria-label='Angjoo Kanazawa' newTab={false}>
                                Angjoo Kanazawa
                            </ExternalLink>
                            {' '}and{' '}
                            <ExternalLink href='https://people.eecs.berkeley.edu/~efros/' className='font-bold hover:text-accent1' aria-label='Alexei Efros' newTab={false}>
                                Alexei Efros
                            </ExternalLink>.
                        </p>
                        <Section items={cs280} />
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>CS180 Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>
                            Fall 2024 I took{' '}
                            <ExternalLink href='https://cal-cs180.github.io/fa24/index.html' className='italic hover:text-accent1' aria-label='CS 180/280A' newTab={false}>
                                CS180/280A: Intro to Computer Vision and Computational Photography
                            </ExternalLink>
                            , taught by Professor <ExternalLink href='https://people.eecs.berkeley.edu/~efros/' className='font-bold hover:text-accent1' aria-label='Alexei Efros' newTab={false}>Alexei Efros</ExternalLink>.
                            I got to work on some pretty neat projects which you can check out below.
                        </p>
                        <Section items={cs180} />
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>Misc Academic Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>Projects from classes at Berkeley.</p>
                        <Section items={research} />
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                        <h2 className='text-xl font-bold sm:text-2xl md:text-3xl tracking-tight'>Personal Projects</h2>
                        <p className='text-sm leading-relaxed text-foreground'>Smaller experiments and things I built for fun or learning.</p>
                        <Section items={personal} />
                    </div>
                </div>
            </section >
        </div >
    )
}
