import ExternalLink from '@/components/ExternalLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    date,
    authors,
    pdfUrl
}: HeaderProps) {
    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between gap-4'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                <div className='flex items-center gap-2'>
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
            {(authors?.length || date) ? (
                <div className='flex flex-wrap items-center gap-2 text-xs text-foreground/90'>
                    {authors?.length ? (
                        <span>{authors.join(' · ')}</span>
                    ) : null}
                    {date ? (
                        <Badge variant='outline' className='border-foreground bg-foreground text-background'>
                            {date}
                        </Badge>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}


