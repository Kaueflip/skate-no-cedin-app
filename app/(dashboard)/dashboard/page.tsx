import {
    Users,
    CalendarCheck,
    TrendingUp,
    BarChart3,
    Cake,
    CalendarDays,
} from "lucide-react"

import { createClient }
    from "@/lib/supabase-server"

import { PageShell }
    from "@/components/layout/page-shell"

import { PageHeader }
    from "@/components/layout/page-header"

import { StatCard }
    from "@/components/dashboard/stat-card"

import { GlassCard }
    from "@/components/ui/glass-card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge }
    from "@/components/ui/badge"

import Link from "next/link"

import Image from "next/image"

export default async function DashboardPage() {

    const supabase =
        await createClient()

    const {
        count: studentsCount,
    } = await supabase
        .from("students")
        .select("*", {
            count: "exact",
            head: true,
        })

    const {
        count: attendanceCount,
    } = await supabase
        .from("attendance")
        .select("*", {
            count: "exact",
            head: true,
        })

    const {
        data: students,
    } = await supabase
        .from("students")
        .select("*")
        .limit(5)
        .order("created_at", {
            ascending: false,
        })

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

    // Data atual no fuso horário de Brasília

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

    // Filtra e organiza os aniversariantes

    const birthdays = (birthdayStudents || [])
        .filter((student) => {
            if (!student.data_nascimento) return false

            const [, month, day] =
                student.data_nascimento.split("-").map(Number)

            return (
                month === currentMonth &&
                day >= 1 &&
                day <= 31
            )
        })
        .sort((a, b) => {
            const dayA = Number(
                a.data_nascimento?.split("-")[2]
            )

            const dayB = Number(
                b.data_nascimento?.split("-")[2]
            )

            return dayA - dayB
        })

    const todayBirthdays = birthdays.filter(
        (student) => {
            const day = Number(
                student.data_nascimento?.split("-")[2]
            )

            return day === currentDay
        }
    )

    const currentMonthName = new Intl.DateTimeFormat(
        "pt-BR",
        {
            month: "long",
            timeZone: "America/Sao_Paulo",
        }
    ).format(new Date())

    return (

        <PageShell>

            <PageHeader
                title="Dashboard"
                description="
          Visão geral do projeto
          Skate no Cedin
        "
            />

            <section className="
        grid
        gap-5

        md:grid-cols-2

        xl:grid-cols-4
      ">

                <StatCard
                    title="Alunos"

                    value={
                        studentsCount || 0
                    }

                    icon={
                        <Users className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Presenças"

                    value={
                        attendanceCount || 0
                    }

                    icon={
                        <CalendarCheck className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Evolução"

                    value="87%"

                    description="
            média geral
          "

                    icon={
                        <TrendingUp className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Relatórios"

                    value="12"

                    description="
            este mês
          "

                    icon={
                        <BarChart3 className="
              h-5
              w-5
            " />
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

                {/* ANIVERSARIANTES DE HOJE */}

                <GlassCard className="p-6">

                    <div className="
            mb-5

            flex
            items-center
            justify-between
        ">

                        <div>

                            <h2 className="
                    text-xl
                    font-bold
                ">
                                Aniversariantes de hoje
                            </h2>

                            <p className="
                    mt-1
                    text-sm
                    text-muted
                ">
                                Alunos que fazem aniversário hoje
                            </p>

                        </div>

                        <div className="
                rounded-2xl
                bg-primary/10
                p-3
                text-primary
            ">

                            <Cake className="h-6 w-6" />

                        </div>

                    </div>

                    {todayBirthdays.length > 0 ? (

                        <div className="space-y-3">

                            {todayBirthdays.map((student) => {

                                const birthYear = Number(
                                    student.data_nascimento?.split("-")[0]
                                )

                                const age = currentYear - birthYear

                                return (

                                    <Link
                                        key={student.id}
                                        href={`/students/${student.id}`}
                                        className="
                                flex
                                items-center
                                justify-between
                                gap-3

                                rounded-2xl
                                border
                                border-border
                                bg-background/60

                                p-4

                                transition-colors
                                hover:bg-accent
                            "
                                    >

                                        <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                            <div className="
    relative
    h-12
    w-12
    shrink-0
    overflow-hidden
    rounded-full
    border
    border-border
    bg-primary/10
">

                                                {student.foto_url ? (

                                                    <Image
                                                        src={student.foto_url}
                                                        alt={student.nome}
                                                        fill
                                                        sizes="150px"
                                                        className="object-cover"
                                                    />

                                                ) : (

                                                    <div className="
            flex
            h-full
            w-full
            items-center
            justify-center
            font-bold
            text-primary
        ">
                                                        {student.nome.charAt(0).toUpperCase()}
                                                    </div>

                                                )}

                                            </div>

                                            <div>

                                                <p className="font-semibold">
                                                    {student.nome}
                                                </p>

                                                <p className="
                                        text-sm
                                        text-muted
                                    ">
                                                    Turma {student.turma}
                                                </p>

                                            </div>

                                        </div>

                                        <Badge variant="secondary">
                                            {age} anos
                                        </Badge>

                                    </Link>

                                )
                            })}

                        </div>

                    ) : (

                        <div className="
                rounded-2xl
                border
                border-dashed
                border-border

                p-8

                text-center
                text-sm
                text-muted
            ">
                            Nenhum aluno faz aniversário hoje.
                        </div>

                    )}

                </GlassCard>


                {/* ANIVERSARIANTES DO MÊS */}

                <GlassCard className="p-6">

                    <div className="
            mb-5

            flex
            items-center
            justify-between
        ">

                        <div>

                            <h2 className="
                    text-xl
                    font-bold
                    capitalize
                ">
                                Aniversariantes de {currentMonthName}
                            </h2>

                            <p className="
                    mt-1
                    text-sm
                    text-muted
                ">
                                Todos os aniversários deste mês
                            </p>

                        </div>

                        <div className="
                rounded-2xl
                bg-primary/10
                p-3
                text-primary
            ">

                            <CalendarDays className="h-6 w-6" />

                        </div>

                    </div>

                    {birthdays.length > 0 ? (

                        <div className="
                max-h-80
                space-y-2
                overflow-y-auto
                pr-1
            ">

                            {birthdays.map((student) => {

                                const [, , day] =
                                    student.data_nascimento!.split("-")

                                const birthYear = Number(
                                    student.data_nascimento!.split("-")[0]
                                )

                                const age = currentYear - birthYear

                                const isToday =
                                    Number(day) === currentDay

                                return (

                                    <Link
                                        key={student.id}
                                        href={`/students/${student.id}`}
                                        className="
                                flex
                                items-center
                                justify-between
                                gap-3

                                rounded-xl
                                p-3

                                transition-colors
                                hover:bg-accent
                            "
                                    >

                                        <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                            <div className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    flex-col
                                    items-center
                                    justify-center

                                    rounded-xl

                                    border
                                    border-border

                                    bg-background
                                ">

                                                <span className="
                                        text-lg
                                        font-bold
                                        leading-none
                                    ">
                                                    {day}
                                                </span>

                                                <span className="
                                        mt-1
                                        text-[10px]
                                        uppercase
                                        text-muted
                                    ">
                                                    {currentMonthName.slice(0, 3)}
                                                </span>

                                            </div>

                                            <div>

                                                <p className="font-semibold">
                                                    {student.nome}
                                                </p>

                                                <p className="
                                        text-sm
                                        text-muted
                                    ">
                                                    Turma {student.turma}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="
                                flex
                                flex-col
                                items-end
                                gap-1
                            ">

                                            <span className="
                                    text-sm
                                    font-semibold
                                ">
                                                {age} anos
                                            </span>

                                            {isToday && (
                                                <Badge>
                                                    Hoje
                                                </Badge>
                                            )}

                                        </div>

                                    </Link>

                                )
                            })}

                        </div>

                    ) : (

                        <div className="
                rounded-2xl
                border
                border-dashed
                border-border

                p-8

                text-center
                text-sm
                text-muted
            ">
                            Nenhum aniversariante neste mês.
                        </div>

                    )}

                </GlassCard>

            </section>

            <GlassCard
                className="
          mt-8

          overflow-hidden

          p-0
        "
            >

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

                            <TableHead>
                                Nome
                            </TableHead>

                            <TableHead>
                                Turma
                            </TableHead>

                            <TableHead>
                                Turno
                            </TableHead>

                            <TableHead>
                                Nível
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {students?.map(
                            (student) => (

                                <TableRow
                                    key={student.id}
                                >

                                    <TableCell
                                        className="
                      font-medium
                    "
                                    >

                                        {student.nome}

                                    </TableCell>

                                    <TableCell>

                                        {student.turma}

                                    </TableCell>

                                    <TableCell>

                                        {student.turno}

                                    </TableCell>

                                    <TableCell>

                                        <Badge
                                            variant="secondary"
                                        >

                                            {student.nivel}

                                        </Badge>

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </GlassCard>

        </PageShell>
    )
}