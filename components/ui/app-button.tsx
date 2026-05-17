import { cn }
    from "@/lib/utils"

import { Button }
    from "@/components/ui/button"

import type {
    ButtonHTMLAttributes,
} from "react"

type Props =
    ButtonHTMLAttributes<
        HTMLButtonElement
    > & {
        loading?: boolean

        children:
        React.ReactNode
    }

export function AppButton({
    children,
    className,
    loading,
    disabled,
    ...props
}: Props) {

    return (

        <Button
            variant="ghost"
            className={cn(
                `
          h-12
          rounded-2xl
          px-6

          bg-zinc-900
          text-white

          text-base
          font-semibold

          shadow-sm
            cursor-pointer
          transition-all

          hover:bg-zinc-800
          hover:text-white

          active:scale-[0.99]
        `,
                className
            )}
            disabled={
                disabled || loading
            }
            {...props}
        >

            {loading
                ? "Carregando..."
                : children}

        </Button>
    )
}