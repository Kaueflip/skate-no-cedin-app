import { createClient }
    from "@/lib/supabase-server"

import { DashboardHeader }
    from "@/components/dashboard/dashboard-header"

import { DashboardStats }
    from "@/components/dashboard/dashboard-stats"

export default async function DashboardPage() {

    const supabase =
        await createClient()

    const {
        data: students,
        error,
    } = await supabase
        .from("students")
        .select("*")

    if (error) {

        console.error(error)
    }

    const data =
        students || []

    const stats = {
        totalStudents:
            data.length,

        activeStudents:
            data.filter(
                (student) =>
                    student.ativo
            ).length,

        beginners:
            data.filter(
                (student) =>
                    student.nivel ===
                    "Iniciante"
            ).length,

        advanced:
            data.filter(
                (student) =>
                    student.nivel ===
                    "Avançado"
            ).length,
    }

    return (

        <div className="flex flex-col gap-6 p-6">

            <DashboardHeader />

            <DashboardStats
                stats={stats}
            />

        </div>
    )
}