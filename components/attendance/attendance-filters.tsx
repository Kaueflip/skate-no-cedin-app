"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SchoolClass = { id: string; nome: string }

type Props = {
    search: string
    onSearchChange: (value: string) => void
    turno: string
    onTurnoChange: (value: string) => void
    turma: string
    onTurmaChange: (value: string) => void
    schoolClasses: SchoolClass[]
    date: string
    onDateChange: (value: string) => void
    disabled?: boolean
}

export function AttendanceFilters({
    search, onSearchChange, turno, onTurnoChange,
    turma, onTurmaChange, schoolClasses, date, onDateChange,
    disabled = false,
}: Props) {
    return (
        <div className="grid min-w-0 grid-cols-2 gap-2.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] lg:items-end lg:gap-3">
            <div className="col-span-2 min-w-0 lg:col-span-1">
                <label htmlFor="attendance-search" className="mb-1 block text-xs font-medium text-muted">Buscar aluno</label>
                <div className="relative min-w-0">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input id="attendance-search" value={search} onChange={(e) => onSearchChange(e.target.value)} disabled={disabled} placeholder="Buscar aluno..." className="h-11 w-full min-w-0 rounded-lg pl-10 text-base md:text-sm" />
                </div>
            </div>

            <div className="min-w-0">
                <label htmlFor="attendance-date" className="mb-1 block text-xs font-medium text-muted">Data da aula</label>
                <Input id="attendance-date" type="date" value={date} onChange={(e) => onDateChange(e.target.value)} disabled={disabled} className="h-11 w-full min-w-0 max-w-full appearance-none rounded-lg px-2 text-base md:text-sm [&::-webkit-date-and-time-value]:min-w-0 [&::-webkit-date-and-time-value]:text-left" />
            </div>

            <div className="min-w-0">
                <label htmlFor="attendance-turno" className="mb-1 block text-xs font-medium text-muted">Turno</label>
                <Select value={turno} onValueChange={onTurnoChange} disabled={disabled}>
                    <SelectTrigger id="attendance-turno" className="h-11 w-full min-w-0 rounded-lg px-2 text-base md:text-sm [&>span]:min-w-0 [&>span]:truncate">
                        <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                        <SelectItem value="all">Todos os turnos</SelectItem>
                        <SelectItem value="Manhã">Manhã</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="col-span-2 min-w-0 lg:col-span-1">
                <label htmlFor="attendance-turma" className="mb-1 block text-xs font-medium text-muted">Turma</label>
                <Select value={turma} onValueChange={onTurmaChange} disabled={disabled}>
                    <SelectTrigger id="attendance-turma" className="h-11 w-full min-w-0 rounded-lg px-3 text-base md:text-sm [&>span]:min-w-0 [&>span]:truncate">
                        <SelectValue placeholder="Turma" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[calc(100vw-2rem)] rounded-lg">
                        <SelectItem value="all">Todas as turmas</SelectItem>
                        {schoolClasses.map((schoolClass) => (
                            <SelectItem key={schoolClass.id} value={schoolClass.id} className="whitespace-normal break-words">
                                {schoolClass.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
