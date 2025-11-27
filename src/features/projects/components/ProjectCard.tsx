'use client'

import { FileText, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'

/**
 * ProjectCard
 * A reusable card for project teasers. Supports both general projects and CS180 projects
 * by accepting either description/imageUrl or summary/heroImageSrc and a basePath for slug links.
 */
type ProjectCardProps = {
    // Link building
    href?: string
    slug?: string | undefined
    gitUrl?: string | undefined
    pdfUrl?: string | undefined

    // Display
    title: string
    description?: string // general projects
    summary?: string // cs180
    imageUrl?: string // general projects
    heroImageSrc?: string // cs180
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
        // date,
        className
    } = props

    const resolvedHref = href ?? (slug ? `/projects/${slug}/` : (gitUrl ?? '#'))
    const displayDescription = description ?? summary ?? ''
    const displayImage = imageUrl ?? heroImageSrc ?? '/logo512.png'

    return (
        <Card className={cn('group relative flex h-full flex-col overflow-hidden transition-colors hover:border-accent', className)}>
            {/* Clickable overlay link to make the entire card clickable without nesting anchors */}
            <Link
                href={resolvedHref}
                prefetch={false}
                aria-label={`Open ${title}`}
                className='absolute inset-0 z-10'
            />

            <div className='p-4 pb-0'>
                <div className='relative aspect-video w-full overflow-hidden rounded-md bg-muted'>
                    <Image
                        src={displayImage}
                        alt={title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                </div>
            </div>

            <CardHeader className='space-y-2'>
                <div className='flex items-start justify-between gap-2'>
                    <CardTitle className='line-clamp-2 h3 leading-tight'>{title}</CardTitle>
                </div>
            </CardHeader>

            <CardContent className='flex-1'>
                <p className='line-clamp-3 body-text'>
                    {displayDescription}
                </p>
            </CardContent>

            {(gitUrl || pdfUrl) && (
                <CardFooter className='relative z-20 gap-2 pt-0'>
                    {pdfUrl && (
                        <Button
                            variant='outline'
                            size='sm'
                            className='h-8 gap-2'
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(pdfUrl, '_blank', 'noopener,noreferrer')
                            }}
                        >
                            <FileText className='h-3.5 w-3.5' />
                            <span className='text-xs'>PDF</span>
                        </Button>
                    )}
                    {gitUrl && (
                        <Button
                            variant='outline'
                            size='sm'
                            className='h-8 gap-2'
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(gitUrl, '_blank', 'noopener,noreferrer')
                            }}
                        >
                            <Github className='h-3.5 w-3.5' />
                            <span className='text-xs'>Code</span>
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
