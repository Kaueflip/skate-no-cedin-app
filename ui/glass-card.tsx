import type {
    HTMLAttributes,
} from "react"

import { cn }
    from "@/lib/utils"

type Props =
    HTMLAttributes<HTMLDivElement>

export function GlassCard({
    className,
    ...props
}: Props) {

    return (

        <div
            className={cn(
                `
          rounded-[2rem]

          border
          border-border

          bg-card

          shadow-sm

          backdrop-blur-2xl

          transition-colors
        `,
                className
            )}
            {...props}
        />
    )
}