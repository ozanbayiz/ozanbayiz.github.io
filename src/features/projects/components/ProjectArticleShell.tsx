'use client'

import * as React from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import { useTableOfContents } from '../hooks/useTableOfContents'

import ProjectFooter from './ProjectFooter'
import ProjectTopBar from './ProjectTopBar'
import { ReadingProgressBar } from './ReadingProgressBar'

import type { TocItem } from '../utils/toc'
import type { Heading } from '@/types/content'

export type ProjectNav = { slug: string; title: string } | null

type TocContextValue = {
    toc: TocItem[]
    activeId: string | null
    navigateTo: (id: string) => void
    setHeadings: (headings: Heading[]) => void
}

type MetaContextValue = {
    title: string
    prev: ProjectNav
    next: ProjectNav
}

export const ProjectTocContext = React.createContext<TocContextValue>({
    toc: [],
    activeId: null,
    navigateTo: () => {},
    setHeadings: () => {},
})

export const ProjectMetaContext = React.createContext<MetaContextValue>({
    title: '',
    prev: null,
    next: null,
})

type ShellProps = {
    title: string
    prev: ProjectNav
    next: ProjectNav
    children: React.ReactNode
}

export default function ProjectArticleShell({ title, prev, next, children }: ShellProps) {
    const [headings, setHeadings] = React.useState<Heading[]>([])
    const { toc, allIds } = useTableOfContents(headings)
    const { activeId, navigateTo } = useActiveSection({ sectionIds: allIds })

    const tocValue = React.useMemo<TocContextValue>(
        () => ({ toc, activeId, navigateTo, setHeadings }),
        [toc, activeId, navigateTo],
    )

    const metaValue = React.useMemo<MetaContextValue>(
        () => ({ title, prev, next }),
        [title, prev, next],
    )

    return (
        <ProjectMetaContext.Provider value={metaValue}>
            <ProjectTocContext.Provider value={tocValue}>
                <ProjectTopBar />
                <ReadingProgressBar />
                <div className='min-h-screen'>{children}</div>
                <ProjectFooter />
            </ProjectTocContext.Provider>
        </ProjectMetaContext.Provider>
    )
}
