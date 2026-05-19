"use client"

import {
    useState,
} from "react"

import {
    useRouter,
} from "next/navigation"

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
    EditStudentDialog,
} from "@/components/students/edit-student-dialog"

type Props = {

    student: Student
}

const supabase =
    createClient()

export function StudentPageActions({
    student,
}: Props) {

    const router =
        useRouter()

    const [
        editOpen,
        setEditOpen,
    ] = useState(false)

    const [
        deleting,
        setDeleting,
    ] = useState(false)

    async function handleDelete() {

        const confirmed =
            window.confirm(
                `Remover ${student.nome}?`
            )

        if (!confirmed)
            return

        try {

            setDeleting(true)

            await supabase
                .from("attendance")
                .delete()
                .eq(
                    "student_id",
                    student.id
                )

            const {
                error,
            } = await supabase
                .from("students")
                .delete()
                .eq(
                    "id",
                    student.id
                )

            if (error)
                throw error

            toast.success(
                "Aluno removido"
            )

            router.push(
                "/students"
            )

            router.refresh()

        } catch (error) {

            console.error(
                "DELETE_STUDENT_ERROR",
                error
            )

            toast.error(
                "Erro ao remover aluno"
            )

        } finally {

            setDeleting(false)
        }
    }

    return (

        <>

            <div className="
                flex
                flex-wrap
                gap-3
            ">

                <AppButton
                    onClick={() =>
                        setEditOpen(
                            true
                        )
                    }
                >

                    Editar aluno

                </AppButton>

                <AppButton
                    variant="danger"
                    loading={deleting}
                    onClick={
                        handleDelete
                    }
                >

                    Remover aluno

                </AppButton>

            </div>

            <EditStudentDialog
                student={student}
                open={editOpen}
                onOpenChange={
                    setEditOpen
                }
            />

        </>
    )
}