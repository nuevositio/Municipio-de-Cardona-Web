import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/* eslint-disable react-refresh/only-export-components */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  {
    variants: {
      variant: {
        default:
          'bg-[--brand-blue] text-white hover:bg-[--brand-blue-700] focus-visible:ring-[--brand-blue]',
        secondary:
          'bg-[--brand-green] text-white hover:bg-[--brand-green-700] focus-visible:ring-[--brand-green]',
        outline:
          'border border-[--line] bg-white text-[--ink-900] hover:bg-[--soft-blue] focus-visible:ring-[--brand-blue]',
        ghost:
          'text-[--ink-800] hover:bg-[--soft-blue] focus-visible:ring-[--brand-blue]',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
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
