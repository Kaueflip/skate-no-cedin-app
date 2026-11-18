
"use client"

import { useState } from "react"

import {
    Trash2,
    Loader2,
} from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { AppButton } from "@/components/ui/app-button"

type Props = {
    turno: string
    aulaNumero: number
    onDelete: () => Promise<void>
    disabled?: boolean
}

export function DeleteSessionDialog({
    turno,
    aulaNumero,
    onDelete,
    disabled = false,
}: Props) {
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        try {
            setDeleting(true)
            await onDelete()
            setOpen(false)
        } catch {
            // O componente pai já apresenta a mensagem de erro.
        } finally {
            setDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    disabled={disabled || deleting}
                    title="Excluir aula"
                    aria-label="Excluir aula"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        text-muted
                        transition
                        hover:bg-red-500/10
                        hover:text-red-500
                        disabled:opacity-50
                    "
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Excluir registro de aula?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Você está prestes a excluir a{" "}
                        <strong>{aulaNumero}ª aula</strong>{" "}
                        do turno da <strong>{turno.toLowerCase()}</strong>.

                        <br />
                        <br />

                        Essa ação é permanente e não poderá ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                        Cancelar
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault()
                            handleDelete()
                        }}
                        disabled={deleting}
                        className="
                            bg-red-600
                            text-white
                            hover:bg-red-700
                        "
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir aula
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
