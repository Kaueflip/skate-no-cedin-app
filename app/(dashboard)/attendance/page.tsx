
import { createClient } from "@/lib/supabase-server"

import {
    AttendanceClient,
} from "@/components/attendance/attendance-client"

import {
    PageShell,
} from "@/components/layout/page-shell"

import {
    PageHeader,
} from "@/components/layout/page-header"

import {
    attachStudentPrimaryPhotos,
} from "@/services/student-photo-service"

export default async function AttendancePage() {

    const supabase = await createClient()

    // DATA ATUAL - FUSO DE BRASÍLIA

    const today = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(new Date())

    // CONSULTAS EM PARALELO

    const [
        {
            data: students,
            error: studentsError,
        },
        {
            data: attendance,
            error: attendanceError,
        },
    ] = await Promise.all([

        supabase
            .from("students")
            .select("*")
            .eq("ativo", true)
            .order("nome", {
                ascending: true,
            }),

        supabase
            .from("attendance")
            .select("student_id, present")
            .eq("class_date", today),

    ])

    if (studentsError) {

        console.error(
            "Erro ao carregar alunos:",
            studentsError
        )

        throw new Error(
            "Não foi possível carregar os alunos."
        )
    }

    if (attendanceError) {

        console.error(
            "Erro ao carregar frequência:",
            attendanceError
        )

        throw new Error(
            "Não foi possível carregar a frequência."
        )
    }

    // MINIATURAS DOS ALUNOS

    const studentsWithPhotos =
        await attachStudentPrimaryPhotos(
            supabase,
            students || []
        )

    // MAPA DE FREQUÊNCIA

    const attendanceMap =
        (attendance || []).reduce(

            (acc, item) => {

                acc[item.student_id] =
                    item.present

                return acc
            },

            {} as Record<string, boolean>
        )

    return (

        <PageShell>

            <PageHeader
                title="Frequência"
                description="Registre a presença dos alunos nas aulas."
            />

            <div className="
                w-full
                min-w-0
            ">

                <AttendanceClient
                    students={studentsWithPhotos}
                    initialAttendanceMap={attendanceMap}
                    initialDate={today}
                />

            </div>

        </PageShell>
    )
}
