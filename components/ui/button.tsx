import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border border-transparent text-sm font-bold uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-primary/50 shadow-[4px_4px_0_0_#C5A059] hover:bg-primary/90 hover:shadow-[0_0_0_0_#C5A059] hover:translate-x-1 hover:translate-y-1',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 shadow-[4px_4px_0_0_#7f1d1d] hover:shadow-none hover:translate-x-1 hover:translate-y-1',
        outline:
          'border-current bg-background text-foreground shadow-[4px_4px_0_0_currentColor] hover:bg-accent hover:text-accent-foreground hover:shadow-none hover:translate-x-1 hover:translate-y-1 dark:bg-input/30 dark:border-input',
        secondary:
          'bg-secondary text-secondary-foreground border-secondary/50 shadow-[4px_4px_0_0_#1E3A8A] hover:bg-secondary/80 hover:shadow-[0_0_0_0_#1E3A8A] hover:translate-x-1 hover:translate-y-1',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-none gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-none px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
