import { createClient }
    from "@/lib/supabase-server"

import { DashboardHeader }
    from "@/components/dashboard/dashboard-header"

import { DashboardStats }
    from "@/components/dashboard/dashboard-stats"

import { AppButton }
    from "@/components/ui/app-button"

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

                <div className="
          flex
          flex-col
          gap-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        ">

                    <DashboardHeader />

                    <div className="flex gap-3">

                        <AppButton>

                            Novo Aluno

                        </AppButton>

                    </div>

                </div>

                <DashboardStats
                    stats={stats}
                />

                <section className="
          grid
          gap-6

          lg:grid-cols-3
        ">

                    <div className="
            rounded-[2rem]

            border
            border-white/40

            bg-white/70

            p-8

            shadow-sm

            backdrop-blur-xl

            lg:col-span-2
          ">

                        <div className="
              flex
              items-center
              justify-between
            ">

                            <div>

                                <h2 className="
                  text-2xl
                  font-black
                  tracking-tight

                  text-zinc-900
                ">

                                    Atividade recente

                                </h2>

                                <p className="
                  mt-1
                  text-zinc-500
                ">

                                    Últimos alunos cadastrados

                                </p>

                            </div>

                        </div>

                        <div className="
              mt-8
              flex
              flex-col
              gap-4
            ">

                            {data
                                .slice(0, 5)
                                .map((student) => (

                                    <div
                                        key={student.id}
                                        className="
                      flex
                      items-center
                      justify-between

                      rounded-2xl

                      border
                      border-white/40

                      bg-white/60

                      p-4

                      backdrop-blur-xl
                    "
                                    >

                                        <div>

                                            <p className="
                        font-semibold
                        text-zinc-900
                      ">

                                                {student.nome}

                                            </p>

                                            <p className="
                        text-sm
                        text-zinc-500
                      ">

                                                {student.nivel}

                                            </p>

                                        </div>

                                        <div className="
                      rounded-xl

                      bg-zinc-900

                      px-3
                      py-1

                      text-sm
                      font-medium

                      text-white
                    ">

                                            {student.turno}

                                        </div>

                                    </div>
                                ))}

                        </div>

                    </div>

                    <div className="
            rounded-[2rem]

            border
            border-white/40

            bg-white/70

            p-8

            shadow-sm

            backdrop-blur-xl
          ">

                        <h2 className="
              text-2xl
              font-black
              tracking-tight

              text-zinc-900
            ">

                            Resumo

                        </h2>

                        <p className="
              mt-1
              text-zinc-500
            ">

                            Informações rápidas

                        </p>

                        <div className="
              mt-8
              flex
              flex-col
              gap-4
            ">

                            <div className="
                rounded-2xl

                bg-white/60

                p-5
              ">

                                <p className="
                  text-sm
                  text-zinc-500
                ">

                                    Total de alunos

                                </p>

                                <h3 className="
                  mt-2

                  text-4xl
                  font-black

                  text-zinc-900
                ">

                                    {stats.totalStudents}

                                </h3>

                            </div>

                            <div className="
                rounded-2xl

                bg-white/60

                p-5
              ">

                                <p className="
                  text-sm
                  text-zinc-500
                ">

                                    Alunos ativos

                                </p>

                                <h3 className="
                  mt-2

                  text-4xl
                  font-black

                  text-zinc-900
                ">

                                    {stats.activeStudents}

                                </h3>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    )
}