"use client"

import { useMemo, useRef, useState } from "react"
import { CheckCheck, Save, X } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase-browser"
import type { Student } from "@/types/student"
import { AppButton } from "@/components/ui/app-button"
import { AttendanceList } from "@/components/attendance/attendance-list"
import { AttendanceFilters } from "@/components/attendance/attendance-filters"
import { ConfirmAbsencesDialog } from "@/components/attendance/confirm-absences-dialog"

type Props = {
    students: Student[]
    initialAttendanceMap: Record<string, boolean>
    initialDate: string
}

const supabase = createClient()

function matchesShift(student: Student, turno: string) {
    return turno === "all" || student.turno === turno ||
        (turno === "Tarde" && student.turno === "Integral")
}

function normalizeText(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export function AttendanceClient({
    students,
    initialAttendanceMap,
    initialDate,
}: Props) {
    const [saving, setSaving] = useState(false)
    const [loadingDate, setLoadingDate] = useState(false)
    const [dateError, setDateError] = useState(false)
    const [search, setSearch] = useState("")
    const [turno, setTurno] = useState("all")
    const [turma, setTurma] = useState("all")
    const [date, setDate] = useState(initialDate)
    const [attendanceMap, setAttendanceMap] = useState(initialAttendanceMap)
    const [confirmAbsencesOpen, setConfirmAbsencesOpen] = useState(false)
    const dateRequest = useRef(0)
    const saveLock = useRef(false)

    const schoolClasses = useMemo(() => {
        const classes = new Map<string, string>()
        for (const student of students) {
            if (!student.turma?.trim() || !matchesShift(student, turno)) continue
            classes.set(student.school_class_id || student.turma, student.turma)
        }
        return Array.from(classes.entries())
            .map(([id, nome]) => ({ id, nome }))
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true }))
    }, [students, turno])

    const filteredStudents = useMemo(() => {
        const query = normalizeText(search)
        return students.filter((student) =>
            normalizeText(student.nome).includes(query) &&
            matchesShift(student, turno) &&
            (turma === "all" || (student.school_class_id || student.turma) === turma)
        )
    }, [students, search, turno, turma])

    const presentCount = filteredStudents.filter(
        (student) => attendanceMap[student.id] === true
    ).length
    const total = filteredStudents.length
    const percentage = total ? (presentCount / total) * 100 : 0
    const locked = saving || loadingDate || dateError || confirmAbsencesOpen
    const cannotSave = locked || total === 0

    async function handleDateChange(newDate: string) {
        if (!newDate || saving || saveLock.current || confirmAbsencesOpen) return
        const requestId = ++dateRequest.current
        setLoadingDate(true)
        setDateError(false)
        setDate(newDate)
        setAttendanceMap({})

        try {
            const { data, error } = await supabase
                .from("attendance")
                .select("student_id, present")
                .eq("class_date", newDate)

            if (requestId !== dateRequest.current) return
            if (error) throw error

            const mapped = (data || []).reduce((acc, item) => {
                if (item.student_id) acc[item.student_id] = item.present ?? false
                return acc
            }, {} as Record<string, boolean>)
            setAttendanceMap(mapped)
        } catch (error) {
            if (requestId !== dateRequest.current) return
            console.error("Erro ao carregar frequência:", error)
            setDateError(true)
            toast.error("Não foi possível carregar a frequência desta data.")
        } finally {
            if (requestId === dateRequest.current) setLoadingDate(false)
        }
    }

    function toggleAttendance(studentId: string) {
        if (locked || saveLock.current) return
        setAttendanceMap((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
    }

    function markAll(present: boolean) {
        if (locked || saveLock.current) return
        setAttendanceMap((prev) => {
            const updated = { ...prev }
            for (const student of filteredStudents) updated[student.id] = present
            return updated
        })
    }

    async function handleSaveAttendance() {
        if (cannotSave || saveLock.current) return
        if (presentCount === 0) {
            setConfirmAbsencesOpen(true)
            return
        }
        await saveAttendance()
    }

    async function saveAttendance() {
        if (saveLock.current || loadingDate || dateError || total === 0) return
        saveLock.current = true
        setSaving(true)
        try {
            const payload = filteredStudents.map((student) => ({
                student_id: student.id,
                class_date: date,
                present: attendanceMap[student.id] === true,
            }))

            const { error } = await supabase.from("attendance").upsert(payload, {
                onConflict: "student_id,class_date",
            })
            if (error) throw error
            setConfirmAbsencesOpen(false)
            toast.success("Frequência salva com sucesso.")
        } catch (error) {
            console.error("Erro ao salvar frequência:", error)
            toast.error("Não foi possível salvar a frequência.")
        } finally {
            saveLock.current = false
            setSaving(false)
        }
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-3 md:gap-5">
            <div className="min-w-0 rounded-[10px] border border-border bg-card p-3 shadow-sm sm:p-4">
                <AttendanceFilters
                    search={search}
                    onSearchChange={setSearch}
                    turno={turno}
                    onTurnoChange={(value) => {
                        setTurno(value)
                        setTurma("all")
                    }}
                    turma={turma}
                    onTurmaChange={setTurma}
                    schoolClasses={schoolClasses}
                    date={date}
                    onDateChange={handleDateChange}
                    disabled={saving || confirmAbsencesOpen}
                />
            </div>

            <section className="w-full min-w-0 rounded-[10px] border border-border bg-card p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-bold md:text-lg">Lista de presença</h2>
                    {!loadingDate && !dateError && (
                        <p aria-live="polite" className="text-xs tabular-nums text-muted">
                            <span className="font-semibold text-foreground">{presentCount}</span> de {total} presentes
                        </p>
                    )}
                </div>

                {!loadingDate && !dateError && total > 0 && (
                    <>
                        <div role="progressbar" aria-label="Alunos presentes na lista filtrada" aria-valuemin={0} aria-valuemax={total} aria-valuenow={presentCount} className="mb-3 h-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 sm:flex">
                            <AppButton variant="secondary" onClick={() => markAll(true)} disabled={locked || presentCount === total} className="h-11 min-w-0 gap-1.5 rounded-lg px-2 text-xs sm:px-3 sm:text-sm">
                                <CheckCheck className="h-4 w-4 shrink-0" />
                                Marcar todos
                            </AppButton>
                            <AppButton variant="secondary" onClick={() => markAll(false)} disabled={locked || presentCount === 0} className="h-11 min-w-0 gap-1.5 rounded-lg px-2 text-xs sm:px-3 sm:text-sm">
                                <X className="h-4 w-4 shrink-0" />
                                Desmarcar todos
                            </AppButton>
                        </div>
                    </>
                )}

                {loadingDate ? (
                    <p role="status" className="py-10 text-center text-sm text-muted">Carregando frequência...</p>
                ) : dateError ? (
                    <div role="alert" className="space-y-3 rounded-lg border border-dashed border-border p-4 text-center">
                        <p className="text-sm text-muted">Não foi possível carregar esta chamada. O salvamento está bloqueado.</p>
                        <AppButton variant="secondary" onClick={() => handleDateChange(date)} className="h-11 rounded-lg text-sm">Tentar novamente</AppButton>
                    </div>
                ) : (
                    <AttendanceList students={filteredStudents} attendanceMap={attendanceMap} onToggle={toggleAttendance} disabled={locked} />
                )}
            </section>

            {/* A barra fica no fluxo da página e acompanha a rolagem sem cobrir a última linha. */}
            <div className="sticky bottom-0 z-20 w-full min-w-0 rounded-[10px] border border-border bg-card p-2 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-3">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted">
                        {loadingDate || dateError ? "Frequência indisponível" : `${total} alunos nesta seleção`}
                        {!loadingDate && !dateError && total > 0 && <span className="block text-[11px]">Somente a lista filtrada será salva.</span>}
                    </p>
                    <AppButton onClick={handleSaveAttendance} loading={saving} disabled={cannotSave} className="h-11 w-full gap-2 rounded-lg text-sm sm:w-auto">
                        {!saving && <Save className="h-4 w-4 shrink-0" />}
                        Salvar frequência
                    </AppButton>
                </div>
            </div>

            <ConfirmAbsencesDialog
                open={confirmAbsencesOpen}
                onOpenChange={(open) => { if (!saving) setConfirmAbsencesOpen(open) }}
                onConfirm={saveAttendance}
                loading={saving}
                studentCount={total}
            />
        </div>
    )
}
