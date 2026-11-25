
"use client"

import {
    useState,
    useEffect,
} from "react"

import {
    CalendarDays,
    ChevronDown,
    Sun,
    Sunset,
    Plus,
    Loader2,
    Trash2,
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

export function ClassesClient({
    initialSessions,
    initialDate,
}: Props) {
    const [date, setDate] = useState(initialDate)

    const [sessions, setSessions] =
        useState<ClassSession[]>(initialSessions)

    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [shiftFilter, setShiftFilter] = useState<ClassSession["turno"]>("Manhã")
    const [monthRevision, setMonthRevision] = useState(0)
    const monthKey = date.slice(0, 7)

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
        if (sessions.length === 0) {
            setSessionTeachers({})
            return
        }

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
                const [year, month] = monthKey.split("-")

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
    }, [monthKey, monthRevision])

    async function handleDateChange(newDate: string) {
        if (!newDate || loading || saving || deleteDialog.open || teachersDialog.open) return

        try {
            setLoading(true)
            setLoadError(false)
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
            setLoadError(true)
            toast.error("Erro ao carregar aulas")
        } finally {
            setLoading(false)
        }
    }

    async function addSession(turno: ClassSession["turno"]) {
        if (loading || saving || loadError) return
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

            setMonthlySessions((prev) => [...prev.filter((item) => item.id !== newSession.id), newSession])
            setMonthRevision((prev) => prev + 1)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao registrar aula")
        } finally {
            setSaving(false)
        }
    }

    async function toggleStatus(session: ClassSession) {
        if (loading || saving || loadError) return
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

            setMonthlySessions((prev) => prev.map((item) =>
                item.id === session.id ? { ...item, status: newStatus } : item
            ))
            setMonthRevision((prev) => prev + 1)
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

        setMonthRevision((prev) => prev + 1)

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

    const busy = loading || saving || deleteDialog.open || teachersDialog.open

    return (
        <div className="flex w-full min-w-0 flex-col gap-3 md:gap-5">
            <section className="min-w-0 rounded-[10px] border border-border bg-card p-3 shadow-sm sm:p-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold">Data das atividades</h2>
                        <p className="mt-0.5 text-xs text-muted">Selecione o dia para registrar ou consultar aulas.</p>
                    </div>
                    <div className="min-w-0 w-full sm:w-auto">
                        <input
                            aria-label="Data das atividades"
                            type="date"
                            value={date}
                            disabled={busy}
                            onChange={(event) => handleDateChange(event.target.value)}
                            className="h-11 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary disabled:opacity-50 md:text-sm"
                        />
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Turno das aulas">
                    {shifts.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            type="button"
                            aria-pressed={shiftFilter === name}
                            disabled={busy}
                            onClick={() => setShiftFilter(name)}
                            className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-1.5 text-xs font-semibold transition-colors disabled:opacity-50 sm:text-sm ${shiftFilter === name ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/60 hover:bg-accent"}`}
                        >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="min-w-0 rounded-[10px] border border-border bg-card p-3 shadow-sm sm:p-4 lg:p-5">
                <div className="mb-3">
                    <h2 className="text-base font-bold md:text-lg">Registro de aulas</h2>
                    <p className="mt-0.5 text-xs text-muted">Adicione somente as aulas programadas para este dia.</p>
                </div>
                {loading ? (
                    <div role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" /> Carregando aulas...
                    </div>
                ) : loadError ? (
                    <div className="rounded-lg border border-dashed border-border p-4 text-center">
                        <p className="text-sm text-muted">Não foi possível carregar as aulas desta data.</p>
                        <AppButton variant="secondary" onClick={() => handleDateChange(date)} className="mt-3 h-11 text-xs">Tentar novamente</AppButton>
                    </div>
                ) : (
                    shifts.filter((shift) => shift.name === shiftFilter).map((shift) => {
                        const Icon = shift.icon
                        const shiftSessions = sessions.filter((item) => item.turno === shift.name).sort((a, b) => a.aula_numero - b.aula_numero)
                        return (
                            <div key={shift.name} className="min-w-0 space-y-3">
                                <div className="flex min-w-0 items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold">{shift.name}</h3>
                                            <p className="text-[11px] text-muted">{shiftSessions.length} {shiftSessions.length === 1 ? "aula registrada" : "aulas registradas"}</p>
                                        </div>
                                    </div>
                                    <AppButton variant="secondary" onClick={() => addSession(shift.name)} disabled={busy || shiftSessions.length >= 2} className="h-11 shrink-0 gap-1.5 px-3 text-xs sm:text-sm">
                                        <Plus className="h-4 w-4" /> Adicionar
                                    </AppButton>
                                </div>
                                {shiftSessions.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">Nenhuma aula registrada neste turno.</div>
                                ) : (
                                    <div className="grid min-w-0 gap-2 xl:grid-cols-2">
                                        {shiftSessions.map((session) => {
                                            const assignedTeachers = sessionTeachers[session.id] || []
                                            const realized = session.status === "realizada"
                                            return (
                                                <article key={session.id} className="min-w-0 space-y-3 rounded-lg border border-border bg-background/60 p-3">
                                                    <div className="flex min-w-0 items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold">{session.aula_numero}ª aula</p>
                                                            <p className="mt-1 text-xs font-medium text-primary">{classTimes[session.turno]?.[session.aula_numero as 1 | 2] || "Horário não definido"}</p>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-1.5">
                                                            <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${realized ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>{realized ? "Realizada" : "Cancelada"}</span>
                                                            <button type="button" disabled={busy} onClick={() => setDeleteDialog({open: true, session})} aria-label="Excluir aula" title="Excluir aula" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button type="button" aria-pressed={realized} disabled={busy || realized} onClick={() => toggleStatus(session)} className={`min-h-11 rounded-lg border px-2 text-xs font-semibold ${realized ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border hover:bg-accent"}`}>Realizada</button>
                                                        <button type="button" aria-pressed={!realized} disabled={busy || !realized} onClick={() => toggleStatus(session)} className={`min-h-11 rounded-lg border px-2 text-xs font-semibold ${!realized ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-border hover:bg-accent"}`}>Cancelada</button>
                                                    </div>
                                                    <div className="space-y-2 border-t border-border pt-3">
                                                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted"><Users className="h-4 w-4 shrink-0" /> Professores responsáveis</p>
                                                        {assignedTeachers.length > 0 ? (
                                                            <div className="flex min-w-0 flex-wrap gap-1.5">
                                                                {assignedTeachers.map((teacher) => <span key={teacher.id} className="max-w-full rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary [overflow-wrap:anywhere]">{teacher.nome}</span>)}
                                                            </div>
                                                        ) : <p className="text-xs text-muted">Nenhum professor vinculado</p>}
                                                        <AppButton variant="secondary" disabled={busy} onClick={() => setTeachersDialog({open: true, sessionId: session.id})} className="h-11 w-full gap-1.5 px-3 text-xs sm:w-auto sm:text-sm"><Users className="h-4 w-4" /> Professores</AppButton>
                                                    </div>
                                                    {session.observacoes?.trim() && <p className="border-t border-border pt-2 text-xs text-muted whitespace-pre-wrap [overflow-wrap:anywhere]">{session.observacoes}</p>}
                                                </article>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </section>

            <details className="group min-w-0 rounded-[10px] border border-border bg-card shadow-sm">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary" /> Calendário de atividades
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="min-w-0 border-t border-border p-2 sm:p-3">
                    <MonthlyCalendar date={date} sessions={monthlySessions} onMonthChange={handleDateChange} onDaySelect={handleDateChange} disabled={busy} />
                </div>
            </details>

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

            {teachersDialog.sessionId && teachersDialog.open && (
                <SessionTeachersDialog
                    key={teachersDialog.sessionId}
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
