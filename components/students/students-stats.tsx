"use client"

import type { Student }
    from "@/types/student"

import {
    Card,
    CardContent,
} from "@/components/ui/card"

import {
    Users,
    Sun,
    Moon,
    GraduationCap,
    Trophy,
    Cake,
} from "lucide-react"

type Props = {
    students: Student[]
}

export function StudentsStats({
    students,
}: Props) {

    const totalStudents =
        students.length

    const morningStudents =
        students.filter(
            (student) =>
                student.turno === "Manhã"
        ).length

    const afternoonStudents =
        students.filter(
            (student) =>
                student.turno === "Tarde"
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
                    (acc, student) =>
                        acc + student.idade,
                    0
                ) / students.length
            )
            : 0

    const items = [
        {
            title: "Total",
            value: totalStudents,
            icon: Users,
        },

        {
            title: "Manhã",
            value: morningStudents,
            icon: Sun,
        },

        {
            title: "Tarde",
            value: afternoonStudents,
            icon: Moon,
        },

        {
            title: "Idade Média",
            value: `${averageAge} anos`,
            icon: Cake,
        },

        {
            title: "Iniciantes",
            value: beginners,
            icon: GraduationCap,
        },

        {
            title: "Avançados",
            value: advanced,
            icon: Trophy,
        },
    ]

    return (

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">

            {items.map((item) => (

                <Card key={item.title}>

                    <CardContent className="flex items-center justify-between p-6">

                        <div>

                            <p className="text-sm text-muted-foreground">

                                {item.title}

                            </p>

                            <h3 className="mt-1 text-2xl font-bold">

                                {item.value}

                            </h3>

                        </div>

                        <div className="rounded-xl bg-primary/10 p-3">

                            <item.icon className="h-5 w-5 text-primary" />

                        </div>

                    </CardContent>

                </Card>
            ))}

        </div>
    )
}