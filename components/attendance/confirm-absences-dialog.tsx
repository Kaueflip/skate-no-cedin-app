"use client"

import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppButton } from "@/components/ui/app-button"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading?: boolean
    studentCount: number
}

export function ConfirmAbsencesDialog({ open, onOpenChange, onConfirm, loading = false, studentCount }: Props) {
    return (
        <Dialog open={open} onOpenChange={(value) => { if (!loading) onOpenChange(value) }}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[10px] border-border bg-card p-4 sm:p-6">
                <DialogHeader className="text-left">
                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-lg font-bold tracking-tight">Confirmar faltas</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-muted">
                        Nenhum aluno foi marcado como presente. Você está prestes a registrar{" "}
                        <strong className="font-semibold text-foreground">{studentCount} {studentCount === 1 ? "falta" : "faltas"}</strong>
                        {" "}nesta chamada. Deseja realmente continuar?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-2 grid grid-cols-2 gap-2 sm:grid sm:grid-cols-2">
                    <AppButton variant="secondary" onClick={() => onOpenChange(false)} disabled={loading} className="h-11 w-full min-w-0 rounded-lg px-2 text-xs sm:text-sm">Cancelar</AppButton>
                    <AppButton variant="danger" loading={loading} onClick={onConfirm} className="h-11 w-full min-w-0 rounded-lg px-2 text-xs sm:text-sm">Confirmar faltas</AppButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
