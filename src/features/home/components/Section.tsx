import { cn } from '@/lib/utils'

type SectionProps = {
    children: React.ReactNode
    id?: string
    className?: string
    containerClassName?: string
}

export default function Section({ children, id, className, containerClassName }: SectionProps) {
    return (
        <section id={id} className={cn('py-16 md:py-20', className)}>
            <div className={cn('container mx-auto max-w-screen-lg px-6 md:px-8', containerClassName)}>
                {children}
            </div>
        </section>
    )
}
