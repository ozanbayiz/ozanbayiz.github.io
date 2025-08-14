'use client'

import { FileText, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        date
    } = props

    const resolvedHref = href ?? (slug ? `/projects/${slug}/` : (gitUrl ?? '#'))
    const displayDescription = description ?? summary ?? ''
    const displayImage = imageUrl ?? heroImageSrc ?? '/logo512.png'

    return (
        <Card className='relative w-full overflow-hidden text-foreground transition-colors hover:border-accent'>
            {/* Clickable overlay link to make the entire card clickable without nesting anchors */}
            <Link href={resolvedHref} prefetch={false} aria-label={`Open ${title}`} className='absolute inset-0' />
            <CardHeader>
                <CardTitle className='flex min-w-0 items-center justify-between gap-2'>
                    <span className='flex-1 break-words text-left line-clamp-3'>{title}</span>
                    <div className='flex shrink-0 items-center gap-1'>
                        {pdfUrl ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                className='relative z-10'
                                aria-label='View PDF'
                                title='View PDF'
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <FileText className='h-4 w-4' />
                            </Button>
                        ) : null}
                        {gitUrl ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                className='relative z-10'
                                aria-label='View repository'
                                title='View repository'
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(gitUrl, '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Github className='h-4 w-4' />
                            </Button>
                        ) : null}
                    </div>
                </CardTitle>
                {date ? (
                    <div className='text-left'>
                        <Badge variant='outline' className='w-max'>
                            {date}
                        </Badge>
                    </div>
                ) : null}
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='overflow-hidden rounded-md'>
                    <Image
                        src={displayImage}
                        alt={title}
                        width={800}
                        height={450}
                        className='mx-auto block h-auto max-h-[clamp(160px,30vh,320px)] w-auto max-w-full object-contain'
                    />
                </div>
                <p className='break-words text-left text-sm text-foreground'>
                    {displayDescription}
                </p>
            </CardContent>
        </Card>
    )
}
