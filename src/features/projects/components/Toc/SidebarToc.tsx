'use client'

import * as React from 'react'

import { ProjectTocContext } from '../ProjectArticleShell'

import TocList from './TocList'

export function SidebarToc() {
    const { toc, activeId, navigateTo } = React.useContext(ProjectTocContext)

    if (toc.length === 0) return null

    return (
        <div className='hidden xl:block absolute right-full mr-8 w-56'>
            <nav className='sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto'>
                <TocList
                    items={toc}
                    variant='sidebar'
                    activeId={activeId}
                    navigateTo={navigateTo}
                    className='space-y-1 border-l'
                />
            </nav>
        </div>
    )
}
