import {
    Users,
    Sun,
    Moon,
    Cake,
    GraduationCap,
    Trophy,
} from "lucide-react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"

import type { Student }
    from "@/types/student"

type Props = {
    students: Student[]
}

export function StudentsStats({
    students,
}: Props) {

    const morning =
        students.filter(
            (student) =>
                student.turno ===
                "Manhã"
        ).length

    const afternoon =
        students.filter(
            (student) =>
                student.turno ===
                "Tarde"
        ).length

    const beginners =
        students.filter(
            (student) =>
                student.nivel ===
                "Iniciante"
        ).length

    const advanced =
        students.filter(
            (student) =>
                student.nivel ===
                "Avançado"
        ).length

    const averageAge =
        students.length > 0
            ? Math.round(
                students.reduce(
                    (
                        acc,
                        student
                    ) =>
                        acc +
                        student.idade,
                    0
                ) /
                students.length
            )
            : 0

    const stats = [
        {
            title: "Total",

            value:
                students.length,

            icon: Users,
        },

        {
            title: "Manhã",

            value:
                morning,

            icon: Sun,
        },

        {
            title: "Tarde",

            value:
                afternoon,

            icon: Moon,
        },

        {
            title: "Idade Média",

            value: `${averageAge} anos`,

            icon: Cake,
        },

        {
            title: "Iniciantes",

            value:
                beginners,

            icon: GraduationCap,
        },

        {
            title: "Avançados",

            value:
                advanced,

            icon: Trophy,
        },
    ]

    return (

        <div className="
      grid
      gap-4

      sm:grid-cols-2

      xl:grid-cols-6
    ">

            {stats.map((stat) => (

                <Card
                    key={stat.title}
                    className="
            overflow-hidden

            rounded-[2rem]

            border
            border-white/40

            bg-white/70

            shadow-sm

            backdrop-blur-xl
          "
                >

                    <CardContent className="p-6">

                        <div className="
              flex
              items-start
              justify-between
            ">

                            <div>

                                <p className="
                  text-sm
                  text-zinc-500
                ">

                                    {stat.title}

                                </p>

                                <h3 className="
                  mt-3

                  text-4xl
                  font-black
                  tracking-tight

                  text-zinc-900
                ">

                                    {stat.value}

                                </h3>

                            </div>

                            <div
                                className="
                  rounded-2xl

                  bg-zinc-900

                  p-3

                  text-white
                "
                            >

                                <stat.icon
                                    className="
                    h-5
                    w-5
                  "
                                />

                            </div>

                        </div>

                    </CardContent>

                </Card>
            ))}

        </div>
    )
}