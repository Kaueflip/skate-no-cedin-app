
"use client"

import {
    useMemo,
    useState,
} from "react"

import {
    Search,
    Download,
    X,
} from "lucide-react"

import type { Student } from "@/types/student"

import { cn } from "@/lib/utils"

import { GlassCard } from "@/components/ui/glass-card"

import { Input } from "@/components/ui/input"

import { AppButton } from "@/components/ui/app-button"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    StudentsTable,
} from "@/components/students/students-table"

type Props = {
    initialStudents: Student[]
}

type StatusFilter =
    "todos" | "ativos" | "inativos"

function normalizeText(value: string) {

    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}

function getClassId(student: Student) {

    return student.school_class_id || student.turma
}

export function StudentsClient({
    initialStudents,
}: Props) {

    const [search, setSearch] = useState("")

    const [turno, setTurno] = useState("all")

    const [turma, setTurma] = useState("all")

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ativos")

    // TURMAS DISPONÍVEIS

    const schoolClasses = useMemo(() => {

        const classes = new Map<string, string>()

        for (const student of initialStudents) {

            if (!student.turma?.trim()) continue

            if (
                turno !== "all" &&
                student.turno !== turno &&
                !(turno === "Tarde" && student.turno === "Integral")
            ) {
                continue
            }

            classes.set(
                getClassId(student),
                student.turma
            )
        }

        return Array.from(classes.entries())
            .map(([id, nome]) => ({
                id,
                nome,
            }))
            .sort((a, b) =>
                a.nome.localeCompare(
                    b.nome,
                    "pt-BR",
                    {
                        numeric: true,
                    }
                )
            )

    }, [initialStudents, turno])

    // BUSCA, TURMA E TURNO

    const baseStudents = useMemo(() => {

        const query = normalizeText(search)

        return initialStudents.filter((student) => {

            const searchableFields = [
                student.nome,
                student.turma,
                student.turno,
                student.nivel,
                student.matricula_escolar,
            ]

            const matchesSearch =
                searchableFields.some(
                    (field) =>
                        normalizeText(
                            field || ""
                        ).includes(query)
                )

            const matchesTurno =
                turno === "all" ||
                student.turno === turno ||
                (
                    turno === "Tarde" &&
                    student.turno === "Integral"
                )

            const matchesTurma =
                turma === "all" ||
                getClassId(student) === turma

            return (
                matchesSearch &&
                matchesTurno &&
                matchesTurma
            )
        })

    }, [
        initialStudents,
        search,
        turno,
        turma,
    ])

    // FILTRO DE SITUAÇÃO

    const students = useMemo(() => {

        return baseStudents.filter((student) => {

            const isActive =
                student.ativo !== false

            return (
                statusFilter === "todos" ||
                (statusFilter === "ativos" && isActive) ||
                (statusFilter === "inativos" && !isActive)
            )

        })

    }, [
        baseStudents,
        statusFilter,
    ])

    const activeCount = baseStudents.filter(
        (student) => student.ativo !== false
    ).length

    const filters: {
        label: string
        value: StatusFilter
        count: number
    }[] = [

            {
                label: "Todos",
                value: "todos",
                count: baseStudents.length,
            },

            {
                label: "Ativos",
                value: "ativos",
                count: activeCount,
            },

            {
                label: "Inativos",
                value: "inativos",
                count: baseStudents.length - activeCount,
            },

        ]

    const hasFilters =
        search !== "" ||
        turno !== "all" ||
        turma !== "all" ||
        statusFilter !== "ativos"

    function clearFilters() {

        setSearch("")
        setTurno("all")
        setTurma("all")
        setStatusFilter("ativos")
    }

    function handleTurnoChange(value: string) {

        setTurno(value)

        // EVITA MANTER UMA TURMA DE OUTRO TURNO

        setTurma("all")
    }

    // EXPORTAÇÃO CSV

    function exportStudentsCSV() {

        if (students.length === 0) return

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
            student.ativo !== false
                ? "Ativo"
                : "Inativo",
            student.responsavel_nome || "",
            student.responsavel_contato || "",

        ])

        function escapeCSV(value: unknown) {

            let text = String(value ?? "")

            // PROTEÇÃO CONTRA FÓRMULAS EM PLANILHAS

            if (/^[\s]*[=+\-@\t\r\n]/.test(text)) {
                text = `'${text}`
            }

            return `"${text.replace(/"/g, '""')}"`
        }

        const csvContent = [

            headers.join(","),

            ...rows.map((row) =>
                row.map(escapeCSV).join(",")
            ),

        ].join("\r\n")

        const blob = new Blob(
            ["\uFEFF", csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        )

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")

        a.href = url
        a.download = "alunos.csv"

        document.body.appendChild(a)

        a.click()

        a.remove()

        window.setTimeout(() => {
            URL.revokeObjectURL(url)
        }, 1000)
    }

    return (

        <div className="
            flex
            w-full
            min-w-0
            flex-col
            gap-3

            md:gap-5
        ">

            <GlassCard className="
                w-full
                min-w-0
                rounded-[10px]

                p-3

                sm:p-4
                lg:p-5
            ">

                <div className="
                    flex
                    min-w-0
                    flex-col
                    gap-3

                    md:gap-4
                ">

                    {/* BUSCA E FILTROS */}

                    <div className="
                        grid
                        min-w-0
                        grid-cols-2
                        gap-2

                        lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.5fr)]
                        lg:gap-3
                    ">

                        {/* BUSCA */}

                        <div className="
                            relative
                            col-span-2
                            min-w-0

                            lg:col-span-1
                        ">

                            <Search className="
                                pointer-events-none
                                absolute
                                left-3
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
                                aria-label="Buscar alunos"
                                placeholder="Buscar alunos..."
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    pl-10
                                    pr-10
                                    text-base
                                    md:text-sm
                                "
                            />

                            {search && (

                                <button
                                    type="button"
                                    aria-label="Limpar busca"
                                    onClick={() => setSearch("")}
                                    className="
                                        absolute
                                        right-0
                                        top-1/2

                                        flex
                                        h-11
                                        w-10
                                        -translate-y-1/2
                                        items-center
                                        justify-center

                                        text-muted
                                        hover:text-foreground
                                    "
                                >
                                    <X className="h-4 w-4" />
                                </button>

                            )}

                        </div>

                        {/* TURNO */}

                        <Select
                            value={turno}
                            onValueChange={handleTurnoChange}
                        >

                            <SelectTrigger
                                aria-label="Filtrar por turno"
                                className="
                                    h-11
                                    w-full
                                    min-w-0
                                    rounded-lg
                                    px-2.5
                                    text-xs
                                    sm:text-sm
                                "
                            >

                                <SelectValue placeholder="Turno" />

                            </SelectTrigger>

                            <SelectContent className="rounded-lg">

                                <SelectItem value="all">
                                    Todos os turnos
                                </SelectItem>

                                <SelectItem value="Manhã">
                                    Manhã
                                </SelectItem>

                                <SelectItem value="Tarde">
                                    Tarde
                                </SelectItem>

                                <SelectItem value="Integral">
                                    Integral
                                </SelectItem>

                            </SelectContent>

                        </Select>

                        {/* TURMA */}

                        <Select
                            value={turma}
                            onValueChange={setTurma}
                        >

                            <SelectTrigger
                                aria-label="Filtrar por turma"
                                className="
                                    h-11
                                    w-full
                                    min-w-0
                                    rounded-lg
                                    px-2.5
                                    text-xs
                                    sm:text-sm

                                    [&>span]:min-w-0
                                    [&>span]:truncate
                                "
                            >

                                <SelectValue placeholder="Turma" />

                            </SelectTrigger>

                            <SelectContent className="
                                max-w-[calc(100vw-2rem)]
                                rounded-lg
                            ">

                                <SelectItem value="all">
                                    Todas as turmas
                                </SelectItem>

                                {schoolClasses.map(
                                    (schoolClass) => (

                                        <SelectItem
                                            key={schoolClass.id}
                                            value={schoolClass.id}
                                            className="
                                                whitespace-normal
                                                text-xs
                                                sm:text-sm
                                            "
                                        >

                                            {schoolClass.nome}

                                        </SelectItem>

                                    )
                                )}

                            </SelectContent>

                        </Select>

                    </div>

                    {/* SITUAÇÃO DOS ALUNOS */}

                    <div className="
                        grid
                        min-w-0
                        grid-cols-3
                        gap-1.5

                        sm:gap-2

                        md:flex
                        md:flex-wrap
                    ">

                        {filters.map((filter) => {

                            const selected =
                                statusFilter === filter.value

                            return (

                                <button
                                    key={filter.value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        setStatusFilter(
                                            filter.value
                                        )
                                    }
                                    className={cn(
                                        `
                                            flex
                                            min-h-11
                                            min-w-0
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-0.5

                                            rounded-lg
                                            border

                                            px-1.5
                                            py-1.5

                                            text-xs
                                            font-semibold

                                            transition-colors

                                            min-[380px]:flex-row
                                            min-[380px]:gap-1.5

                                            md:px-4
                                            md:text-sm
                                        `,
                                        selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-background/60 text-foreground hover:bg-accent"
                                    )}
                                >

                                    {filter.label}

                                    <span className={cn(
                                        `
                                            rounded-md
                                            px-1.5
                                            py-0.5
                                            text-[10px]
                                            tabular-nums
                                        `,
                                        selected
                                            ? "bg-primary-foreground/15"
                                            : "bg-foreground/5"
                                    )}>

                                        {filter.count}

                                    </span>

                                </button>
                            )
                        })}

                    </div>

                    {/* RESULTADOS E EXPORTAÇÃO */}

                    <div className="
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        justify-between
                        gap-2

                        border-t
                        border-border

                        pt-3
                    ">

                        <div className="min-w-0">

                            <p
                                aria-live="polite"
                                className="text-xs text-muted"
                            >

                                Exibindo{" "}

                                <span className="
                                    font-semibold
                                    tabular-nums
                                    text-foreground
                                ">
                                    {students.length}
                                </span>

                                {" "}de {initialStudents.length} alunos

                            </p>

                            {hasFilters && (

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        mt-1
                                        min-h-8
                                        text-xs
                                        font-medium
                                        text-primary
                                        hover:underline
                                    "
                                >
                                    Limpar filtros
                                </button>

                            )}

                        </div>

                        <AppButton
                            variant="secondary"
                            onClick={exportStudentsCSV}
                            disabled={students.length === 0}
                            className="
                                h-11
                                shrink-0
                                gap-1.5
                                rounded-lg
                                px-3
                                text-xs
                            "
                        >

                            <Download className="
                                h-3.5
                                w-3.5
                                shrink-0
                            " />

                            <span className="hidden sm:inline">
                                Exportar CSV
                            </span>

                            <span className="sm:hidden">
                                CSV
                            </span>

                        </AppButton>

                    </div>

                </div>

            </GlassCard>

            <StudentsTable students={students} />

        </div>
    )
}
