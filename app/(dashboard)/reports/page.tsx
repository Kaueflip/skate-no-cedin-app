
import {
    BarChart3,
    CalendarDays,
    CalendarCheck,
    CalendarX,
    ClipboardCheck,
    FileSpreadsheet,
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

    // TURMAS DISPONÍVEIS

    const {
        data: students,
        error: turmasError,
    } = await supabase
        .from("students")
        .select("turma")
        .eq("ativo", true)
        .not("turma", "is", null)

    if (turmasError) {
        console.error("Erro ao carregar turmas:", turmasError)
        throw new Error("Não foi possível carregar as turmas.")
    }

    const turmas = Array.from(
        new Set(
            (students || [])
                .map((student) => student.turma)
                .filter(Boolean)
        )
    ).sort()

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

    // ALUNOS ATIVOS E DISTRIBUIÇÃO POR GÊNERO (CADASTRO ATUAL)

    function activeStudentsQuery(gender?: "M" | "F") {
        let query = supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("ativo", true)

        if (turma !== "todas") query = query.eq("turma", turma)

        if (turno === "Tarde") {
            query = query.in("turno", ["Tarde", "Integral"])
        } else if (turno !== "todos") {
            query = query.eq("turno", turno)
        }

        if (gender === "M") {
            query = query.or(
                "genero.ilike.M,genero.ilike.Masculino"
            )
        }

        if (gender === "F") {
            query = query.or(
                "genero.ilike.F,genero.ilike.Feminino"
            )
        }

        return query
    }

    const studentsQuery = activeStudentsQuery()
    const maleStudentsQuery = activeStudentsQuery("M")
    const femaleStudentsQuery = activeStudentsQuery("F")

    // NOVOS ALUNOS NO PERÍODO

    let newStudentsQuery = supabase
        .from("students")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("ativo", true)
        .gte(
            "created_at",
            `${periodStart}T00:00:00-03:00`
        )
        .lt(
            "created_at",
            `${periodEnd}T00:00:00-03:00`
        )

    if (turma !== "todas") {
        newStudentsQuery = newStudentsQuery.eq(
            "turma",
            turma
        )
    }

    if (turno === "Tarde") {
        newStudentsQuery = newStudentsQuery.in("turno", ["Tarde", "Integral"])
    } else if (turno !== "todos") {
        newStudentsQuery = newStudentsQuery.eq("turno", turno)
    }

    // PRESENÇAS NO PERÍODO

    let attendanceQuery = supabase
        .from("attendance")
        .select(
            "id, students!inner(turma, turno)",
            {
                count: "exact",
                head: true,
            }
        )
        .eq("present", true)
        .gte("class_date", periodStart)
        .lt("class_date", periodEnd)

    if (turma !== "todas") {
        attendanceQuery = attendanceQuery.eq(
            "students.turma",
            turma
        )
    }

    if (turno === "Tarde") {
        attendanceQuery = attendanceQuery.in("students.turno", ["Tarde", "Integral"])
    } else if (turno !== "todos") {
        attendanceQuery = attendanceQuery.eq("students.turno", turno)
    }

    // FALTAS NO PERÍODO

    let absencesQuery = supabase
        .from("attendance")
        .select(
            "id, students!inner(turma, turno)",
            {
                count: "exact",
                head: true,
            }
        )
        .eq("present", false)
        .gte("class_date", periodStart)
        .lt("class_date", periodEnd)

    if (turma !== "todas") {
        absencesQuery = absencesQuery.eq(
            "students.turma",
            turma
        )
    }

    if (turno === "Tarde") {
        absencesQuery = absencesQuery.in("students.turno", ["Tarde", "Integral"])
    } else if (turno !== "todos") {
        absencesQuery = absencesQuery.eq("students.turno", turno)
    }

    // AULAS REALIZADAS

    let classesQuery = supabase
        .from("class_sessions")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("status", "realizada")
        .gte("class_date", periodStart)
        .lt("class_date", periodEnd)

    if (turno !== "todos") {
        classesQuery = classesQuery.eq("turno", turno)
    }

    // AULAS CANCELADAS

    let canceledClassesQuery = supabase
        .from("class_sessions")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("status", "cancelada")
        .gte("class_date", periodStart)
        .lt("class_date", periodEnd)

    if (turno !== "todos") {
        canceledClassesQuery = canceledClassesQuery.eq(
            "turno",
            turno
        )
    }

    // PROFESSORES ATIVOS

    const teachersQuery = supabase
        .from("teachers")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("ativo", true)

    // EXECUÇÃO DAS CONSULTAS

    const [
        studentsResult,
        maleStudentsResult,
        femaleStudentsResult,
        newStudentsResult,
        attendanceResult,
        absencesResult,
        classesResult,
        canceledClassesResult,
        teachersResult,
    ] = await Promise.all([
        studentsQuery,
        maleStudentsQuery,
        femaleStudentsQuery,
        newStudentsQuery,
        attendanceQuery,
        absencesQuery,
        classesQuery,
        canceledClassesQuery,
        teachersQuery,
    ])

    const queryError = [
        studentsResult,
        maleStudentsResult,
        femaleStudentsResult,
        newStudentsResult,
        attendanceResult,
        absencesResult,
        classesResult,
        canceledClassesResult,
        teachersResult,
    ].find((result) => result.error)?.error

    if (queryError) {
        console.error("Erro ao carregar indicadores:", queryError)
        throw new Error("Não foi possível carregar os indicadores.")
    }

    // RESULTADOS

    const studentsCount = studentsResult.count || 0

    const maleCount = maleStudentsResult.count ?? 0
    const femaleCount = femaleStudentsResult.count ?? 0
    const unknownGenderCount = Math.max(0, studentsCount - maleCount - femaleCount)

    const genderDistribution = [
        { label: "Masculino", count: maleCount, color: "bg-blue-500" },
        { label: "Feminino", count: femaleCount, color: "bg-violet-500" },
        { label: "Não informado / outro", count: unknownGenderCount, color: "bg-zinc-400" },
    ].map((item) => ({
        ...item,
        percentage: studentsCount > 0 ? item.count / studentsCount * 100 : 0,
    }))

    const newStudentsCount = newStudentsResult.count || 0

    const attendanceCount = attendanceResult.count || 0

    const absencesCount = absencesResult.count || 0

    const classesCount = classesResult.count || 0

    const canceledClassesCount =
        canceledClassesResult.count || 0

    const teachersCount = teachersResult.count || 0

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
                            value={`${attendanceRate.toFixed(1).replace(".", ",")}%`}
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
                        Total: {studentsCount} alunos ativos. O período não altera este indicador; registros diferentes de M e F são agrupados em Não informado / outro.
                    </p>
                </GlassCard>

                {/* ANÁLISES */}

                <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">

                    <div className="flex items-center gap-2">

                        <BarChart3 className="h-5 w-5 text-muted" />

                        <h2 className="
                        text-base
                        md:text-lg
                        font-semibold
                        text-foreground
                    ">
                            Análises e gráficos
                        </h2>

                    </div>

                    <p className="
                    mt-2
                    text-sm
                    text-muted
                ">
                        Nesta seção serão adicionados os gráficos de frequência,
                        distribuição de alunos, aulas por turno e evolução pedagógica.
                    </p>

                </GlassCard>

                {/* EXPORTAÇÃO */}

                <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">

                    <div className="flex items-center gap-2">

                        <FileSpreadsheet className="h-5 w-5 text-muted" />

                        <h2 className="
                        text-base
                        md:text-lg
                        font-semibold
                        text-foreground
                    ">
                            Exportação de relatórios
                        </h2>

                    </div>

                    <p className="
                    mt-2
                    text-sm
                    text-muted
                ">
                        Os recursos de exportação em PDF, Excel e CSV serão
                        implementados nas próximas etapas.
                    </p>

                </GlassCard>

            </div>

        </PageShell>
    )
}
