"use client"

import { Search }
    from "lucide-react"

import { Button }
    from "@/components/ui/button"

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
    searchTerm: string

    onSearchChange: (
        value: string
    ) => void

    filterShift: string

    onFilterShiftChange: (
        value: string
    ) => void

    loading?: boolean

    onRefresh?: () => void
}

export function StudentsFilters({
    searchTerm,
    onSearchChange,
    filterShift,
    onFilterShiftChange,
    loading,
    onRefresh,
}: Props) {

    return (

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-1 flex-col gap-4 sm:flex-row">

                <div className="relative flex-1">

                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                        placeholder="Buscar aluno..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) =>
                            onSearchChange(
                                e.target.value
                            )
                        }
                    />

                </div>

                <Select
                    value={filterShift}
                    onValueChange={
                        onFilterShiftChange
                    }
                >

                    <SelectTrigger className="w-full sm:w-[180px]">

                        <SelectValue placeholder="Turno" />

                    </SelectTrigger>

                    <SelectContent className="
            rounded-xl

            border-white/40

            bg-[#eef1fb]

            backdrop-blur-2xl
          ">

                        <SelectItem value="all" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                            Todos os turnos
                        </SelectItem>

                        <SelectItem value="Manhã" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                            Manhã
                        </SelectItem>

                        <SelectItem value="Tarde" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                            Tarde
                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <Button
                variant="outline"
                onClick={onRefresh}
                disabled={loading}
            >

                {loading
                    ? "Atualizando..."
                    : "Atualizar"}

            </Button>

        </div>
    )
}