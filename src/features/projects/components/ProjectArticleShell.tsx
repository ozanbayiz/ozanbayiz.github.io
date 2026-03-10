'use client'

import * as React from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import { useTableOfContents } from '../hooks/useTableOfContents'
import { TocItem } from '../utils/toc'

import ProjectFooter from './ProjectFooter'
import ProjectTopBar from './ProjectTopBar'
import { ReadingProgressBar } from './ReadingProgressBar'

export type ProjectNav = { slug: string; title: string } | null

type ProjectArticleContextType = {
    toc: TocItem[]
    activeId: string | null
    navigateTo: (id: string) => void
    contentRef: React.RefObject<HTMLDivElement | null>
    title: string
    prev: ProjectNav
    next: ProjectNav
    setMeta: (meta: { title: string; prev: ProjectNav; next: ProjectNav }) => void
}

export const ProjectArticleContext = React.createContext<ProjectArticleContextType>({
    toc: [],
    activeId: null,
    navigateTo: () => {},
    contentRef: { current: null },
    title: '',
    prev: null,
    next: null,
    setMeta: () => {}
})

export default function ProjectArticleShell({ children }: { children: React.ReactNode }) {
    const contentRef = React.useRef<HTMLDivElement>(null)

    const { toc, allIds, expandPath } = useTableOfContents({ contentRef })

    const { activeId, navigateTo } = useActiveSection({
        sectionIds: allIds,
        onActiveChange: expandPath
    })

    const [meta, setMeta] = React.useState<{ title: string; prev: ProjectNav; next: ProjectNav }>({
        title: '',
        prev: null,
        next: null
    })

    return (
        <ProjectArticleContext.Provider value={{ toc, activeId, navigateTo, contentRef, ...meta, setMeta }}>
            <ProjectTopBar />
            <ReadingProgressBar />
            <div ref={contentRef} className='min-h-screen'>
                {children}
            </div>
            <ProjectFooter />
        </ProjectArticleContext.Provider>
    )
}
