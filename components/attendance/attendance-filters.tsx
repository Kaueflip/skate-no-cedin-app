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

            text-zinc-400
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

            border-white/40

            bg-white

            pl-11
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

            border-white/40

            bg-white
          "
                >

                    <SelectValue placeholder="Turno" />

                </SelectTrigger>

                <SelectContent
                    className="
            rounded-2xl

            border-white/40

            bg-[#eef1fb]

            backdrop-blur-2xl
          "
                >

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

      text-zinc-400

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

            border-white/40

            bg-white

            pl-4
            sm:pl-11

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