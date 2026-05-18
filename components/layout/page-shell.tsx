import type {
    HTMLAttributes,
} from "react"

import { cn }
    from "@/lib/utils"

type Props =
    HTMLAttributes<HTMLDivElement>

export function PageShell({
    className,
    ...props
}: Props) {

    return (

        <main
            className={cn(
                `
          min-h-screen

          bg-background

          p-6

          md:p-8
        `,
                className
            )}
            {...props}
        />
    )
}