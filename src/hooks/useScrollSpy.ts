'use client'

import { useEffect, useState, useRef } from 'react'

export function useScrollSpy(
    sectionIds: string[],
    rootMargin = '-20% 0px -60% 0px'
) {
    const [activeId, setActiveId] = useState<string | null>(null)
    // Use ref to store IDs and avoid recreating observer when array reference changes
    // but content is the same
    const idsRef = useRef<string[]>([])

    // Create a stable key from IDs to detect meaningful changes
    const idsKey = sectionIds.join(',')

    // Update ref when IDs actually change
    useEffect(() => {
        idsRef.current = sectionIds
    }, [idsKey, sectionIds])

    useEffect(() => {
        const ids = idsRef.current
        const elements = ids
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el)

        if (elements.length === 0) return

        // Track all intersecting elements to find the topmost one
        const intersectingSet = new Set<string>()

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        intersectingSet.add(entry.target.id)
                    } else {
                        intersectingSet.delete(entry.target.id)
                    }
                })

                // Find the first (topmost in document order) ID that's currently intersecting
                const topmost = ids.find(id => intersectingSet.has(id))
                if (topmost) {
                    setActiveId(topmost)
                }
                // If nothing intersecting, keep the last active ID to prevent flickering
            },
            { rootMargin, threshold: [0, 0.1, 1] }
        )

        elements.forEach(el => observer.observe(el))

        // Initial check to set active section on mount
        requestAnimationFrame(() => {
            const visible = elements.find(el => {
                const rect = el.getBoundingClientRect()
                return rect.top >= 0 && rect.top < window.innerHeight * 0.5
            })
            if (visible) setActiveId(visible.id)
        })

        return () => observer.disconnect()
    }, [idsKey, rootMargin])

    return activeId
}
