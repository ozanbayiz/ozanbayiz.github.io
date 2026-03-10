import { useEffect, useState } from 'react'

export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mql.matches)
        const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [])

    return prefersReducedMotion
}
