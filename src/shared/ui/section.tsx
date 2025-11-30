import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    className?: string
}

export function Section({ className, children, ...props }: SectionProps) {
    return (
        <section
            className={cn(
                // GLOBAL DEFAULTS
                "w-full py-4", // Standard vertical spacing
                "flex flex-col", // Default layout behavior
                className // Allow overrides
            )}
            {...props}
        >
            {children}
        </section>
    )
}

