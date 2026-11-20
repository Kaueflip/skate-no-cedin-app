
"use client"

import {
    useEffect,
    useRef,
    useState,
} from "react"

import Image from "next/image"

import {
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    Loader2,
    Star,
    Trash2,
    Upload,
    AlertTriangle,
} from "lucide-react"

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

import { toast } from "sonner"

import { createClient } from "@/lib/supabase-browser"

type StudentPhoto = {
    id: string
    storage_path: string
    is_primary: boolean
    created_at: string
    signedUrl: string
}

type StudentPhotoGalleryProps = {
    studentId: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
]

const supabase = createClient()

async function getStudentPhotos(studentId: string): Promise<StudentPhoto[]> {
    const { data, error } = await supabase
        .from("student_photos")
        .select("id, storage_path, is_primary, created_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

    if (error) {
        throw error
    }

    const photosWithUrls = await Promise.all(
        (data ?? []).map(async (photo) => {
            const { data: signedData, error: signedError } =
                await supabase.storage
                    .from("student-photos")
                    .createSignedUrl(photo.storage_path, 3600)

            if (signedError || !signedData) {
                return null
            }

            return {
                ...photo,
                signedUrl: signedData.signedUrl,
            }
        })
    )

    return photosWithUrls.filter(
        (photo): photo is StudentPhoto => photo !== null
    )
}

export function StudentPhotoGallery({
    studentId,
}: StudentPhotoGalleryProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [photos, setPhotos] = useState<StudentPhoto[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [updatingPrimary, setUpdatingPrimary] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const currentPhoto = photos[currentIndex] ?? null

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    useEffect(() => {
        let active = true

        async function fetchPhotos() {
            try {
                const validPhotos = await getStudentPhotos(studentId)

                if (!active) return

                setPhotos(validPhotos)

                const primaryIndex = validPhotos.findIndex(
                    (photo) => photo.is_primary
                )

                setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0)
            } catch (error) {
                console.error("Erro ao carregar fotos:", error)

                if (active) {
                    toast.error("Não foi possível carregar as fotos.")
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchPhotos()

        return () => {
            active = false
        }
    }, [studentId])

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0]

        if (!file) return

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Formato inválido. Use JPG, PNG ou WEBP.")
            event.target.value = ""
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("A imagem deve ter no máximo 5 MB.")
            event.target.value = ""
            return
        }

        const extension = file.name.split(".").pop()?.toLowerCase()

        if (!extension) {
            toast.error("Não foi possível identificar o formato da imagem.")
            event.target.value = ""
            return
        }

        setUploading(true)

        try {
            const storagePath =
                `${studentId}/${crypto.randomUUID()}.${extension}`

            const { error: uploadError } = await supabase.storage
                .from("student-photos")
                .upload(storagePath, file, {
                    contentType: file.type,
                    upsert: false,
                })

            if (uploadError) {
                throw uploadError
            }

            const isFirstPhoto = photos.length === 0

            const { error: insertError } = await supabase
                .from("student_photos")
                .insert({
                    student_id: studentId,
                    storage_path: storagePath,
                    is_primary: isFirstPhoto,
                })

            if (insertError) {
                await supabase.storage
                    .from("student-photos")
                    .remove([storagePath])

                throw insertError
            }

            toast.success("Foto adicionada com sucesso.")
            const updatedPhotos = await getStudentPhotos(studentId)
            setPhotos(updatedPhotos)

            const primaryIndex = updatedPhotos.findIndex(
                (photo) => photo.is_primary
            )

            setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0)
        } catch (error) {
            console.error("Erro ao enviar foto:", error)
            toast.error("Não foi possível adicionar a foto.")
        } finally {
            setUploading(false)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    async function handleSetPrimary() {
        if (!currentPhoto || currentPhoto.is_primary) return

        setUpdatingPrimary(true)

        const { error } = await supabase.rpc(
            "set_student_primary_photo",
            {
                p_student_id: studentId,
                p_photo_id: currentPhoto.id,
            }
        )

        if (error) {
            console.error("Erro ao definir foto principal:", error)
            toast.error("Não foi possível definir a foto principal.")
            setUpdatingPrimary(false)
            return
        }

        toast.success("Foto principal atualizada.")
        const updatedPhotos = await getStudentPhotos(studentId)
        setPhotos(updatedPhotos)

        const primaryIndex = updatedPhotos.findIndex(
            (photo) => photo.is_primary
        )

        setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0)

        setDeleteDialogOpen(false)
        setDeleting(false)
    }

    async function handleDelete() {
        if (!currentPhoto) return

        if (
            currentPhoto.is_primary &&
            photos.length > 1
        ) {
            toast.error(
                "Escolha outra foto como principal antes de excluir esta."
            )
            return
        }

        setDeleting(true)

        const { error: databaseError } = await supabase
            .from("student_photos")
            .delete()
            .eq("id", currentPhoto.id)
            .eq("student_id", studentId)

        if (databaseError) {
            console.error("Erro ao excluir registro:", databaseError)
            toast.error("Não foi possível excluir a foto.")
            setDeleting(false)
            return
        }

        const { error: storageError } = await supabase.storage
            .from("student-photos")
            .remove([currentPhoto.storage_path])

        if (storageError) {
            console.error("Erro ao excluir arquivo:", storageError)
            toast.warning(
                "O registro foi excluído, mas o arquivo não pôde ser removido do armazenamento."
            )
        } else {
            toast.success("Foto excluída.")
        }

        const updatedPhotos = await getStudentPhotos(studentId)
        setPhotos(updatedPhotos)

        const primaryIndex = updatedPhotos.findIndex(
            (photo) => photo.is_primary
        )

        setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0)
        setDeleting(false)
    }

    function showPrevious() {
        setCurrentIndex((index) =>
            index === 0 ? photos.length - 1 : index - 1
        )
    }

    function showNext() {
        setCurrentIndex((index) =>
            index === photos.length - 1 ? 0 : index + 1
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold">
                        Fotos do aluno
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {photos.length === 0
                            ? "Nenhuma foto cadastrada"
                            : `${photos.length} ${photos.length === 1 ? "foto cadastrada" : "fotos cadastradas"}`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="h-4 w-4" />
                    )}

                    {uploading ? "Enviando..." : "Adicionar foto"}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>

            {loading ? (
                <div className="flex min-h-64 items-center justify-center rounded-xl border border-border">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : photos.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div>
                        <p className="font-medium">
                            Nenhuma foto por aqui
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Adicione fotos para criar a galeria deste aluno.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Adicionar primeira foto
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 p-3">
                        <div className="relative h-72 w-full max-w-md">
                            {currentPhoto && (
                                <Image
                                    src={currentPhoto.signedUrl}
                                    alt="Foto do aluno"
                                    fill
                                    unoptimized
                                    className="rounded-lg object-contain"
                                    sizes="(max-width: 768px) 100vw, 448px"
                                />
                            )}
                        </div>

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrevious}
                                    aria-label="Foto anterior"
                                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm transition-colors hover:bg-muted"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={showNext}
                                    aria-label="Próxima foto"
                                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm transition-colors hover:bg-muted"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        {currentPhoto?.is_primary && (
                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                                <Star className="h-3 w-3 fill-current" />
                                Foto principal
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Foto {currentIndex + 1} de {photos.length}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {!currentPhoto?.is_primary && (
                                <button
                                    type="button"
                                    onClick={handleSetPrimary}
                                    disabled={updatingPrimary || deleting}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                                >
                                    {updatingPrimary ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Star className="h-4 w-4" />
                                    )}
                                    Definir como principal
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setDeleteDialogOpen(true)}
                                disabled={
                                    deleting ||
                                    updatingPrimary ||
                                    photos.length === 1
                                }
                                title={
                                    photos.length === 1
                                        ? "O aluno precisa ter pelo menos uma foto cadastrada."
                                        : "Excluir foto"
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {deleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}

                                Excluir
                            </button>
                        </div>
                    </div>

                    {photos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {photos.map((photo, index) => (
                                <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Ver foto ${index + 1}`}
                                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${index === currentIndex
                                        ? "border-primary"
                                        : "border-border opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={photo.signedUrl}
                                        alt={`Miniatura ${index + 1}`}
                                        fill
                                        unoptimized
                                        sizes="64px"
                                        className="object-cover"
                                    />

                                    {photo.is_primary && (
                                        <span className="absolute bottom-0 right-0 rounded-tl-md bg-primary p-1 text-primary-foreground">
                                            <Star className="h-3 w-3 fill-current" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Imagens JPG, PNG ou WEBP, com tamanho máximo de 5 MB.
            </p>

            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!deleting) {
                        setDeleteDialogOpen(open)
                    }
                }}
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
                bg-destructive/10
                text-destructive
            ">
                            <AlertTriangle className="h-6 w-6" />
                        </div>

                        <DialogTitle className="
                text-2xl
                font-black
                tracking-tight
            ">
                            Excluir foto
                        </DialogTitle>

                        <DialogDescription className="
                pt-2
                text-base
                leading-relaxed
                text-muted
            ">
                            Tem certeza de que deseja excluir esta foto?

                            <br />
                            <br />

                            Esta ação removerá permanentemente a imagem
                            da galeria e do armazenamento. Essa operação
                            não poderá ser desfeita.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="
            mt-6
            flex-col-reverse
            gap-3
            sm:flex-row
        ">
                        <AppButton
                            variant="secondary"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </AppButton>

                        <AppButton
                            variant="danger"
                            loading={deleting}
                            onClick={handleDelete}
                            className="w-full sm:w-auto"
                        >
                            Excluir foto
                        </AppButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </section>
    )
}
