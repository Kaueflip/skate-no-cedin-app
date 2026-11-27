
"use client"

import {
    BookOpen,
    LayoutDashboard,
    Users,
    ClipboardCheck,
    CalendarDays,
    ChartNoAxesCombined,
    GraduationCap,
    ShieldCheck,
    CircleHelp,
} from "lucide-react"

const sections = [
    {
        title: "Apresentação",
        href: "#apresentacao",
        icon: BookOpen,
    },
    {
        title: "Conhecendo o sistema",
        href: "#conhecendo",
        icon: LayoutDashboard,
    },
    {
        title: "Gestão de alunos",
        href: "#alunos",
        icon: Users,
    },
    {
        title: "Controle de frequência",
        href: "#frequencia",
        icon: ClipboardCheck,
    },
    {
        title: "Controle de aulas",
        href: "#aulas",
        icon: CalendarDays,
    },
    {
        title: "Dashboard e indicadores",
        href: "#indicadores",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Rotina dos professores",
        href: "#rotina",
        icon: GraduationCap,
    },
    {
        title: "Boas práticas",
        href: "#boas-praticas",
        icon: ShieldCheck,
    },
    {
        title: "Perguntas frequentes",
        href: "#duvidas",
        icon: CircleHelp,
    },
]

export function ManualSidebar() {
    return (
        <aside className="space-y-2">
            <div className="mb-4 px-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conteúdo do manual
                </p>
            </div>

            <nav className="space-y-1">
                {sections.map((section) => {
                    const Icon = section.icon

                    return (
                        <a
                            key={section.href}
                            href={section.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent-foreground"
                        >
                            <Icon className="h-4 w-4 shrink-0" />

                            <span>{section.title}</span>
                        </a>
                    )
                })}
            </nav>
        </aside>
    )
}
