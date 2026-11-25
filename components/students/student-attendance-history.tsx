
"use client"

import type { ReactNode } from "react"

import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Clock3,
} from "lucide-react"

import { useMemo } from "react"

import { cn } from "@/lib/utils"

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
            ? Math.round(
                (present / attendance.length) * 100
            )
            : 0

        const lastPresence = attendance.reduce<string | null>(
            (latest, item) => {

                if (!item.present) return latest

                if (!latest || item.class_date > latest) {
                    return item.class_date
                }

                return latest
            },
            null
        )

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

            const [year, month] =
                item.class_date.split("-")

            const key = `${year}-${month}`

            if (!months[key]) {

                months[key] = {

                    label: new Intl.DateTimeFormat(
                        "pt-BR",
                        {
                            month: "long",
                            year: "numeric",
                            timeZone: "UTC",
                        }
                    ).format(
                        new Date(
                            Date.UTC(
                                Number(year),
                                Number(month) - 1,
                                1
                            )
                        )
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
        ? stats.lastPresence.split("-").reverse().join("/")
        : "Nenhuma presença"

    return (

        <section className="
            w-full
            min-w-0

            rounded-[10px]
            border
            border-border
            bg-card

            p-3
            shadow-sm

            sm:p-4
            lg:p-5
        ">

            {/* CABEÇALHO */}

            <div className="
                mb-4
                flex
                min-w-0
                items-center
                gap-2.5
            ">

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

                    <CalendarDays className="h-4 w-4" />

                </div>

                <div className="min-w-0">

                    <h2 className="
                        text-base
                        font-bold
                        leading-tight

                        md:text-lg
                    ">
                        Histórico de frequência
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-muted
                    ">
                        Acompanhamento das aulas do aluno
                    </p>

                </div>

            </div>

            {/* INDICADORES */}

            <div className="
                grid
                min-w-0
                grid-cols-2
                gap-2

                md:gap-3
                xl:grid-cols-4
            ">

                <StatCard
                    label="Presenças"
                    value={stats.present}
                    icon={<CheckCircle2 />}
                    color="text-emerald-600 dark:text-emerald-400"
                />

                <StatCard
                    label="Faltas"
                    value={stats.absent}
                    icon={<XCircle />}
                    color="text-red-500"
                />

                <StatCard
                    label="Aulas registradas"
                    value={stats.total}
                    icon={<CalendarDays />}
                    color="text-primary"
                />

                <StatCard
                    label="Frequência"
                    value={`${stats.percentage}%`}
                    icon={<TrendingUp />}
                    color="text-primary"
                />

            </div>

            {/* ÚLTIMA PRESENÇA */}

            <div className="
                mt-3
                flex
                min-w-0
                items-center
                gap-2

                rounded-lg
                border
                border-border
                bg-background/70

                p-3
            ">

                <Clock3 className="
                    h-4
                    w-4
                    shrink-0
                    text-muted
                " />

                <div className="min-w-0">

                    <p className="text-[11px] text-muted">
                        Última presença
                    </p>

                    <p className="text-sm font-semibold">
                        {formattedLastPresence}
                    </p>

                </div>

            </div>

            {/* HISTÓRICO MENSAL */}

            <div className="mt-5">

                <h3 className="
                    mb-3
                    text-sm
                    font-bold

                    md:text-base
                ">
                    Histórico mensal
                </h3>

                {monthlyHistory.length > 0 ? (

                    <div className="space-y-2">

                        {monthlyHistory.map((month) => {

                            const total =
                                month.present + month.absent

                            const percentage = total > 0
                                ? (month.present / total) * 100
                                : 0

                            return (

                                <div
                                    key={month.key}
                                    className="
                                        min-w-0
                                        rounded-lg
                                        border
                                        border-border
                                        bg-background/60
                                        p-3
                                    "
                                >

                                    <div className="
                                        mb-2
                                        flex
                                        min-w-0
                                        items-center
                                        justify-between
                                        gap-2
                                    ">

                                        <p className="
                                            min-w-0
                                            text-sm
                                            font-semibold
                                            capitalize
                                        ">
                                            {month.label}
                                        </p>

                                        <span className="
                                            shrink-0
                                            text-xs
                                            font-bold
                                            tabular-nums
                                            text-primary
                                        ">
                                            {Math.round(percentage)}%
                                        </span>

                                    </div>

                                    <div
                                        role="progressbar"
                                        aria-label={`Frequência de ${month.label}`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={Math.round(percentage)}
                                        className="
                                            mb-3
                                            h-1.5
                                            overflow-hidden
                                            rounded-full
                                            bg-muted
                                        "
                                    >

                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-emerald-500
                                                transition-all
                                            "
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                    <div className="
                                        grid
                                        grid-cols-3
                                        gap-2
                                        text-center
                                    ">

                                        <MonthlyMetric
                                            label="Presenças"
                                            value={month.present}
                                            color="text-emerald-600 dark:text-emerald-400"
                                        />

                                        <MonthlyMetric
                                            label="Faltas"
                                            value={month.absent}
                                            color="text-red-500"
                                        />

                                        <MonthlyMetric
                                            label="Total"
                                            value={total}
                                        />

                                    </div>

                                </div>
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
                    ">

                        <CalendarDays className="
                            mx-auto
                            mb-2
                            h-6
                            w-6
                            text-muted
                        " />

                        <p className="text-sm font-semibold">
                            Nenhum registro de frequência
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            leading-relaxed
                            text-muted
                        ">
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
    icon: ReactNode
    color: string
}

function StatCard({
    label,
    value,
    icon,
    color,
}: StatCardProps) {

    return (

        <div className="
            flex
            h-full
            min-w-0
            flex-col

            rounded-lg
            border
            border-border
            bg-background/70

            p-3
        ">

            <div className="
                flex
                min-w-0
                items-center
                justify-between
                gap-2
            ">

                <p className="
                    min-w-0
                    text-xs
                    font-medium
                    leading-tight
                    text-muted
                ">
                    {label}
                </p>

                <div className={cn(
                    `
                        shrink-0
                        [&>svg]:h-4
                        [&>svg]:w-4
                    `,
                    color
                )}>

                    {icon}

                </div>

            </div>

            <p className="
                mt-2
                text-xl
                font-black
                leading-none
                tracking-tight
                tabular-nums

                sm:text-2xl
            ">
                {value}
            </p>

        </div>
    )
}

type MonthlyMetricProps = {
    label: string
    value: number
    color?: string
}

function MonthlyMetric({
    label,
    value,
    color,
}: MonthlyMetricProps) {

    return (

        <div className="min-w-0">

            <p className={cn(
                "text-sm font-bold tabular-nums",
                color
            )}>

                {value}

            </p>

            <p className="
                mt-0.5
                text-[10px]
                leading-tight
                text-muted
            ">

                {label}

            </p>

        </div>
    )
}
