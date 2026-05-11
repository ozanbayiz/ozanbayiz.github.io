'use client'

import * as React from 'react'

import { ProjectTocContext } from '../ProjectArticleShell'

import TocList from './TocList'

export default function InlineToc() {
    const { toc, activeId, navigateTo } = React.useContext(ProjectTocContext)

    if (toc.length === 0) return null

    return (
        <details open className='border px-5 py-4 xl:hidden'>
            <summary className='text-xs uppercase tracking-widest text-foreground cursor-pointer select-none'>
                Table of Contents
            </summary>
            <nav className='mt-3'>
                <TocList
                    items={toc}
                    variant='inline'
                    activeId={activeId}
                    navigateTo={navigateTo}
                    className='space-y-1'
                />
            </nav>
        </details>
    )
}
