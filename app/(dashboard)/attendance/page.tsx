import {
    CalendarDays,
} from "lucide-react"

import {
    createClient,
} from "@/lib/supabase-server"

import {
    AttendanceClient,
} from "@/components/attendance/attendance-client"

import {
    PageShell,
} from "@/components/layout/page-shell"

import {
    PageHeader,
} from "@/components/layout/page-header"

export default async function AttendancePage() {

    const supabase =
        await createClient()

    const today =
        new Date()
            .toLocaleDateString(
                "en-CA",
                {
                    timeZone:
                        "America/Sao_Paulo",
                }
            )

    const {
        data: students,
    } = await supabase
        .from("students")
        .select("*")
        .order("nome")

    const {
        data: attendance,
    } = await supabase
        .from("attendance")
        .select("*")
        .eq(
            "class_date",
            today
        )

    const attendanceMap =
        (attendance || []).reduce(

            (acc, item) => {

                acc[item.student_id] =
                    item.present

                return acc
            },

            {} as Record<
                string,
                boolean
            >
        )

    return (

        <PageShell>

            <PageHeader
                title="Frequência"
                description="
          Marque os alunos presentes
          nas aulas do projeto
        "
                icon={
                    <CalendarDays
                        className="
              h-5
              w-5
            "
                    />
                }
            />

            <div className="
        mt-8
      ">

                <AttendanceClient
                    students={
                        students || []
                    }
                    initialAttendanceMap={
                        attendanceMap
                    }
                    initialDate={today}
                />

            </div>

        </PageShell>
    )
}