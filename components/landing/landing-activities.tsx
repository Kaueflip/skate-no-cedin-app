import { CalendarDays, Clock3, ShieldCheck } from "lucide-react"

const shifts = [
    { name: "Manhã", hours: ["07:30 – 09:15", "09:45 – 11:30"] },
    { name: "Tarde", hours: ["13:00 – 14:45", "15:15 – 17:00"] },
]

export function LandingActivities() {
    return (
        <section id="atividades" className="mx-auto max-w-7xl scroll-mt-20 px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Organização das atividades</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Como funcionam as aulas</h2>
            <div className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-5">
                <article className="rounded-[10px] border bg-card p-3 sm:p-5">
                    <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg"><CalendarDays className="size-5 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" /> Horários de referência</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {shifts.map(({ name, hours }) => (
                            <div key={name} className="min-w-0 rounded-lg border bg-background/60 p-2.5 sm:p-3">
                                <h4 className="text-sm font-semibold">{name}</h4>
                                {hours.map((hour, i) => (
                                    <div key={hour} className="mt-2">
                                        <p className="text-xs text-muted">{i + 1}ª aula</p>
                                        <p className="text-sm font-medium tabular-nums">{hour}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-sm text-muted"><Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Cada sessão tem 1h45. Os horários seguem a organização escolar; não representam vagas abertas ou garantia de oferta diária.</p>
                </article>
                <article className="rounded-[10px] border bg-card p-3 sm:p-5">
                    <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg"><ShieldCheck className="size-5 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" /> Organização e segurança</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">As oficinas acontecem semanalmente, com atividades organizadas conforme a rotina escolar. O turno dos estudantes é definido pela organização das turmas.</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">A orientação dos professores, o uso de equipamentos de proteção e o respeito às regras de convivência são prioridades para uma prática responsável.</p>
                </article>
            </div>
        </section>
    )
}
