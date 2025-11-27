import { Button } from '@/shared/ui/button'
import ExternalLink from '@/shared/ui/external-link'

export type HeaderProps = {
    title: string
    repoUrl: string
    date?: string | undefined
    authors?: string[] | undefined
    pdfUrl?: string | undefined
}

export default function ProjectHeader({
    title,
    repoUrl,
    // date,
    authors,
    pdfUrl
}: HeaderProps) {
    return (
        <div className='space-y-4'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <h1 className='h1 leading-tight'>{title}</h1>
                <div className='flex shrink-0 items-center gap-2'>
                    {pdfUrl ? (
                        <ExternalLink href={pdfUrl} aria-label='View PDF'>
                            <Button variant='outlineAccent' size='sm'>
                                View PDF
                            </Button>
                        </ExternalLink>
                    ) : null}
                    <ExternalLink href={repoUrl} aria-label='View repository'>
                        <Button variant='outlineAccent' size='sm'>
                            View repo
                        </Button>
                    </ExternalLink>
                </div>
            </div>
            {/* Tags removed per request */}
            {(authors?.length) ? (
                <div className='flex flex-wrap items-center gap-2 text-xs text-foreground/90'>
                    {authors?.length ? (
                        <span>{authors.join(' · ')}</span>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}


