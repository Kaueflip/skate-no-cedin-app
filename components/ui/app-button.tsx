"use client"

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react"

import { Slot }
    from "@radix-ui/react-slot"

import { Loader2 }
    from "lucide-react"

import { cn }
    from "@/lib/utils"

type Variant =
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"

type Props =
    ButtonHTMLAttributes<HTMLButtonElement> & {

        loading?: boolean

        children: ReactNode

        variant?: Variant

        asChild?: boolean
    }

export function AppButton({
    loading,
    children,
    className,
    disabled,
    variant = "primary",
    asChild = false,
    type = "button",
    ...props
}: Props) {

    const variants = {

        primary: `
      bg-primary

      text-primary-foreground

      hover:bg-accent-hover

      shadow-sm
    `,

        secondary: `
      border
      border-border

      bg-card

      text-foreground

      hover:bg-black/5

      dark:hover:bg-white/4
    `,

        ghost: `
      bg-transparent

      text-foreground

      hover:bg-black/5

      dark:hover:bg-white/4
    `,

        danger: `
        bg-red-500

        text-white

        hover:bg-red-600

        dark:bg-red-500
        dark:hover:bg-red-600
    `,
    }

    const classes =
        cn(
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

        transition-all

        outline-none

        focus-visible:ring-4
        focus-visible:ring-ring

        active:scale-[0.985]

        disabled:pointer-events-none
        disabled:opacity-50

        cursor-pointer
      `,

            variants[variant],

            className
        )

    if (asChild) {

        return (

            <Slot
                className={classes}
                {...props}
            >

                {children}

            </Slot>
        )
    }

    return (

        <button
            type={type}
            disabled={
                disabled || loading
            }
            className={classes}
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