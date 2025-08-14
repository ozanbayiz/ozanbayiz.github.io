'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(
    sectionIds: string[],
    rootMargin = '-20% 0px -60% 0px'
) {
    const [activeId, setActiveId] = useState<string | null>(null)

    useEffect(() => {
        const elements = sectionIds
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el)

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin, threshold: [0, 1] }
        )

        elements.forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [sectionIds, rootMargin])

    return activeId
}
