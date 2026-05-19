import type {
    ReactNode,
} from "react"

type Props = {

    title:
    string

    description?:
    string

    action?:
    ReactNode

    icon?:
    ReactNode
}

export function PageHeader({
    title,
    description,
    action,
    icon,
}: Props) {

    return (

        <div className="
      flex
      flex-col
      gap-6

      lg:flex-row
      lg:items-center
      lg:justify-between
    ">

            <div>

                {icon && (

                    <div className="
            mb-4

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
            mt-3

            max-w-2xl

            text-lg
            leading-relaxed

            text-muted
          ">

                        {description}

                    </p>

                )}

            </div>

            {action && (

                <div>

                    {action}

                </div>

            )}

        </div>
    )
}