'use client'

import Link from 'next/link'
import { useRef } from 'react'

import SectionHeading from '@/components/common/SectionHeading'
import { projectsData } from '@/features/projects'
import { byDateDesc, formatProjectDate } from '@/features/projects/utils/dates'
import { useScrollParallax } from '@/hooks/useScrollParallax'

export default function ProjectSection() {
    const featured = [...projectsData].filter(p => p.featured).sort(byDateDesc)
    const listRef = useRef<HTMLDivElement>(null)
    useScrollParallax(listRef, -0.02)

    return (
        <div className="w-full">
            <div className="mb-4 flex items-baseline justify-between">
                <SectionHeading>projects</SectionHeading>
                <Link
                    href="/projects/"
                    prefetch={false}
                    className="gradient-link text-xs"
                >
                    all &rarr;
                </Link>
            </div>

            <div ref={listRef} className="border-t" style={{ willChange: 'transform' }}>
                {featured.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}/`}
                        prefetch={false}
                        className="group flex items-baseline justify-between gap-4 border-b py-3"
                    >
                        <span className="gradient-link-group text-sm">
                            {project.title}
                        </span>
                        <span className="shrink-0 text-xs text-foreground">
                            {formatProjectDate(project.date) ?? ''}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
