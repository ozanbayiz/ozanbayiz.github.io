'use client'

import * as React from 'react'

export function useIntersectionObserver(
    target: Element | null,
    options?: IntersectionObserverInit,
): IntersectionObserverEntry | null {
    const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null)

    React.useEffect(() => {
        if (!target) return

        const observer = new IntersectionObserver(([first]) => {
            if (first) setEntry(first)
        }, options)

        observer.observe(target)
        return () => observer.disconnect()
    }, [target, options])

    return entry
}
