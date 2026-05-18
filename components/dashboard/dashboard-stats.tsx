import {
    Users,
    UserCheck,
    TrendingUp,
    Award,
} from "lucide-react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"

type Props = {
    stats: {
        totalStudents: number

        activeStudents: number

        beginners: number

        advanced: number
    }
}

export function DashboardStats({
    stats,
}: Props) {

    const items = [
        {
            title: "Total de Alunos",

            value:
                stats.totalStudents,

            icon: Users,
        },

        {
            title: "Alunos Ativos",

            value:
                stats.activeStudents,

            icon: UserCheck,
        },

        {
            title: "Iniciantes",

            value:
                stats.beginners,

            icon: TrendingUp,
        },

        {
            title: "Avançados",

            value:
                stats.advanced,

            icon: Award,
        },
    ]

    return (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {items.map((item) => (

                <Card
                    key={item.title}
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

                                    {item.title}

                                </p>

                                <h3 className="
                  mt-3

                  text-4xl
                  font-black
                  tracking-tight

                  text-zinc-900
                ">

                                    {item.value}

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

                                <item.icon
                                    className="h-5 w-5"
                                />

                            </div>

                        </div>

                    </CardContent>

                </Card>
            ))}

        </div>
    )
}