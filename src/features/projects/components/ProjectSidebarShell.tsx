'use client'

import { Minus, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    // SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    SidebarTrigger,
    // SidebarGroupAction
} from '@/shared/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

type Heading = { id: string; title: string; level: number }

type Section = { id: string; title: string }

export default function ProjectSidebarShell({
    sections,
    children,
    title: _title,
    header,
    rightActions,
    sidebarTop
}: {
    sections: Section[]
    children: React.ReactNode
    title?: string
    header?: React.ReactNode
    rightActions?: React.ReactNode
    sidebarTop?: React.ReactNode
}) {
    const pathname = usePathname()
    const storageKey = React.useMemo(
        () => `project_toc_open:${pathname ?? ''}`,
        [pathname]
    )
    const [contentsOpen] = React.useState<boolean>(() => {
        if (typeof window === 'undefined') return true
        const stored = window.localStorage.getItem(storageKey)
        return stored === null ? true : stored === 'true'
    })

    const contentRef = React.useRef<HTMLDivElement>(null)

    type TocItem = { id: string; title: string; children: TocItem[] }
    const [toc, setToc] = React.useState<TocItem[]>([])
    const [expandedMap, setExpandedMap] = React.useState<Record<string, boolean>>({})
    const [activeOverrideId, setActiveOverrideId] = React.useState<string | null>(null)
    const idToParent = React.useMemo(() => {
        const map: Record<string, string | null> = {}
        const walk = (nodes: TocItem[], parent: string | null) => {
            nodes.forEach(n => {
                if (n.id) map[n.id] = parent
                if (n.children?.length) walk(n.children, n.id)
            })
        }
        walk(toc, null)
        return map
    }, [toc])

    // Simplified: rely on compile-time MDX-exported headings via 'mdx:headings' event.
    // We keep `sections` as a safe fallback for pages without headings.

    // Provide a setter to consume compile-time headings from MDX (via MdxClient)
    const setHeadingsFromMdx = React.useCallback(
        (headings: Heading[]) => {
            // Convert flat list to tree for levels 1/2/3
            type Node = TocItem
            const root: Node[] = []
            const stack: { level: number; node: Node }[] = []
            headings
                .filter(h => h.level === 2 || h.level === 3)
                .forEach(h => {
                    const node: Node = { id: h.id, title: h.title, children: [] }
                    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= h.level) {
                        stack.pop()
                    }
                    const last = stack[stack.length - 1]
                    if (!last) {
                        root.push(node)
                    } else {
                        last.node.children.push(node)
                    }
                    stack.push({ level: h.level, node })
                })
            setToc(root)
        },
        []
    )

    // One-time DOM fallback builder for H2/H3 when compile-time headings are not provided
    const buildTocFromDom = React.useCallback(() => {
        const root = contentRef.current
        if (!root) return
        const getIdTitle = (el: HTMLElement) => ({
            id:
                el.id ||
                el.textContent?.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') ||
                '',
            title: el.textContent?.trim() || ''
        })
        const all = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
        if (all.length === 0) return
        const items: TocItem[] = []
        let currentTop: TocItem | null = null
        for (const el of all) {
            const tag = el.tagName.toLowerCase()
            if (tag === 'h2') {
                const { id, title } = getIdTitle(el)
                if (!title) continue
                const node: TocItem = { id, title, children: [] }
                items.push(node)
                currentTop = node
            } else if (tag === 'h3') {
                const { id, title } = getIdTitle(el)
                if (!title) continue
                if (currentTop) currentTop.children.push({ id, title, children: [] })
            }
        }
        if (items.length > 0) setToc(items)
    }, [])

    // Initialize TOC: use sections; listen for MDX 'headings' once loaded
    React.useEffect(() => {
        const handler = (e: Event) => {
            try {
                const detail = (e as CustomEvent).detail as Heading[]
                if (Array.isArray(detail)) setHeadingsFromMdx(detail)
            } catch { }
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('mdx:headings', handler as EventListener)
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mdx:headings', handler as EventListener)
            }
        }
    }, [children, setHeadingsFromMdx])

    // One-time DOM fallback after MDX mounts (if needed)
    React.useEffect(() => {
        const onLoaded = () => {
            const hasNesting = toc.some(t => t.children?.length)
            buildTocFromDom()
            if (!hasNesting) {
                // Try again after styles/images hydrate to ensure layout is stable
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(() => buildTocFromDom())
                }
                setTimeout(() => buildTocFromDom(), 50)
            }
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('mdx:content:loaded', onLoaded)
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mdx:content:loaded', onLoaded)
            }
        }
        // Intentionally exclude toc from deps so we don't rewire listeners repeatedly
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildTocFromDom])

    React.useEffect(() => {
        if (sections.length > 0) {
            setToc(sections.map(s => ({ id: s.id, title: s.title, children: [] })))
        }
    }, [sections])

    const allIds = React.useMemo(() => {
        const ids: string[] = []
        const walk = (nodes: TocItem[]) => {
            nodes.forEach(n => {
                if (n.id) ids.push(n.id)
                if (n.children?.length) walk(n.children)
            })
        }
        walk(toc)
        return ids
    }, [toc])

    // Account for sticky header height (~64px) by expanding top rootMargin
    const activeId = useScrollSpy(allIds, '-80px 0px -55% 0px')
    const effectiveActiveId = activeOverrideId ?? activeId

    // Initialize expansion state: default closed; will expand active path after detecting activeId
    React.useEffect(() => {
        const defaultMap: Record<string, boolean> = {}
        try {
            const key = `toc:open:${pathname ?? ''}`
            const stored = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
            const parsed = stored ? (JSON.parse(stored) as Record<string, boolean>) : {}
            setExpandedMap({ ...defaultMap, ...parsed })
        } catch {
            setExpandedMap(defaultMap)
        }
    }, [pathname, toc])

    // Persist expansion changes
    React.useEffect(() => {
        try {
            const key = `toc:open:${pathname ?? ''}`
            window.localStorage.setItem(key, JSON.stringify(expandedMap))
        } catch { }
    }, [expandedMap, pathname])

    // Auto-expand only the active path (collapse siblings)
    React.useEffect(() => {
        if (!effectiveActiveId) return
        // Build chain of ancestors from current active id
        const chain: string[] = []
        let cur: string | undefined = effectiveActiveId
        while (cur) {
            const parent: string | null | undefined = idToParent[cur]
            if (parent) chain.unshift(parent)
            cur = parent || ''
            if (!parent) break
        }
        const nextMap: Record<string, boolean> = {}
        chain.forEach(id => (nextMap[id] = true))
        setExpandedMap(nextMap)
    }, [effectiveActiveId, idToParent])

    // Clear override once scroll spy catches up to the override target
    React.useEffect(() => {
        if (activeOverrideId && activeId === activeOverrideId) {
            setActiveOverrideId(null)
        }
    }, [activeId, activeOverrideId])

    // Apply hash from URL on mount and when hash/back-forward changes
    React.useEffect(() => {
        const applyHash = () => {
            if (typeof window === 'undefined') return
            const id = window.location.hash?.slice(1) || ''
            if (id) setActiveOverrideId(id)
        }
        applyHash()
        const onHashChange = () => applyHash()
        if (typeof window !== 'undefined') {
            window.addEventListener('hashchange', onHashChange)
            window.addEventListener('popstate', onHashChange)
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('hashchange', onHashChange)
                window.removeEventListener('popstate', onHashChange)
            }
        }
    }, [])

    const toggleSection = (id: string) => {
        setExpandedMap(prev => {
            const nextOpen = !prev[id]
            if (!nextOpen) return { ...prev, [id]: false }
            const parent = idToParent[id]
            const siblings = parent
                ? (toc.find(t => t.id === parent)?.children ?? [])
                : toc
            const map: Record<string, boolean> = {}
            siblings.forEach(s => {
                map[s.id] = s.id === id
            })
            if (parent) map[parent] = true
            return { ...prev, ...map }
        })
    }

    return (
        <SidebarProvider
            className='[&_.container]:!max-w-none [&_.container]:!px-0'
        >
            <Sidebar
                side='left'
                collapsible='offcanvas'
                className='[&_.container]:!max-w-none [&_.container]:!px-0 border-r-0'
            >
                <SidebarHeader>
                    <div className='px-2 text-sm font-medium truncate'>Content</div>
                </SidebarHeader>
                <SidebarSeparator />
                <SidebarContent>
                    {sidebarTop ? (
                        <div className='px-2 py-2'>{sidebarTop}</div>
                    ) : null}
                    <SidebarGroup>
                        {contentsOpen ? (
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {toc.map(section => {
                                        const sectionActive =
                                            effectiveActiveId === section.id ||
                                            section.children.some(c => c.id === effectiveActiveId || c.children?.some(g => g.id === effectiveActiveId))
                                        const hasChildren = section.children.length > 0
                                        const isOpen = hasChildren ? expandedMap[section.id] !== false : false
                                        return (
                                            <SidebarMenuItem key={section.id || section.title}>
                                                <div className='flex items-center'>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={sectionActive}
                                                        className='text-foreground flex-1 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent'
                                                    >
                                                        <a
                                                            href={section.id ? `#${section.id}` : '#'}
                                                            className='cursor-pointer'
                                                            onClick={() => {
                                                                setActiveOverrideId(section.id)
                                                                if (hasChildren) {
                                                                    setExpandedMap(prev => ({ ...prev, [section.id]: true }))
                                                                }
                                                            }}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span
                                                                        className='block whitespace-normal break-words overflow-hidden'
                                                                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as unknown as React.CSSProperties['WebkitBoxOrient'] }}
                                                                    >
                                                                        {section.title}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent side='right' className='max-w-[320px]'>
                                                                    {section.title}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </a>
                                                    </SidebarMenuButton>
                                                    {hasChildren ? (
                                                        // right-edge toggle
                                                        <SidebarMenuAction
                                                            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                                                            aria-expanded={isOpen}
                                                            className='text-foreground ml-1 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent'
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                toggleSection(section.id)
                                                            }}
                                                        >
                                                            {isOpen ? <Minus className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
                                                        </SidebarMenuAction>
                                                    ) : null}
                                                </div>
                                                {hasChildren && isOpen ? (
                                                    <SidebarMenuSub>
                                                        {section.children.map(child => {
                                                            const childHasChildren = child.children?.length > 0
                                                            const childOpen = childHasChildren ? expandedMap[child.id] !== false : false
                                                            const childActive =
                                                                effectiveActiveId === child.id || child.children?.some(g => g.id === effectiveActiveId)
                                                            return (
                                                                <SidebarMenuSubItem key={child.id || child.title}>
                                                                    <div className='flex items-center'>
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={childActive}
                                                                        >
                                                                            <a
                                                                                href={child.id ? `#${child.id}` : '#'}
                                                                                onClick={() => {
                                                                                    setActiveOverrideId(child.id)
                                                                                    if (childHasChildren) {
                                                                                        setExpandedMap(prev => ({ ...prev, [child.id]: true }))
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <span className='block whitespace-normal break-words overflow-hidden clamp-2'>
                                                                                            {child.title}
                                                                                        </span>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side='right' className='max-w-[320px]'>
                                                                                        {child.title}
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </a>
                                                                        </SidebarMenuSubButton>
                                                                        {childHasChildren ? (
                                                                            <SidebarMenuAction
                                                                                aria-label={childOpen ? 'Collapse section' : 'Expand section'}
                                                                                aria-expanded={childOpen}
                                                                                className='text-foreground ml-1 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent'
                                                                                onClick={(e: React.MouseEvent) => {
                                                                                    e.preventDefault()
                                                                                    e.stopPropagation()
                                                                                    toggleSection(child.id)
                                                                                }}
                                                                            >
                                                                                {childOpen ? <Minus className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
                                                                            </SidebarMenuAction>
                                                                        ) : null}
                                                                    </div>
                                                                    {childHasChildren && childOpen ? (
                                                                        <ul className='ml-4 border-l pl-2'>
                                                                            {child.children.map(grand => {
                                                                                const grandActive = effectiveActiveId === grand.id
                                                                                return (
                                                                                    <li key={grand.id || grand.title} className='my-0.5'>
                                                                                        <a
                                                                                            href={grand.id ? `#${grand.id}` : '#'}
                                                                                            className={cn('text-sm', grandActive && 'text-accent')}
                                                                                            onClick={() => setActiveOverrideId(grand.id)}
                                                                                        >
                                                                                            <Tooltip>
                                                                                                <TooltipTrigger asChild>
                                                                                                    <span className='block whitespace-normal break-words overflow-hidden clamp-2'>
                                                                                                        {grand.title}
                                                                                                    </span>
                                                                                                </TooltipTrigger>
                                                                                                <TooltipContent side='right' className='max-w-[320px]'>
                                                                                                    {grand.title}
                                                                                                </TooltipContent>
                                                                                            </Tooltip>
                                                                                        </a>
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                        </ul>
                                                                    ) : null}
                                                                </SidebarMenuSubItem>
                                                            )
                                                        })}
                                                    </SidebarMenuSub>
                                                ) : null}
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        ) : null}
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className='[&_.container]:!max-w-none [&_.container]:!px-0'>
                <header className='sticky top-0 z-50 md:z-[55] isolate pointer-events-auto flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
                    <SidebarTrigger className='hover:text-accent' />
                    {header}
                    <div className='ml-auto' />
                    {rightActions}
                </header>
                <div ref={contentRef} className='flex flex-1 flex-col gap-4 px-3 py-4 md:p-6 lg:p-8'>
                    <div className='prose prose-sm prose-neutral dark:prose-invert max-w-none w-full mx-auto'>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}


