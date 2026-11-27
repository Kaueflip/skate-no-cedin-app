import { CalendarCheck, CalendarDays, Clock3, ClipboardCheck, Users, UserRound, Flag, Construction } from "lucide-react"
import { createClient } from "@/lib/supabase-server"

const keys = [
    "active_students",
    "active_teachers",
    "completed_sessions",
    "known_duration_minutes",
    "attendance_presences",
    "activity_days",
    "unknown_duration_sessions",
] as const

type Stats = Record<(typeof keys)[number], number>

function parseStats(data: unknown): Stats | null {
    if (!data || typeof data !== "object") return null
    const row = data as Record<string, unknown>
    for (const key of keys) {
        if (typeof row[key] !== "number" || !Number.isSafeInteger(row[key]) || (row[key] as number) < 0) {
            return null
        }
    }
    return row as Stats
}

async function getStats(): Promise<Stats | null> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.rpc("get_public_project_stats")
        if (error) {
            console.error("PUBLIC_PROJECT_STATS_ERROR", error.code)
            return null
        }
        return parseStats(data)
    } catch {
        return null
    }
}

const numberFormat = new Intl.NumberFormat("pt-BR")

function formatHours(minutes: number) {
    return `${numberFormat.format(Math.floor(minutes / 60))}h${String(minutes % 60).padStart(2, "0")}`
}

export async function LandingStats() {
    const stats = await getStats()
    const milestones = [
        { label: "Início do projeto", value: "2023", icon: Flag, detail: "Trajetória institucional" },
        { label: "Minirrampa", value: "2025", icon: Construction, detail: "Implantação em concreto" },
    ]
    const items = stats ? [
        { label: "Alunos ativos", value: numberFormat.format(stats.active_students), icon: Users, detail: "Cadastro atual" },
        { label: "Professores ativos", value: numberFormat.format(stats.active_teachers), icon: UserRound, detail: "Equipe cadastrada" },
        { label: "Aulas realizadas", value: numberFormat.format(stats.completed_sessions), icon: CalendarCheck, detail: "Histórico registrado" },
        { label: "Carga horária", value: formatHours(stats.known_duration_minutes), icon: Clock3, detail: "Aulas de manhã e tarde" },
        { label: "Presenças registradas", value: numberFormat.format(stats.attendance_presences), icon: ClipboardCheck, detail: "Participações acumuladas" },
        { label: "Dias de atividade", value: numberFormat.format(stats.activity_days), icon: CalendarDays, detail: "Com aulas realizadas" },
    ] : [
        { label: "Alunos ativos", value: "—", icon: Users, detail: "Cadastro atual" },
        { label: "Professores ativos", value: "—", icon: UserRound, detail: "Equipe cadastrada" },
        { label: "Aulas realizadas", value: "—", icon: CalendarCheck, detail: "Histórico registrado" },
        { label: "Carga horária", value: "—", icon: Clock3, detail: "Aulas de manhã e tarde" },
        { label: "Presenças registradas", value: "—", icon: ClipboardCheck, detail: "Participações acumuladas" },
        { label: "Dias de atividade", value: "—", icon: CalendarDays, detail: "Com aulas realizadas" },
    ]

    return (
        <section id="indicadores" className="scroll-mt-20 border-b bg-card/30">
            <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Transparência</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">O projeto em números</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                    Indicadores agregados do cadastro atual e do histórico de atividades do sistema.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
                    {[milestones[0], ...items, milestones[1]].map(({ label, value, icon: Icon, detail }) => (
                        <div key={label} className="flex min-w-0 flex-col gap-2 rounded-[10px] border bg-card p-3 sm:p-4">
                            <div className="flex min-w-0 items-start justify-between gap-1.5">
                                <p className="min-w-0 break-words text-xs font-medium leading-snug text-muted sm:text-sm">{label}</p>
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                    <Icon className="size-4 text-primary dark:text-blue-400" aria-hidden="true" />
                                </span>
                            </div>
                            <p className="break-words text-xl font-bold tracking-tight tabular-nums sm:text-2xl">{value}</p>
                            <p className="mt-auto text-[11px] leading-snug text-muted sm:text-xs">{detail}</p>
                        </div>
                    ))}
                </div>
                {stats ? (
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                        Totais do histórico registrado até a data atual (horário de Brasília).
                        Presenças representam participações, não alunos únicos.
                        {stats.unknown_duration_sessions > 0 && ` ${numberFormat.format(stats.unknown_duration_sessions)} aula(s) realizada(s) sem duração definida não entram na carga horária.`}
                    </p>
                ) : (
                    <p className="mt-5 rounded-[10px] border bg-card p-4 text-sm text-muted">
                        Os indicadores estão temporariamente indisponíveis.
                    </p>
                )}
            </div>
        </section>
    )
}
