
"use client"

import {
    useState,
} from "react"

import {
    Trash2,
} from "lucide-react"

import {
    toast,
} from "sonner"

import {
    createClient,
} from "@/lib/supabase-browser"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type Props = {
    sessionId: string
    turno: string
    aulaNumero: number
    open: boolean
    onOpenChange: (open: boolean) => void
    onDeleted: (sessionId: string) => void
}

const supabase = createClient()

export function DeleteSessionDialog({
    sessionId,
    turno,
    aulaNumero,
    open,
    onOpenChange,
    onDeleted,
}: Props) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (loading) return
        try {
            setLoading(true)

            const { error } = await supabase
                .from("class_sessions")
                .delete()
                .eq("id", sessionId)

            if (error) throw error

            onDeleted(sessionId)

            toast.success("Aula excluída com sucesso")

            onOpenChange(false)

        } catch (error) {
            console.error("DELETE_SESSION_ERROR", error)

            toast.error("Erro ao excluir aula")

        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => { if (!loading) onOpenChange(next) }}
        >
            <DialogContent
                className="
                    rounded-[10px]
                    p-4 sm:p-6
                    max-h-[90dvh] overflow-y-auto
                    border-border
                    bg-card
                    sm:max-w-md
                "
            >
                <DialogHeader>
                    <div className="
                        mb-2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-500/10
                        text-red-500
                    ">
                        <Trash2 className="h-5 w-5" />
                    </div>

                    <DialogTitle className="
                        text-lg
                        font-black
                        tracking-tight
                    ">
                        Excluir aula
                    </DialogTitle>

                    <DialogDescription className="
                        pt-2
                        text-sm
                        leading-relaxed
                        text-muted
                    ">
                        Tem certeza que deseja excluir a{" "}

                        <span className="font-semibold text-foreground">
                            {aulaNumero}ª aula
                        </span>

                        {" "}do turno da{" "}

                        <span className="font-semibold text-foreground">
                            {turno.toLowerCase()}
                        </span>

                        ?

                        <br />
                        <br />

                        Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="
                    mt-3
                    grid grid-cols-2 gap-2 sm:grid
                ">
                    <AppButton
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="h-11 w-full px-2 text-xs sm:text-sm"
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        variant="danger"
                        loading={loading}
                        onClick={handleDelete}
                        className="h-11 w-full px-2 text-xs sm:text-sm"
                    >
                        Excluir aula
                    </AppButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
