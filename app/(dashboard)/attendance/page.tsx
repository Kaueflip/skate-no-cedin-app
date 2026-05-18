import { createClient }
    from "@/lib/supabase-server"

import { AttendanceClient }
    from "@/components/attendance/attendance-client"

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

        <main className="
      min-h-screen

      bg-[#e5e8f7]

      bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_35%)]
    ">

            <div className="
        flex
        flex-col
        gap-8

        p-6

        lg:p-10
      ">

                <div>

                    {/*          <p className="
            text-sm
            font-semibold
            uppercase

            tracking-[0.25em]

            text-zinc-500
          ">

                        Controle de Presença

                    </p> */}

                    <h1 className="
            mt-2

            text-4xl
            font-black
            tracking-tight

            text-zinc-900
          ">

                        Frequência

                    </h1>

                    <p className="
            mt-3

            text-lg
            text-zinc-600
          ">

                        Marque os alunos presentes no dia

                    </p>

                </div>

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

        </main>
    )
}