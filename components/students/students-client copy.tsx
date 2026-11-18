"use client"

import {
    useMemo,
    useState,
} from "react"

import {
    Search,
    Download,
} from "lucide-react"

import type {
    Student,
} from "@/types/student"

import { GlassCard }
    from "@/components/ui/glass-card"

import { Input }
    from "@/components/ui/input"

import { AppButton }
    from "@/components/ui/app-button"

import {
    StudentsTable,
} from "@/components/students/students-table"

type Props = {

    initialStudents:
    Student[]
}

export function StudentsClient({
    initialStudents,
}: Props) {

    const [search, setSearch] =
        useState("")

    const students =
        useMemo(() => {

            return initialStudents.filter(
                (student) => {

                    const query =
                        search.toLowerCase()

                    return (

                        student.nome
                            ?.toLowerCase()
                            .includes(query)

                        ||

                        student.turma
                            ?.toLowerCase()
                            .includes(query)

                        ||

                        student.turno
                            ?.toLowerCase()
                            .includes(query)

                        ||

                        student.nivel
                            ?.toLowerCase()
                            .includes(query)
                    )
                }
            )

        }, [
            initialStudents,
            search,
        ])

    function exportStudentsCSV() {

        const headers = [

            "Nome",

            "Turma",

            "Turno",

            "Nível",

            "Responsável",

            "Contato",
        ]

        const rows =
            students.map(
                (student) => [

                    student.nome,

                    student.turma,

                    student.turno,

                    student.nivel,

                    student.responsavel_nome || "",

                    student.responsavel_contato || "",
                ]
            )

        const csvContent = [

            headers.join(","),

            ...rows.map(
                (row) =>
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

        <div className="
            flex
            flex-col
            gap-6
        ">

            <GlassCard
                className="
                    p-6
                "
            >

                <div className="
                    flex
                    flex-col
                    gap-4

                    md:flex-row
                    md:items-center
                    md:justify-between
                ">

                    <div className="
                        relative

                        w-full

                        md:max-w-sm
                    ">

                        <Search
                            className="
                                absolute
                                left-4
                                top-1/2

                                h-4
                                w-4

                                -translate-y-1/2

                                text-muted
                            "
                        />

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                Buscar alunos...
                            "
                            className="
                                pl-11
                            "
                        />

                    </div>

                    <AppButton
                        variant="secondary"
                        onClick={
                            exportStudentsCSV
                        }
                    >

                        <Download
                            className="
                                h-4
                                w-4
                            "
                        />

                        Exportar CSV

                    </AppButton>

                </div>

            </GlassCard>

            <StudentsTable
                students={students}
            />

        </div>
    )
}