
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
    Plus,
    CheckCircle2,
    XCircle,
    Loader2,
    Trash2,
    Clock3,
    Users,
    Moon,
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

import {
    DeleteSessionDialog,
} from "@/components/classes/delete-session-dialog"

import {
    SessionTeachersDialog,
} from "@/components/classes/session-teachers-dialog"

type ClassSession = {
    id: string
    class_date: string
    turno: "Manhã" | "Tarde" | "Noite"
    aula_numero: number
    status: "realizada" | "cancelada"
    observacoes: string | null
    created_at: string
}

type SessionTeacher = {
    id: string
    nome: string
    funcao: string | null
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

const classTimes: Partial<
    Record<
        ClassSession["turno"],
        Partial<Record<1 | 2, string>>
    >
> = {
    Manhã: {
        1: "07:30 – 09:15",
        2: "09:45 – 11:30",
    },
    Tarde: {
        1: "13:00 – 14:45",
        2: "15:15 – 17:00",
    },
}

const CLASS_DURATION_MINUTES = 105

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}h${remainingMinutes > 0
        ? ` ${remainingMinutes}min`
        : ""
        }`
}

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

    const [sessionTeachers, setSessionTeachers] =
        useState<Record<string, SessionTeacher[]>>({})

    const [teachersDialog, setTeachersDialog] = useState<{
        open: boolean
        sessionId: string | null
    }>({
        open: false,
        sessionId: null,
    })

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        session: ClassSession | null
    }>({
        open: false,
        session: null,
    })

    async function fetchSessionTeachers(
        sessionList: ClassSession[]
    ): Promise<Record<string, SessionTeacher[]>> {
        if (sessionList.length === 0) {
            return {}
        }

        const sessionIds = sessionList.map(
            (session) => session.id
        )

        const { data, error } = await supabase
            .from("class_session_teachers")
            .select(`
                class_session_id,
                teachers (
                    id,
                    nome,
                    funcao
                )
            `)
            .in("class_session_id", sessionIds)

        if (error) throw error

        const grouped: Record<string, SessionTeacher[]> = {}

        for (const assignment of data || []) {
            const teacher = Array.isArray(assignment.teachers)
                ? assignment.teachers[0]
                : assignment.teachers

            if (!teacher) continue

            if (!grouped[assignment.class_session_id]) {
                grouped[assignment.class_session_id] = []
            }

            grouped[assignment.class_session_id].push({
                id: teacher.id,
                nome: teacher.nome,
                funcao: teacher.funcao,
            })
        }

        return grouped
    }

    // Carrega os professores vinculados às aulas
    useEffect(() => {
        if (sessions.length === 0) return

        let cancelled = false

        async function load() {
            try {
                const grouped = await fetchSessionTeachers(sessions)

                if (!cancelled) {
                    setSessionTeachers(grouped)
                }
            } catch (error) {
                console.error(
                    "LOAD_SESSION_TEACHERS_ERROR",
                    error
                )

                if (!cancelled) {
                    toast.error(
                        "Erro ao carregar professores das aulas."
                    )
                }
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [sessions])

    // Carrega as aulas do mês selecionado
    useEffect(() => {
        let cancelled = false

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

                if (!cancelled) {
                    setMonthlySessions(
                        (data || []) as ClassSession[]
                    )
                }
            } catch (error) {
                console.error(error)

                if (!cancelled) {
                    toast.error(
                        "Erro ao carregar histórico mensal"
                    )
                }
            }
        }

        fetchMonthlySessions()

        return () => {
            cancelled = true
        }
    }, [date])

    const stats = useMemo(() => {
        const realized = sessions.filter(
            (item) => item.status === "realizada"
        )

        const cancelled = sessions.filter(
            (item) => item.status === "cancelada"
        )

        return {
            realized: realized.length,
            cancelled: cancelled.length,
            total: sessions.length,
            hours: realized.length * CLASS_DURATION_MINUTES,
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
            hours: realized.length * CLASS_DURATION_MINUTES,
        }
    }, [monthlySessions])

    async function handleDateChange(newDate: string) {
        if (!newDate) return

        try {
            setLoading(true)
            setDate(newDate)
            setSessions([])
            setSessionTeachers({})

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

    async function loadMonthlySessions(selectedDate: string) {
        try {
            const [year, month] = selectedDate.split("-")

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

    async function addSession(turno: ClassSession["turno"]) {
        try {
            setSaving(true)

            const existingSessions = sessions.filter(
                (item) => item.turno === turno
            )

            const usedNumbers = existingSessions.map(
                (item) => item.aula_numero
            )

            const nextNumber = ([1, 2] as const).find(
                (number) => !usedNumbers.includes(number)
            )

            if (!nextNumber) {
                toast.error(
                    "As duas aulas deste turno já foram registradas."
                )
                return
            }

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

            const newSession = data as ClassSession

            setSessions((prev) =>
                [...prev, newSession].sort(
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

    async function toggleStatus(session: ClassSession) {
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

    function handleSessionDeleted(sessionId: string) {
        setSessions((prev) =>
            prev.filter((item) => item.id !== sessionId)
        )

        setMonthlySessions((prev) =>
            prev.filter((item) => item.id !== sessionId)
        )

        setSessionTeachers((prev) => {
            const updated = { ...prev }
            delete updated[sessionId]
            return updated
        })

        setDeleteDialog({
            open: false,
            session: null,
        })
    }

    async function handleTeachersSaved() {
        try {
            const grouped = await fetchSessionTeachers(sessions)
            setSessionTeachers(grouped)
        } catch (error) {
            console.error(
                "REFRESH_SESSION_TEACHERS_ERROR",
                error
            )

            toast.error(
                "Erro ao atualizar professores da aula."
            )
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

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">

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

                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="mb-3 text-primary">
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-muted">
                            Carga horária
                        </p>

                        <p className="mt-1 text-2xl font-black">
                            {formatDuration(monthlyStats.hours)}
                        </p>
                    </div>

                </div>
            </div>

            <MonthlyCalendar
                date={date}
                sessions={monthlySessions}
                onMonthChange={handleDateChange}
                onDaySelect={handleDateChange}
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
                                            onClick={() => addSession(shift.name)}
                                            disabled={saving || shiftSessions.length >= 2}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Adicionar
                                        </AppButton>

                                    </div>

                                    {shiftSessions.length > 0 ? (

                                        <div className="flex flex-col gap-3">

                                            {shiftSessions.map((session) => {
                                                const assignedTeachers =
                                                    sessionTeachers[session.id] || []

                                                return (
                                                    <div
                                                        key={session.id}
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-border
                                                            bg-card
                                                            p-4
                                                        "
                                                    >

                                                        <div className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                        ">

                                                            <div>
                                                                <p className="font-semibold">
                                                                    {session.aula_numero}ª aula
                                                                </p>

                                                                <p className="text-xs font-medium text-primary">
                                                                    {classTimes[session.turno]?.[
                                                                        session.aula_numero as 1 | 2
                                                                    ] || "Horário não definido"}
                                                                </p>

                                                                <p className="text-xs text-muted">
                                                                    {session.status === "realizada"
                                                                        ? "Atividade registrada"
                                                                        : "Aula cancelada"}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-2">

                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() => toggleStatus(session)}
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

                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() =>
                                                                        setDeleteDialog({
                                                                            open: true,
                                                                            session,
                                                                        })
                                                                    }
                                                                    title="Excluir aula"
                                                                    aria-label="Excluir aula"
                                                                    className="
                                                                        flex
                                                                        h-9
                                                                        w-9
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        text-muted
                                                                        transition
                                                                        hover:bg-red-500/10
                                                                        hover:text-red-500
                                                                        disabled:opacity-50
                                                                    "
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>

                                                            </div>

                                                        </div>

                                                        <div className="
                                                            mt-4
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                            border-t
                                                            border-border
                                                            pt-3
                                                        ">

                                                            <div className="flex min-w-0 flex-1 items-center gap-2">

                                                                <Users className="h-4 w-4 shrink-0 text-muted" />

                                                                {assignedTeachers.length > 0 ? (

                                                                    <div className="flex flex-wrap gap-2">

                                                                        {assignedTeachers.map((teacher) => (
                                                                            <span
                                                                                key={teacher.id}
                                                                                className="
                                                                                    rounded-lg
                                                                                    bg-primary/10
                                                                                    px-2
                                                                                    py-1
                                                                                    text-xs
                                                                                    font-medium
                                                                                    text-primary
                                                                                "
                                                                            >
                                                                                {teacher.nome}
                                                                            </span>
                                                                        ))}

                                                                    </div>

                                                                ) : (

                                                                    <span className="text-xs text-muted">
                                                                        Nenhum professor vinculado
                                                                    </span>

                                                                )}

                                                            </div>

                                                            <AppButton
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    setTeachersDialog({
                                                                        open: true,
                                                                        sessionId: session.id,
                                                                    })
                                                                }
                                                            >
                                                                <Users className="mr-2 h-4 w-4" />
                                                                Professores
                                                            </AppButton>

                                                        </div>

                                                    </div>
                                                )
                                            })}

                                        </div>

                                    ) : (

                                        <div className="
                                            rounded-xl
                                            border
                                            border-dashed
                                            border-border
                                            p-5
                                            text-center
                                        ">
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

            {deleteDialog.session && (
                <DeleteSessionDialog
                    sessionId={deleteDialog.session.id}
                    turno={deleteDialog.session.turno}
                    aulaNumero={deleteDialog.session.aula_numero}
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog((prev) => ({
                            ...prev,
                            open,
                        }))
                    }
                    onDeleted={handleSessionDeleted}
                />
            )}

            {teachersDialog.sessionId && (
                <SessionTeachersDialog
                    sessionId={teachersDialog.sessionId}
                    open={teachersDialog.open}
                    onOpenChange={(open) =>
                        setTeachersDialog((prev) => ({
                            ...prev,
                            open,
                        }))
                    }
                    onSaved={handleTeachersSaved}
                />
            )}

        </div>
    )
}
