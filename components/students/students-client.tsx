
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
    initialStudents: Student[]
}

type StatusFilter = "todos" | "ativos" | "inativos"

export function StudentsClient({
    initialStudents,
}: Props) {

    const [search, setSearch] = useState("")

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ativos")

    const students = useMemo(() => {

        return initialStudents.filter((student) => {

            const query = search.toLowerCase()

            const matchesSearch =
                student.nome?.toLowerCase().includes(query) ||
                student.turma?.toLowerCase().includes(query) ||
                student.turno?.toLowerCase().includes(query) ||
                student.nivel?.toLowerCase().includes(query)

            const isActive = student.ativo !== false

            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativos" && isActive) ||
                (statusFilter === "inativos" && !isActive)

            return matchesSearch && matchesStatus
        })

    }, [
        initialStudents,
        search,
        statusFilter,
    ])

    function exportStudentsCSV() {

        const headers = [
            "Nome",
            "Turma",
            "Turno",
            "Nível",
            "Situação",
            "Responsável",
            "Contato",
        ]

        const rows = students.map((student) => [

            student.nome,
            student.turma,
            student.turno,
            student.nivel,
            student.ativo !== false ? "Ativo" : "Inativo",
            student.responsavel_nome || "",
            student.responsavel_contato || "",
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((value) =>
                    `"${String(value).replace(/"/g, '""')}"`
                ).join(",")
            ),
        ].join("\n")

        const blob = new Blob(
            [
                "\uFEFF",
                csvContent,
            ],
            {
                type: "text/csv;charset=utf-8;",
            }
        )

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")

        a.href = url
        a.download = "alunos.csv"

        a.click()

        URL.revokeObjectURL(url)
    }

    const filters: {
        label: string
        value: StatusFilter
        count: number
    }[] = [

            {
                label: "Todos",
                value: "todos",
                count: initialStudents.length,
            },

            {
                label: "Ativos",
                value: "ativos",
                count: initialStudents.filter(
                    (student) => student.ativo !== false
                ).length,
            },

            {
                label: "Inativos",
                value: "inativos",
                count: initialStudents.filter(
                    (student) => student.ativo === false
                ).length,
            },
        ]

    return (

        <div className="
            flex
            flex-col
            gap-6
        ">

            <GlassCard className="p-6">

                <div className="
                    flex
                    flex-col
                    gap-5
                ">

                    {/* BUSCA E EXPORTAÇÃO */}

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

                            <Search className="
                                absolute
                                left-4
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted
                            " />

                            <Input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Buscar alunos..."
                                className="pl-11"
                            />

                        </div>

                        <AppButton
                            variant="secondary"
                            onClick={exportStudentsCSV}
                        >

                            <Download className="h-4 w-4" />

                            Exportar CSV

                        </AppButton>

                    </div>

                    {/* FILTROS DE SITUAÇÃO */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    ">

                        {filters.map((filter) => {

                            const selected =
                                statusFilter === filter.value

                            return (

                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() =>
                                        setStatusFilter(filter.value)
                                    }
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition-colors

                                        ${selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-muted/10 text-foreground hover:bg-muted/20"
                                        }
                                    `}
                                >

                                    {filter.label}

                                    <span className={`
                                        rounded-md
                                        px-1.5
                                        py-0.5
                                        text-xs

                                      ${selected
                                            ? "bg-white/15"
                                            : "bg-muted/15 text-foreground"
                                        }
                                    `}>

                                        {filter.count}

                                    </span>

                                </button>

                            )
                        })}

                    </div>

                    <div className="
                        text-xs
                        text-muted
                    ">

                        Exibindo {students.length} de {initialStudents.length} alunos

                    </div>

                </div>

            </GlassCard>

            <StudentsTable
                students={students}
            />

        </div>
    )
}
