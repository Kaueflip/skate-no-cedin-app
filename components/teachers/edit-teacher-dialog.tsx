
"use client"

import Image from "next/image"

import {
    Camera,
} from "lucide-react"

import {
    useRef,
    useState,
} from "react"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase-browser"

import type { Teacher } from "@/types/teacher"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppButton } from "@/components/ui/app-button"

type Props = {
    teacher: Teacher
    currentPhotoUrl: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditTeacherDialog({
    teacher,
    currentPhotoUrl,
    open,
    onOpenChange,
}: Props) {

    const router = useRouter()
    const supabase = createClient()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)

    const [photoPreview, setPhotoPreview] = useState<string | null>(
        currentPhotoUrl
    )

    const [photoFile, setPhotoFile] = useState<File | null>(null)

    const [form, setForm] = useState({
        nome: teacher.nome || "",
        contato: teacher.contato || "",
        funcao: teacher.funcao || "",
        data_inicio: teacher.data_inicio || "",
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

        if (photoPreview && photoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(photoPreview)
        }

        setPhotoFile(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    function resetForm() {

        setForm({
            nome: teacher.nome || "",
            contato: teacher.contato || "",
            funcao: teacher.funcao || "",
            data_inicio: teacher.data_inicio || "",
        })

        if (photoPreview && photoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(photoPreview)
        }

        setPhotoFile(null)
        setPhotoPreview(currentPhotoUrl)

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    async function uploadPhoto() {

        if (!photoFile) return null

        const extension =
            photoFile.name.split(".").pop()?.toLowerCase() || "jpg"

        const filePath =
            `${teacher.id}/${crypto.randomUUID()}.${extension}`

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

        if (!form.nome.trim()) {
            toast.error("Informe o nome do professor.")
            return
        }

        try {

            setLoading(true)

            let photoPath: string | null = null

            if (photoFile) {
                photoPath = await uploadPhoto()
            }

            const updateData = {
                nome: form.nome.trim(),
                contato: form.contato.trim() || null,
                funcao: form.funcao.trim() || null,
                data_inicio: form.data_inicio || null,
                ...(photoPath && { foto_url: photoPath }),
            }

            const { error } = await supabase
                .from("teachers")
                .update(updateData)
                .eq("id", teacher.id)

            if (error) throw error

            toast.success("Professor atualizado com sucesso.")

            onOpenChange(false)

            router.refresh()

        } catch (error: unknown) {

            console.error(
                "EDIT_TEACHER_ERROR",
                error
            )

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar professor."
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={(value) => {

                if (!value) resetForm()

                onOpenChange(value)
            }}
        >

            <DialogContent className="
                max-h-[90vh]
                overflow-y-auto
                sm:max-w-[520px]
            ">

                <DialogHeader>

                    <DialogTitle>
                        Editar professor
                    </DialogTitle>

                    <DialogDescription>
                        Atualize os dados do professor.
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
                        onClick={() => fileInputRef.current?.click()}
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
                                unoptimized
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
                        Salvar alterações

                    </AppButton>

                </div>

            </DialogContent>

        </Dialog>
    )
}
