'use client'

import { FileText, Github } from 'lucide-react'
import Link from 'next/link'
import ExportedImage from 'next-image-export-optimizer'

import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'

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
        <div className={cn('group relative flex h-full flex-col overflow-hidden rounded-lg border bg-background text-foreground transition-colors hover:border-accent1 hover:bg-transparent', className)}>
            <Link
                href={resolvedHref}
                prefetch={false}
                aria-label={`Open ${title}`}
                className='absolute inset-0 z-10'
            />

            {/* Thumbnail */}
            <div className='relative w-full aspect-video overflow-hidden bg-muted/50 border-b'>
                <ExportedImage
                    src={displayImage}
                    alt={title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, 50vw'
                />
            </div>

            {/* Content */}
            <div className='flex min-w-0 flex-1 flex-col gap-1.5 p-4'>
                <h3 className='line-clamp-2 text-lg font-semibold sm:text-xl md:text-2xl tracking-tight leading-tight'>{title}</h3>
                <p className='line-clamp-2 text-sm leading-relaxed flex-1 text-foreground'>
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
        </div>
    )
}
