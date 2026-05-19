"use client"

import {
    useMemo,
    useState,
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
                        turno === "all"
                            ? true
                            : student.turno ===
                            turno

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

    async function handleDateChange(
        newDate: string
    ) {

        try {

            setLoadingDate(true)

            setDate(newDate)

            const {
                data,
                error,
            } = await supabase
                .from("attendance")
                .select("*")
                .eq(
                    "class_date",
                    newDate
                )

            if (error)
                throw error

            const mapped =
                (data || []).reduce(
                    (
                        acc,
                        item
                    ) => {

                        acc[
                            item.student_id
                        ] =
                            item.present

                        return acc

                    },

                    {} as Record<
                        string,
                        boolean
                    >
                )

            setAttendanceMap(
                mapped
            )

        } catch (error) {

            console.error(error)

            toast.error(
                "Erro ao carregar presença"
            )

        } finally {

            setLoadingDate(false)
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

    async function saveAttendance() {

        try {

            setSaving(true)

            const payload =
                Object.entries(
                    attendanceMap
                ).map(
                    ([
                        studentId,
                        present,
                    ]) => ({
                        student_id:
                            studentId,

                        class_date:
                            date,

                        present,
                    })
                )

            if (
                payload.length === 0
            ) {

                toast.error(
                    "Nenhum aluno marcado"
                )

                return
            }

            const { error } =
                await supabase
                    .from("attendance")
                    .upsert(
                        payload,
                        {
                            onConflict:
                                "student_id,class_date",
                        }
                    )

            if (error) {

                console.error(error)

                toast.error(
                    error.message
                )

                return
            }

            toast.success(
                "Presença salva"
            )

        } catch (error) {

            console.error(error)

            toast.error(
                "Erro ao salvar"
            )

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
                    onClick={
                        saveAttendance
                    }
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

        </div>
    )
}