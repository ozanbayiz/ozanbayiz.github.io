import Link from 'next/link'
import ExportedImage from 'next-image-export-optimizer'

import { ModeToggle } from '@/components/common/ModeToggle'
import { projectsData, type Project } from '@/features/projects'
import ExternalLink from '@/shared/ui/external-link'

const byDateDesc = (a?: string, b?: string) => {
    const ad = a ? Date.parse(a) : 0
    const bd = b ? Date.parse(b) : 0
    return bd - ad
}

function formatDate(date?: string) {
    if (!date) return null
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    })
}

function ProjectRow({ p }: { p: Project }) {
    const formattedDate = formatDate(p.date)
    return (
        <div className='group border-b'>
            <Link href={`/projects/${p.slug}/`} className='flex items-center gap-4 py-4'>
                <div className='relative h-16 w-24 shrink-0 overflow-hidden border'>
                    <ExportedImage src={p.imageUrl} alt={p.title} fill className='object-cover' sizes='96px' />
                </div>
                <div className='flex-1 min-w-0'>
                    <h3 className='gradient-link-group text-sm font-bold'>{p.title}</h3>
                    <p className='text-xs text-foreground line-clamp-1 mt-0.5'>{p.description}</p>
                </div>
                {formattedDate ? (
                    <span className='shrink-0 text-xs text-foreground hidden sm:block'>{formattedDate}</span>
                ) : null}
            </Link>
        </div>
    )
}

function Section({ items }: { items: Project[] }) {
    return (
        <div className='border-t'>
            {items.map(p => (
                <ProjectRow key={`${p.collection}:${p.slug ?? p.title}`} p={p} />
            ))}
        </div>
    )
}

export default function ProjectsListPage() {
    const all = [...projectsData].sort((a, b) => byDateDesc(a.date, b.date))
    const cs185 = all.filter(p => p.collection === 'cs185')
    const cs280 = all.filter(p => p.collection === 'cs280')
    const research = all.filter(p => p.collection === 'misc-academic')
    const personal = all.filter(p => p.collection === 'personal')
    return (
        <div className='relative mx-auto w-full max-w-screen-lg px-6 pb-12 md:px-8'>
            <header className='flex items-center justify-between py-6'>
                <Link href='/' className='gradient-link text-xs uppercase tracking-widest'>
                    &larr; Home
                </Link>
                <h1 className='text-sm font-bold uppercase tracking-widest'>Projects</h1>
                <div className='flex items-center gap-3'>
                    <ModeToggle />
                </div>
            </header>
            <div className='flex flex-col gap-10'>
                <div className='space-y-3'>
                    <div className='sticky top-0 z-10 bg-background py-3'>
                        <h2 className='text-sm font-bold uppercase tracking-widest'>CS185 — Deep RL</h2>
                        <p className='text-xs text-foreground mt-1'>
                            with{' '}
                            <ExternalLink href='https://people.eecs.berkeley.edu/~svlevine/'>
                                Sergey Levine
                            </ExternalLink>
                        </p>
                    </div>
                    <Section items={cs185} />
                </div>
                <div className='h-px w-full bg-foreground' />
                <div className='space-y-3'>
                    <div className='sticky top-0 z-10 bg-background py-3'>
                        <h2 className='text-sm font-bold uppercase tracking-widest'>CS280 — Computer Vision</h2>
                        <p className='text-xs text-foreground mt-1'>
                            with{' '}
                            <ExternalLink href='https://people.eecs.berkeley.edu/~kanazawa/'>
                                Angjoo Kanazawa
                            </ExternalLink>
                            {' '}and{' '}
                            <ExternalLink href='https://people.eecs.berkeley.edu/~efros/'>
                                Alexei Efros
                            </ExternalLink>
                        </p>
                    </div>
                    <Section items={cs280} />
                </div>
                <div className='h-px w-full bg-foreground' />
                <div className='space-y-3'>
                    <div className='sticky top-0 z-10 bg-background py-3'>
                        <h2 className='text-sm font-bold uppercase tracking-widest'>Academic</h2>
                    </div>
                    <Section items={research} />
                </div>
                <div className='h-px w-full bg-foreground' />
                <div className='space-y-3'>
                    <div className='sticky top-0 z-10 bg-background py-3'>
                        <h2 className='text-sm font-bold uppercase tracking-widest'>Personal</h2>
                    </div>
                    <Section items={personal} />
                </div>
            </div>
            <footer className='py-16 md:py-20 text-center'>
                <div className='h-px w-full bg-foreground mb-16' />
                <p className='text-xs text-foreground'>
                    ozanbayiz {new Date().getFullYear()}
                    <span className='animate-blink ml-1'>_</span>
                </p>
            </footer>
        </div>
    )
}
