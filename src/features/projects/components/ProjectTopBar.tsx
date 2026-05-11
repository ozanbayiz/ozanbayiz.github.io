'use client'

import Link from 'next/link'
import * as React from 'react'

import { ModeToggle } from '@/components/common/ModeToggle'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

import { ProjectMetaContext } from './ProjectArticleShell'

const OBSERVER_OPTIONS: IntersectionObserverInit = { threshold: 0 }

export default function ProjectTopBar() {
    const { title } = React.useContext(ProjectMetaContext)
    const [h1, setH1] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        setH1(document.querySelector('h1'))
    }, [])

    const entry = useIntersectionObserver(h1, OBSERVER_OPTIONS)
    const showTitle = entry ? !entry.isIntersecting : false

    return (
        <header className='fixed top-0 z-50 w-full h-12 bg-background/80 backdrop-blur-sm border-b flex items-center justify-between px-4 md:px-6'>
            <Link
                href='/projects/'
                className='gradient-link text-xs uppercase tracking-widest'
            >
                &larr; Projects
            </Link>
            <span
                className={`text-xs truncate max-w-[50vw] transition-all duration-200 ${
                    showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
            >
                {title}
            </span>
            <div className='flex items-center gap-3'>
                <ModeToggle />
            </div>
        </header>
    )
}
