import type { ReactNode } from "react"
import Link from "next/link"
import { Users, Clock3, BriefcaseBusiness, ChevronRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import {
    ageStats, formatHours, summarizeSessions, teachingStats,
    type RosterStudent, type ReportSession, type ReportTeacher, type ReportAssignment,
} from "@/components/reports/report-metrics"

const panel = "w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5"
const grid = "grid min-w-0 grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4"
const pct = (n: number, total: number) => total ? n / total * 100 : 0
const number = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })
const percent = (n: number, total: number) => `${number(pct(n, total))}%`
const dateLabel = (date: string | null) => date ? date.split("-").reverse().join("/") : "—"

function SectionHeading({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
    return <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
            <h2 className="text-base font-bold leading-tight md:text-lg">{title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">{description}</p>
        </div>
        <div className="shrink-0 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
    </div>
}

function Metric({ label, value, description }: { label: string; value: string | number; description?: string }) {
    return <div className="flex h-full min-w-0 flex-col rounded-lg border border-border bg-background/60 p-2.5 sm:p-3">
        <p className="text-xs font-medium leading-tight text-muted [overflow-wrap:anywhere]">{label}</p>
        <p className="mt-2 text-xl font-bold leading-tight tabular-nums [overflow-wrap:anywhere] sm:text-2xl">{value}</p>
        {description && <p className="mt-1 text-[11px] leading-relaxed text-muted [overflow-wrap:anywhere]">{description}</p>}
    </div>
}

function BarRow({ label, count, total }: { label: string; count: number; total: number }) {
    return <div className="min-w-0 space-y-1.5">
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
            <span className="min-w-0 font-medium [overflow-wrap:anywhere]">{label}</span>
            <span className="shrink-0 tabular-nums text-muted">{count} · {percent(count, total)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/30" aria-hidden="true">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct(count, total)}%` }} />
        </div>
    </div>
}

export function AgeReport({ students, today }: { students: RosterStudent[]; today: string }) {
    const stats = ageStats(students, today)
    return <GlassCard className={panel}>
        <SectionHeading title="Distribuição por faixa etária" description="Idade em anos completos dos alunos ativos, por turma e turno." icon={<Users />} />
        {!stats.total ? <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">Nenhum aluno ativo nos filtros selecionados.</p> : <>
            <div className={grid}>
                <Metric label="Idade média" value={stats.average === null ? "—" : `${number(stats.average)} anos`} />
                <Metric label="Menor idade" value={stats.youngest === null ? "—" : `${stats.youngest} anos`} />
                <Metric label="Maior idade" value={stats.oldest === null ? "—" : `${stats.oldest} anos`} />
                <Metric label="Com idade válida" value={`${stats.known}/${stats.total}`} />
            </div>
            <div className="mt-4 space-y-3">
                {stats.groups.map((group) => <BarRow key={group.label} label={group.label} count={group.count} total={stats.total} />)}
            </div>
        </>}
        <p className="mt-3 text-xs leading-relaxed text-muted">Idades em {dateLabel(today)} (Brasília). O período não altera este indicador. A média exclui datas ausentes ou inválidas; os percentuais incluem todos os alunos ativos da seleção.</p>
    </GlassCard>
}

function SessionBreakdown({ label, sessions }: { label: string; sessions: ReportSession[] }) {
    const s = summarizeSessions(sessions)
    return <div className="min-w-0 rounded-lg border border-border bg-background/60 p-3">
        <p className="text-sm font-semibold capitalize">{label}</p>
        <p className="mt-1 text-xl font-bold tabular-nums">{s.realizedMinutes || !s.unknownRealized ? formatHours(s.realizedMinutes) : "—"}</p>
        <p className="mt-1 text-xs text-muted">{s.realized} realizadas · {s.canceled} canceladas</p>
        {s.unknownRealized > 0 && <p className="mt-1 text-xs text-muted">{s.unknownRealized} realizadas sem duração definida</p>}
    </div>
}

export function ProjectHoursReport({ sessions }: { sessions: ReportSession[] }) {
    const s = summarizeSessions(sessions)
    const monthly = new Map<string, ReportSession[]>()
    for (const session of sessions) {
        const key = session.class_date.slice(0, 7)
        const list = monthly.get(key) ?? []
        list.push(session)
        monthly.set(key, list)
    }
    const months = [...monthly.entries()].sort(([a], [b]) => b.localeCompare(a))
    return <GlassCard className={panel}>
        <SectionHeading title="Carga horária do projeto" description="Aulas registradas no período e turno selecionados. Horas estimadas pelo horário padrão." icon={<Clock3 />} />
        <div className={grid}>
            <Metric label="Carga horária realizada" value={s.realizedMinutes || !s.unknownRealized ? formatHours(s.realizedMinutes) : "—"} description={`${s.realized} aulas realizadas${s.unknownRealized ? ` · ${s.unknownRealized} sem duração` : ""}`} />
            <Metric label="Carga horária cancelada" value={s.canceledMinutes || !s.unknownCanceled ? formatHours(s.canceledMinutes) : "—"} description={`${s.canceled} aulas canceladas${s.unknownCanceled ? ` · ${s.unknownCanceled} sem duração` : ""}`} />
            <Metric label="Dias de atividade" value={s.days} description="Dias com aula realizada" />
            <Metric label="Aulas por dia ativo" value={s.days ? number(s.realized / s.days) : "—"} description="Média de aulas realizadas" />
            <Metric label="Carga horária registrada" value={s.realizedMinutes + s.canceledMinutes || !(s.unknownRealized + s.unknownCanceled) ? formatHours(s.realizedMinutes + s.canceledMinutes) : "—"} description="Realizadas + canceladas; horas conhecidas" />
            <Metric label="Taxa de realização" value={s.realized + s.canceled ? percent(s.realized, s.realized + s.canceled) : "—"} description="Das aulas com status realizado/cancelado" />
            <Metric label="Taxa de cancelamento" value={s.realized + s.canceled ? percent(s.canceled, s.realized + s.canceled) : "—"} />
            <Metric label="Última aula realizada" value={dateLabel(s.lastRealized)} />
        </div>
        <h3 className="mb-2 mt-4 text-sm font-bold">Por turno</h3>
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
            {["Manhã", "Tarde", "Noite"].map((shift) => <SessionBreakdown key={shift} label={shift} sessions={sessions.filter((session) => session.turno === shift)} />)}
        </div>
        <h3 className="mb-2 mt-4 text-sm font-bold">Histórico mensal no período</h3>
        {months.length ? <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {months.map(([key, list]) => <SessionBreakdown key={key} label={new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${key}-01T00:00:00Z`))} sessions={list} />)}
        </div> : <p className="text-xs text-muted">Nenhuma aula registrada no período.</p>}
        <p className="mt-3 text-xs leading-relaxed text-muted">Cada aula da manhã ou tarde (1ª e 2ª) vale 105 minutos (1h45), sem os intervalos. Aulas sem horário definido, inclusive Noite, entram nas contagens, mas não nas horas. Cancelamentos não entram na carga realizada. O filtro de turma não se aplica a aulas, pois não há vínculo de sessão com turma.</p>
    </GlassCard>
}

export function TeachersReport({ sessions, teachers, assignments }: { sessions: ReportSession[]; teachers: ReportTeacher[]; assignments: ReportAssignment[] }) {
    const stats = teachingStats(sessions, teachers, assignments)
    const totalRealized = sessions.filter((session) => session.status === "realizada").length
    return <GlassCard className={panel}>
        <SectionHeading title="Indicadores dos professores" description="Participação e carga horária estimada a partir das aulas vinculadas no período e turno." icon={<BriefcaseBusiness />} />
        <div className={grid}>
            <Metric label="Professores participantes" value={stats.participating} description="Com aula realizada vinculada" />
            <Metric label="Horas-professor" value={stats.totalTeacherMinutes || !stats.unknownTeacherAssignments ? formatHours(stats.totalTeacherMinutes) : "—"} description="Soma das horas conhecidas da equipe" />
            <Metric label="Aulas com professor" value={stats.linked} description={totalRealized ? `${percent(stats.linked, totalRealized)} das realizadas` : "Sem aulas realizadas"} />
            <Metric label="Aulas sem professor" value={stats.unlinked} description="Realizadas sem vínculo visível" />
            <Metric label="Aulas em equipe" value={stats.coTeaching} description="Realizadas com 2 ou mais professores" />
            <Metric label="Ativos sem aula realizada" value={stats.activeWithoutRealized} description="No período e turno" />
        </div>
        {stats.unmatched > 0 && <p role="status" className="mt-3 text-xs text-muted">{stats.unmatched} vínculos não puderam ser associados a um professor ou sessão visível. Confira os dados e permissões.</p>}
        {stats.unknownTeacherAssignments > 0 && <p className="mt-3 text-xs text-muted">{stats.unknownTeacherAssignments} vínculos de aulas realizadas sem duração definida estão fora da soma de horas.</p>}
        <h3 className="mb-2 mt-4 text-sm font-bold">Por professor</h3>
        {stats.byTeacher.length ? <div className="grid min-w-0 gap-3 xl:grid-cols-2">
            {stats.byTeacher.map((teacher) => <article key={teacher.id} className="min-w-0 rounded-lg border border-border bg-background/60 p-3">
                <Link href={`/teachers/${teacher.id}`} className="flex min-w-0 items-center justify-between gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold [overflow-wrap:anywhere]">{teacher.nome}</p>
                        <p className="mt-0.5 text-xs text-muted [overflow-wrap:anywhere]">{teacher.funcao || "Função não informada"} · {teacher.ativo ? "Ativo" : "Inativo"}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
                <div className="mt-3 grid min-w-0 grid-cols-2 gap-2">
                    <Metric label="Aulas vinculadas" value={teacher.total} />
                    <Metric label="Horas em aulas realizadas" value={teacher.realizedMinutes || !teacher.unknownRealized ? formatHours(teacher.realizedMinutes) : "—"} />
                    <Metric label="Realizadas" value={teacher.realized} />
                    <Metric label="Canceladas" value={teacher.canceled} />
                    <Metric label="Dias de atuação" value={teacher.days} />
                    <Metric label="Última aula realizada" value={dateLabel(teacher.lastRealized)} />
                </div>
                <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {teacher.shifts.map((shift) => <div key={shift.label} className="flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-xs">
                        <span className="font-medium">{shift.label}</span>
                        <span className="tabular-nums text-muted">{shift.realized} realizadas · {shift.realizedMinutes || !shift.unknownRealized ? formatHours(shift.realizedMinutes) : "—"}{shift.unknownRealized > 0 ? ` (+${shift.unknownRealized} sem duração)` : ""}</span>
                    </div>)}
                </div>
            </article>)}
        </div> : <p className="text-xs text-muted">Nenhum professor ativo ou com vínculo no período.</p>}
        <p className="mt-3 text-xs leading-relaxed text-muted">Uma aula com dois professores soma duas cargas individuais, mas somente uma carga ao projeto. Professores inativos com vínculos no período permanecem no histórico. O filtro de turma não afeta esta seção. Vínculo não comprova presença do professor nem constitui registro de ponto, folha de pagamento ou horas extras.</p>
    </GlassCard>
}
