'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { TocItem } from '../utils/toc'

import { ProjectArticleContext } from './ProjectArticleShell'

export default function InlineToc() {
    const { toc, activeId, navigateTo } = React.useContext(ProjectArticleContext)

    if (toc.length === 0) return null

    return (
        <details open className='border px-5 py-4 xl:hidden'>
            <summary className='text-xs uppercase tracking-widest text-foreground cursor-pointer select-none'>
                Table of Contents
            </summary>
            <nav className='mt-3'>
                <ul className='space-y-1'>
                    {toc.map(item => (
                        <TocEntry key={item.id} item={item} activeId={activeId} navigateTo={navigateTo} />
                    ))}
                </ul>
            </nav>
        </details>
    )
}

function TocEntry({ item, activeId, navigateTo }: { item: TocItem; activeId: string | null; navigateTo: (id: string) => void }) {
    const isActive = activeId === item.id

    return (
        <li>
            <a
                href={`#${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={cn(
                    'gradient-link text-sm',
                    isActive && '[animation-play-state:running]'
                )}
            >
                {item.title}
            </a>
            {item.children.length > 0 && (
                <ul className='ml-4 border-l pl-3 space-y-1 mt-1'>
                    {item.children.map(child => (
                        <TocEntry key={child.id} item={child} activeId={activeId} navigateTo={navigateTo} />
                    ))}
                </ul>
            )}
        </li>
    )
}
