
import Link from "next/link"

import {
    Cake,
    CalendarDays,
} from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

type BirthdayStudent = {
    id: string
    nome: string
    turma: string
    data_nascimento: string
}

type Props = {
    students: BirthdayStudent[]
    currentYear: number
    currentMonth: number
    currentDay: number
    monthName: string
}

export function BirthdaysMonth({
    students,
    currentYear,
    currentDay,
    monthName,
}: Props) {

    return (
        <GlassCard className="p-6">

            <div className="
                mb-5
                flex
                items-center
                justify-between
            ">

                <div>
                    <h2 className="
                        text-xl
                        font-bold
                        capitalize
                    ">
                        Aniversariantes de {monthName}
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Todos os aniversários deste mês
                    </p>
                </div>

                <div className="
                    rounded-2xl
                    bg-primary/10
                    p-3
                    text-primary
                ">
                    <CalendarDays className="h-6 w-6" />
                </div>

            </div>

            {students.length > 0 ? (

                <div className="
                    max-h-80
                    space-y-2
                    overflow-y-auto
                    pr-1
                ">

                    {students.map((student) => {

                        const [, , day] =
                            student.data_nascimento.split("-")

                        const birthYear = Number(
                            student.data_nascimento.split("-")[0]
                        )

                        const age = currentYear - birthYear

                        const isToday =
                            Number(day) === currentDay

                        return (
                            <Link
                                key={student.id}
                                href={`/students/${student.id}`}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    rounded-xl
                                    p-3
                                    transition-colors
                                    hover:bg-accent
                                "
                            >

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    min-w-0
                                ">

                                    <div className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-border
                                        bg-background
                                    ">

                                        <span className="
                                            text-lg
                                            font-bold
                                            leading-none
                                        ">
                                            {day}
                                        </span>

                                        <span className="
                                            mt-1
                                            text-[10px]
                                            uppercase
                                            text-muted
                                        ">
                                            {monthName.slice(0, 3)}
                                        </span>

                                    </div>

                                    <div className="min-w-0">

                                        <p className="truncate font-semibold">
                                            {student.nome}
                                        </p>

                                        <p className="text-sm text-muted">
                                            Turma {student.turma}
                                        </p>

                                    </div>

                                </div>

                                <div className="
                                    flex
                                    shrink-0
                                    flex-col
                                    items-end
                                    gap-1
                                ">

                                    <span className="text-sm font-semibold">
                                        {age} anos
                                    </span>

                                    {isToday && (
                                        <Badge>
                                            Hoje
                                        </Badge>
                                    )}

                                </div>

                            </Link>
                        )
                    })}

                </div>

            ) : (

                <div className="
                    rounded-2xl
                    border
                    border-dashed
                    border-border
                    p-8
                    text-center
                    text-sm
                    text-muted
                ">
                    Nenhum aniversariante neste mês.
                </div>

            )}

        </GlassCard>
    )
}
