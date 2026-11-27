"use client"

import { useRef, useState } from "react"
import { useRouter } from "nextjs-toploader/app"
import { UserX } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase-browser"
import type { Student } from "@/types/student"
import { AppButton } from "@/components/ui/app-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DeleteStudentDialog({ student, open, onOpenChange }: { student: Student; open: boolean; onOpenChange: (open: boolean) => void }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const busy = useRef(false)
    async function deactivate() {
        if (busy.current) return
        busy.current = true
        setLoading(true)
        try {
            const { error } = await createClient().from("students").update({ ativo: false }).eq("id", student.id).select("id").single()
            if (error) throw error
            toast.success("Aluno desativado com sucesso")
            onOpenChange(false)
            router.push("/students")
            router.refresh()
        } catch (error) {
            console.error("DEACTIVATE_STUDENT_ERROR", error)
            toast.error("Não foi possível desativar o aluno.")
        } finally {
            busy.current = false
            setLoading(false)
        }
    }
    return <Dialog open={open} onOpenChange={next => { if (!busy.current) onOpenChange(next) }}>
        <DialogContent className="max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] max-w-md gap-3 overflow-y-auto rounded-[10px] p-3 sm:p-5 [&>button:last-child]:h-11 [&>button:last-child]:w-11 [&>button:last-child]:rounded-lg" onEscapeKeyDown={event => { if (busy.current) event.preventDefault() }} onInteractOutside={event => { if (busy.current) event.preventDefault() }}>
            <DialogHeader className="gap-2 pr-12">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500"><UserX className="h-5 w-5" /></div>
                <DialogTitle className="text-lg">Desativar aluno</DialogTitle>
                <DialogDescription className="break-words text-sm leading-relaxed">Deseja desativar <span className="font-semibold text-foreground">{student.nome}</span>? O aluno deixará de aparecer nas listas de atividades. O cadastro, as fotos e o histórico serão preservados.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                <AppButton type="button" variant="secondary" disabled={loading} onClick={() => onOpenChange(false)} className="min-h-11 rounded-lg px-2 py-2 text-xs sm:text-sm">Cancelar</AppButton>
                <AppButton type="button" variant="danger" loading={loading} onClick={deactivate} className="min-h-11 rounded-lg px-2 py-2 text-xs sm:text-sm">Desativar</AppButton>
            </div>
        </DialogContent>
    </Dialog>
}
