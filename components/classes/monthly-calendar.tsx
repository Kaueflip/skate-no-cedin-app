
"use client"

import { useMemo } from "react"
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
} from "lucide-react"

type ClassSession = {
    id: string
    class_date: string
    turno: "Manhã" | "Tarde" | "Noite"
    aula_numero: number
    status: "realizada" | "cancelada"
    observacoes: string | null
    created_at: string
}

type Props = {
    date: string
    sessions: ClassSession[]
    onMonthChange: (date: string) => void
    onDaySelect: (date: string) => void
}

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function MonthlyCalendar({
    date,
    sessions,
    onMonthChange,
    onDaySelect,
}: Props) {
    const calendar = useMemo(() => {
        const [year, month] = date.split("-").map(Number)

        const firstDay = new Date(year, month - 1, 1).getDay()
        const daysInMonth = new Date(year, month, 0).getDate()

        const days = Array.from(
            { length: firstDay },
            () => null as number | null
        )

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return { year, month, days }
    }, [date])

    const sessionsByDay = useMemo(() => {
        return sessions.reduce<Record<string, {
            realized: number
            cancelled: number
        }>>((acc, session) => {
            const day = session.class_date

            if (!acc[day]) {
                acc[day] = {
                    realized: 0,
                    cancelled: 0,
                }
            }

            if (session.status === "realizada") {
                acc[day].realized++
            } else {
                acc[day].cancelled++
            }

            return acc
        }, {})
    }, [sessions])

    const monthLabel = new Date(
        calendar.year,
        calendar.month - 1,
        1
    ).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    })

    function changeMonth(offset: number) {
        const nextDate = new Date(
            calendar.year,
            calendar.month - 1 + offset,
            1
        )

        const year = nextDate.getFullYear()
        const month = String(nextDate.getMonth() + 1).padStart(2, "0")

        onMonthChange(`${year}-${month}-01`)
    }

    return (
        <section className="rounded-[2rem] border border-border bg-card/80 p-5 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">
                        Calendário de atividades
                    </h2>

                    <p className="mt-1 text-sm text-muted capitalize">
                        {monthLabel}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted/10"
                        aria-label="Mês anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted/10"
                        aria-label="Próximo mês"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold text-muted"
                    >
                        {day}
                    </div>
                ))}

                {calendar.days.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} />
                    }

                    const dayKey =
                        `${calendar.year}-${String(calendar.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                    const dayStats = sessionsByDay[dayKey]

                    const selected = date === dayKey

                    return (
                        <button
                            key={dayKey}
                            type="button"
                            onClick={() => onDaySelect(dayKey)}
                            className={`
            min-h-[76px]
            rounded-xl
            border
            p-2
            text-left
            transition
            hover:border-primary
            ${selected
                                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                                    : dayStats?.realized
                                        ? "border-emerald-500/30 bg-emerald-500/5"
                                        : "border-border bg-background/50"
                                }
        `}
                        >
                            <p className={`text-sm font-bold ${selected ? "text-primary" : ""
                                }`}>
                                {day}
                            </p>

                            {dayStats && (
                                <div className="mt-2 flex flex-col gap-1">
                                    {dayStats.realized > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                                            {dayStats.realized}
                                        </span>
                                    )}

                                    {dayStats.cancelled > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                                            <XCircle className="h-3 w-3 shrink-0" />
                                            {dayStats.cancelled}
                                        </span>
                                    )}
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
                <span className="flex items-center gap-2 text-xs text-muted">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Aulas realizadas
                </span>

                <span className="flex items-center gap-2 text-xs text-muted">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Aulas canceladas
                </span>
            </div>
        </section>
    )
}
