import {
    CalendarDays,
    ChartNoAxesCombined,
    ClipboardCheck,
    Users,
} from "lucide-react"

const features = [
    { icon: Users, title: "Gestão de alunos", detail: "Cadastros e organização das turmas." },
    { icon: ClipboardCheck, title: "Frequência", detail: "Acompanhamento da participação nas oficinas." },
    { icon: CalendarDays, title: "Aulas e professores", detail: "Organização das atividades e da equipe." },
    { icon: ChartNoAxesCombined, title: "Indicadores e relatórios", detail: "Dados para planejamento e prestação de contas." },
]

export function AuthBranding() {
    return (
        <aside
            aria-label="Sobre a plataforma"
            className="hidden min-w-0 flex-col justify-center border-r border-border bg-card/50 px-8 py-10 lg:flex xl:px-14"
        >
            <div className="mx-auto w-full max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Desde 2023 · Educação Integral
                </p>
                <p className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground xl:text-5xl">
                    Cultura urbana como linguagem pedagógica.
                </p>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                    Uma plataforma para organizar as atividades, acompanhar a participação
                    dos estudantes e fortalecer a gestão do Skate no Cedin.
                </p>
                <ul className="mt-8 grid gap-3 xl:grid-cols-2">
                    {features.map(({ icon: Icon, title, detail }) => (
                        <li key={title} className="flex min-w-0 items-start gap-3 rounded-[10px] border border-border bg-background/60 p-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-blue-400">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">{title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                    <p className="font-medium text-foreground">CEDIN Ângela Dalçóquio de Souza</p>
                    <p>Itajaí, Santa Catarina</p>
                </div>
            </div>
        </aside>
    )
}
