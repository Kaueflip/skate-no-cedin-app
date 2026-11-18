"use client"

import {
    useMemo,
    useState,
    useRef,
} from "react"

import {
    toast,
} from "sonner"

import {
    createClient,
} from "@/lib/supabase-browser"

import type {
    Student,
} from "@/types/student"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    AttendanceList,
} from "@/components/attendance/attendance-list"

import {
    AttendanceFilters,
} from "@/components/attendance/attendance-filters"

import {
    ConfirmAbsencesDialog,
} from "@/components/attendance/confirm-absences-dialog"

type Props = {

    students: Student[]

    initialAttendanceMap:
    Record<string, boolean>

    initialDate: string
}

const supabase =
    createClient()

export function AttendanceClient({
    students,
    initialAttendanceMap,
    initialDate,
}: Props) {

    const [saving, setSaving] =
        useState(false)

    const [loadingDate, setLoadingDate] =
        useState(false)

    const [search, setSearch] =
        useState("")

    const [turno, setTurno] =
        useState("all")

    const [date, setDate] =
        useState(initialDate)

    const [attendanceMap, setAttendanceMap] =
        useState(
            initialAttendanceMap
        )

    const dateRequest = useRef(0)

    const filteredStudents =
        useMemo(() => {

            return students.filter(
                (student) => {

                    const matchesSearch =
                        student.nome
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )

                    const matchesTurno =
                        turno === "all" ||
                        student.turno === turno ||
                        (
                            turno === "Tarde" &&
                            student.turno === "Integral"
                        )

                    return (
                        matchesSearch &&
                        matchesTurno
                    )
                }
            )

        }, [
            students,
            search,
            turno,
        ])

    const [confirmAbsencesOpen, setConfirmAbsencesOpen] =
        useState(false)

    async function handleDateChange(newDate: string) {
        if (!newDate) return

        const requestId = ++dateRequest.current

        try {
            setLoadingDate(true)
            setDate(newDate)

            // Limpa os dados anteriores imediatamente
            setAttendanceMap({})

            const { data, error } = await supabase
                .from("attendance")
                .select("*")
                .eq("class_date", newDate)

            if (requestId !== dateRequest.current) return

            if (error) throw error

            const mapped = (data || []).reduce(
                (acc, item) => {
                    if (item.student_id) {
                        acc[item.student_id] = item.present ?? false
                    }

                    return acc
                },
                {} as Record<string, boolean>
            )

            setAttendanceMap(mapped)

        } catch (error) {
            console.error(error)

            if (requestId === dateRequest.current) {
                setAttendanceMap({})
                toast.error("Erro ao carregar presença")
            }

        } finally {
            if (requestId === dateRequest.current) {
                setLoadingDate(false)
            }
        }
    }

    function toggleAttendance(
        studentId: string
    ) {

        setAttendanceMap(
            (prev) => ({
                ...prev,

                [studentId]:
                    !prev[studentId],
            })
        )
    }

    function markAllPresent() {

        const updated =
            filteredStudents.reduce(
                (acc, student) => {

                    acc[
                        student.id
                    ] = true

                    return acc

                },

                {
                    ...attendanceMap,
                } as Record<
                    string,
                    boolean
                >
            )

        setAttendanceMap(
            updated
        )
    }

    async function handleSaveAttendance() {

        if (loadingDate) {
            toast.error("Aguarde o carregamento das presenças")
            return
        }

        const presentCount = filteredStudents.filter(
            (student) => attendanceMap[student.id] === true
        ).length

        if (presentCount === 0 && filteredStudents.length > 0) {
            setConfirmAbsencesOpen(true)
            return
        }

        await saveAttendance()
    }

    async function saveAttendance() {

        try {

            setSaving(true)

            const payload = filteredStudents.map((student) => ({
                student_id: student.id,
                class_date: date,
                present: attendanceMap[student.id] === true,
            }))

            if (payload.length === 0) {
                toast.error("Nenhum aluno encontrado")
                return
            }

            const { error } = await supabase
                .from("attendance")
                .upsert(
                    payload,
                    {
                        onConflict: "student_id,class_date",
                    }
                )

            if (error) throw error

            toast.success("Presença salva")

            setConfirmAbsencesOpen(false)

        } catch (error) {

            console.error(error)

            toast.error("Erro ao salvar presença")

        } finally {

            setSaving(false)
        }
    }

    return (

        <div className="
            flex
            flex-col
            gap-6
        ">

            <div className="
                rounded-[2rem]

                border
                border-border

                bg-card/80

                p-5

                shadow-sm

                backdrop-blur-xl
            ">

                <AttendanceFilters
                    search={search}
                    onSearchChange={
                        setSearch
                    }
                    turno={turno}
                    onTurnoChange={
                        setTurno
                    }
                    date={date}
                    onDateChange={
                        handleDateChange
                    }
                />

            </div>

            <div className="
                flex
                flex-wrap
                gap-3
            ">

                <AppButton
                    variant="secondary"
                    onClick={
                        markAllPresent
                    }
                >

                    Marcar Todos

                </AppButton>

                <AppButton
                    onClick={handleSaveAttendance}
                    loading={saving}
                >
                    Salvar Presença
                </AppButton>

            </div>

            <div className="
                rounded-[2rem]

                border
                border-border

                bg-card/80

                p-5

                shadow-sm

                backdrop-blur-xl
            ">

                <div className="
                    mb-6

                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-2xl
                            font-black
                            tracking-tight

                            text-foreground
                        ">

                            Lista de Presença

                        </h2>

                        <p className="
                            mt-1

                            text-muted
                        ">

                            {
                                filteredStudents.length
                            }{" "}
                            alunos encontrados

                        </p>

                    </div>

                </div>

                {loadingDate ? (

                    <div className="
                        py-20

                        text-center

                        text-muted
                    ">

                        Carregando presença...

                    </div>

                ) : (

                    <AttendanceList
                        students={
                            filteredStudents
                        }
                        attendanceMap={
                            attendanceMap
                        }
                        onToggle={
                            toggleAttendance
                        }
                    />

                )}

            </div>

            <ConfirmAbsencesDialog
                open={confirmAbsencesOpen}
                onOpenChange={setConfirmAbsencesOpen}
                onConfirm={saveAttendance}
                loading={saving}
                studentCount={filteredStudents.length}
            />

        </div>
    )
}