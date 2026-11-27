import Link from "next/link"
import { ArrowRight, BarChart3, CalendarDays, ClipboardCheck, Users, UserRound, FileDown } from "lucide-react"

const items = [
    { title: "Alunos", description: "Cadastro e organização dos participantes.", icon: Users },
    { title: "Frequência", description: "Registros de presenças e faltas.", icon: ClipboardCheck },
    { title: "Controle de aulas", description: "Sessões realizadas e canceladas.", icon: CalendarDays },
    { title: "Professores", description: "Equipe e vínculos com as aulas.", icon: UserRound },
    { title: "Indicadores", description: "Participação e carga horária.", icon: BarChart3 },
    { title: "Relatórios", description: "Exportações para acompanhamento do projeto.", icon: FileDown },
]

export function LandingPlatform() {
    return (
        <section id="sistema" className="mx-auto max-w-7xl scroll-mt-20 px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
            <div className="grid gap-5 rounded-[10px] border bg-card p-3 sm:p-6 lg:grid-cols-[1fr_1.3fr] lg:gap-8 lg:p-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Plataforma de gestão</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Organização das atividades em um só lugar</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">O ambiente interno reúne as ferramentas de acompanhamento das aulas e da equipe. O acesso é destinado aos usuários autorizados.</p>
                    <Link href="/login" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto">
                        Acessar plataforma <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:gap-3">
                    {items.map(({ title, description, icon: Icon }) => (
                        <article key={title} className="min-w-0 rounded-lg border bg-background/60 p-3">
                            <Icon className="size-5 text-primary dark:text-blue-400" aria-hidden="true" />
                            <h3 className="mt-2 text-sm font-semibold">{title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
