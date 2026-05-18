"use client"

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react"

import { Loader2 }
    from "lucide-react"

import { cn }
    from "@/lib/utils"

type Variant =
    | "primary"
    | "secondary"
    | "ghost"

type Props =
    ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: boolean

        children: ReactNode

        variant?: Variant
    }

export function AppButton({
    loading,
    children,
    className,
    disabled,
    variant = "primary",
    ...props
}: Props) {

    const variants = {
        primary: `
      bg-zinc-900
      text-white

      hover:bg-zinc-800
    `,

        secondary: `
      border
      border-white/40

      bg-white/70

      text-zinc-900

      hover:bg-white
    `,

        ghost: `
      bg-transparent

      text-zinc-700

      hover:bg-white/60
    `,
    }

    return (

        <button
            disabled={
                disabled || loading
            }
            className={cn(
                `
          inline-flex
          items-center
          justify-center
          gap-2

          rounded-2xl

          px-6
          py-3

          text-sm
          font-semibold

          shadow-sm

          transition-all

          active:scale-[0.98]

          disabled:cursor-not-allowed
          disabled:opacity-50
        `,

                variants[variant],

                className
            )}
            {...props}
        >

            {loading && (

                <Loader2
                    className="
            h-4
            w-4

            animate-spin
          "
                />

            )}

            {children}

        </button>
    )
}