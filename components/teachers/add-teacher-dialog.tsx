
"use client"

import Image from "next/image"

import {
    Camera,
} from "lucide-react"

import {
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

import { AppButton }
    from "@/components/ui/app-button"

type Props = {
    children: React.ReactNode
}

export function AddTeacherDialog({
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

    const [photoPreview, setPhotoPreview] =
        useState<string | null>(null)

    const [photoFile, setPhotoFile] =
        useState<File | null>(null)

    const [form, setForm] = useState({
        nome: "",
        contato: "",
        funcao: "",
        data_inicio: "",
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

        if (!file) return

        if (![
            "image/jpeg",
            "image/png",
            "image/webp",
        ].includes(file.type)) {
            toast.error("Formato inválido. Use JPG, PNG ou WEBP.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("A imagem deve ter no máximo 5 MB.")
            return
        }

        if (photoPreview) {
            URL.revokeObjectURL(photoPreview)
        }

        setPhotoFile(file)

        setPhotoPreview(
            URL.createObjectURL(file)
        )
    }

    function resetForm() {

        setForm({
            nome: "",
            contato: "",
            funcao: "",
            data_inicio: "",
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

    async function uploadPhoto(teacherId: string) {
        if (!photoFile) return null

        const extension =
            photoFile.name.split(".").pop()?.toLowerCase() || "jpg"

        const filePath =
            `${teacherId}/${crypto.randomUUID()}.${extension}`

        const { error } = await supabase
            .storage
            .from("teacher-photos")
            .upload(filePath, photoFile, {
                contentType: photoFile.type,
                upsert: false,
            })

        if (error) throw error

        return filePath
    }

    async function handleSubmit() {

        try {

            if (!form.nome.trim()) {
                toast.error("Informe o nome do professor.")
                return
            }

            setLoading(true)

            const {
                data: insertedTeacher,
                error: insertError,
            } = await supabase
                .from("teachers")
                .insert({
                    nome: form.nome.trim(),
                    contato: form.contato.trim() || null,
                    funcao: form.funcao.trim() || null,
                    data_inicio: form.data_inicio || null,
                })
                .select()
                .single()

            if (insertError) throw insertError

            if (!insertedTeacher) {
                throw new Error("Professor não cadastrado.")
            }

            if (photoFile) {

                const photoUrl = await uploadPhoto(
                    insertedTeacher.id
                )

                if (photoFile) {
                    const photoPath = await uploadPhoto(insertedTeacher.id)

                    if (photoPath) {
                        const { error: updateError } = await supabase
                            .from("teachers")
                            .update({
                                foto_url: photoPath,
                            })
                            .eq("id", insertedTeacher.id)

                        if (updateError) throw updateError
                    }
                }
            }

            toast.success("Professor cadastrado com sucesso.")

            setOpen(false)

            resetForm()

            router.refresh()

        } catch (error: unknown) {

            console.error(
                "ADD_TEACHER_ERROR",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar professor."
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

                if (!value) resetForm()
            }}
        >

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="
                max-h-[90vh]
                overflow-y-auto
                sm:max-w-[520px]
            ">

                <DialogHeader>

                    <DialogTitle>
                        Novo professor
                    </DialogTitle>

                    <DialogDescription>
                        Cadastre um professor no projeto Skate no Cedin.
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
                                alt="Foto do professor"
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
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />

                </div>

                <div className="grid gap-5">

                    <div className="space-y-2">

                        <Label>
                            Nome completo *
                        </Label>

                        <Input
                            value={form.nome}
                            onChange={(e) =>
                                updateField("nome", e.target.value)
                            }
                            placeholder="Nome do professor"
                        />

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Função
                        </Label>

                        <Input
                            value={form.funcao}
                            onChange={(e) =>
                                updateField("funcao", e.target.value)
                            }
                            placeholder="Ex.: Professor de skate"
                        />

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Contato
                        </Label>

                        <Input
                            inputMode="numeric"
                            value={form.contato}
                            onChange={(e) =>
                                updateField(
                                    "contato",
                                    formatPhone(e.target.value)
                                )
                            }
                            placeholder="(47) 99999-9999"
                        />

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Data de início
                        </Label>

                        <Input
                            type="date"
                            value={form.data_inicio}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={(e) =>
                                updateField(
                                    "data_inicio",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <AppButton
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Salvar professor

                    </AppButton>

                </div>

            </DialogContent>

        </Dialog>
    )
}
