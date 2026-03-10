'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { TocItem } from '../utils/toc'

import { ProjectArticleContext } from './ProjectArticleShell'

export function SidebarToc() {
    const { toc, activeId, navigateTo } = React.useContext(ProjectArticleContext)

    if (toc.length === 0) return null

    return (
        <div className='hidden xl:block absolute right-full mr-8 w-56'>
            <nav className='sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto'>
                <ul className='space-y-1 border-l'>
                    {toc.map(item => (
                        <SidebarTocEntry key={item.id} item={item} activeId={activeId} navigateTo={navigateTo} />
                    ))}
                </ul>
            </nav>
        </div>
    )
}

function SidebarTocEntry({ item, activeId, navigateTo }: { item: TocItem; activeId: string | null; navigateTo: (id: string) => void }) {
    const isActive = activeId === item.id

    return (
        <li>
            <a
                href={`#${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={cn(
                    'block pl-3 py-0.5 text-xs transition-colors gradient-link',
                    isActive && 'border-l-2 border-accent1 -ml-px [animation-play-state:running]'
                )}
            >
                {item.title}
            </a>
            {item.children.length > 0 && (
                <ul className='ml-3 space-y-0.5'>
                    {item.children.map(child => (
                        <SidebarTocEntry key={child.id} item={child} activeId={activeId} navigateTo={navigateTo} />
                    ))}
                </ul>
            )}
        </li>
    )
}
