import * as React
  from "react"

import { cn }
  from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {

  return (

    <input
      type={type}
      data-slot="input"
      className={cn(
        `
          flex
          h-11
          w-full
          min-w-0

          rounded-2xl

          border
          border-border

          bg-input

          px-4
          py-2

          text-sm
          text-foreground

          shadow-sm

          outline-none

          transition-all

          file:inline-flex
          file:border-0
          file:bg-transparent
          file:text-sm
          file:font-medium

          placeholder:text-muted

          selection:bg-primary
          selection:text-primary-foreground

          focus-visible:ring-4
          focus-visible:ring-ring

          disabled:pointer-events-none
          disabled:cursor-not-allowed
          disabled:opacity-50

          aria-invalid:border-red-500
          aria-invalid:ring-red-500/20
        `,
        className
      )}
      {...props}
    />
  )
}

export { Input }