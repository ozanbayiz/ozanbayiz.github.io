import ExternalLink from '@/shared/ui/external-link'

export type HeaderProps = {
    title: string
    description?: string | undefined
    repoUrl: string
    date?: string | undefined
    authors?: string[] | undefined
    pdfUrl?: string | undefined
    demoUrl?: string | undefined
}

export default function ProjectHeader({
    title,
    description,
    repoUrl,
    date,
    authors,
    pdfUrl,
    demoUrl
}: HeaderProps) {
    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-bold sm:text-3xl md:text-4xl tracking-tight leading-tight'>{title}</h1>
            {description ? (
                <p className='text-sm leading-relaxed text-foreground'>{description}</p>
            ) : null}
            {(date || authors?.length) ? (
                <p className='text-sm text-foreground'>
                    {date ? (
                        <time dateTime={date}>{'// '}{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    ) : null}
                    {authors?.length ? (
                        <span>{' // '}{authors.join(', ')}</span>
                    ) : null}
                </p>
            ) : null}
            <div className='flex flex-wrap items-center gap-3'>
                <ExternalLink href={repoUrl} className='border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-foreground transition-all no-underline'>[view repo]</ExternalLink>
                {pdfUrl ? (
                    <ExternalLink href={pdfUrl} className='border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-foreground transition-all no-underline'>[view pdf]</ExternalLink>
                ) : null}
                {demoUrl ? (
                    <ExternalLink href={demoUrl} className='border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-foreground transition-all no-underline'>[demo]</ExternalLink>
                ) : null}
            </div>
        </div>
    )
}
