"use client"

import Image from "next/image"

import {
    Camera,
    Loader2,
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

type Props = {

    children:
    React.ReactNode
}

export function AddStudentDialog({
    children,
}: Props) {

    const router =
        useRouter()

    const supabase =
        createClient()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [photoPreview, setPhotoPreview] =
        useState<string | null>(null)

    const [photoFile, setPhotoFile] =
        useState<File | null>(null)

    const [form, setForm] =
        useState({

            nome: "",

            idade: "",

            turma: "",

            turno: "Manhã",

            nivel: "Iniciante",

            responsavel_nome: "",

            responsavel_contato: "",

            observacoes: "",
        })

    function updateField(
        field: keyof typeof form,
        value: string
    ) {

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function formatPhone(
        value: string
    ) {

        const cleaned =
            value
                .replace(/\D/g, "")
                .slice(0, 11)

        if (
            cleaned.length <= 2
        ) {

            return cleaned
        }

        if (
            cleaned.length <= 7
        ) {

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
        event:
            React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0]

        if (!file)
            return

        setPhotoFile(file)

        const previewUrl =
            URL.createObjectURL(file)

        setPhotoPreview(
            previewUrl
        )
    }

    async function uploadPhoto(
        studentId: string
    ) {

        if (!photoFile)
            return null

        const extension =
            photoFile.name
                .split(".")
                .pop()

        const filePath =
            `${studentId}/perfil.${extension}`

        const {
            error: uploadError,
        } = await supabase
            .storage
            .from("alunos")
            .upload(
                filePath,
                photoFile,
                {
                    upsert: true,
                }
            )

        if (uploadError)
            throw uploadError

        const { data } =
            supabase.storage
                .from("alunos")
                .getPublicUrl(
                    filePath
                )

        return data.publicUrl
    }

    async function handleSubmit() {

        try {

            setLoading(true)

            if (
                !form.nome.trim() ||
                !form.idade.trim() ||
                !form.turma.trim()
            ) {

                toast.error(
                    "Preencha os campos obrigatórios"
                )

                return
            }

            const {
                data: insertedStudent,
                error: insertError,
            } = await supabase
                .from("students")
                .insert({

                    nome:
                        form.nome.trim(),

                    idade:
                        Number(
                            form.idade
                        ),

                    turma:
                        form.turma.trim(),

                    turno:
                        form.turno,

                    nivel:
                        form.nivel,

                    data_inicio:
                        new Date()
                            .toISOString(),

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

                const photoUrl =
                    await uploadPhoto(
                        insertedStudent.id
                    )

                if (photoUrl) {

                    const {
                        error: updateError,
                    } = await supabase
                        .from("students")
                        .update({
                            foto_url:
                                photoUrl,
                        })
                        .eq(
                            "id",
                            insertedStudent.id
                        )

                    if (updateError)
                        throw updateError
                }
            }

            toast.success(
                "Aluno cadastrado com sucesso"
            )

            setOpen(false)

            router.refresh()

            setForm({

                nome: "",

                idade: "",

                turma: "",

                turno: "Manhã",

                nivel: "Iniciante",

                responsavel_nome: "",

                responsavel_contato: "",

                observacoes: "",
            })

            setPhotoFile(null)

            setPhotoPreview(null)

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
            onOpenChange={setOpen}
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
                                className="
                  object-cover
                "
                            />

                        ) : (

                            <div className="
                flex
                flex-col
                items-center
                gap-2
              ">

                                <Camera
                                    className="
                    h-6
                    w-6

                    text-muted
                  "
                                />

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
                        onChange={
                            handlePhotoChange
                        }
                    />

                </div>

                <div className="
          grid
          gap-5
        ">

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
                                placeholder="
                  Nome do aluno
                "
                            />

                        </div>

                        <div className="
              space-y-2
            ">

                            <Label>
                                Idade *
                            </Label>

                            <Input
                                type="number"
                                value={form.idade}
                                onChange={(e) =>
                                    updateField(
                                        "idade",
                                        e.target.value
                                    )
                                }
                                placeholder="12"
                            />

                        </div>

                        <div className="
              space-y-2
            ">

                            <Label>
                                Turma *
                            </Label>

                            <Input
                                value={form.turma}
                                onChange={(e) =>
                                    updateField(
                                        "turma",
                                        e.target.value
                                    )
                                }
                                placeholder="6A"
                            />

                        </div>

                        <div className="
              space-y-2
            ">

                            <Label>
                                Turno
                            </Label>

                            <Select
                                value={form.turno}
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

                                </SelectContent>

                            </Select>

                        </div>

                        <div className="
              space-y-2
            ">

                            <Label>
                                Nível
                            </Label>

                            <Select
                                value={form.nivel}
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

                        </div>

                        <div className="
              space-y-2

              md:col-span-2
            ">

                            <Label>
                                Responsável
                            </Label>

                            <Input
                                value={
                                    form.responsavel_nome
                                }
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_nome",
                                        e.target.value
                                    )
                                }
                                placeholder="
                  Nome do responsável
                "
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
                                value={
                                    form.responsavel_contato
                                }
                                onChange={(e) =>
                                    updateField(
                                        "responsavel_contato",
                                        formatPhone(
                                            e.target.value
                                        )
                                    )
                                }
                                placeholder="
                  (47) 99999-9999
                "
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
                                value={
                                    form.observacoes
                                }
                                onChange={(e) =>
                                    updateField(
                                        "observacoes",
                                        e.target.value
                                    )
                                }
                                placeholder="
                  Observações adicionais...
                "
                            />

                        </div>

                    </div>

                    <AppButton
                        loading={loading}
                        onClick={handleSubmit}
                    >

                        {loading && (

                            <Loader2
                                className="
                  h-4
                  w-4

                  animate-spin
                "
                            />

                        )}

                        Salvar aluno

                    </AppButton>

                </div>

            </DialogContent>

        </Dialog>
    )
}