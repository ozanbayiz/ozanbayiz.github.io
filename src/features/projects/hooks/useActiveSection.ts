'use client'

import * as React from 'react'

import { useScrollSpy } from '@/hooks/useScrollSpy'

type UseActiveSectionOptions = {
    sectionIds: string[]
    onActiveChange?: (id: string | null) => void
}

/**
 * Combines scroll spy with URL hash handling for active section tracking.
 * Provides override capability for immediate navigation feedback.
 */
export function useActiveSection({ sectionIds, onActiveChange }: UseActiveSectionOptions) {
    const scrollSpyId = useScrollSpy(sectionIds, '-80px 0px -55% 0px')
    const [overrideId, setOverrideId] = React.useState<string | null>(null)

    // The effective active ID: override takes precedence until scroll catches up
    const activeId = overrideId ?? scrollSpyId

    // Clear override when scroll spy reaches the override target
    React.useEffect(() => {
        if (overrideId && scrollSpyId === overrideId) {
            setOverrideId(null)
        }
    }, [scrollSpyId, overrideId])

    // Sync with URL hash on mount and navigation
    React.useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash?.slice(1)
            if (hash && sectionIds.includes(hash)) {
                setOverrideId(hash)
            }
        }

        applyHash()
        window.addEventListener('hashchange', applyHash)
        window.addEventListener('popstate', applyHash)

        return () => {
            window.removeEventListener('hashchange', applyHash)
            window.removeEventListener('popstate', applyHash)
        }
    }, [sectionIds])

    // Notify parent of changes
    React.useEffect(() => {
        onActiveChange?.(activeId)
    }, [activeId, onActiveChange])

    const navigateTo = React.useCallback((id: string) => {
        setOverrideId(id)
    }, [])

    return { activeId, navigateTo }
}
