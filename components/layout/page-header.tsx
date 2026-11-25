import type { ReactNode } from "react"

type Props = {
    title: string
    description?: string
    action?: ReactNode
    icon?: ReactNode
}

export function PageHeader({ title, description, action, icon }: Props) {
    return (
        <div className="mb-4 flex min-w-0 flex-col gap-3 sm:mb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                {icon && (
                    <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-3 sm:size-12 sm:rounded-2xl">
                        {icon}
                    </div>
                )}
                <h1 className="break-words text-xl font-black tracking-tight text-foreground md:text-2xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted sm:mt-2">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex min-w-0 flex-wrap items-center gap-2 lg:shrink-0">
                    {action}
                </div>
            )}
        </div>
    )
}
