
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { GlassCard } from "@/components/ui/glass-card"

type Props = {
    title: string
    value: string | number
    icon?: ReactNode
    description?: string
    className?: string
}

export function StatCard({
    title,
    value,
    icon,
    description,
    className,
}: Props) {

    return (

        <GlassCard
            className={cn(
                `
                    relative
                    flex
                    h-full
                    w-full
                    min-w-0
                    flex-col

                    rounded-[10px]

                    p-3
                    sm:p-4
                    lg:p-5
                `,
                className
            )}
        >

            {/* TÍTULO E ÍCONE */}

            <div className="
                flex
                min-w-0
                items-center
                justify-between
                gap-2
            ">

                <p className="
                    min-w-0

                    text-xs
                    font-medium
                    leading-tight
                    text-muted

                    [overflow-wrap:anywhere]

                    sm:text-sm
                ">

                    {title}

                </p>

                {icon && (

                    <div className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center

                        rounded-lg

                        bg-primary/10
                        text-primary

                        sm:h-9
                        sm:w-9

                        lg:h-10
                        lg:w-10

                        [&>svg]:h-4
                        [&>svg]:w-4

                        lg:[&>svg]:h-5
                        lg:[&>svg]:w-5
                    ">

                        {icon}

                    </div>

                )}

            </div>

            {/* VALOR */}

            <h3 className="
                mt-2

                text-2xl
                font-black
                leading-none
                tracking-tight
                tabular-nums

                text-foreground

                [overflow-wrap:anywhere]

                sm:text-3xl
                lg:text-4xl
            ">

                {value}

            </h3>

            {/* DESCRIÇÃO */}

            {description && (

                <p className="
                    mt-1.5

                    text-[11px]
                    leading-tight
                    text-muted

                    [overflow-wrap:anywhere]

                    sm:text-xs
                    lg:text-sm
                ">

                    {description}

                </p>

            )}

        </GlassCard>
    )
}
