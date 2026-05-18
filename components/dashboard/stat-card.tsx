import type {
    ReactNode,
} from "react"

import { cn }
    from "@/lib/utils"

import { GlassCard }
    from "@/components/ui/glass-card"

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

          overflow-hidden

          p-6
        `,
                className
            )}
        >

            <div className="
        flex
        items-start
        justify-between
        gap-4
      ">

                <div>

                    <p className="
            text-sm
            font-medium

            text-muted
          ">

                        {title}

                    </p>

                    <h3 className="
            mt-3

            text-4xl
            font-black
            tracking-tight

            text-foreground
          ">

                        {value}

                    </h3>

                    {description && (

                        <p className="
              mt-2

              text-sm

              text-muted
            ">

                            {description}

                        </p>

                    )}

                </div>

                {icon && (

                    <div className="
            flex
            h-12
            w-12
            items-center
            justify-center

            rounded-2xl

            bg-primary/10

            text-primary
          ">

                        {icon}

                    </div>

                )}

            </div>

        </GlassCard>
    )
}