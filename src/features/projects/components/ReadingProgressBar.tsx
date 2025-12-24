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
            className='absolute bottom-0 left-2 right-2 h-[1px]'
            role='progressbar'
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Reading progress'
        >
            <div
                className='h-full bg-accent transition-all duration-150 ease-out'
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

