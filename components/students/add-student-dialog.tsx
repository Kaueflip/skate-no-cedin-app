
"use client"

import Image from "next/image"

import {
    Camera,
} from "lucide-react"

import {
    useEffect,
    useRef,
    useState,
} from "react"

import { useRouter }
    from "next/navigation"

import { toast }
    from "sonner"

import { createClient }
    from "@/lib/supabase-browser"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input }
    from "@/components/ui/input"

import { Label }
    from "@/components/ui/label"

import { Textarea }
    from "@/components/ui/textarea"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { AppButton }
    from "@/components/ui/app-button"

import { calculateAge } from "@/lib/calculate-age"

import { uploadStudentPhoto, } from "@/services/student-photo-upload-service"

type Props = {
    children: React.ReactNode
}

type SchoolClass = {
    id: string
    nome: string
    turno: string
}

export function AddStudentDialog({
    children,
}: Props) {

    const router = useRouter()

    const supabase = createClient()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [loadingClasses, setLoadingClasses] =
        useState(false)

    const [schoolClasses, setSchoolClasses] =
        useState<SchoolClass[]>([])

    const [photoPreview, setPhotoPreview] =
        useState<string | null>(null)

    const [photoFile, setPhotoFile] =
        useState<File | null>(null)

    const [form, setForm] = useState({

        nome: "",

        data_nascimento: "",

        school_class_id: "",

        matricula_escolar: "",

        genero: "",

        turno: "Integral",

        nivel: "Iniciante",

        responsavel_nome: "",

        responsavel_contato: "",

        observacoes: "",
    })

    useEffect(() => {

        if (!open)
            return

        let cancelled = false

        async function loadSchoolClasses() {

            setLoadingClasses(true)

            const {
                data,
                error,
            } = await supabase
                .from("school_classes")
                .select("id, nome, turno")
                .eq("ativo", true)
                .eq("ano_letivo", new Date().getFullYear())
                .order("nome")

            if (cancelled)
                return

            if (error) {

                console.error(
                    "LOAD_SCHOOL_CLASSES_ERROR",
                    error
                )

                toast.error(
                    "Erro ao carregar turmas escolares"
                )

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
        field: keyof typeof form,
        value: string
    ) {

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function handleSchoolClassChange(
        schoolClassId: string
    ) {

        const selectedClass =
            schoolClasses.find(
                (item) => item.id === schoolClassId
            )

        if (!selectedClass)
            return

        const turnoMap: Record<string, string> = {
            Matutino: "Manhã",
            Vespertino: "Tarde",
            "Matutino e Vespertino": "Integral",
            Integral: "Integral",
        }

        setForm((prev) => ({
            ...prev,
            school_class_id: schoolClassId,
            turno: turnoMap[selectedClass.turno] ?? "Integral",
        }))
    }

    function formatPhone(value: string) {

        const cleaned = value
            .replace(/\D/g, "")
            .slice(0, 11)

        if (cleaned.length <= 2) {
            return cleaned
        }

        if (cleaned.length <= 7) {
            return cleaned.replace(
                /(\d{2})(\d+)/,
                "($1) $2"
            )
        }

        return cleaned.replace(
            /(\d{2})(\d{5})(\d{0,4})/,
            "($1) $2-$3"
        )
    }

    function handlePhotoChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = event.target.files?.[0]

        if (!file)
            return

        if (photoPreview) {
            URL.revokeObjectURL(photoPreview)
        }

        setPhotoFile(file)

        const previewUrl =
            URL.createObjectURL(file)

        setPhotoPreview(previewUrl)
    }

    async function uploadPhoto(studentId: string) {

        if (!photoFile) return

        await uploadStudentPhoto(
            supabase,
            studentId,
            photoFile,
            true
        )
    }


    function resetForm() {

        setForm({

            nome: "",

            data_nascimento: "",

            school_class_id: "",

            matricula_escolar: "",

            genero: "",

            turno: "Integral",

            nivel: "Iniciante",

            responsavel_nome: "",

            responsavel_contato: "",

            observacoes: "",
        })

        setPhotoFile(null)

        if (photoPreview) {
            URL.revokeObjectURL(photoPreview)
        }

        setPhotoPreview(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    async function handleSubmit() {

        try {

            if (
                !form.nome.trim() ||
                !form.data_nascimento ||
                !form.school_class_id
            ) {

                toast.error(
                    "Preencha os campos obrigatórios"
                )

                return
            }

            const selectedClass =
                schoolClasses.find(
                    (item) => item.id === form.school_class_id
                )

            if (!selectedClass) {

                toast.error(
                    "Selecione uma turma escolar válida"
                )

                return
            }

            const idadeCalculada = calculateAge(
                form.data_nascimento
            )

            if (idadeCalculada === null) {
                toast.error(
                    "Informe uma data de nascimento válida"
                )
                return
            }

            const matricula = form.matricula_escolar.trim()

            if (matricula && !/^\d{11}$/.test(matricula)) {
                toast.error("A matrícula escolar deve conter exatamente 11 dígitos.")
                return
            }


            setLoading(true)

            const {
                data: insertedStudent,
                error: insertError,
            } = await supabase
                .from("students")
                .insert({

                    nome:
                        form.nome.trim(),

                    data_nascimento:
                        form.data_nascimento,
                    turma:
                        selectedClass.nome,

                    school_class_id:
                        selectedClass.id,

                    matricula_escolar:
                        matricula || null,

                    genero:
                        form.genero || null,

                    turno:
                        form.turno,

                    nivel:
                        form.nivel,

                    data_inicio:
                        new Date().toISOString()
                            .slice(0, 10),

                    responsavel_nome:
                        form.responsavel_nome.trim(),

                    responsavel_contato:
                        form.responsavel_contato.trim(),

                    observacoes:
                        form.observacoes.trim(),
                })
                .select()
                .single()

            if (insertError)
                throw insertError

            if (!insertedStudent)
                throw new Error(
                    "Aluno não criado"
                )


            if (photoFile) {

                try {
                    await uploadPhoto(insertedStudent.id)

                } catch (error) {

                    console.error(
                        "Erro ao cadastrar foto:",
                        error
                    )

                    toast.warning(
                        "Aluno cadastrado, mas não foi possível enviar a foto."
                    )
                }
            }

            toast.success(
                "Aluno cadastrado com sucesso"
            )

            setOpen(false)

            resetForm()

            router.refresh()

        } catch (error: unknown) {

            console.error(
                "ADD_STUDENT_ERROR",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar aluno"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={(value) => {

                setOpen(value)

                if (!value) {
                    resetForm()
                }
            }}
        >

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent
                className="
                    max-h-[90vh]
                    overflow-y-auto
                    sm:max-w-[560px]
                "
            >

                <DialogHeader>

                    <DialogTitle>
                        Novo aluno
                    </DialogTitle>

                    <DialogDescription>
                        Cadastre um novo aluno
                        no projeto Skate no Cedin
                    </DialogDescription>

                </DialogHeader>

                <div className="
                    flex
                    flex-col
                    items-center
                    gap-4
                ">

                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="
                            relative
                            flex
                            h-28
                            w-28
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            border
                            border-border
                            bg-input
                            transition-all
                            hover:scale-[1.02]
                            hover:border-primary/30
                            cursor-pointer
                        "
                    >

                        {photoPreview ? (

                            <Image
                                src={photoPreview}
                                alt="Foto do aluno"
                                fill
                                sizes="112px"
                                className="object-cover"
                            />

                        ) : (

                            <div className="
                                flex
                                flex-col
                                items-center
                                gap-2
                            ">

                                <Camera className="
                                    h-6
                                    w-6
                                    text-muted
                                " />

                                <span className="
                                    text-xs
                                    text-muted
                                ">
                                    Adicionar foto
                                </span>

                            </div>
                        )}

                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />

                </div>

                <div className="grid gap-5">

                    <div className="
                        grid
                        gap-5
                        md:grid-cols-2
                    ">

                        <div className="
                            space-y-2
                            md:col-span-2
                        ">

                            <Label>
                                Nome completo *
                            </Label>

                            <Input
                                value={form.nome}
                                onChange={(e) =>
                                    updateField(
                                        "nome",
                                        e.target.value
                                    )
                                }
                                placeholder="Nome do aluno"
                            />

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Data de nascimento *
                            </Label>

                            <Input
                                type="date"
                                value={form.data_nascimento}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(e) =>
                                    updateField(
                                        "data_nascimento",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Matrícula escolar
                            </Label>

                            <Input
                                type="text"
                                inputMode="numeric"
                                maxLength={11}
                                placeholder="Digite os 11 dígitos"
                                value={form.matricula_escolar}
                                onChange={(e) =>
                                    updateField(
                                        "matricula_escolar",
                                        e.target.value.replace(/\D/g, "").slice(0, 11)
                                    )
                                }
                            />

                        </div>

                        <div className="space-y-2 md:col-span-2">

                            <Label>
                                Turma escolar *
                            </Label>

                            <Select
                                value={form.school_class_id}
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

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Gênero
                            </Label>

                            <Select
                                value={form.genero}
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

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Nível
                            </Label>

                            <Select
                                value={form.nivel}
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

                        </div>

                        <div className="
                            space-y-2
                            md:col-span-2
                        ">

                            <Label>
                                Responsável
                            </Label>

                            <Input
                                value={form.responsavel_nome}
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_nome",
                                        e.target.value
                                    )
                                }
                                placeholder="Nome do responsável"
                            />

                        </div>

                        <div className="
                            space-y-2
                            md:col-span-2
                        ">

                            <Label>
                                Contato
                            </Label>

                            <Input
                                inputMode="numeric"
                                value={form.responsavel_contato}
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_contato",
                                        formatPhone(e.target.value)
                                    )
                                }
                                placeholder="(47) 99999-9999"
                            />

                        </div>

                        <div className="
                            space-y-2
                            md:col-span-2
                        ">

                            <Label>
                                Observações
                            </Label>

                            <Textarea
                                value={form.observacoes}
                                onChange={(e) =>
                                    updateField(
                                        "observacoes",
                                        e.target.value
                                    )
                                }
                                placeholder="Observações adicionais..."
                            />

                        </div>

                    </div>

                    <AppButton
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={loading || loadingClasses}
                    >

                        Salvar aluno

                    </AppButton>

                </div>

            </DialogContent>

        </Dialog>
    )
}
