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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { calculateAge } from "@/lib/calculate-age"

type Props = {
    student: Student

    open: boolean

    onOpenChange: (
        open: boolean
    ) => void
}

const supabase = createClient()

export function EditStudentDialog({
    student,
    open,
    onOpenChange,
}: Props) {

    const router = useRouter()

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

        data_nascimento:
            student.data_nascimento || "",

        turma:
            student.turma || "",

        turno:
            student.turno || "Manhã",

        nivel:
            student.nivel || "Iniciante",

        responsavel_nome:
            student.responsavel_nome || "",

        responsavel_contato:
            student.responsavel_contato || "",

        observacoes:
            student.observacoes || "",
    }))

    function updateField(
        field: keyof typeof formData,
        value: string
    ) {

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    async function handleSubmit() {

        try {

            if (
                !formData.nome.trim() ||
                !formData.data_nascimento ||
                !formData.turma.trim()
            ) {

                toast.error(
                    "Preencha os campos obrigatórios"
                )

                return
            }

            const idadeCalculada = calculateAge(
                formData.data_nascimento
            )

            if (idadeCalculada === null) {
                toast.error(
                    "Informe uma data de nascimento válida"
                )
                return
            }

            setLoading(true)

            const {
                error,
            } = await supabase
                .from("students")
                .update({

                    nome:
                        formData.nome.trim(),

                    data_nascimento:
                        formData.data_nascimento,

                    turma:
                        formData.turma.trim(),

                    turno:
                        formData.turno,

                    nivel:
                        formData.nivel,

                    responsavel_nome:
                        formData.responsavel_nome.trim(),

                    responsavel_contato:
                        formData.responsavel_contato.trim(),

                    observacoes:
                        formData.observacoes.trim(),
                })
                .eq(
                    "id",
                    student.id
                )

            if (error)
                throw error

            toast.success(
                "Aluno atualizado com sucesso"
            )

            router.refresh()

            onOpenChange(false)

        } catch (error: unknown) {

            console.error(
                "EDIT_STUDENT_ERROR",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar aluno"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
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

                    <DialogTitle className="
                        text-2xl
                        font-black
                        tracking-tight
                    ">
                        Editar aluno
                    </DialogTitle>

                    <DialogDescription className="
                        text-base
                        text-muted
                    ">
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

                        <Field label="Nome">

                            <Input
                                value={formData.nome}
                                onChange={(e) =>
                                    updateField(
                                        "nome",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field label="Data de nascimento">

                            <Input
                                type="date"
                                value={formData.data_nascimento}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    updateField(
                                        "data_nascimento",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field label="Turma">

                            <Input
                                value={formData.turma}
                                onChange={(e) =>
                                    updateField(
                                        "turma",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field label="Turno">

                            <Select
                                value={formData.turno}
                                onValueChange={(value) =>
                                    updateField(
                                        "turno",
                                        value
                                    )
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="Manhã">
                                        Manhã
                                    </SelectItem>

                                    <SelectItem value="Tarde">
                                        Tarde
                                    </SelectItem>

                                    <SelectItem value="Integral">
                                        Integral
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </Field>

                        <Field label="Nível">

                            <Select
                                value={formData.nivel}
                                onValueChange={(value) =>
                                    updateField(
                                        "nivel",
                                        value
                                    )
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="Iniciante">
                                        Iniciante
                                    </SelectItem>

                                    <SelectItem value="Básico">
                                        Básico
                                    </SelectItem>

                                    <SelectItem value="Intermediário">
                                        Intermediário
                                    </SelectItem>

                                    <SelectItem value="Avançado">
                                        Avançado
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </Field>

                        <Field label="Responsável">

                            <Input
                                value={formData.responsavel_nome}
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_nome",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                        <Field label="Contato">

                            <Input
                                value={formData.responsavel_contato}
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_contato",
                                        e.target.value
                                    )
                                }
                            />

                        </Field>

                    </div>

                    <Field label="Observações">

                        <Textarea
                            rows={5}
                            value={formData.observacoes}
                            onChange={(e) =>
                                updateField(
                                    "observacoes",
                                    e.target.value
                                )
                            }
                        />

                    </Field>

                </div>

                <DialogFooter className="mt-4">

                    <AppButton
                        variant="secondary"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        disabled={loading}
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={loading}
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
    children: React.ReactNode
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