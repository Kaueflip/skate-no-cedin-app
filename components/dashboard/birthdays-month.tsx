
import Link from "next/link"

import { CalendarDays } from "lucide-react"

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

        <GlassCard className="
            w-full
            min-w-0
            rounded-[10px]
            p-3
            md:p-5
        ">

            {/* CABEÇALHO */}

            <div className="
                mb-4
                flex
                min-w-0
                items-start
                justify-between
                gap-2
            ">

                <div className="min-w-0 flex-1">

                    <h2 className="
                        text-base
                        font-bold
                        leading-tight
                        md:text-lg
                    ">
                        Aniversariantes de {monthName}
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        leading-relaxed
                        text-muted
                        md:text-sm
                    ">
                        {students.length} {
                            students.length === 1
                                ? "aniversariante"
                                : "aniversariantes"
                        } neste mês
                    </p>

                </div>

                <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                ">

                    <CalendarDays className="h-5 w-5" />

                </div>

            </div>

            {/* LISTAGEM */}

            {students.length > 0 ? (

                <div className="
                    max-h-80
                    w-full
                    min-w-0
                    space-y-1

                    overflow-y-auto
                    overscroll-contain

                    md:max-h-96
                ">

                    {students.map((student) => {

                        const [birthYear, , day] =
                            student.data_nascimento.split("-")

                        const age =
                            currentYear - Number(birthYear)

                        const isToday =
                            Number(day) === currentDay

                        return (

                            <Link
                                key={student.id}
                                href={`/students/${student.id}`}
                                className={`
                                    flex
                                    w-full
                                    min-w-0
                                    items-center
                                    gap-2

                                    rounded-lg
                                    border
                                    p-2

                                    transition-colors
                                    hover:bg-accent

                                    sm:gap-3

                                    ${isToday
                                        ? "border-primary/20 bg-primary/5"
                                        : "border-transparent"
                                    }
                                `}
                            >

                                {/* DATA */}

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    flex-col
                                    items-center
                                    justify-center

                                    rounded-lg
                                    border
                                    border-border
                                    bg-background
                                ">

                                    <span className="
                                        text-base
                                        font-bold
                                        leading-none
                                        tabular-nums
                                    ">
                                        {day}
                                    </span>

                                    <span className="
                                        mt-0.5
                                        text-[10px]
                                        uppercase
                                        text-muted
                                    ">
                                        {monthName.slice(0, 3)}
                                    </span>

                                </div>

                                {/* ALUNO */}

                                <div className="
                                    min-w-0
                                    flex-1
                                ">

                                    <p className="
                                        text-sm
                                        font-semibold
                                        leading-snug
                                        [overflow-wrap:anywhere]
                                    ">
                                        {student.nome}
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        leading-relaxed
                                        text-muted
                                        [overflow-wrap:anywhere]
                                    ">
                                        {student.turma}
                                    </p>

                                </div>

                                {/* IDADE */}

                                <div className="
                                    flex
                                    shrink-0
                                    flex-col
                                    items-end
                                    gap-1
                                ">

                                    <span className="
                                        whitespace-nowrap
                                        text-xs
                                        font-semibold
                                    ">
                                        {age} anos
                                    </span>

                                    {isToday && (

                                        <Badge className="
                                            rounded-md
                                            px-1.5
                                            py-0.5
                                            text-[10px]
                                        ">
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
                    rounded-lg
                    border
                    border-dashed
                    border-border
                    px-3
                    py-6
                    text-center
                    text-xs
                    text-muted

                    md:py-8
                    md:text-sm
                ">
                    Nenhum aniversariante neste mês.
                </div>

            )}

        </GlassCard>
    )
}
