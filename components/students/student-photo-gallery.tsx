
"use client"

import {
    useEffect,
    useRef,
    useState,
} from "react"

import Image from "next/image"

import { useRouter } from "next/navigation"

import {
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    Star,
    Trash2,
    Upload,
    AlertTriangle,
    LoaderCircle,
    ImageOff,
} from "lucide-react"

import { AppButton } from "@/components/ui/app-button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { createClient } from "@/lib/supabase-browser"

import {
    uploadStudentPhoto,
} from "@/services/student-photo-upload-service"

type StudentPhoto = {
    id: string
    storage_path: string
    thumbnail_path: string | null
    is_primary: boolean
    created_at: string
    signedUrl: string | null
    thumbnailUrl: string | null
}

type StudentPhotoGalleryProps = {
    studentId: string
}

const BUCKET = "student-photos"

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
]

const supabase = createClient()

// CONSULTA DAS FOTOGRAFIAS

async function getStudentPhotos(
    studentId: string
): Promise<StudentPhoto[]> {

    const { data, error } = await supabase
        .from("student_photos")
        .select(`
            id,
            storage_path,
            thumbnail_path,
            is_primary,
            created_at
        `)
        .eq("student_id", studentId)
        .order("created_at", {
            ascending: false,
        })

    if (error) throw error

    const photos = data ?? []

    if (photos.length === 0) {
        return []
    }

    const paths = [
        ...new Set(
            photos.flatMap((photo) => [
                photo.storage_path,
                photo.thumbnail_path,
            ]).filter(
                (path): path is string =>
                    typeof path === "string" &&
                    path.length > 0
            )
        ),
    ]

    const { data: signedUrls, error: signedError } =
        await supabase.storage
            .from(BUCKET)
            .createSignedUrls(paths, 3600)

    if (signedError) throw signedError

    const urlsByPath = new Map<string, string>()

    for (const item of signedUrls ?? []) {

        if (
            item.path &&
            item.signedUrl &&
            !item.error
        ) {

            urlsByPath.set(
                item.path,
                item.signedUrl
            )
        }
    }

    return photos.map((photo) => ({

        ...photo,

        signedUrl:
            urlsByPath.get(photo.storage_path) ?? null,

        thumbnailUrl: photo.thumbnail_path
            ? urlsByPath.get(photo.thumbnail_path) ?? null
            : null,

    }))
}

export function StudentPhotoGallery({
    studentId,
}: StudentPhotoGalleryProps) {

    const router = useRouter()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [photos, setPhotos] =
        useState<StudentPhoto[]>([])

    const [currentIndex, setCurrentIndex] =
        useState(0)

    const [loading, setLoading] =
        useState(true)

    const [loadError, setLoadError] =
        useState(false)

    const [retryCount, setRetryCount] =
        useState(0)

    const [uploading, setUploading] =
        useState(false)

    const [updatingPrimary, setUpdatingPrimary] =
        useState(false)

    const [deleting, setDeleting] =
        useState(false)

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false)

    const currentPhoto =
        photos[currentIndex] ?? null

    const busy =
        loading ||
        uploading ||
        updatingPrimary ||
        deleting

    const canDelete =
        photos.length > 1 &&
        currentPhoto !== null &&
        !currentPhoto.is_primary

    // CARREGAMENTO INICIAL

    useEffect(() => {

        let active = true

        async function fetchPhotos() {

            try {

                const validPhotos =
                    await getStudentPhotos(studentId)

                if (!active) return

                setPhotos(validPhotos)

                const primaryIndex =
                    validPhotos.findIndex(
                        (photo) => photo.is_primary
                    )

                setCurrentIndex(
                    primaryIndex >= 0
                        ? primaryIndex
                        : 0
                )

                setLoadError(false)

            } catch (error) {

                console.error(
                    "Erro ao carregar fotos:",
                    error
                )

                if (active) {

                    setLoadError(true)

                    toast.error(
                        "Não foi possível carregar as fotos."
                    )
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

    }, [studentId, retryCount])

    function retryLoading() {

        setLoading(true)

        setLoadError(false)

        setRetryCount(
            (previous) => previous + 1
        )
    }

    // UPLOAD

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = event.target.files?.[0]

        if (!file) return

        if (busy || loadError) {
            event.target.value = ""
            return
        }

        if (!ALLOWED_TYPES.includes(file.type)) {

            toast.error(
                "Formato inválido. Use JPG, PNG ou WEBP."
            )

            event.target.value = ""

            return
        }

        if (file.size > MAX_FILE_SIZE) {

            toast.error(
                "A imagem deve ter no máximo 5 MB."
            )

            event.target.value = ""

            return
        }

        setUploading(true)

        try {

            const isFirstPhoto =
                photos.length === 0

            await uploadStudentPhoto(
                supabase,
                studentId,
                file,
                isFirstPhoto
            )

            toast.success(
                "Foto adicionada com sucesso."
            )

            router.refresh()

            try {

                const updatedPhotos =
                    await getStudentPhotos(studentId)

                setPhotos(updatedPhotos)

                const primaryIndex =
                    updatedPhotos.findIndex(
                        (photo) => photo.is_primary
                    )

                setCurrentIndex(
                    primaryIndex >= 0
                        ? primaryIndex
                        : 0
                )

            } catch (error) {

                console.error(
                    "Erro ao atualizar galeria:",
                    error
                )

                setLoadError(true)

                toast.warning(
                    "Foto enviada. Atualize a galeria para visualizá-la."
                )
            }

        } catch (error) {

            console.error(
                "Erro ao enviar foto:",
                error
            )

            toast.error(
                "Não foi possível adicionar a foto."
            )

        } finally {

            setUploading(false)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    // DEFINIR FOTO PRINCIPAL

    async function handleSetPrimary() {

        if (
            !currentPhoto ||
            currentPhoto.is_primary ||
            busy ||
            loadError
        ) {
            return
        }

        setUpdatingPrimary(true)

        try {

            const { error } = await supabase.rpc(
                "set_student_primary_photo",
                {
                    p_student_id: studentId,
                    p_photo_id: currentPhoto.id,
                }
            )

            if (error) throw error

            setPhotos((previous) =>
                previous.map((photo) => ({

                    ...photo,

                    is_primary:
                        photo.id === currentPhoto.id,

                }))
            )

            toast.success(
                "Foto principal atualizada."
            )

            router.refresh()

        } catch (error) {

            console.error(
                "Erro ao definir foto principal:",
                error
            )

            toast.error(
                "Não foi possível definir a foto principal."
            )

        } finally {

            setUpdatingPrimary(false)
        }
    }

    // EXCLUIR FOTOGRAFIA

    async function handleDelete() {

        if (
            !currentPhoto ||
            busy ||
            loadError
        ) {
            return
        }

        if (photos.length === 1) {

            toast.error(
                "O aluno precisa ter pelo menos uma foto cadastrada."
            )

            return
        }

        if (currentPhoto.is_primary) {

            toast.error(
                "Escolha outra foto como principal antes de excluir esta."
            )

            return
        }

        setDeleting(true)

        try {

            const { error: databaseError } =
                await supabase
                    .from("student_photos")
                    .delete()
                    .eq("id", currentPhoto.id)
                    .eq("student_id", studentId)

            if (databaseError) {
                throw databaseError
            }

            const pathsToDelete = [
                currentPhoto.storage_path,
            ]

            if (currentPhoto.thumbnail_path) {

                pathsToDelete.push(
                    currentPhoto.thumbnail_path
                )
            }

            const remainingPhotos = photos.filter(
                (photo) => photo.id !== currentPhoto.id
            )

            setPhotos(remainingPhotos)

            const primaryIndex =
                remainingPhotos.findIndex(
                    (photo) => photo.is_primary
                )

            setCurrentIndex(
                primaryIndex >= 0
                    ? primaryIndex
                    : 0
            )

            setDeleteDialogOpen(false)

            router.refresh()

            try {

                const { error: storageError } =
                    await supabase.storage
                        .from(BUCKET)
                        .remove(pathsToDelete)

                if (storageError) {
                    throw storageError
                }

                toast.success("Foto excluída.")

            } catch (error) {

                console.error(
                    "Erro ao remover arquivos:",
                    error
                )

                toast.warning(
                    "Registro excluído, mas não foi possível remover todos os arquivos do armazenamento."
                )
            }

        } catch (error) {

            console.error(
                "Erro ao excluir foto:",
                error
            )

            toast.error(
                "Não foi possível excluir a foto."
            )

        } finally {

            setDeleting(false)
        }
    }

    function showPrevious() {

        if (busy || photos.length < 2) return

        setCurrentIndex((index) =>
            index === 0
                ? photos.length - 1
                : index - 1
        )
    }

    function showNext() {

        if (busy || photos.length < 2) return

        setCurrentIndex((index) =>
            index === photos.length - 1
                ? 0
                : index + 1
        )
    }

    return (

        <section className="
            w-full
            min-w-0
            space-y-3
        ">

            {/* CABEÇALHO */}

            <div className="
                flex
                min-w-0
                flex-wrap
                items-center
                justify-between
                gap-2
            ">

                <div className="min-w-0 flex-1">

                    <h2 className="
                        text-base
                        font-bold
                        leading-tight

                        md:text-lg
                    ">
                        Fotos do aluno
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-muted-foreground
                    ">
                        {loading
                            ? "Carregando fotos..."
                            : loadError
                                ? "Galeria indisponível"
                                : photos.length === 0
                                    ? "Nenhuma foto cadastrada"
                                    : `${photos.length} ${photos.length === 1
                                        ? "foto cadastrada"
                                        : "fotos cadastradas"
                                    }`}
                    </p>

                </div>

                <AppButton
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    loading={uploading}
                    disabled={busy || loadError}
                    className="
                        h-11
                        shrink-0
                        gap-1.5
                        rounded-lg
                        px-3
                        text-xs

                        sm:text-sm
                    "
                >

                    {!uploading && (
                        <Upload className="h-4 w-4 shrink-0" />
                    )}

                    {uploading
                        ? "Enviando..."
                        : "Adicionar foto"}

                </AppButton>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUpload}
                    className="hidden"
                />

            </div>

            {/* CARREGAMENTO */}

            {loading ? (

                <div
                    role="status"
                    className="
                        flex
                        min-h-40
                        flex-col
                        items-center
                        justify-center
                        gap-2

                        rounded-lg
                        border
                        border-border
                        bg-background/50
                    "
                >

                    <LoaderCircle className="
                        h-5
                        w-5
                        animate-spin
                        text-muted-foreground
                    " />

                    <p className="
                        text-xs
                        text-muted-foreground
                    ">
                        Carregando galeria...
                    </p>

                </div>

            ) : loadError ? (

                <div className="
                    flex
                    min-h-40
                    flex-col
                    items-center
                    justify-center
                    gap-2

                    rounded-lg
                    border
                    border-dashed
                    border-border

                    p-3
                    text-center
                ">

                    <ImageOff className="
                        h-6
                        w-6
                        text-muted-foreground
                    " />

                    <p className="text-sm font-medium">
                        Não foi possível carregar as fotos.
                    </p>

                    <AppButton
                        variant="secondary"
                        onClick={retryLoading}
                        className="h-11 px-3 text-xs"
                    >
                        Tentar novamente
                    </AppButton>

                </div>

            ) : photos.length === 0 ? (

                /* GALERIA VAZIA */

                <div className="
                    flex
                    min-h-40
                    flex-col
                    items-center
                    justify-center
                    gap-2

                    rounded-lg
                    border
                    border-dashed
                    border-border
                    bg-muted/20

                    p-4
                    text-center
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-lg
                        bg-muted
                    ">

                        <ImagePlus className="
                            h-5
                            w-5
                            text-muted-foreground
                        " />

                    </div>

                    <p className="text-sm font-semibold">
                        Nenhuma foto por aqui
                    </p>

                    <p className="
                        text-xs
                        leading-relaxed
                        text-muted-foreground
                    ">
                        Adicione a primeira fotografia deste aluno.
                    </p>

                    <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="
                            min-h-11
                            text-xs
                            font-semibold
                            text-primary
                            hover:underline
                            disabled:opacity-50
                        "
                    >
                        Adicionar primeira foto
                    </button>

                </div>

            ) : (

                <div className="min-w-0 space-y-3">

                    {/* FOTOGRAFIA ORIGINAL */}

                    <div className="
                        relative
                        flex
                        w-full
                        min-w-0
                        items-center
                        justify-center

                        overflow-hidden
                        rounded-[10px]
                        border
                        border-border
                        bg-muted/20
                    ">

                        <div className="
                            relative

                            h-48
                            w-full
                            max-w-lg

                            sm:h-64
                            lg:h-80
                        ">

                            {currentPhoto?.signedUrl ? (

                                <Image
                                    key={currentPhoto.id}
                                    src={currentPhoto.signedUrl}
                                    alt={`Foto ${currentIndex + 1} do aluno`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 640px) 100vw, 512px"
                                    className="object-contain"
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-full
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                ">

                                    <ImageOff className="
                                        h-6
                                        w-6
                                        text-muted-foreground
                                    " />

                                    <p className="
                                        text-xs
                                        text-muted-foreground
                                    ">
                                        Foto indisponível
                                    </p>

                                </div>

                            )}

                        </div>

                        {/* NAVEGAÇÃO */}

                        {photos.length > 1 && (

                            <>

                                <button
                                    type="button"
                                    onClick={showPrevious}
                                    disabled={busy}
                                    aria-label="Foto anterior"
                                    className="
                                        absolute
                                        left-1.5
                                        top-1/2

                                        flex
                                        h-11
                                        w-11
                                        -translate-y-1/2
                                        items-center
                                        justify-center

                                        rounded-lg
                                        border
                                        border-border
                                        bg-background/90

                                        shadow-sm

                                        transition-colors
                                        hover:bg-muted
                                        disabled:opacity-50
                                    "
                                >

                                    <ChevronLeft className="h-5 w-5" />

                                </button>

                                <button
                                    type="button"
                                    onClick={showNext}
                                    disabled={busy}
                                    aria-label="Próxima foto"
                                    className="
                                        absolute
                                        right-1.5
                                        top-1/2

                                        flex
                                        h-11
                                        w-11
                                        -translate-y-1/2
                                        items-center
                                        justify-center

                                        rounded-lg
                                        border
                                        border-border
                                        bg-background/90

                                        shadow-sm

                                        transition-colors
                                        hover:bg-muted
                                        disabled:opacity-50
                                    "
                                >

                                    <ChevronRight className="h-5 w-5" />

                                </button>

                            </>

                        )}

                        {/* IDENTIFICAÇÃO DA FOTO PRINCIPAL */}

                        {currentPhoto?.is_primary && (

                            <span className="
                                absolute
                                left-2
                                top-2

                                inline-flex
                                items-center
                                gap-1

                                rounded-md

                                bg-primary

                                px-2
                                py-1

                                text-[10px]
                                font-semibold
                                text-primary-foreground
                            ">

                                <Star className="h-3 w-3 fill-current" />

                                Principal

                            </span>

                        )}

                        {/* CONTADOR */}

                        <span className="
                            absolute
                            bottom-2
                            right-2

                            rounded-md

                            bg-black/70

                            px-2
                            py-1

                            text-[10px]
                            font-medium
                            tabular-nums
                            text-white
                        ">

                            {currentIndex + 1}/{photos.length}

                        </span>

                    </div>

                    {/* MINIATURAS WEBP */}

                    {photos.length > 1 && (

                        <div className="
                            flex
                            w-full
                            min-w-0
                            gap-2

                            overflow-x-auto
                            overscroll-x-contain

                            pb-1
                        ">

                            {photos.map((photo, index) => (

                                <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() =>
                                        setCurrentIndex(index)
                                    }
                                    disabled={busy}
                                    aria-label={`Ver foto ${index + 1}`}
                                    aria-pressed={index === currentIndex}
                                    className={cn(
                                        `
                                            relative

                                            h-12
                                            w-12
                                            shrink-0

                                            overflow-hidden

                                            rounded-lg
                                            border-2
                                            bg-muted/20

                                            transition-colors
                                            disabled:opacity-50

                                            sm:h-14
                                            sm:w-14
                                        `,
                                        index === currentIndex
                                            ? "border-primary"
                                            : "border-border opacity-70 hover:opacity-100"
                                    )}
                                >

                                    {photo.thumbnailUrl ? (

                                        <Image
                                            src={photo.thumbnailUrl}
                                            alt={`Miniatura ${index + 1}`}
                                            fill
                                            unoptimized
                                            loading="lazy"
                                            sizes="56px"
                                            className="object-cover"
                                        />

                                    ) : (

                                        <div className="
                                            flex
                                            h-full
                                            items-center
                                            justify-center
                                        ">

                                            <ImageOff className="
                                                h-4
                                                w-4
                                                text-muted-foreground
                                            " />

                                        </div>

                                    )}

                                    {photo.is_primary && (

                                        <span className="
                                            absolute
                                            bottom-0
                                            right-0

                                            rounded-tl-sm
                                            bg-primary

                                            p-0.5
                                            text-primary-foreground
                                        ">

                                            <Star className="h-2.5 w-2.5 fill-current" />

                                        </span>

                                    )}

                                </button>
                            ))}

                        </div>

                    )}

                    {/* AÇÕES DA FOTOGRAFIA */}

                    <div className={cn(
                        "grid min-w-0 gap-2",
                        currentPhoto?.is_primary
                            ? "grid-cols-1"
                            : "grid-cols-2"
                    )}>

                        {!currentPhoto?.is_primary && (

                            <AppButton
                                variant="secondary"
                                onClick={handleSetPrimary}
                                loading={updatingPrimary}
                                disabled={busy}
                                className="
                                    h-11
                                    min-w-0
                                    gap-1.5
                                    rounded-lg
                                    px-2
                                    text-xs
                                "
                            >

                                {!updatingPrimary && (
                                    <Star className="h-4 w-4 shrink-0" />
                                )}

                                Tornar principal

                            </AppButton>

                        )}

                        <AppButton
                            variant="secondary"
                            onClick={() =>
                                setDeleteDialogOpen(true)
                            }
                            loading={deleting}
                            disabled={busy || !canDelete}
                            title={
                                photos.length === 1
                                    ? "O aluno precisa ter pelo menos uma foto."
                                    : currentPhoto?.is_primary
                                        ? "Defina outra foto como principal antes de excluir."
                                        : "Excluir foto"
                            }
                            className="
                                h-11
                                min-w-0
                                gap-1.5

                                rounded-lg
                                border-destructive/30

                                px-2
                                text-xs
                                text-destructive

                                hover:bg-destructive/10
                            "
                        >

                            {!deleting && (
                                <Trash2 className="h-4 w-4 shrink-0" />
                            )}

                            Excluir foto

                        </AppButton>

                    </div>

                </div>

            )}

            <p className="
                text-[11px]
                leading-relaxed
                text-muted-foreground
            ">
                JPG, PNG ou WEBP • Máximo de 5 MB por foto.
            </p>

            {/* CONFIRMAÇÃO DE EXCLUSÃO */}

            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {

                    if (!deleting) {
                        setDeleteDialogOpen(open)
                    }
                }}
            >

                <DialogContent className="
                    w-[calc(100%-2rem)]
                    max-w-md

                    rounded-[10px]
                    border-border
                    bg-card

                    p-4

                    sm:p-6
                ">

                    <DialogHeader className="text-left">

                        <div className="
                            mb-2

                            flex
                            h-10
                            w-10
                            items-center
                            justify-center

                            rounded-lg

                            bg-destructive/10
                            text-destructive
                        ">

                            <AlertTriangle className="h-5 w-5" />

                        </div>

                        <DialogTitle className="
                            text-lg
                            font-bold
                            tracking-tight
                        ">
                            Excluir foto
                        </DialogTitle>

                        <DialogDescription className="
                            text-sm
                            leading-relaxed
                            text-muted-foreground
                        ">
                            Tem certeza de que deseja excluir esta foto?
                            A imagem e sua miniatura serão removidas
                            permanentemente. Esta ação não poderá
                            ser desfeita.
                        </DialogDescription>

                    </DialogHeader>

                    <DialogFooter className="
                        mt-3

                        grid
                        grid-cols-2
                        gap-2
                    ">

                        <AppButton
                            variant="secondary"
                            onClick={() =>
                                setDeleteDialogOpen(false)
                            }
                            disabled={deleting}
                            className="
                                h-11
                                w-full
                                px-2
                                text-xs
                            "
                        >
                            Cancelar
                        </AppButton>

                        <AppButton
                            variant="danger"
                            loading={deleting}
                            onClick={handleDelete}
                            disabled={!canDelete}
                            className="
                                h-11
                                w-full
                                px-2
                                text-xs
                            "
                        >
                            Excluir foto
                        </AppButton>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

        </section>
    )
}
