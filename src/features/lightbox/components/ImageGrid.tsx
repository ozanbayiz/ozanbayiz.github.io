import * as React from 'react'

import { cn } from '@/lib/utils'

type ImageGridProps = {
    children: React.ReactNode
    className?: string
}

export default function ImageGrid({
    children,
    className
}: ImageGridProps): React.JSX.Element {
    return (
        <div
            className={cn(
                // Container-based responsive columns (not viewport-based)
                'grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]',
                // Normalize markdown images inside grids
                '[&>p]:m-0 [&>p]:contents [&>p>img]:m-0 [&>p>img]:border [&>p>img]:border-transparent [&>p>img:hover]:border-accent',
                className
            )}
        >
            {children}
        </div>
    )
}
