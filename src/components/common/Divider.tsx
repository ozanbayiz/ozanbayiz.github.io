import { cn } from '@/lib/utils'

type DividerProps = {
    className?: string
}

export function Divider({ className }: DividerProps) {
    return <div className={cn('h-px w-full bg-foreground', className)} />
}

export function PageDivider({ className }: DividerProps) {
    return (
        <div className="mx-auto max-w-screen-lg px-6 md:px-8">
            <Divider {...(className !== undefined && { className })} />
        </div>
    )
}
