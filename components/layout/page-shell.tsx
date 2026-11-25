import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Props = HTMLAttributes<HTMLDivElement>

export function PageShell({ className, ...props }: Props) {
    return (
        <div
            className={cn(
                "w-full min-w-0 flex-1 bg-background p-3 text-sm sm:p-4 md:p-6 lg:p-8",
                className
            )}
            {...props}
        />
    )
}
