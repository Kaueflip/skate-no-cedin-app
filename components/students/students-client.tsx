"use client"

import Image
    from "next/image"

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

import { Badge }
    from "@/components/ui/badge"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    StudentDetailsDialog,
} from "@/components/students/student-details-dialog"

type Props = {

    initialStudents:
    Student[]
}

export function StudentsClient({
    initialStudents,
}: Props) {

    const [search, setSearch] =
        useState("")

    const [
        selectedStudent,
        setSelectedStudent,
    ] = useState<Student | null>(
        null
    )

    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false)

    const students =
        useMemo(() => {

            return initialStudents.filter(
                (student) => {

                    const query =
                        search.toLowerCase()

                    return (
                        student.nome
                            ?.toLowerCase()
                            .includes(query) ||

                        student.turma
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

    function openStudent(
        student: Student
    ) {

        setSelectedStudent(
            student
        )

        setDetailsOpen(true)
    }

    return (

        <>

            <GlassCard
                className="
          overflow-hidden

          p-0
        "
            >

                <div className="
          flex
          flex-col
          gap-4

          border-b
          border-border

          p-6

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

                <Table>

                    <TableHeader>

                        <TableRow>

                            <TableHead>
                                Aluno
                            </TableHead>

                            <TableHead>
                                Turma
                            </TableHead>

                            <TableHead>
                                Turno
                            </TableHead>

                            <TableHead>
                                Nível
                            </TableHead>

                            <TableHead>
                                Responsável
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {students.map(
                            (student) => (

                                <TableRow
                                    key={student.id}
                                    onClick={() =>
                                        openStudent(
                                            student
                                        )
                                    }
                                    className="
                    cursor-pointer

                    transition-colors

                    hover:bg-black/5

                    dark:hover:bg-white/4
                  "
                                >

                                    <TableCell>

                                        <div className="
                      flex
                      items-center
                      gap-3
                    ">

                                            <div className="
                        relative

                        h-11
                        w-11

                        overflow-hidden

                        rounded-full

                        border
                        border-border

                        bg-input
                      ">

                                                {student.foto_url ? (

                                                    <Image
                                                        src={
                                                            student.foto_url
                                                        }
                                                        alt={
                                                            student.nome
                                                        }
                                                        fill
                                                        sizes="44px"
                                                        className="
                              object-cover
                            "
                                                    />

                                                ) : (

                                                    <div className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center

                            text-sm
                            font-semibold

                            text-muted
                          ">

                                                        {
                                                            student
                                                                .nome?.[0]
                                                        }

                                                    </div>
                                                )}

                                            </div>

                                            <div>

                                                <p className="
                          font-medium
                        ">

                                                    {student.nome}

                                                </p>

                                                <p className="
                          text-sm

                          text-muted
                        ">

                                                    {
                                                        student.idade
                                                    } anos

                                                </p>

                                            </div>

                                        </div>

                                    </TableCell>

                                    <TableCell>

                                        {student.turma}

                                    </TableCell>

                                    <TableCell>

                                        {student.turno}

                                    </TableCell>

                                    <TableCell>

                                        <Badge
                                            variant="secondary"
                                        >

                                            {student.nivel}

                                        </Badge>

                                    </TableCell>

                                    <TableCell>

                                        {
                                            student.responsavel_nome ||
                                            "-"
                                        }

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </GlassCard>

            <StudentDetailsDialog
                student={
                    selectedStudent
                }
                open={detailsOpen}
                onOpenChange={
                    setDetailsOpen
                }
            />

        </>
    )
}