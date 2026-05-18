import type {
    ReactNode,
} from "react"

type Props = {

    title: string

    description?: string

    action?: ReactNode
}

export function PageHeader({
    title,
    description,
    action,
}: Props) {

    return (

        <div className="
      mb-8

      flex
      flex-col
      gap-4

      md:flex-row
      md:items-start
      md:justify-between
    ">

            <div>

                <h1 className="
          text-4xl
          font-black
          tracking-tight

          text-foreground
        ">

                    {title}

                </h1>

                {description && (

                    <p className="
            mt-2

            text-base

            text-muted
          ">

                        {description}

                    </p>

                )}

            </div>

            {action && (

                <div className="
          shrink-0
        ">

                    {action}

                </div>

            )}

        </div>
    )
}