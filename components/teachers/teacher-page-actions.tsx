
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
    Teacher,
} from "@/types/teacher"

import {
    EditTeacherDialog,
} from "@/components/teachers/edit-teacher-dialog"

import {
    AppButton,
} from "@/components/ui/app-button"

type Props = {
    teacher: Teacher
    currentPhotoUrl: string | null
}

export function TeacherPageActions({
    teacher,
    currentPhotoUrl,
}: Props) {

    const router = useRouter()
    const supabase = createClient()

    const [editOpen, setEditOpen] = useState(false)
    const [isChangingStatus, setIsChangingStatus] = useState(false)

    const isActive = teacher.ativo !== false

    async function handleToggleActive() {

        if (isChangingStatus) return

        setIsChangingStatus(true)

        const newStatus = !isActive

        const { error } = await supabase
            .from("teachers")
            .update({
                ativo: newStatus,
            })
            .eq("id", teacher.id)

        if (error) {

            console.error(
                "Erro ao alterar situação do professor:",
                error
            )

            toast.error(
                "Não foi possível alterar a situação do professor."
            )

            setIsChangingStatus(false)
            return
        }

        toast.success(
            newStatus
                ? "Professor reativado com sucesso!"
                : "Professor desativado com sucesso!"
        )

        router.refresh()

        setIsChangingStatus(false)
    }

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
                    Editar professor
                </AppButton>

                {isActive ? (

                    <AppButton
                        variant="danger"
                        onClick={handleToggleActive}
                        disabled={isChangingStatus}
                    >
                        {isChangingStatus
                            ? "Desativando..."
                            : "Desativar professor"}
                    </AppButton>

                ) : (

                    <AppButton
                        onClick={handleToggleActive}
                        disabled={isChangingStatus}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        {isChangingStatus
                            ? "Reativando..."
                            : "Reativar professor"}
                    </AppButton>

                )}

            </div>

            <EditTeacherDialog
                teacher={teacher}
                currentPhotoUrl={currentPhotoUrl}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    )
}
