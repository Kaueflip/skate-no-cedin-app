import {
    Users,
    CalendarCheck,
    TrendingUp,
    BarChart3,
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