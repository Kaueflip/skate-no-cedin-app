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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Input,
} from "@/components/ui/input"

import {
    Textarea,
} from "@/components/ui/textarea"

type Props = {

    student: Student

    open: boolean

    onOpenChange: (
        open: boolean
    ) => void
}

const supabase =
    createClient()

export function EditStudentDialog({
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

    const [
        formData,
        setFormData,
    ] = useState(() => ({

        nome:
            student.nome || "",

        idade:
            String(
                student.idade || ""
            ),

        turma:
            student.turma || "",

        turno:
            student.turno || "",

        nivel:
            student.nivel || "",

        responsavel_nome:
            student.responsavel_nome || "",

        responsavel_contato:
            student.responsavel_contato || "",

        observacoes:
            student.observacoes || "",
    }))



    function updateField(
        field: string,
        value: string
    ) {

        setFormData(
            (prev) => ({

                ...prev,

                [field]:
                    value,
            })
        )
    }

    async function handleSubmit() {

        try {

            setLoading(true)

            const {
                error,
            } = await supabase
                .from("students")
                .update({

                    nome:
                        formData.nome,

                    idade:
                        Number(
                            formData.idade
                        ),

                    turma:
                        formData.turma,

                    turno:
                        formData.turno,

                    nivel:
                        formData.nivel,

                    responsavel_nome:
                        formData.responsavel_nome,

                    responsavel_contato:
                        formData.responsavel_contato,

                    observacoes:
                        formData.observacoes,
                })
                .eq(
                    "id",
                    student.id
                )

            if (error)
                throw error

            toast.success(
                "Aluno atualizado"
            )

            router.refresh()

            onOpenChange(false)

        } catch (error) {

            console.error(
                "EDIT_STUDENT_ERROR",
                error
            )

            toast.error(
                "Erro ao atualizar aluno"
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
                    max-h-[90vh]

                    overflow-y-auto

                    rounded-[2rem]

                    border-border

                    bg-card

                    sm:max-w-2xl
                "
            >

                <DialogHeader>

                    <DialogTitle
                        className="
                            text-2xl
                            font-black
                            tracking-tight
                        "
                    >

                        Editar aluno

                    </DialogTitle>

                    <DialogDescription
                        className="
                            text-base

                            text-muted
                        "
                    >

                        Atualize as informações do aluno.

                    </DialogDescription>

                </DialogHeader>

                <div className="
                    grid
                    gap-5

                    py-4
                ">

                    <div className="
                        grid
                        gap-5

                        md:grid-cols-2
                    ">

                        <Field
                            label="Nome"
                        >

                            <Input
                                value={
                                    formData.nome
                                }
                                onChange={(e) =>
                                    updateField(
                                        "nome",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field
                            label="Idade"
                        >

                            <Input
                                type="number"
                                value={
                                    formData.idade
                                }
                                onChange={(e) =>
                                    updateField(
                                        "idade",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field
                            label="Turma"
                        >

                            <Input
                                value={
                                    formData.turma
                                }
                                onChange={(e) =>
                                    updateField(
                                        "turma",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field
                            label="Turno"
                        >

                            <Input
                                value={
                                    formData.turno
                                }
                                onChange={(e) =>
                                    updateField(
                                        "turno",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field
                            label="Nível"
                        >

                            <Input
                                value={
                                    formData.nivel
                                }
                                onChange={(e) =>
                                    updateField(
                                        "nivel",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field
                            label="Responsável"
                        >

                            <Input
                                value={
                                    formData.responsavel_nome
                                }
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_nome",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                    </div>

                    <Field
                        label="Contato"
                    >

                        <Input
                            value={
                                formData.responsavel_contato
                            }
                            onChange={(e) =>
                                updateField(
                                    "responsavel_contato",
                                    e.target.value
                                )
                            }
                        />

                    </Field>

                    <Field
                        label="Observações"
                    >

                        <Textarea
                            rows={5}
                            value={
                                formData.observacoes
                            }
                            onChange={(e) =>
                                updateField(
                                    "observacoes",
                                    e.target.value
                                )
                            }
                        />

                    </Field>

                </div>

                <DialogFooter
                    className="
                        mt-4
                    "
                >

                    <AppButton
                        variant="secondary"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                    >

                        Cancelar

                    </AppButton>

                    <AppButton
                        loading={loading}
                        onClick={
                            handleSubmit
                        }
                    >

                        Salvar alterações

                    </AppButton>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}

type FieldProps = {

    label: string

    children:
    React.ReactNode
}

function Field({
    label,
    children,
}: FieldProps) {

    return (

        <div className="
            flex
            flex-col
            gap-2
        ">

            <label className="
                text-sm
                font-semibold

                text-foreground
            ">

                {label}

            </label>

            {children}

        </div>
    )
}   