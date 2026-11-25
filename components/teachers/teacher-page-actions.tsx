"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, UserCheck, UserX } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase-browser"
import type { Teacher } from "@/types/teacher"
import { EditTeacherDialog } from "@/components/teachers/edit-teacher-dialog"
import { AppButton } from "@/components/ui/app-button"

type Props = { teacher: Teacher; currentPhotoUrl: string | null }

export function TeacherPageActions({ teacher, currentPhotoUrl }: Props) {
    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [isChangingStatus, setIsChangingStatus] = useState(false)
    const isActive = teacher.ativo !== false

    async function handleToggleActive() {
        if (isChangingStatus) return
        setIsChangingStatus(true)
        try {
            const { error } = await createClient().from("teachers").update({ ativo: !isActive }).eq("id", teacher.id)
            if (error) throw error
            toast.success(isActive ? "Professor desativado com sucesso!" : "Professor reativado com sucesso!")
            router.refresh()
        } catch (error) {
            console.error("Erro ao alterar situação do professor:", error)
            toast.error("Não foi possível alterar a situação do professor.")
        } finally {
            setIsChangingStatus(false)
        }
    }

    return <>
        <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:flex lg:w-auto">
            <AppButton onClick={() => setEditOpen(true)} disabled={isChangingStatus} className="h-11 min-w-0 gap-1.5 rounded-lg px-2 text-xs sm:px-4 sm:text-sm">
                <Pencil className="h-4 w-4 shrink-0" /> Editar
            </AppButton>
            <AppButton variant={isActive ? "danger" : "primary"} loading={isChangingStatus} onClick={handleToggleActive}
                className={`h-11 min-w-0 gap-1.5 rounded-lg px-2 text-xs sm:px-4 sm:text-sm ${!isActive ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}>
                {!isChangingStatus && (isActive ? <UserX className="h-4 w-4 shrink-0" /> : <UserCheck className="h-4 w-4 shrink-0" />)}
                {isChangingStatus ? (isActive ? "Desativando..." : "Reativando...") : (isActive ? "Desativar" : "Reativar")}
            </AppButton>
        </div>
        {editOpen && <EditTeacherDialog teacher={teacher} currentPhotoUrl={currentPhotoUrl} open={editOpen} onOpenChange={setEditOpen} />}
    </>
}
