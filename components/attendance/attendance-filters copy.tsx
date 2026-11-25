
"use client"

import {
    Search,
    CalendarDays,
} from "lucide-react"

import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type SchoolClass = {
    id: string
    nome: string
}

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
}

export function AttendanceFilters({
    search,
    onSearchChange,
    turno,
    onTurnoChange,
    turma,
    onTurmaChange,
    schoolClasses,
    date,
    onDateChange,
}: Props) {

    return (

        <div className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
        ">

            {/* BUSCA */}

            <div className="relative">

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
                        onSearchChange(e.target.value)
                    }
                    placeholder="Buscar aluno..."
                    className="
                        h-12
                        rounded-2xl
                        border-border
                        bg-card
                        pl-11
                        shadow-sm
                    "
                />

            </div>

            {/* TURNO */}

            <Select
                value={turno}
                onValueChange={onTurnoChange}
            >

                <SelectTrigger className="
                    h-12
                    w-full
                    rounded-2xl
                    border-border
                    bg-card
                    shadow-sm
                ">
                    <SelectValue placeholder="Turno" />
                </SelectTrigger>

                <SelectContent className="
                    rounded-2xl
                    border-border
                    bg-popover
                    backdrop-blur-xl
                ">

                    <SelectItem value="all">
                        Todos os turnos
                    </SelectItem>

                    <SelectItem value="Manhã">
                        Manhã
                    </SelectItem>

                    <SelectItem value="Tarde">
                        Tarde
                    </SelectItem>

                </SelectContent>

            </Select>

            {/* TURMA */}

            <Select
                value={turma}
                onValueChange={onTurmaChange}
            >

                <SelectTrigger className="
                    h-12
                    w-full
                    min-w-0
                    rounded-2xl
                    border-border
                    bg-card
                    shadow-sm
                    [&>span]:truncate
                ">

                    <SelectValue placeholder="Turma" />

                </SelectTrigger>

                <SelectContent className="
                    rounded-2xl
                    border-border
                    bg-popover
                    backdrop-blur-xl
                ">

                    <SelectItem value="all">
                        Todas as turmas
                    </SelectItem>

                    {schoolClasses.map((schoolClass) => (

                        <SelectItem
                            key={schoolClass.id}
                            value={schoolClass.id}
                        >

                            {schoolClass.nome}

                        </SelectItem>

                    ))}

                </SelectContent>

            </Select>

            {/* DATA */}

            <div className="relative">

                <CalendarDays className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    hidden
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted
                    sm:block
                " />

                <Input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        onDateChange(e.target.value)
                    }
                    className="
                        h-12
                        cursor-pointer
                        rounded-2xl
                        border-border
                        bg-card
                        pl-4
                        sm:pl-11
                        shadow-sm

                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:inset-0
                        [&::-webkit-calendar-picker-indicator]:h-full
                        [&::-webkit-calendar-picker-indicator]:w-full
                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                    "
                />

            </div>

        </div>
    )
}
