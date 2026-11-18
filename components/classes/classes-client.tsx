
"use client"

import {
    useMemo,
    useState,
    useEffect,
} from "react"

import {
    CalendarDays,
    Sun,
    Sunset,
    Moon,
    Plus,
    CheckCircle2,
    XCircle,
    Loader2,
} from "lucide-react"

import {
    toast,
} from "sonner"

import {
    createClient,
} from "@/lib/supabase-browser"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    MonthlyCalendar,
} from "@/components/classes/monthly-calendar"

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
    initialSessions: ClassSession[]
    initialDate: string
}

const supabase = createClient()

const shifts = [
    {
        name: "Manhã" as const,
        icon: Sun,
    },
    {
        name: "Tarde" as const,
        icon: Sunset,
    },
    {
        name: "Noite" as const,
        icon: Moon,
    },
]

export function ClassesClient({
    initialSessions,
    initialDate,
}: Props) {
    const [date, setDate] = useState(initialDate)

    const [sessions, setSessions] =
        useState<ClassSession[]>(initialSessions)

    const [loading, setLoading] = useState(false)

    const [saving, setSaving] = useState(false)


    const [monthlySessions, setMonthlySessions] =
        useState<ClassSession[]>([])


    useEffect(() => {
        async function fetchMonthlySessions() {
            try {
                const [year, month] = date.split("-")

                const startDate = `${year}-${month}-01`

                const lastDay = new Date(
                    Number(year),
                    Number(month),
                    0
                ).getDate()

                const endDate =
                    `${year}-${month}-${String(lastDay).padStart(2, "0")}`

                const { data, error } = await supabase
                    .from("class_sessions")
                    .select("*")
                    .gte("class_date", startDate)
                    .lte("class_date", endDate)
                    .order("class_date", {
                        ascending: false,
                    })

                if (error) throw error

                setMonthlySessions(
                    (data || []) as ClassSession[]
                )

            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar histórico mensal")
            }
        }

        fetchMonthlySessions()
    }, [date])

    const stats = useMemo(() => {
        const realized = sessions.filter(
            (item) => item.status === "realizada"
        ).length

        const cancelled = sessions.filter(
            (item) => item.status === "cancelada"
        ).length

        return {
            realized,
            cancelled,
            total: sessions.length,
        }
    }, [sessions])


    const monthlyStats = useMemo(() => {
        const realized = monthlySessions.filter(
            (item) => item.status === "realizada"
        )

        const cancelled = monthlySessions.filter(
            (item) => item.status === "cancelada"
        )

        const activeDays = new Set(
            realized.map((item) => item.class_date)
        )

        return {
            realized: realized.length,
            cancelled: cancelled.length,
            total: monthlySessions.length,
            activeDays: activeDays.size,
        }
    }, [monthlySessions])

    async function handleDateChange(
        newDate: string
    ) {
        if (!newDate) return

        try {
            setLoading(true)
            setDate(newDate)
            setSessions([])

            const { data, error } = await supabase
                .from("class_sessions")
                .select("*")
                .eq("class_date", newDate)
                .order("turno")
                .order("aula_numero")

            if (error) throw error

            setSessions((data || []) as ClassSession[])

        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar aulas")
        } finally {
            setLoading(false)
        }
    }

    async function loadMonthlySessions(
        selectedDate: string
    ) {
        try {
            const [year, month] = selectedDate.split("-")

            const startDate = `${year}-${month}-01`

            const lastDay = new Date(
                Number(year),
                Number(month),
                0
            ).getDate()

            const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`

            const { data, error } = await supabase
                .from("class_sessions")
                .select("*")
                .gte("class_date", startDate)
                .lte("class_date", endDate)
                .order("class_date", { ascending: false })

            if (error) throw error

            setMonthlySessions(
                (data || []) as ClassSession[]
            )

        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar histórico mensal")
        }
    }

    async function addSession(
        turno: ClassSession["turno"]
    ) {
        try {
            setSaving(true)

            const existingSessions = sessions.filter(
                (item) => item.turno === turno
            )

            const nextNumber = existingSessions.reduce(
                (max, item) => Math.max(max, item.aula_numero),
                0
            ) + 1

            const { data, error } = await supabase
                .from("class_sessions")
                .insert({
                    class_date: date,
                    turno,
                    aula_numero: nextNumber,
                    status: "realizada",
                })
                .select()
                .single()

            if (error) throw error

            setSessions((prev) =>
                [...prev, data as ClassSession].sort(
                    (a, b) =>
                        a.turno.localeCompare(b.turno) ||
                        a.aula_numero - b.aula_numero
                )
            )

            toast.success("Aula registrada com sucesso")

            await loadMonthlySessions(date)

        } catch (error) {
            console.error(error)
            toast.error("Erro ao registrar aula")
        } finally {
            setSaving(false)
        }
    }

    async function toggleStatus(
        session: ClassSession
    ) {
        const newStatus =
            session.status === "realizada"
                ? "cancelada"
                : "realizada"

        try {
            setSaving(true)

            const { error } = await supabase
                .from("class_sessions")
                .update({
                    status: newStatus,
                })
                .eq("id", session.id)

            if (error) throw error

            setSessions((prev) =>
                prev.map((item) =>
                    item.id === session.id
                        ? {
                            ...item,
                            status: newStatus,
                        }
                        : item
                )
            )

            toast.success(
                newStatus === "realizada"
                    ? "Aula marcada como realizada"
                    : "Aula marcada como cancelada"
            )

            await loadMonthlySessions(date)

        } catch (error) {
            console.error(error)
            toast.error("Erro ao atualizar aula")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Seleção de data */}

            <div className="
                rounded-[2rem]
                border
                border-border
                bg-card/80
                p-5
                shadow-sm
            ">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-lg font-bold">
                            Data das atividades
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            Selecione o dia para consultar ou registrar aulas.
                        </p>
                    </div>

                    <div className="relative">
                        <CalendarDays className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-muted
                        "/>

                        <input
                            type="date"
                            value={date}
                            onChange={(event) =>
                                handleDateChange(event.target.value)
                            }
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-background
                                pl-10
                                pr-3
                                text-sm
                                outline-none
                                focus:border-primary
                                sm:w-auto
                            "
                        />
                    </div>

                </div>
            </div>

            {/* Indicadores */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 text-emerald-500">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <p className="text-sm text-muted">
                        Aulas realizadas
                    </p>

                    <p className="mt-1 text-3xl font-black">
                        {stats.realized}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 text-red-500">
                        <XCircle className="h-5 w-5" />
                    </div>

                    <p className="text-sm text-muted">
                        Aulas canceladas
                    </p>

                    <p className="mt-1 text-3xl font-black">
                        {stats.cancelled}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 text-primary">
                        <CalendarDays className="h-5 w-5" />
                    </div>

                    <p className="text-sm text-muted">
                        Total registrado
                    </p>

                    <p className="mt-1 text-3xl font-black">
                        {stats.total}
                    </p>
                </div>

            </div>


            {/* Indicadores mensais */}

            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-bold">
                        Resumo mensal
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Acompanhamento das atividades no mês selecionado.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-3 text-emerald-500">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-muted">
                            Aulas realizadas
                        </p>

                        <p className="mt-1 text-2xl font-black">
                            {monthlyStats.realized}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-3 text-red-500">
                            <XCircle className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-muted">
                            Aulas canceladas
                        </p>

                        <p className="mt-1 text-2xl font-black">
                            {monthlyStats.cancelled}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-3 text-primary">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-muted">
                            Total registrado
                        </p>

                        <p className="mt-1 text-2xl font-black">
                            {monthlyStats.total}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-3 text-primary">
                            <Sun className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-muted">
                            Dias com atividades
                        </p>

                        <p className="mt-1 text-2xl font-black">
                            {monthlyStats.activeDays}
                        </p>
                    </div>

                </div>
            </div>


            <MonthlyCalendar
                date={date}
                sessions={monthlySessions}
                onMonthChange={handleDateChange}
            />

            {/* Turnos */}

            <div className="
                rounded-[2rem]
                border
                border-border
                bg-card/80
                p-5
                shadow-sm
            ">
                <div className="mb-6">
                    <h2 className="text-xl font-black tracking-tight">
                        Registro de aulas
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Adicione somente as aulas programadas para este dia.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-muted">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando aulas...
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">

                        {shifts.map((shift) => {
                            const Icon = shift.icon

                            const shiftSessions = sessions
                                .filter((item) => item.turno === shift.name)
                                .sort((a, b) => a.aula_numero - b.aula_numero)

                            return (
                                <div
                                    key={shift.name}
                                    className="rounded-2xl border border-border bg-background/50 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h3 className="font-bold">
                                                    {shift.name}
                                                </h3>

                                                <p className="text-xs text-muted">
                                                    {shiftSessions.length}{" "}
                                                    {shiftSessions.length === 1
                                                        ? "aula registrada"
                                                        : "aulas registradas"}
                                                </p>
                                            </div>
                                        </div>

                                        <AppButton
                                            variant="secondary"
                                            onClick={() =>
                                                addSession(shift.name)
                                            }
                                            disabled={saving}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Adicionar
                                        </AppButton>

                                    </div>

                                    {shiftSessions.length > 0 ? (
                                        <div className="flex flex-col gap-2">

                                            {shiftSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                        rounded-xl
                                                        border
                                                        border-border
                                                        bg-card
                                                        p-3
                                                    "
                                                >
                                                    <div>
                                                        <p className="font-semibold">
                                                            {session.aula_numero}ª aula
                                                        </p>

                                                        <p className="text-xs text-muted">
                                                            {session.status === "realizada"
                                                                ? "Atividade registrada"
                                                                : "Aula cancelada"}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={saving}
                                                        onClick={() =>
                                                            toggleStatus(session)
                                                        }
                                                        className={`
                                                            rounded-full
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-bold
                                                            transition
                                                            disabled:opacity-50
                                                            ${session.status === "realizada"
                                                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                                                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                            }
                                                        `}
                                                    >
                                                        {session.status === "realizada"
                                                            ? "Realizada"
                                                            : "Cancelada"}
                                                    </button>
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border p-5 text-center">
                                            <p className="text-sm text-muted">
                                                Nenhuma aula registrada neste turno.
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )
                        })}

                    </div>
                )}
            </div>

        </div>
    )
}
