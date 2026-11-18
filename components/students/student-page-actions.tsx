
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

import {
    DeleteStudentDialog,
} from "@/components/students/delete-student-dialog"

type Props = {
    student: Student
}

export function StudentPageActions({
    student,
}: Props) {

    const router = useRouter()
    const supabase = createClient()

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [isActivating, setIsActivating] = useState(false)

    async function handleActivate() {

        if (isActivating) return

        setIsActivating(true)

        const { error } = await supabase
            .from("students")
            .update({
                ativo: true,
            })
            .eq("id", student.id)

        if (error) {
            console.error("Erro ao reativar aluno:", error)

            toast.error("Não foi possível reativar o aluno.")

            setIsActivating(false)
            return
        }

        toast.success("Aluno reativado com sucesso!")

        router.refresh()

        setIsActivating(false)
    }

    const isActive = student.ativo !== false

    return (
        <>
            <div className="
                flex
                flex-wrap
                gap-3
            ">

                <AppButton
                    onClick={() => setEditOpen(true)}
                >
                    Editar aluno
                </AppButton>

                {isActive ? (

                    <AppButton
                        variant="danger"
                        onClick={() => setDeleteOpen(true)}
                    >
                        Desativar aluno
                    </AppButton>

                ) : (

                    <AppButton
                        onClick={handleActivate}
                        disabled={isActivating}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"

                    >
                        {isActivating
                            ? "Reativando..."
                            : "Reativar aluno"}
                    </AppButton>

                )}

            </div>

            <EditStudentDialog
                student={student}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            {isActive && (
                <DeleteStudentDialog
                    student={student}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            )}

        </>
    )
}
