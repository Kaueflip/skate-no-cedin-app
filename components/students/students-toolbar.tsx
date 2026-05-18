"use client"

import type { Student }
    from "@/types/student"

import {
    Download,
    Users,
} from "lucide-react"

import { Button }
    from "@/components/ui/button"

type Props = {
    students: Student[]
}

export function StudentsToolbar({
    students,
}: Props) {

    function exportStudents() {

        const headers = [
            "Nome",
            "Idade",
            "Turma",
            "Turno",
            "Nível",
            "Responsável",
            "Contato",
        ]

        const rows = students.map(
            (student) => [
                student.nome,

                student.idade,

                student.turma,

                student.turno,

                student.nivel,

                student.responsavel_nome || "",

                student.responsavel_contato || "",
            ]
        )

        const csvContent = [
            headers.join(","),

            ...rows.map((row) =>
                row.join(",")
            ),
        ].join("\n")

        const blob =
            new Blob(
                [
                    "\uFEFF",
                    csvContent,
                ],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            )

        const url =
            URL.createObjectURL(
                blob
            )

        const a =
            document.createElement(
                "a"
            )

        a.href = url

        a.download =
            "alunos.csv"

        a.click()

        URL.revokeObjectURL(
            url
        )
    }

    return (

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <Users className="h-4 w-4" />

                <span>

                    {students.length} alunos carregados

                </span>

            </div>

            <div className="flex items-center gap-2">

                <Button
                    variant="outline"
                    onClick={exportStudents}
                >

                    <Download className="mr-2 h-4 w-4" />

                    Exportar CSV

                </Button>

            </div>

        </div>
    )
}