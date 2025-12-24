'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import {
    TocItem,
    Heading,
    getAllIds,
    buildIdToParentMap,
    getAncestorChain,
    headingsToToc
} from '../utils/toc'

type UseTocOptions = {
    contentRef: React.RefObject<HTMLDivElement | null>
    initialSections?: { id: string; title: string }[]
}

type TocState = {
    toc: TocItem[]
    allIds: string[]
    idToParent: Record<string, string | null>
    expandedIds: Set<string>
    toggleExpanded: (id: string) => void
    expandPath: (targetId: string | null) => void
}

/**
 * Hook for managing Table of Contents state including:
 * - TOC tree structure (from MDX headings or DOM fallback)
 * - Expansion state (user-controlled + auto-expanded for active path)
 * - Persistence to localStorage
 */
export function useTableOfContents({ contentRef, initialSections = [] }: UseTocOptions): TocState {
    const pathname = usePathname()
    const [toc, setToc] = React.useState<TocItem[]>(() =>
        initialSections.map(s => ({ id: s.id, title: s.title, children: [] }))
    )

    // User-controlled expansion state (persisted)
    const [userExpandedIds, setUserExpandedIds] = React.useState<Set<string>>(new Set())
    // Auto-expanded for active path (not persisted)
    const [autoExpandedIds, setAutoExpandedIds] = React.useState<Set<string>>(new Set())

    // Derived data - memoized together to avoid multiple tree walks
    const { allIds, idToParent } = React.useMemo(() => ({
        allIds: getAllIds(toc),
        idToParent: buildIdToParentMap(toc)
    }), [toc])

    // Combined expanded state
    const expandedIds = React.useMemo(() => {
        return new Set([...userExpandedIds, ...autoExpandedIds])
    }, [userExpandedIds, autoExpandedIds])

    // Load persisted expansion state after mount (avoids hydration mismatch)
    React.useEffect(() => {
        const key = `toc:expanded:${pathname ?? ''}`
        try {
            const stored = localStorage.getItem(key)
            if (stored) {
                setUserExpandedIds(new Set(JSON.parse(stored)))
            }
        } catch { /* ignore localStorage errors */ }
    }, [pathname])

    // Persist user expansion changes
    React.useEffect(() => {
        if (userExpandedIds.size === 0) return // Don't persist empty state on initial load
        const key = `toc:expanded:${pathname ?? ''}`
        try {
            localStorage.setItem(key, JSON.stringify([...userExpandedIds]))
        } catch { /* ignore localStorage errors */ }
    }, [userExpandedIds, pathname])

    // Listen for MDX headings event (dispatched by MdxClient)
    React.useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Heading[]
            if (Array.isArray(detail)) {
                setToc(headingsToToc(detail))
            }
        }
        window.addEventListener('mdx:headings', handler)
        return () => window.removeEventListener('mdx:headings', handler)
    }, [])

    // DOM fallback for TOC building when MDX headings aren't available
    React.useEffect(() => {
        const buildFromDom = () => {
            const root = contentRef.current
            if (!root) return

            const elements = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
            if (elements.length === 0) return

            const headings: Heading[] = elements.map(el => ({
                id: el.id || el.textContent?.trim().toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-') || '',
                title: el.textContent?.trim() || '',
                level: el.tagName === 'H2' ? 2 : 3
            })).filter(h => h.title)

            if (headings.length > 0) {
                setToc(headingsToToc(headings))
            }
        }

        const onLoaded = () => {
            buildFromDom()
            // Retry after paint for layout stability
            requestAnimationFrame(buildFromDom)
        }

        window.addEventListener('mdx:content:loaded', onLoaded)
        return () => window.removeEventListener('mdx:content:loaded', onLoaded)
    }, [contentRef])

    // Update TOC when initialSections change
    React.useEffect(() => {
        if (initialSections.length > 0) {
            setToc(initialSections.map(s => ({ id: s.id, title: s.title, children: [] })))
        }
    }, [initialSections])

    const toggleExpanded = React.useCallback((id: string) => {
        setUserExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    const expandPath = React.useCallback((targetId: string | null) => {
        if (!targetId) {
            setAutoExpandedIds(new Set())
            return
        }
        const chain = getAncestorChain(targetId, idToParent)
        setAutoExpandedIds(new Set(chain))
    }, [idToParent])

    return {
        toc,
        allIds,
        idToParent,
        expandedIds,
        toggleExpanded,
        expandPath
    }
}
