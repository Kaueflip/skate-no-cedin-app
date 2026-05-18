import {
    Users,
    GraduationCap,
    UserCheck,
    Activity,
} from "lucide-react"

import { createClient }
    from "@/lib/supabase-server"

import { PageShell }
    from "@/components/layout/page-shell"

import { PageHeader }
    from "@/components/layout/page-header"

import { StatCard }
    from "@/components/dashboard/stat-card"

import { StudentsClient }
    from "@/components/students/students-client"

import {
    AddStudentButton,
}
    from "@/components/students/add-student-button"

export default async function StudentsPage() {

    const supabase =
        await createClient()

    const {
        data: students,
    } = await supabase
        .from("students")
        .select("*")
        .order("created_at", {
            ascending: false,
        })

    const totalStudents =
        students?.length || 0

    const basicStudents =
        students?.filter(
            (student) =>
                student.nivel ===
                "Básico"
        ).length || 0

    const activeStudents =
        students?.filter(
            (student) =>
                student.ativo !== false
        ).length || 0

    return (

        <PageShell>

            <PageHeader
                title="Alunos"
                description="
          Gerencie os alunos
          do projeto
        "
                action={

                    <AddStudentButton />
                }
            />

            <section className="
        grid
        gap-5

        md:grid-cols-2

        xl:grid-cols-4
      ">

                <StatCard
                    title="Total"

                    value={
                        totalStudents
                    }

                    icon={
                        <Users className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Nível Básico"

                    value={
                        basicStudents
                    }

                    icon={
                        <GraduationCap className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Ativos"

                    value={
                        activeStudents
                    }

                    icon={
                        <UserCheck className="
              h-5
              w-5
            " />
                    }
                />

                <StatCard
                    title="Frequência"

                    value="92%"

                    icon={
                        <Activity className="
              h-5
              w-5
            " />
                    }
                />

            </section>

            <div className="mt-8">

                <StudentsClient
                    initialStudents={
                        students || []
                    }
                />

            </div>

        </PageShell>
    )
}