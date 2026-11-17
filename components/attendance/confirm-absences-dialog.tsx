
"use client"

import {
    AlertTriangle,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    AppButton,
} from "@/components/ui/app-button"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading?: boolean
    studentCount: number
}

export function ConfirmAbsencesDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
    studentCount,
}: Props) {

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="
                    rounded-[2rem]
                    border-border
                    bg-card
                    sm:max-w-md
                "
            >
                <DialogHeader>

                    <div className="
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-amber-500/10
                        text-amber-500
                    ">
                        <AlertTriangle className="h-6 w-6" />
                    </div>

                    <DialogTitle className="
                        text-2xl
                        font-black
                        tracking-tight
                    ">
                        Confirmar faltas
                    </DialogTitle>

                    <DialogDescription className="
                        pt-2
                        text-base
                        leading-relaxed
                        text-muted
                    ">
                        Nenhum aluno foi marcado como presente.

                        <br />
                        <br />

                        Você está prestes a registrar{" "}

                        <span className="
                            font-bold
                            text-foreground
                        ">
                            {studentCount} {studentCount === 1 ? "falta" : "faltas"}
                        </span>

                        {" "}nesta chamada.

                        <br />
                        <br />

                        Deseja realmente continuar?
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter className="
                    mt-6
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                ">

                    <AppButton
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        variant="danger"
                        loading={loading}
                        onClick={onConfirm}
                        className="w-full sm:w-auto"
                    >
                        Confirmar faltas
                    </AppButton>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
