import * as React
  from "react"

import { cva, VariantProps }
  from "class-variance-authority"

import { cn }
  from "@/lib/utils"

const badgeVariants =
  cva(
    `
      inline-flex
      items-center
      justify-center

      rounded-full

      border

      px-2.5
      py-1

      text-xs
      font-semibold

      whitespace-nowrap

      transition-colors

      focus-visible:ring-4
      focus-visible:ring-ring
    `,
    {
      variants: {

        variant: {

          default: `
            border-transparent

            bg-primary

            text-primary-foreground

            hover:bg-accent-hover
          `,

          secondary: `
            border-border

            bg-card

            text-foreground

            hover:bg-white/70

            dark:hover:bg-white/4
          `,

          success: `
            border-transparent

            bg-emerald-600

            text-white
          `,

          warning: `
            border-transparent

            bg-amber-500

            text-black
          `,

          danger: `
            border-transparent

            bg-red-600

            text-white
          `,

          outline: `
            border-border

            bg-transparent

            text-foreground
          `,
        },
      },

      defaultVariants: {

        variant:
          "default",
      },
    }
  )

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<
    typeof badgeVariants
  >) {

  return (

    <div
      data-slot="badge"
      className={cn(
        badgeVariants({
          variant,
        }),
        className
      )}
      {...props}
    />
  )
}

export {
  Badge,
  badgeVariants,
}