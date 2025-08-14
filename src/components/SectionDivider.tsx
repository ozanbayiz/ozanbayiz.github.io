import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type SectionDividerProps = {
  bleed?: boolean
  className?: string
}

export default function SectionDivider({ bleed = true, className }: SectionDividerProps) {
  const bleedClasses = bleed
    ? '-mx-[var(--inset-x,0rem)] w-[calc(100%+var(--inset-x,0rem)*2)]'
    : ''
  return <Separator className={cn(bleedClasses, className)} />
}
