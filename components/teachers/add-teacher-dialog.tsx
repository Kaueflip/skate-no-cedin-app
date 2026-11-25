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

    useEffect(() => {
        return () => {
            if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview)
        }
    }, [photoPreview])

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
        event.target.value = ""
        if (loading) return

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
        if (loading) return

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

            let photoFailed = false
            if (photoFile) {
                let photoPath: string | null = null
                try {
                    photoPath = await uploadPhoto(insertedTeacher.id)
                    if (photoPath) {
                        const { error: updateError } = await supabase.from("teachers")
                            .update({ foto_url: photoPath }).eq("id", insertedTeacher.id)
                        if (updateError) throw updateError
                    }
                } catch (error) {
                    photoFailed = true
                    console.error("Professor cadastrado, mas foto não vinculada:", error)
                    // Não repetir o cadastro se apenas a fotografia falhar.
                }
            }
            if (photoFailed) {
                toast.warning("Professor cadastrado. Adicione a foto pelo perfil.")
            } else {
                toast.success("Professor cadastrado com sucesso.")
            }

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
                if (loading) return

                setOpen(value)

                if (!value) resetForm()
            }}
        >

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="
                max-h-[calc(100dvh-2rem)]
                w-[calc(100%-2rem)]
                min-w-0
                overflow-y-auto
                overscroll-contain
                rounded-[10px]
                gap-3
                p-4
                sm:max-w-[520px]
                sm:p-6
            ">

                <DialogHeader className="text-left">

                    <DialogTitle className="text-lg font-bold">
                        Novo professor
                    </DialogTitle>

                    <DialogDescription className="text-xs leading-relaxed sm:text-sm">
                        Cadastre um professor no projeto Skate no Cedin.
                    </DialogDescription>

                </DialogHeader>

                <div className="
                    flex
                    flex-col
                    items-center
                    gap-2
                ">

                    <button
                        type="button"
                        disabled={loading}
                        aria-label="Selecionar foto do professor"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="
                            relative
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            border
                            border-border
                            bg-input
                            transition-all
                            hover:border-primary/30
                            cursor-pointer
                        "
                    >

                        {photoPreview ? (

                            <Image
                                src={photoPreview}
                                alt="Foto do professor"
                                fill
                                unoptimized
                                sizes="80px"
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
                                    h-5
                                    w-5
                                    text-muted
                                " />

                                <span className="
                                    text-[10px]
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

                <div className="grid min-w-0 gap-3">

                    <div className="min-w-0 space-y-1.5">

                        <Label htmlFor="add-teacher-dialog-nome" className="text-xs sm:text-sm">
                            Nome completo *
                        </Label>

                        <Input
                            id="add-teacher-dialog-nome"
                            disabled={loading}
                            className="h-11 w-full min-w-0 rounded-lg text-base md:text-sm"
                            value={form.nome}
                            onChange={(e) =>
                                updateField("nome", e.target.value)
                            }
                            placeholder="Nome do professor"
                        />

                    </div>

                    <div className="min-w-0 space-y-1.5">

                        <Label htmlFor="add-teacher-dialog-funcao" className="text-xs sm:text-sm">
                            Função
                        </Label>

                        <Input
                            id="add-teacher-dialog-funcao"
                            disabled={loading}
                            className="h-11 w-full min-w-0 rounded-lg text-base md:text-sm"
                            value={form.funcao}
                            onChange={(e) =>
                                updateField("funcao", e.target.value)
                            }
                            placeholder="Ex.: Professor de skate"
                        />

                    </div>

                    <div className="min-w-0 space-y-1.5">

                        <Label htmlFor="add-teacher-dialog-contato" className="text-xs sm:text-sm">
                            Contato
                        </Label>

                        <Input
                            id="add-teacher-dialog-contato"
                            disabled={loading}
                            className="h-11 w-full min-w-0 rounded-lg text-base md:text-sm"
                            inputMode="tel"
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

                    <div className="min-w-0 space-y-1.5">

                        <Label htmlFor="add-teacher-dialog-data_inicio" className="text-xs sm:text-sm">
                            Data de início
                        </Label>

                        <Input
                            id="add-teacher-dialog-data_inicio"
                            disabled={loading}
                            className="h-11 w-full min-w-0 rounded-lg text-base md:text-sm"
                            type="date"
                            value={form.data_inicio}
                            max={new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())}
                            onChange={(e) =>
                                updateField(
                                    "data_inicio",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <AppButton
                        className="h-11 w-full rounded-lg text-sm"
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
