
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
    Teacher,
} from "@/types/teacher"

import { GlassCard }
    from "@/components/ui/glass-card"

import { Input }
    from "@/components/ui/input"

import { AppButton }
    from "@/components/ui/app-button"

import {
    TeachersTable,
} from "@/components/teachers/teachers-table"

type Props = {
    initialTeachers: Teacher[]
}

type StatusFilter = "todos" | "ativos" | "inativos"

export function TeachersClient({
    initialTeachers,
}: Props) {

    const [search, setSearch] = useState("")

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ativos")

    const teachers = useMemo(() => {

        return initialTeachers.filter((teacher) => {

            const query = search.toLowerCase()

            const matchesSearch =
                teacher.nome?.toLowerCase().includes(query) ||
                teacher.contato?.toLowerCase().includes(query) ||
                teacher.funcao?.toLowerCase().includes(query)

            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativos" && teacher.ativo) ||
                (statusFilter === "inativos" && !teacher.ativo)

            return matchesSearch && matchesStatus
        })

    }, [
        initialTeachers,
        search,
        statusFilter,
    ])

    function exportTeachersCSV() {

        const headers = [
            "Nome",
            "Função",
            "Contato",
            "Data de início",
            "Situação",
        ]

        const rows = teachers.map((teacher) => [
            teacher.nome,
            teacher.funcao || "",
            teacher.contato || "",
            teacher.data_inicio || "",
            teacher.ativo ? "Ativo" : "Inativo",
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
        a.download = "professores.csv"

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
                count: initialTeachers.length,
            },

            {
                label: "Ativos",
                value: "ativos",
                count: initialTeachers.filter(
                    (teacher) => teacher.ativo
                ).length,
            },

            {
                label: "Inativos",
                value: "inativos",
                count: initialTeachers.filter(
                    (teacher) => !teacher.ativo
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
                                placeholder="Buscar professores..."
                                className="pl-11"
                            />

                        </div>

                        <AppButton
                            variant="secondary"
                            onClick={exportTeachersCSV}
                        >

                            <Download className="h-4 w-4" />

                            Exportar CSV

                        </AppButton>

                    </div>

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
                        Exibindo {teachers.length} de {initialTeachers.length} professores
                    </div>

                </div>

            </GlassCard>

            <TeachersTable
                teachers={teachers}
            />

        </div>
    )
}
