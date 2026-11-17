
"use client"

import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Clock3,
} from "lucide-react"

import { useMemo } from "react"

type AttendanceRecord = {
    id: string
    class_date: string
    present: boolean
}

type Props = {
    attendance: AttendanceRecord[]
}

export function StudentAttendanceHistory({
    attendance,
}: Props) {

    const stats = useMemo(() => {

        const present = attendance.filter(
            (item) => item.present
        ).length

        const absent = attendance.length - present

        const percentage = attendance.length > 0
            ? Math.round((present / attendance.length) * 100)
            : 0

        const lastPresence = attendance.find(
            (item) => item.present
        )?.class_date ?? null

        return {
            present,
            absent,
            total: attendance.length,
            percentage,
            lastPresence,
        }

    }, [attendance])

    const monthlyHistory = useMemo(() => {

        const months: Record<
            string,
            {
                label: string
                present: number
                absent: number
            }
        > = {}

        attendance.forEach((item) => {

            const [year, month] = item.class_date.split("-")

            const key = `${year}-${month}`

            if (!months[key]) {

                const date = new Date(
                    Number(year),
                    Number(month) - 1,
                    1
                )

                months[key] = {
                    label: date.toLocaleDateString(
                        "pt-BR",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    ),
                    present: 0,
                    absent: 0,
                }
            }

            if (item.present) {
                months[key].present++
            } else {
                months[key].absent++
            }

        })

        return Object.entries(months)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, value]) => ({
                key,
                ...value,
            }))

    }, [attendance])

    const formattedLastPresence = stats.lastPresence
        ? new Date(
            `${stats.lastPresence}T12:00:00`
        ).toLocaleDateString("pt-BR")
        : "Nenhuma presença"

    return (

        <section className="mt-8 rounded-4xl border border-border bg-card p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-xl font-bold">
                        Histórico de frequência
                    </h2>

                    <p className="text-sm text-muted">
                        Acompanhamento das aulas do aluno
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

                <StatCard
                    label="Presenças"
                    value={stats.present}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    color="text-emerald-500"
                />

                <StatCard
                    label="Faltas"
                    value={stats.absent}
                    icon={<XCircle className="h-5 w-5" />}
                    color="text-red-500"
                />

                <StatCard
                    label="Aulas registradas"
                    value={stats.total}
                    icon={<CalendarDays className="h-5 w-5" />}
                    color="text-primary"
                />

                <StatCard
                    label="Frequência"
                    value={`${stats.percentage}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="text-primary"
                />

            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4">

                <Clock3 className="h-5 w-5 shrink-0 text-muted" />

                <div>
                    <p className="text-xs text-muted">
                        Última presença
                    </p>

                    <p className="font-semibold">
                        {formattedLastPresence}
                    </p>
                </div>

            </div>

            <div className="mt-8">

                <h3 className="mb-4 text-lg font-bold">
                    Histórico mensal
                </h3>

                {monthlyHistory.length > 0 ? (

                    <div className="space-y-3">

                        {monthlyHistory.map((month) => {

                            const total =
                                month.present + month.absent

                            const percentage = total > 0
                                ? (month.present / total) * 100
                                : 0

                            return (

                                <div
                                    key={month.key}
                                    className="rounded-2xl border border-border bg-background/60 p-4"
                                >

                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                                        <p className="font-semibold capitalize">
                                            {month.label}
                                        </p>

                                        <span className="text-sm font-bold text-primary">
                                            {Math.round(percentage)}%
                                        </span>

                                    </div>

                                    <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-muted">

                                        <div
                                            className="bg-emerald-500 transition-all"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm">

                                        <span className="text-emerald-600">
                                            {month.present} presenças
                                        </span>

                                        <span className="text-red-500">
                                            {month.absent} faltas
                                        </span>

                                        <span className="text-muted">
                                            {total} aulas
                                        </span>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                ) : (

                    <div className="rounded-2xl border border-dashed border-border p-8 text-center">

                        <CalendarDays className="mx-auto mb-3 h-8 w-8 text-muted" />

                        <p className="font-semibold">
                            Nenhum registro de frequência
                        </p>

                        <p className="mt-1 text-sm text-muted">
                            O histórico aparecerá aqui após as primeiras chamadas.
                        </p>

                    </div>

                )}

            </div>

        </section>
    )
}

type StatCardProps = {
    label: string
    value: string | number
    icon: React.ReactNode
    color: string
}

function StatCard({
    label,
    value,
    icon,
    color,
}: StatCardProps) {

    return (

        <div className="rounded-2xl border border-border bg-background/70 p-4">

            <div className={`mb-3 ${color}`}>
                {icon}
            </div>

            <p className="text-sm text-muted">
                {label}
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight">
                {value}
            </p>

        </div>
    )
}
