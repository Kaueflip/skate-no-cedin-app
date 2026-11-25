
import {
    Users,
    ClipboardCheck,
    CalendarDays,
    UserX,
} from "lucide-react"

import { createClient } from "@/lib/supabase-server"

import {
    attachStudentPrimaryPhotos,
} from "@/services/student-photo-service"

import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { GlassCard } from "@/components/ui/glass-card"

import { BirthdaysToday } from "@/components/dashboard/birthdays-today"
import { BirthdaysMonth } from "@/components/dashboard/birthdays-month"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {

    const supabase = await createClient()

    // DATA ATUAL - FUSO DE BRASÍLIA

    const now = new Date()

    const dateParts = new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).formatToParts(now)

    const currentYear = Number(
        dateParts.find((part) => part.type === "year")?.value
    )

    const currentMonth = Number(
        dateParts.find((part) => part.type === "month")?.value
    )

    const currentDay = Number(
        dateParts.find((part) => part.type === "day")?.value
    )

    const currentMonthName = new Intl.DateTimeFormat(
        "pt-BR",
        {
            month: "long",
            timeZone: "America/Sao_Paulo",
        }
    ).format(now)

    // PERÍODO DO MÊS ATUAL

    const monthStart =
        `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`

    const nextMonthDate = new Date(
        Date.UTC(currentYear, currentMonth, 1)
    )

    const nextMonthStart = [
        nextMonthDate.getUTCFullYear(),
        String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0"),
        "01",
    ].join("-")

    // CONSULTAS EM PARALELO

    const [
        { count: studentsCount },
        { count: attendanceCount },
        { count: absencesCount },
        { count: classesCount },
        { data: students },
        { data: birthdayStudents },
    ] = await Promise.all([

        supabase
            .from("students")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("ativo", true),

        supabase
            .from("attendance")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("present", true)
            .gte("class_date", monthStart)
            .lt("class_date", nextMonthStart),

        supabase
            .from("attendance")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("present", false)
            .gte("class_date", monthStart)
            .lt("class_date", nextMonthStart),

        supabase
            .from("class_sessions")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "realizada")
            .gte("class_date", monthStart)
            .lt("class_date", nextMonthStart),

        supabase
            .from("students")
            .select("id, nome, turma, turno, nivel")
            .order("created_at", {
                ascending: false,
            })
            .limit(5),

        supabase
            .from("students")
            .select(`
                id,
                nome,
                turma,
                data_nascimento
            `)
            .eq("ativo", true)
            .not("data_nascimento", "is", null),

    ])

    // ANIVERSARIANTES

    const validBirthdayStudents = (
        birthdayStudents || []
    ).filter(
        (student): student is typeof student & {
            data_nascimento: string
        } => student.data_nascimento !== null
    )

    const birthdays = validBirthdayStudents
        .filter((student) => {

            const [, month] =
                student.data_nascimento.split("-").map(Number)

            return month === currentMonth

        })
        .sort((a, b) => {

            const dayA = Number(
                a.data_nascimento.split("-")[2]
            )

            const dayB = Number(
                b.data_nascimento.split("-")[2]
            )

            return dayA - dayB

        })

    const todayBirthdays = birthdays.filter(
        (student) =>
            Number(
                student.data_nascimento.split("-")[2]
            ) === currentDay
    )

    const todayBirthdaysWithPhotos =
        await attachStudentPrimaryPhotos(
            supabase,
            todayBirthdays
        )

    return (

        <PageShell>

            <PageHeader
                title="Dashboard"
                description="Visão geral do projeto Skate no Cedin"
            />

            <div className="
                flex
                w-full
                min-w-0
                flex-col
                gap-4
                md:gap-6
            ">

                {/* INDICADORES */}

                <section className="
                grid
                w-full
                min-w-0
                grid-cols-2
                gap-2
                sm:gap-3
                xl:grid-cols-4
                xl:gap-4
                ">

                    <StatCard
                        title="Alunos ativos"
                        value={studentsCount || 0}
                        icon={<Users className="h-4 w-4 md:h-5 md:w-5" />}
                    />

                    <StatCard
                        title="Presenças"
                        value={attendanceCount || 0}
                        description="Neste mês"
                        icon={<ClipboardCheck className="h-4 w-4 md:h-5 md:w-5" />}
                    />

                    <StatCard
                        title="Aulas realizadas"
                        value={classesCount || 0}
                        description="Neste mês"
                        icon={<CalendarDays className="h-4 w-4 md:h-5 md:w-5" />}
                    />

                    <StatCard
                        title="Faltas"
                        value={absencesCount || 0}
                        description="Neste mês"
                        icon={<UserX className="h-4 w-4 md:h-5 md:w-5" />}
                    />

                </section>

                {/* ANIVERSARIANTES */}

                <section className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    items-start
                    gap-3

                    lg:grid-cols-2
                    lg:gap-4
                ">

                    <BirthdaysToday
                        students={todayBirthdaysWithPhotos}
                        currentYear={currentYear}
                    />

                    <BirthdaysMonth
                        students={birthdays}
                        currentYear={currentYear}
                        currentMonth={currentMonth}
                        currentDay={currentDay}
                        monthName={currentMonthName}
                    />

                </section>

                {/* ÚLTIMOS ALUNOS */}

                <GlassCard className="
                    w-full
                    min-w-0
                    overflow-hidden
                    rounded-[10px]
                    p-0
                ">

                    <div className="
                        border-b
                        border-border
                        p-3
                        md:p-5
                    ">

                        <h2 className="
                            text-base
                            font-bold
                            text-foreground
                            md:text-lg
                        ">
                            Últimos alunos
                        </h2>

                        <p className="mt-1 text-xs text-muted md:text-sm">
                            Alunos cadastrados recentemente
                        </p>

                    </div>

                    {/* LISTAGEM MOBILE */}

                    <div className="divide-y divide-border md:hidden">

                        {students?.map((student) => (

                            <div
                                key={student.id}
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-3
                                    p-3
                                "
                            >

                                <div className="min-w-0 flex-1">

                                    <p className="
                                        break-words
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    ">
                                        {student.nome}
                                    </p>

                                    <p className="
                                        mt-1
                                        break-words
                                        text-xs
                                        leading-relaxed
                                        text-muted
                                    ">
                                        {student.turma}
                                    </p>

                                    <p className="mt-1 text-xs text-muted">
                                        {student.turno}
                                    </p>

                                </div>

                                <Badge
                                    variant="secondary"
                                    className="shrink-0 rounded-md text-[10px]"
                                >
                                    {student.nivel}
                                </Badge>

                            </div>

                        ))}

                    </div>

                    {/* TABELA DESKTOP */}

                    <div className="
                        hidden
                        w-full
                        min-w-0
                        overflow-x-auto
                        md:block
                    ">

                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Turno</TableHead>
                                    <TableHead>Nível</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {students?.map((student) => (

                                    <TableRow key={student.id}>

                                        <TableCell className="font-medium">
                                            {student.nome}
                                        </TableCell>

                                        <TableCell>
                                            {student.turma}
                                        </TableCell>

                                        <TableCell>
                                            {student.turno}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="secondary">
                                                {student.nivel}
                                            </Badge>
                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    </div>

                    {!students?.length && (
                        <div className="p-6 text-center text-sm text-muted">
                            Nenhum aluno cadastrado.
                        </div>
                    )}

                </GlassCard>

            </div>

        </PageShell>
    )
}
