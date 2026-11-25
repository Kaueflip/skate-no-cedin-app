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

          p-3
          sm:p-4
          md:p-6
        `,
                className
            )}
        >

            <div className="
        flex
        items-start
        justify-between
        gap-2
        sm:gap-4
      ">

                <div className="min-w-0">

                    <p className="
            text-xs
            sm:text-sm
            font-medium

            text-muted
          ">

                        {title}

                    </p>

                    <h3 className="
            mt-1
            sm:mt-2
            text-2xl
            sm:text-3xl
            lg:text-4xl
            font-black
            tracking-tight

            text-foreground
          ">

                        {value}

                    </h3>

                    {description && (

                        <p className="
              mt-1
              sm:mt-2
              text-xs
              sm:text-sm

              text-muted
            ">

                            {description}

                        </p>

                    )}

                </div>

                {icon && (

                    <div className="
            flex
            h-9
            w-9
            shrink-0
            sm:h-12
            sm:w-12
            items-center
            justify-center

            rounded-xl
            sm:rounded-2xl

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