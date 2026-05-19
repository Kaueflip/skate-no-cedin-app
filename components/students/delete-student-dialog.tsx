"use client"

import {
    useState,
} from "react"

import {
    useRouter,
} from "next/navigation"

import {
    Trash2,
} from "lucide-react"

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type Props = {

    student: Student

    open: boolean

    onOpenChange: (
        open: boolean
    ) => void
}

const supabase =
    createClient()

export function DeleteStudentDialog({
    student,
    open,
    onOpenChange,
}: Props) {

    const router =
        useRouter()

    const [
        loading,
        setLoading,
    ] = useState(false)

    async function handleDelete() {

        try {

            setLoading(true)

            const {
                error: attendanceError,
            } = await supabase
                .from("attendance")
                .delete()
                .eq(
                    "student_id",
                    student.id
                )

            if (
                attendanceError
            ) {

                throw attendanceError
            }

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
                "Aluno removido com sucesso"
            )

            onOpenChange(false)

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

            setLoading(false)
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
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

                        bg-red-500/10

                        text-red-500
                    ">

                        <Trash2
                            className="
                                h-6
                                w-6
                            "
                        />

                    </div>

                    <DialogTitle
                        className="
                            text-2xl
                            font-black
                            tracking-tight
                        "
                    >

                        Remover aluno

                    </DialogTitle>

                    <DialogDescription
                        className="
                            pt-2

                            text-base
                            leading-relaxed

                            text-muted
                        "
                    >

                        Tem certeza que deseja remover{" "}

                        <span className="
                            font-semibold

                            text-foreground
                        ">

                            {student.nome}

                        </span>

                        ?

                        <br />
                        <br />

                        Essa ação não poderá ser desfeita.

                    </DialogDescription>

                </DialogHeader>

                <DialogFooter
                    className="
                        mt-6

                        flex-col-reverse
                        gap-3

                        sm:flex-row
                    "
                >

                    <AppButton
                        variant="secondary"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        className="
                            w-full

                            sm:w-auto
                        "
                    >

                        Cancelar

                    </AppButton>

                    <AppButton
                        variant="danger"
                        loading={loading}
                        onClick={
                            handleDelete
                        }
                        className="
                            w-full

                            sm:w-auto
                        "
                    >

                        Remover aluno

                    </AppButton>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}