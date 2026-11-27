import type { ReactNode } from "react"

type Props = {
    id: string
    eyebrow: string
    title: string
    description?: string
    alternate?: boolean
    children: ReactNode
}

export function LandingSection({ id, eyebrow, title, description, alternate, children }: Props) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-20 ${alternate ? "border-y bg-card/30" : ""}`}>
            <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{eyebrow}</p>
                <h2 id={`${id}-title`} className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
                {description && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
                <div className="mt-5 sm:mt-7">{children}</div>
            </div>
        </section>
    )
}
