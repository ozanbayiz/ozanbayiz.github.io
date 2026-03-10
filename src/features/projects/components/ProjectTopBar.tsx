'use client'

import Link from 'next/link'
import * as React from 'react'

import { ThemeToggle } from '@/components/common/ThemeToggle'

import { ProjectArticleContext } from './ProjectArticleShell'

export default function ProjectTopBar() {
    const { title } = React.useContext(ProjectArticleContext)
    const [showTitle, setShowTitle] = React.useState(false)

    React.useEffect(() => {
        const h1 = document.querySelector('h1')
        if (!h1) return

        const observer = new IntersectionObserver(
            (entries) => setShowTitle(!entries[0]?.isIntersecting),
            { threshold: 0 }
        )
        observer.observe(h1)
        return () => observer.disconnect()
    }, [])

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
            <ThemeToggle />
        </header>
    )
}
