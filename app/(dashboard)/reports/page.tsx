
import {
    BarChart3,
    CalendarDays,
    CalendarCheck,
    CalendarX,
    ClipboardCheck,
    FileSpreadsheet,
    Filter,
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
    } = await supabase
        .from("students")
        .select("turma")
        .eq("ativo", true)
        .not("turma", "is", null)

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

    const turma = params.turma || "todas"

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

        const validStart =
            /^\d{4}-\d{2}-\d{2}$/.test(
                params.dataInicio || ""
            )

        const validEnd =
            /^\d{4}-\d{2}-\d{2}$/.test(
                params.dataFim || ""
            )

        if (
            validStart &&
            validEnd &&
            params.dataInicio! <= params.dataFim!
        ) {

            periodStart = params.dataInicio!
            periodEnd = addDays(params.dataFim!, 1)

        }

    }

    // CONSULTA DE ALUNOS ATIVOS

    let studentsQuery = supabase
        .from("students")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("ativo", true)

    if (turma !== "todas") {
        studentsQuery = studentsQuery.eq("turma", turma)
    }

    if (turno !== "todos") {
        studentsQuery = studentsQuery.eq("turno", turno)
    }

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

    if (turno !== "todos") {
        newStudentsQuery = newStudentsQuery.eq(
            "turno",
            turno
        )
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

    if (turno !== "todos") {
        attendanceQuery = attendanceQuery.eq(
            "students.turno",
            turno
        )
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

    if (turno !== "todos") {
        absencesQuery = absencesQuery.eq(
            "students.turno",
            turno
        )
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
        newStudentsResult,
        attendanceResult,
        absencesResult,
        classesResult,
        canceledClassesResult,
        teachersResult,
    ] = await Promise.all([
        studentsQuery,
        newStudentsQuery,
        attendanceQuery,
        absencesQuery,
        classesQuery,
        canceledClassesQuery,
        teachersQuery,
    ])

    // RESULTADOS

    const studentsCount = studentsResult.count || 0

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
        `${periodLabels[periodo]} · ${periodStart} até ${addDays(periodEnd, -1)}`

    return (

        <PageShell>

            <PageHeader
                title="Relatórios"
                description="Indicadores e análises do projeto Skate no Cedin"
            />

            {/* FILTROS */}

            <GlassCard className="p-6">

                <div className="
                    mb-5
                    flex
                    items-center
                    gap-2
                ">

                    <Filter className="h-5 w-5 text-muted" />

                    <h2 className="
                        text-base
                        font-semibold
                        text-foreground
                    ">
                        Filtros dos relatórios
                    </h2>

                </div>

                <form
                    method="GET"
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <div className="space-y-2">

                        <label
                            htmlFor="periodo"
                            className="text-sm font-medium text-foreground"
                        >
                            Período
                        </label>

                        <select
                            id="periodo"
                            name="periodo"
                            defaultValue={periodo}
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-card
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                focus:ring-2
                                focus:ring-ring
                            "
                        >
                            <option value="mes">Mês atual</option>
                            <option value="trimestre">Últimos 3 meses</option>
                            <option value="ano">Ano atual</option>
                            <option value="personalizado">Personalizado</option>
                        </select>

                    </div>

                    <div className="space-y-2">

                        <label
                            htmlFor="turma"
                            className="text-sm font-medium text-foreground"
                        >
                            Turma
                        </label>

                        <select
                            id="turma"
                            name="turma"
                            defaultValue={turma}
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-card
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                focus:ring-2
                                focus:ring-ring
                            "
                        >

                            <option value="todas">
                                Todas as turmas
                            </option>

                            {turmas.map((item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="space-y-2">

                        <label
                            htmlFor="turno"
                            className="text-sm font-medium text-foreground"
                        >
                            Turno
                        </label>

                        <select
                            id="turno"
                            name="turno"
                            defaultValue={turno}
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-card
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                focus:ring-2
                                focus:ring-ring
                            "
                        >

                            <option value="todos">
                                Todos os turnos
                            </option>

                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>

                        </select>

                    </div>

                    <div className="flex items-end">

                        <button
                            type="submit"
                            className="
                                h-11
                                w-full
                                rounded-xl
                                bg-primary
                                px-5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                transition
                                hover:opacity-90
                            "
                        >
                            Aplicar filtros
                        </button>

                    </div>

                    {periodo === "personalizado" && (

                        <div className="
                            grid
                            gap-4
                            md:col-span-2
                            xl:col-span-4
                            md:grid-cols-2
                        ">

                            <div className="space-y-2">

                                <label
                                    htmlFor="dataInicio"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Data inicial
                                </label>

                                <input
                                    type="date"
                                    id="dataInicio"
                                    name="dataInicio"
                                    defaultValue={params.dataInicio}
                                    required
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-border
                                        bg-card
                                        px-3
                                        text-sm
                                        text-foreground
                                        outline-none
                                        focus:ring-2
                                        focus:ring-ring
                                    "
                                />

                            </div>

                            <div className="space-y-2">

                                <label
                                    htmlFor="dataFim"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Data final
                                </label>

                                <input
                                    type="date"
                                    id="dataFim"
                                    name="dataFim"
                                    defaultValue={params.dataFim}
                                    required
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-border
                                        bg-card
                                        px-3
                                        text-sm
                                        text-foreground
                                        outline-none
                                        focus:ring-2
                                        focus:ring-ring
                                    "
                                />

                            </div>

                        </div>

                    )}

                </form>

                <p className="
                    mt-4
                    text-xs
                    text-muted
                ">
                    {periodDescription}
                </p>

            </GlassCard>

            {/* INDICADORES GERAIS */}

            <section className="mt-8">

                <div className="mb-5">

                    <h2 className="
                        text-lg
                        font-semibold
                        text-foreground
                    ">
                        Indicadores gerais
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-muted
                    ">
                        Resultados conforme os filtros selecionados
                    </p>

                </div>

                <div className="
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-4
                ">

                    <StatCard
                        title="Alunos ativos"
                        value={studentsCount}
                        description="Alunos dentro dos filtros selecionados"
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
                        description="Equipe cadastrada"
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
                        description="Aulas concluídas no período"
                        icon={<CalendarCheck className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Aulas canceladas"
                        value={canceledClassesCount}
                        description="Aulas canceladas no período"
                        icon={<CalendarX className="h-5 w-5" />}
                    />

                </div>

            </section>

            {/* ANÁLISES */}

            <GlassCard className="mt-8 p-6">

                <div className="flex items-center gap-2">

                    <BarChart3 className="h-5 w-5 text-muted" />

                    <h2 className="
                        text-lg
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

            <GlassCard className="mt-5 p-6">

                <div className="flex items-center gap-2">

                    <FileSpreadsheet className="h-5 w-5 text-muted" />

                    <h2 className="
                        text-lg
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

        </PageShell>
    )
}
