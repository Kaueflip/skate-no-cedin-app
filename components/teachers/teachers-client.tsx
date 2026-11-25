"use client"

import { useMemo, useState } from "react"
import { Search, Download, X } from "lucide-react"
import type { Teacher } from "@/types/teacher"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { AppButton } from "@/components/ui/app-button"
import { TeachersTable } from "@/components/teachers/teachers-table"

type Props = { initialTeachers: Teacher[] }
type StatusFilter = "todos" | "ativos" | "inativos"

function normalizeText(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export function TeachersClient({ initialTeachers }: Props) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ativos")

    const matching = useMemo(() => {
        const query = normalizeText(search)
        return initialTeachers.filter((teacher) =>
            [teacher.nome, teacher.funcao, teacher.contato].some((field) =>
                normalizeText(field || "").includes(query)
            )
        )
    }, [initialTeachers, search])

    const teachers = matching.filter((teacher) =>
        statusFilter === "todos" ||
        (statusFilter === "ativos" && teacher.ativo) ||
        (statusFilter === "inativos" && !teacher.ativo)
    )
    const activeCount = matching.filter((teacher) => teacher.ativo).length
    const filters: { label: string; value: StatusFilter; count: number }[] = [
        { label: "Todos", value: "todos", count: matching.length },
        { label: "Ativos", value: "ativos", count: activeCount },
        { label: "Inativos", value: "inativos", count: matching.length - activeCount },
    ]

    function exportTeachersCSV() {
        if (!teachers.length) return
        const headers = ["Nome", "Função", "Contato", "Data de início", "Situação"]
        const rows = teachers.map((teacher) => [
            teacher.nome, teacher.funcao || "", teacher.contato || "",
            teacher.data_inicio || "", teacher.ativo ? "Ativo" : "Inativo",
        ])
        function escapeCSV(value: unknown) {
            let text = String(value ?? "")
            if (/^[\s]*[=+\-@\t\r\n]/.test(text)) text = `'${text}`
            return `"${text.replace(/"/g, '""')}"`
        }
        const content = [headers.join(","), ...rows.map((row) => row.map(escapeCSV).join(","))].join("\r\n")
        const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" }))
        const link = document.createElement("a")
        link.href = url
        link.download = "professores.csv"
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-3 md:gap-5">
            <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">
                <div className="flex min-w-0 flex-col gap-3">
                    <div className="relative w-full min-w-0 md:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)}
                            aria-label="Buscar professores" placeholder="Buscar professores..."
                            className="h-11 w-full min-w-0 rounded-lg pl-10 pr-11 text-base md:text-sm" />
                        {search && <button type="button" aria-label="Limpar busca" onClick={() => setSearch("")}
                            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-muted hover:text-foreground">
                            <X className="h-4 w-4" />
                        </button>}
                    </div>
                    <div className="grid min-w-0 grid-cols-3 gap-1.5 md:flex md:flex-wrap md:gap-2">
                        {filters.map((filter) => {
                            const selected = statusFilter === filter.value
                            return <button key={filter.value} type="button" aria-pressed={selected}
                                onClick={() => setStatusFilter(filter.value)}
                                className={cn("flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-1.5 text-xs font-semibold transition-colors min-[380px]:flex-row min-[380px]:gap-1.5 md:px-4 md:text-sm",
                                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/60 hover:bg-accent")}>
                                {filter.label}
                                <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] tabular-nums", selected ? "bg-primary-foreground/15" : "bg-foreground/5")}>{filter.count}</span>
                            </button>
                        })}
                    </div>
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                        <p aria-live="polite" className="min-w-0 text-xs text-muted">Exibindo {teachers.length} de {initialTeachers.length} professores</p>
                        <AppButton variant="secondary" disabled={!teachers.length} onClick={exportTeachersCSV}
                            className="h-11 shrink-0 gap-1.5 rounded-lg px-3 text-xs">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar CSV</span><span className="sm:hidden">CSV</span>
                        </AppButton>
                    </div>
                </div>
            </GlassCard>
            <TeachersTable teachers={teachers} />
        </div>
    )
}
