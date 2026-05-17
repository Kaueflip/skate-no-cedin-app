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
            className={cn(
                `
          h-12
          rounded-2xl
          px-6
          text-base
          font-semibold
          shadow-sm
          transition-all
          hover:scale-[1.01]
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