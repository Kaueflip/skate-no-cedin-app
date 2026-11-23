
import {
    Users,
    ClipboardCheck,
    CalendarDays,
    UserX,
} from "lucide-react"

import { createClient } from "@/lib/supabase-server"

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

    const currentDay = Number(
        dateParts.find(
            (part) => part.type === "day"
        )?.value
    )

    const currentMonthName = new Intl.DateTimeFormat(
        "pt-BR",
        {
            month: "long",
            timeZone: "America/Sao_Paulo",
        }
    ).format(new Date())

    // TOTAL DE ALUNOS ATIVOS

    const {
        count: studentsCount,
    } = await supabase
        .from("students")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("ativo", true)

    // TOTAL DE PRESENÇAS

    const {
        count: attendanceCount,
    } = await supabase
        .from("attendance")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("present", true)

    // TOTAL DE FALTAS

    const {
        count: absencesCount,
    } = await supabase
        .from("attendance")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("present", false)

    // AULAS REALIZADAS NO MÊS

    const monthStart = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`

    const nextMonthDate = new Date(
        Date.UTC(currentYear, currentMonth, 1)
    )

    const nextMonthStart = [
        nextMonthDate.getUTCFullYear(),
        String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0"),
        "01",
    ].join("-")

    const {
        count: classesCount,
    } = await supabase
        .from("class_sessions")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("status", "realizada")
        .gte("class_date", monthStart)
        .lt("class_date", nextMonthStart)

    // ÚLTIMOS ALUNOS

    const {
        data: students,
    } = await supabase
        .from("students")
        .select("*")
        .limit(5)
        .order("created_at", {
            ascending: false,
        })

    // ANIVERSARIANTES

    const {
        data: birthdayStudents,
    } = await supabase
        .from("students")
        .select(`
            id,
            nome,
            turma,
            data_nascimento,
            foto_url
        `)
        .eq("ativo", true)
        .not("data_nascimento", "is", null)

    // REMOVE DATAS DE NASCIMENTO NULAS

    const validBirthdayStudents = (
        birthdayStudents || []
    ).filter(
        (
            student
        ): student is typeof student & {
            data_nascimento: string
        } => student.data_nascimento !== null
    )

    // ANIVERSARIANTES DO MÊS

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

    // ANIVERSARIANTES DE HOJE

    const todayBirthdays = birthdays.filter(
        (student) => {

            const day = Number(
                student.data_nascimento.split("-")[2]
            )

            return day === currentDay

        }
    )

    return (

        <PageShell>

            <PageHeader
                title="Dashboard"
                description="
                    Visão geral do projeto
                    Skate no Cedin
                "
            />

            {/* INDICADORES */}

            <section className="
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-4
            ">

                <StatCard
                    title="Alunos ativos"
                    value={studentsCount || 0}
                    icon={
                        <Users className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Presenças"
                    value={attendanceCount || 0}
                    description="registros realizados"
                    icon={
                        <ClipboardCheck className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Aulas realizadas"
                    value={classesCount || 0}
                    description="neste mês"
                    icon={
                        <CalendarDays className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Faltas"
                    value={absencesCount || 0}
                    description="registros de ausência"
                    icon={
                        <UserX className="h-5 w-5" />
                    }
                />

            </section>

            {/* ANIVERSARIANTES */}

            <section className="
                mt-8
                grid
                gap-5
                lg:grid-cols-2
            ">

                <BirthdaysToday
                    students={todayBirthdays}
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
                mt-8
                overflow-hidden
                p-0
            ">

                <div className="
                    border-b
                    border-border
                    p-6
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        text-foreground
                    ">
                        Últimos alunos
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-muted
                    ">
                        Alunos cadastrados recentemente
                    </p>

                </div>

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

            </GlassCard>

        </PageShell>
    )
}
