'use client'

import * as React from 'react'

function useReadingProgress() {
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setProgress(Math.min(100, Math.max(0, scrollPercent)))
        }

        window.addEventListener('scroll', updateProgress, { passive: true })
        updateProgress()
        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    return progress
}

export function ReadingProgressBar() {
    const progress = useReadingProgress()

    return (
        <div
            className='fixed top-12 left-0 w-full h-[2px] z-50'
            role='progressbar'
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Reading progress'
        >
            <div
                className='progress-fill h-full transition-all duration-150 ease-out bg-[image:linear-gradient(to_right,hsl(var(--g1)),hsl(var(--g2)),hsl(var(--g3)))]'
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

