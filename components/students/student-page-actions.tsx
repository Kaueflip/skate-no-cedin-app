
"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import {
    Pencil,
    UserCheck,
    UserX,
} from "lucide-react"

import { toast } from "sonner"

import { createClient } from "@/lib/supabase-browser"

import type { Student } from "@/types/student"

import { AppButton } from "@/components/ui/app-button"

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

    const isActive = student.ativo !== false

    async function handleActivate() {

        if (isActivating) return

        setIsActivating(true)

        try {

            const { error } = await supabase
                .from("students")
                .update({
                    ativo: true,
                })
                .eq("id", student.id)

            if (error) throw error

            toast.success("Aluno reativado com sucesso!")

            router.refresh()

        } catch (error) {

            console.error(
                "Erro ao reativar aluno:",
                error
            )

            toast.error(
                "Não foi possível reativar o aluno."
            )

        } finally {

            setIsActivating(false)
        }
    }

    return (
        <>
            <div className="
                grid
                w-full
                min-w-0
                grid-cols-2
                gap-2

                lg:flex
                lg:w-auto
            ">

                <AppButton
                    onClick={() => setEditOpen(true)}
                    disabled={isActivating}
                    className="
                        h-11
                        min-w-0
                        gap-1.5
                        rounded-lg
                        px-2
                        text-xs

                        sm:px-4
                        sm:text-sm
                    "
                >

                    <Pencil className="h-3.5 w-3.5 shrink-0" />

                    Editar aluno

                </AppButton>

                {isActive ? (

                    <AppButton
                        variant="danger"
                        onClick={() => setDeleteOpen(true)}
                        className="
                            h-11
                            min-w-0
                            gap-1.5
                            rounded-lg
                            px-2
                            text-xs

                            sm:px-4
                            sm:text-sm
                        "
                    >

                        <UserX className="h-3.5 w-3.5 shrink-0" />

                        Desativar

                    </AppButton>

                ) : (

                    <AppButton
                        onClick={handleActivate}
                        loading={isActivating}
                        className="
                            h-11
                            min-w-0
                            gap-1.5

                            rounded-lg

                            bg-emerald-600
                            px-2
                            text-xs
                            text-white

                            hover:bg-emerald-700

                            sm:px-4
                            sm:text-sm
                        "
                    >

                        {!isActivating && (
                            <UserCheck className="h-3.5 w-3.5 shrink-0" />
                        )}

                        {isActivating
                            ? "Reativando..."
                            : "Reativar"}

                    </AppButton>

                )}

            </div>

            <EditStudentDialog
                key={student.id}
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
