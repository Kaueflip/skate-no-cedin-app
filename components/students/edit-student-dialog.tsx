"use client"

import {
    useEffect,
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
    onOpenChange: (open: boolean) => void
}

type SchoolClass = {
    id: string
    nome: string
    turno: string
}

type StudentFormData = {
    nome: string
    data_nascimento: string
    school_class_id: string
    matricula_escolar: string
    genero: string
    turno: "Manhã" | "Tarde" | "Integral"
    nivel: "Iniciante" | "Básico" | "Intermediário" | "Avançado"
    responsavel_nome: string
    responsavel_contato: string
    observacoes: string
}

const supabase = createClient()

export function EditStudentDialog({
    student,
    open,
    onOpenChange,
}: Props) {

    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [loadingClasses, setLoadingClasses] = useState(false)
    const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([])

    const [formData, setFormData] = useState<StudentFormData>({
        nome: student.nome || "",
        data_nascimento: student.data_nascimento || "",
        school_class_id: student.school_class_id || "",
        matricula_escolar: student.matricula_escolar || "",
        genero: student.genero || "",
        turno: student.turno || "Integral",
        nivel: student.nivel || "Iniciante",
        responsavel_nome: student.responsavel_nome || "",
        responsavel_contato: student.responsavel_contato || "",
        observacoes: student.observacoes || "",
    })

    useEffect(() => {
        if (!open) return

        let cancelled = false

        async function loadSchoolClasses() {
            setLoadingClasses(true)

            const { data, error } = await supabase
                .from("school_classes")
                .select("id, nome, turno")
                .eq("ativo", true)
                .eq("ano_letivo", new Date().getFullYear())
                .order("nome")

            if (cancelled) return

            if (error) {
                console.error("LOAD_SCHOOL_CLASSES_ERROR", error)
                toast.error("Erro ao carregar turmas escolares")
                setSchoolClasses([])
            } else {
                setSchoolClasses(data ?? [])
            }

            setLoadingClasses(false)
        }

        loadSchoolClasses()

        return () => {
            cancelled = true
        }
    }, [open])

    function updateField(
        field: keyof StudentFormData,
        value: string
    ) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function handleSchoolClassChange(schoolClassId: string) {
        const selectedClass = schoolClasses.find(
            (item) => item.id === schoolClassId
        )

        if (!selectedClass) return

        const turnoMap: Record<string, StudentFormData["turno"]> = {
            Matutino: "Manhã",
            Vespertino: "Tarde",
            "Matutino e Vespertino": "Integral",
            Integral: "Integral",
        }

        setFormData((prev) => ({
            ...prev,
            school_class_id: schoolClassId,
            turno: turnoMap[selectedClass.turno] ?? "Integral",
        }))
    }

    async function handleSubmit() {
        try {
            if (
                !formData.nome.trim() ||
                !formData.data_nascimento ||
                !formData.school_class_id
            ) {
                toast.error("Preencha os campos obrigatórios")
                return
            }

            const matricula = formData.matricula_escolar.trim()

            if (matricula && !/^\d{11}$/.test(matricula)) {
                toast.error(
                    "A matrícula escolar deve conter exatamente 11 dígitos."
                )
                return
            }

            const selectedClass = schoolClasses.find(
                (item) => item.id === formData.school_class_id
            )

            if (!selectedClass) {
                toast.error("Selecione uma turma escolar válida")
                return
            }

            const idadeCalculada = calculateAge(
                formData.data_nascimento
            )

            if (idadeCalculada === null) {
                toast.error("Informe uma data de nascimento válida")
                return
            }

            setLoading(true)

            const { error } = await supabase
                .from("students")
                .update({
                    nome: formData.nome.trim(),
                    data_nascimento: formData.data_nascimento,
                    turma: selectedClass.nome,
                    school_class_id: selectedClass.id,
                    matricula_escolar: matricula || null,
                    genero: formData.genero || null,
                    turno: formData.turno,
                    nivel: formData.nivel,
                    responsavel_nome: formData.responsavel_nome.trim(),
                    responsavel_contato: formData.responsavel_contato.trim(),
                    observacoes: formData.observacoes.trim(),
                })
                .eq("id", student.id)

            if (error) throw error

            toast.success("Aluno atualizado com sucesso")
            router.refresh()
            onOpenChange(false)

        } catch (error: unknown) {
            const supabaseError = error as {
                message?: string
                details?: string
                hint?: string
                code?: string
            }

            console.error("EDIT_STUDENT_ERROR", {
                message: supabaseError?.message,
                details: supabaseError?.details,
                hint: supabaseError?.hint,
                code: supabaseError?.code,
                error: JSON.stringify(
                    error,
                    Object.getOwnPropertyNames(error as object)
                ),
            })

            toast.error(
                supabaseError?.message || "Erro ao atualizar aluno"
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
                                    updateField("nome", e.target.value)
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

                        <Field label="Matrícula escolar">
                            <Input
                                type="text"
                                inputMode="numeric"
                                maxLength={11}
                                placeholder="Digite os 11 dígitos"
                                value={formData.matricula_escolar}
                                onChange={(e) =>
                                    updateField(
                                        "matricula_escolar",
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 11)
                                    )
                                }
                            />
                        </Field>

                        <Field label="Turma escolar">
                            <Select
                                value={formData.school_class_id}
                                onValueChange={handleSchoolClassChange}
                                disabled={loadingClasses}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            loadingClasses
                                                ? "Carregando turmas..."
                                                : "Selecione a turma escolar"
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    {schoolClasses.map((schoolClass) => (
                                        <SelectItem
                                            key={schoolClass.id}
                                            value={schoolClass.id}
                                        >
                                            {schoolClass.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Gênero">
                            <Select
                                value={formData.genero}
                                onValueChange={(value) =>
                                    updateField("genero", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Feminino">
                                        Feminino
                                    </SelectItem>

                                    <SelectItem value="Masculino">
                                        Masculino
                                    </SelectItem>

                                    <SelectItem value="Não informado">
                                        Não informado
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Nível">
                            <Select
                                value={formData.nivel}
                                onValueChange={(value) =>
                                    updateField("nivel", value)
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
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={loading || loadingClasses}
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