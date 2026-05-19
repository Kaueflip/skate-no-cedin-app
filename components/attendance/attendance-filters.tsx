"use client"

import {
    Search,
    CalendarDays,
} from "lucide-react"

import { Input }
    from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {

    search: string

    onSearchChange: (
        value: string
    ) => void

    turno: string

    onTurnoChange: (
        value: string
    ) => void

    date: string

    onDateChange: (
        value: string
    ) => void
}

export function AttendanceFilters({
    search,
    onSearchChange,
    turno,
    onTurnoChange,
    date,
    onDateChange,
}: Props) {

    return (

        <div className="
            grid
            gap-4

            lg:grid-cols-3
        ">

            <div className="relative">

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
                        onSearchChange(
                            e.target.value
                        )
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

            <Select
                value={turno}
                onValueChange={
                    onTurnoChange
                }
            >

                <SelectTrigger
                    className="
                        h-12

                        rounded-2xl

                        border-border

                        bg-card

                        shadow-sm
                    "
                >

                    <SelectValue placeholder="Turno" />

                </SelectTrigger>

                <SelectContent
                    className="
                        rounded-2xl

                        border-border

                        bg-popover

                        backdrop-blur-xl
                    "
                >

                    <SelectItem
                        value="all"
                        className="
                            rounded-xl

                            focus:bg-accent
                            focus:text-foreground
                        "
                    >

                        Todos os turnos

                    </SelectItem>

                    <SelectItem
                        value="Manhã"
                        className="
                            rounded-xl

                            focus:bg-accent
                            focus:text-foreground
                        "
                    >

                        Manhã

                    </SelectItem>

                    <SelectItem
                        value="Tarde"
                        className="
                            rounded-xl

                            focus:bg-accent
                            focus:text-foreground
                        "
                    >

                        Tarde

                    </SelectItem>

                </SelectContent>

            </Select>

            <div className="relative">

                <CalendarDays
                    className="
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
                    "
                />

                <Input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        onDateChange(
                            e.target.value
                        )
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