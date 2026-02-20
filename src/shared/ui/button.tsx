import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-transparent',
    {
        variants: {
            variant: {
                default: 'text-foreground border-foreground hover:text-accent1 hover:border-accent1 hover:bg-transparent bg-transparent',
                destructive: 'text-destructive border-foreground hover:border-accent1 hover:text-accent1 hover:bg-transparent bg-transparent',
                outline: 'text-foreground border-foreground hover:text-accent1 hover:border-accent1 hover:bg-transparent bg-transparent',
                outlineAccent:
                    'text-foreground border-foreground hover:text-accent1 hover:border-accent1 hover:bg-transparent bg-transparent',
                secondary: 'text-foreground border-foreground hover:text-accent1 hover:border-accent1 hover:bg-transparent bg-transparent',
                ghost: 'text-foreground border-transparent hover:text-accent1 hover:border-accent1 hover:bg-transparent bg-transparent',
                link: 'text-foreground hover:text-accent1 hover:bg-transparent bg-transparent'
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-10 px-8',
                icon: 'h-9 w-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
