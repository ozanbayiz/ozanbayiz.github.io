'use client'

import { FileText, Github } from 'lucide-react'
import Link from 'next/link'
import ExportedImage from 'next-image-export-optimizer'

import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardTitle } from '@/shared/ui/card'

type ProjectCardProps = {
    // Link building
    href?: string
    slug?: string | undefined
    gitUrl?: string | undefined
    pdfUrl?: string | undefined

    // Display
    title: string
    description?: string
    summary?: string
    imageUrl?: string
    heroImageSrc?: string
    tags?: string[] | undefined
    date?: string | undefined
    className?: string
}

export default function ProjectCard(props: ProjectCardProps) {
    const {
        href,
        slug,
        gitUrl,
        pdfUrl,
        title,
        description,
        summary,
        imageUrl,
        heroImageSrc,
        className
    } = props

    const resolvedHref = href ?? (slug ? `/projects/${slug}/` : (gitUrl ?? '#'))
    const displayDescription = description ?? summary ?? ''
    const displayImage = imageUrl ?? heroImageSrc ?? '/logo512.png'

    return (
        <Card className={cn('group relative flex h-full flex-row overflow-hidden rounded-lg transition-colors hover:border-accent', className)}>
            <Link
                href={resolvedHref}
                prefetch={false}
                aria-label={`Open ${title}`}
                className='absolute inset-0 z-10'
            />

            {/* Thumbnail */}
            <div className='relative w-32 shrink-0 overflow-hidden bg-muted'>
                <ExportedImage
                    src={displayImage}
                    alt={title}
                    fill
                    className='object-cover'
                    sizes='128px'
                />
            </div>

            {/* Content */}
            <div className='flex min-w-0 flex-1 flex-col gap-1.5 p-4'>
                <CardTitle className='line-clamp-2 h3 leading-tight'>{title}</CardTitle>
                <p className='line-clamp-2 body-text flex-1 text-muted-foreground'>
                    {displayDescription}
                </p>
                {(gitUrl || pdfUrl) && (
                    <div className='relative z-20 flex gap-2 pt-1'>
                        {pdfUrl && (
                            <Button
                                variant='outline'
                                size='sm'
                                className='h-7 gap-1.5'
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <FileText className='h-3 w-3' />
                                <span className='text-xs'>PDF</span>
                            </Button>
                        )}
                        {gitUrl && (
                            <Button
                                variant='outline'
                                size='sm'
                                className='h-7 gap-1.5'
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(gitUrl, '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Github className='h-3 w-3' />
                                <span className='text-xs'>Code</span>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}
