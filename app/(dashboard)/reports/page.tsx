
import {
    CalendarCheck,
    CalendarX,
    ClipboardCheck,
    Percent,
    UserPlus,
    Users,
    UserX,
    BriefcaseBusiness,
} from "lucide-react"

import { createClient } from "@/lib/supabase-server"

import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { GlassCard } from "@/components/ui/glass-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { AgeReport, ProjectHoursReport, TeachersReport } from "@/components/reports/report-sections"
import { readAll, genderCounts, type ReportSession, type ReportTeacher, type ReportAssignment } from "@/components/reports/report-metrics"

import { analytics, buildTables, comparisonPeriod, type AttendanceRow, type ReportStudent } from "@/components/reports/report-analytics"
import { AdditionalReports } from "@/components/reports/additional-reports"
import { ReportExport } from "@/components/reports/report-export"

type SearchParams = {
    periodo?: string
    turma?: string
    turno?: string
    dataInicio?: string
    dataFim?: string
}

type Props = {
    searchParams: Promise<SearchParams>
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10)
}

function isValidDate(value: string | undefined): value is string {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const date = new Date(`${value}T00:00:00Z`)
    return Number.isFinite(date.getTime()) && formatDate(date) === value
}

function formatDisplayDate(value: string) {
    return value.split("-").reverse().join("/")
}

function addDays(date: string, days: number) {
    const result = new Date(`${date}T00:00:00Z`)
    result.setUTCDate(result.getUTCDate() + days)
    return formatDate(result)
}

export default async function ReportsPage({
    searchParams,
}: Props) {

    const params = await searchParams

    const supabase = await createClient()

    // DATA ATUAL - FUSO DE BRASÍLIA

    const dateParts = new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).formatToParts(new Date())

    const currentYear = Number(
        dateParts.find(
            (part) => part.type === "year"
        )?.value
    )

    const currentMonth = Number(
        dateParts.find(
            (part) => part.type === "month"
        )?.value
    )

    const monthStart = [
        currentYear,
        String(currentMonth).padStart(2, "0"),
        "01",
    ].join("-")

    const nextMonthStart = formatDate(
        new Date(Date.UTC(currentYear, currentMonth, 1))
    )

    const today = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${dateParts.find((part) => part.type === "day")!.value}`

    // Cadastro atual e histórico. Apenas campos necessários aos cálculos.
    const [allStudents, schoolClasses] = await Promise.all([
        readAll<ReportStudent>((from, to) => supabase.from("students")
            .select("id, turma, turno, genero, data_nascimento, ativo, created_at, school_class_id")
            .order("id").range(from, to), "cadastro de alunos"),
        readAll<{ id: string; nome: string }>((from, to) => supabase.from("school_classes")
            .select("id, nome").order("id").range(from, to), "turmas escolares"),
    ])
    const classNames = new Map(schoolClasses.map(c => [c.id, c.nome]))
    const normalizedStudents = allStudents.map(s => ({ ...s,
        turma: (s.school_class_id ? classNames.get(s.school_class_id) : undefined) || s.turma?.trim() || "Sem turma",
    }))
    const turmas = [...new Set(normalizedStudents.map(s => s.turma))]
        .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))

    // FILTROS

    const periodOptions = [
        "mes",
        "trimestre",
        "ano",
        "personalizado",
    ]

    const periodo = periodOptions.includes(
        params.periodo || ""
    )
        ? params.periodo!
        : "mes"

    const turma = params.turma && turmas.includes(params.turma)
        ? params.turma
        : "todas"

    const turnoOptions = [
        "todos",
        "Manhã",
        "Tarde",
        "Noite",
    ]

    const turno = turnoOptions.includes(
        params.turno || ""
    )
        ? params.turno!
        : "todos"

    // DEFINIÇÃO DO PERÍODO

    let periodStart = monthStart
    let periodEnd = nextMonthStart

    if (periodo === "trimestre") {

        periodStart = formatDate(
            new Date(
                Date.UTC(
                    currentYear,
                    currentMonth - 3,
                    1
                )
            )
        )

    }

    if (periodo === "ano") {

        periodStart = `${currentYear}-01-01`
        periodEnd = `${currentYear + 1}-01-01`

    }

    if (periodo === "personalizado") {

        if (
            isValidDate(params.dataInicio) &&
            isValidDate(params.dataFim) &&
            params.dataInicio <= params.dataFim &&
            params.dataFim < "9999-12-31"
        ) {
            periodStart = params.dataInicio
            periodEnd = addDays(params.dataFim, 1)
        }
    }

    const invalidCustomPeriod = periodo === "personalizado" && (
        !isValidDate(params.dataInicio) ||
        !isValidDate(params.dataFim) ||
        params.dataInicio > params.dataFim ||
        params.dataFim >= "9999-12-31"
    )

    const selectedStudents = normalizedStudents.filter(student =>
        (turma === "todas" || student.turma === turma) &&
        (turno === "todos" || student.turno === turno ||
            (turno === "Tarde" && student.turno === "Integral"))
    )
    const filteredRoster = selectedStudents.filter(s => s.ativo)
    const startMs = Date.parse(`${periodStart}T00:00:00-03:00`)
    const endMs = Date.parse(`${periodEnd}T00:00:00-03:00`)
    const newStudentsCount = filteredRoster.filter(s => {
        const created = s.created_at ? Date.parse(s.created_at) : NaN
        return created >= startMs && created < endMs
    }).length

    // Frequência histórica, inclusive inativos, com os mesmos filtros do cadastro atual.
    // Paginação e lotes de IDs evitam o limite de linhas e de comprimento de URL.
    async function loadAttendance(start: string, end: string, onlyPresent = false) {
        const result: AttendanceRow[] = []
        for (let offset = 0; offset < selectedStudents.length; offset += 100) {
            const ids = selectedStudents.slice(offset, offset + 100).map(s => s.id)
            result.push(...await readAll<AttendanceRow>((from, to) => {
                let query = supabase.from("attendance").select("id, student_id, class_date, present")
                    .in("student_id", ids).gte("class_date", start).lt("class_date", end)
                if (onlyPresent) query = query.eq("present", true)
                return query.order("id").range(from, to)
            }, "registros de frequência"))
        }
        return result
    }
    const comparison = comparisonPeriod(periodStart, periodEnd, today)
    const [attendanceRows, previousRows, sessions, teachers] = await Promise.all([
        loadAttendance(periodStart, periodEnd),
        comparison ? loadAttendance(comparison.previousStart, comparison.previousEnd, true) : Promise.resolve([] as AttendanceRow[]),
        readAll<ReportSession>((from, to) => {
            let query = supabase.from("class_sessions")
                .select("id, class_date, turno, aula_numero, status")
                .gte("class_date", periodStart).lt("class_date", periodEnd)
            if (turno !== "todos") query = query.eq("turno", turno)
            return query.order("id").range(from, to)
        }, "aulas"),
        readAll<ReportTeacher>((from, to) => supabase.from("teachers")
            .select("id, nome, funcao, ativo").order("id").range(from, to), "professores"),
    ])

    // Lotes pequenos de UUIDs para não exceder o tamanho da URL do PostgREST.
    const assignments: ReportAssignment[] = []
    for (let offset = 0; offset < sessions.length; offset += 100) {
        const ids = sessions.slice(offset, offset + 100).map((session) => session.id)
        assignments.push(...await readAll<ReportAssignment>((from, to) => supabase
            .from("class_session_teachers")
            .select("id, class_session_id, teacher_id")
            .in("class_session_id", ids)
            .order("id").range(from, to), "vínculos de professores"))
    }

    const studentsCount = filteredRoster.length
    const { male: maleCount, female: femaleCount, unknown: unknownGenderCount } = genderCounts(filteredRoster)
    const genderDistribution = [
        { label: "Masculino", count: maleCount, color: "bg-blue-500" },
        { label: "Feminino", count: femaleCount, color: "bg-violet-500" },
        { label: "Não informado / outro", count: unknownGenderCount, color: "bg-zinc-400" },
    ].map((item) => ({ ...item, percentage: studentsCount ? item.count / studentsCount * 100 : 0 }))

    const attendanceCount = attendanceRows.filter(r => r.present).length
    const absencesCount = attendanceRows.length - attendanceCount
    const classesCount = sessions.filter((session) => session.status === "realizada").length
    const canceledClassesCount = sessions.filter((session) => session.status === "cancelada").length
    const teachersCount = teachers.filter((teacher) => teacher.ativo).length

    // TAXA DE FREQUÊNCIA

    const totalAttendanceRecords =
        attendanceCount + absencesCount

    const attendanceRate =
        totalAttendanceRecords > 0
            ? (
                attendanceCount /
                totalAttendanceRecords
            ) * 100
            : 0

    // IDENTIFICAÇÃO DO PERÍODO

    const periodLabels: Record<string, string> = {
        mes: "Mês atual",
        trimestre: "Últimos 3 meses",
        ano: "Ano atual",
        personalizado: "Período personalizado",
    }

    const periodDescription =
        `${invalidCustomPeriod ? "Mês atual (datas inválidas)" : periodLabels[periodo]} · ${formatDisplayDate(periodStart)} até ${formatDisplayDate(addDays(periodEnd, -1))}`

    const additional = analytics(selectedStudents, attendanceRows, previousRows, sessions, periodStart, periodEnd, today)
    const exportTables = buildTables({ active: filteredRoster, a: additional, sessions, teachers, assignments, today,
        newStudents: newStudentsCount, presences: attendanceCount, absences: absencesCount })

    return (

        <PageShell>

            <PageHeader
                title="Relatórios"
                description="Indicadores e análises do projeto Skate no Cedin"
            />

            <div className="flex w-full min-w-0 flex-col gap-4 md:gap-6">

            <ReportsFilters
                key={JSON.stringify([periodo, turma, turno, params.dataInicio, params.dataFim])}
                periodo={periodo}
                turma={turma}
                turno={turno}
                turmas={turmas}
                dataInicio={params.dataInicio || periodStart}
                dataFim={params.dataFim || addDays(periodEnd, -1)}
                periodDescription={periodDescription}
                invalidCustomPeriod={invalidCustomPeriod}
            />

            {/* INDICADORES GERAIS */}

            <section className="w-full min-w-0">

                <div className="mb-3">

                    <h2 className="
                        text-base
                        md:text-lg
                        font-semibold
                        text-foreground
                    ">
                        Indicadores gerais
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        md:text-sm
                        text-muted
                    ">
                        Alunos e frequência por turma e turno; aulas por turno; professores do projeto.
                    </p>

                </div>

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-2
                    gap-2
                    sm:gap-3
                    xl:grid-cols-4
                ">

                    <StatCard
                        title="Alunos ativos"
                        value={studentsCount}
                        description="Cadastro atual"
                        icon={<Users className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Novos alunos"
                        value={newStudentsCount}
                        description="Cadastros no período"
                        icon={<UserPlus className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Professores ativos"
                        value={teachersCount}
                        description="Equipe do projeto"
                        icon={<BriefcaseBusiness className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Frequência"
                        value={totalAttendanceRecords ? `${attendanceRate.toFixed(1).replace(".", ",")}%` : "—"}
                        description={`${attendanceCount} presenças em ${totalAttendanceRecords} registros`}
                        icon={<Percent className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Presenças"
                        value={attendanceCount}
                        description="Registros de presença"
                        icon={<ClipboardCheck className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Faltas"
                        value={absencesCount}
                        description="Registros de ausência"
                        icon={<UserX className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Aulas realizadas"
                        value={classesCount}
                        description="No período e turno"
                        icon={<CalendarCheck className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Aulas canceladas"
                        value={canceledClassesCount}
                        description="No período e turno"
                        icon={<CalendarX className="h-5 w-5" />}
                    />

                </div>

            </section>

            {/* DISTRIBUIÇÃO POR GÊNERO */}

            <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">
                <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold md:text-lg">Distribuição por gênero</h2>
                        <p className="mt-1 text-xs text-muted md:text-sm">
                            Alunos ativos no cadastro atual, por turma e turno.
                        </p>
                    </div>
                    <Users className="h-5 w-5 shrink-0 text-primary" />
                </div>

                {studentsCount > 0 ? (
                    <>
                        <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                            {genderDistribution.map((item) => (
                                <div key={item.label} className={item.color} style={{ width: `${item.percentage}%` }} />
                            ))}
                        </div>
                        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3">
                            {genderDistribution.map((item, index) => (
                                <div key={item.label} className={`min-w-0 rounded-lg border border-border bg-background/60 p-2.5 sm:p-3 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
                                    <div className="flex min-w-0 items-center gap-1.5">
                                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} aria-hidden="true" />
                                        <p className="text-xs leading-tight text-muted [overflow-wrap:anywhere]">{item.label}</p>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <p className="text-xl font-black tabular-nums sm:text-2xl">{item.count}</p>
                                        <p className="text-xs tabular-nums text-muted">{item.percentage.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">Nenhum aluno ativo nos filtros selecionados.</p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted">
                    Total: {studentsCount} alunos ativos. O período não altera este indicador; M/Masculino e F/Feminino são reconhecidos; os demais valores ficam em Não informado / outro.
                </p>
            </GlassCard>

            <AgeReport students={filteredRoster} today={today} />

            <ProjectHoursReport sessions={sessions} />

            <TeachersReport sessions={sessions} teachers={teachers} assignments={assignments} />

            <AdditionalReports data={additional} />

            <ReportExport tables={exportTables} period={periodDescription} turma={turma} turno={turno} today={today} />

            </div>

        </PageShell>
    )
}
