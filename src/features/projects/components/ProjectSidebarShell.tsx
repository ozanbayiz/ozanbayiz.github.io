'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarProvider,
    SidebarTrigger
} from '@/shared/ui/sidebar'

import { useActiveSection } from '../hooks/useActiveSection'
import { useTableOfContents } from '../hooks/useTableOfContents'

import { ReadingProgressBar } from './ReadingProgressBar'
import { TocNode } from './TocNode'

type Section = { id: string; title: string }

type ProjectSidebarShellProps = {
    sections: Section[]
    children: React.ReactNode
    header?: React.ReactNode
    rightActions?: React.ReactNode
    sidebarTop?: React.ReactNode
}

export default function ProjectSidebarShell({
    sections,
    children,
    header,
    rightActions,
    sidebarTop
}: ProjectSidebarShellProps) {
    const contentRef = React.useRef<HTMLDivElement>(null)

    const {
        toc,
        allIds,
        expandedIds,
        toggleExpanded,
        expandPath
    } = useTableOfContents({
        contentRef,
        initialSections: sections
    })

    const { activeId, navigateTo } = useActiveSection({
        sectionIds: allIds,
        onActiveChange: expandPath
    })

    return (
        <SidebarProvider className='[&_.container]:!max-w-none [&_.container]:!px-0'>
            <Sidebar
                side='left'
                collapsible='offcanvas'
                className='[&_.container]:!max-w-none [&_.container]:!px-0 border-r-0'
            >
                <SidebarHeader className='relative pb-2'>
                    <div className='px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium'>
                        Contents
                    </div>
                    <ReadingProgressBar />
                </SidebarHeader>

                <SidebarContent>
                    {sidebarTop && (
                        <div className='px-2 py-2'>{sidebarTop}</div>
                    )}

                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {toc.map(section => (
                                    <TocNode
                                        key={section.id || section.title}
                                        item={section}
                                        depth={0}
                                        activeId={activeId}
                                        expandedIds={expandedIds}
                                        onToggle={toggleExpanded}
                                        onNavigate={navigateTo}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            <SidebarInset className='[&_.container]:!max-w-none [&_.container]:!px-0'>
                <header className={cn(
                    'sticky top-0 z-50 md:z-[55] isolate pointer-events-auto',
                    'flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'
                )}>
                    <SidebarTrigger className='hover:text-accent' />
                    {header}
                    <div className='ml-auto' />
                    {rightActions}
                </header>

                <div ref={contentRef} className='flex flex-1 flex-col gap-4 px-3 py-4 md:p-6 lg:p-8'>
                    <div className='prose prose-sm prose-neutral dark:prose-invert max-w-prose w-full mx-auto [&_figure]:max-w-none [&_.grid]:max-w-none [&_img]:max-w-none [&_video]:max-w-none'>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
