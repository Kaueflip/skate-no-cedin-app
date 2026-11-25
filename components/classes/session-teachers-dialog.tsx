
"use client"

import {
    useEffect,
    useState,
} from "react"

import {
    Loader2,
    Users,
} from "lucide-react"

import {
    toast,
} from "sonner"

import {
    createClient,
} from "@/lib/supabase-browser"

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

type Teacher = {
    id: string
    nome: string
    funcao: string | null
    ativo: boolean
}

type Props = {
    sessionId: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved?: () => void
}

const supabase = createClient()

export function SessionTeachersDialog({
    sessionId,
    open,
    onOpenChange,
    onSaved,
}: Props) {

    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(true)
    const [loadedSession, setLoadedSession] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!open || !sessionId) return

        let active = true
        async function loadData() {
            try {
                setLoading(true)
                setLoadError(true)
                setLoadedSession(null)

                const [
                    { data: teachersData, error: teachersError },
                    { data: assignmentsData, error: assignmentsError },
                ] = await Promise.all([

                    supabase
                        .from("teachers")
                        .select("id, nome, funcao, ativo")
                        .order("nome"),

                    supabase
                        .from("class_session_teachers")
                        .select("teacher_id")
                        .eq("class_session_id", sessionId),

                ])

                if (teachersError) throw teachersError
                if (assignmentsError) throw assignmentsError

                if (!active) return
                setTeachers(teachersData || [])

                setSelectedIds(
                    (assignmentsData || []).map(
                        (assignment) => assignment.teacher_id
                    )
                )

                setLoadError(false)
                setLoadedSession(sessionId)
            } catch (error) {
                if (!active) return
                setLoadError(true)
                console.error("LOAD_SESSION_TEACHERS_ERROR", error)
                toast.error("Erro ao carregar professores.")
            } finally {
                if (active) setLoading(false)
            }
        }

        loadData()
        return () => { active = false }
    }, [open, sessionId])

    function toggleTeacher(teacherId: string) {
        if (saving || loading || loadError || loadedSession !== sessionId) return
        setSelectedIds((prev) =>
            prev.includes(teacherId)
                ? prev.filter((id) => id !== teacherId)
                : [...prev, teacherId]
        )
    }

    async function handleSave() {
        if (loading || saving || loadError || loadedSession !== sessionId) return
        try {
            setSaving(true)

            if (selectedIds.length > 0) {
                const assignments = selectedIds.map((teacherId) => ({
                    class_session_id: sessionId,
                    teacher_id: teacherId,
                }))

                const { error: insertError } = await supabase
                    .from("class_session_teachers")
                    .upsert(assignments, {
                        onConflict: "class_session_id,teacher_id",
                        ignoreDuplicates: true,
                    })

                if (insertError) throw insertError
            }

            const { data: currentAssignments, error: currentError } =
                await supabase
                    .from("class_session_teachers")
                    .select("id, teacher_id")
                    .eq("class_session_id", sessionId)

            if (currentError) throw currentError

            const assignmentsToRemove = (currentAssignments || [])
                .filter(
                    (assignment) =>
                        !selectedIds.includes(assignment.teacher_id)
                )

            if (assignmentsToRemove.length > 0) {
                const { error: deleteError } = await supabase
                    .from("class_session_teachers")
                    .delete()
                    .in(
                        "id",
                        assignmentsToRemove.map((assignment) => assignment.id)
                    )

                if (deleteError) throw deleteError
            }

            toast.success("Professores vinculados à aula.")
            onSaved?.()
            onOpenChange(false)

        } catch (error) {
            console.error("SAVE_SESSION_TEACHERS_ERROR", error)
            toast.error("Erro ao salvar professores da aula.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => { if (!saving) onOpenChange(next) }}
        >
            <DialogContent className="
                max-h-[85dvh]
                overflow-y-auto
                rounded-[10px]
                p-4 sm:p-6
                border-border
                bg-card
                sm:max-w-lg
            ">

                <DialogHeader>

                    <div className="
                        mb-2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                    ">
                        <Users className="h-5 w-5" />
                    </div>

                    <DialogTitle className="
                        text-lg
                        font-black
                        tracking-tight
                    ">
                        Professores da aula
                    </DialogTitle>

                    <DialogDescription>
                        Selecione um ou mais professores responsáveis por esta aula.
                    </DialogDescription>

                </DialogHeader>

                {loading ? (

                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-8
                        text-muted
                    ">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando professores...
                    </div>

                ) : loadError ? (
                    <p className="rounded-lg border border-border p-3 text-sm text-muted">Não foi possível carregar os professores. Feche e abra novamente para tentar.</p>
                ) : teachers.length > 0 ? (

                    <div className="flex flex-col gap-2">

                        {teachers.map((teacher) => (

                            <label
                                key={teacher.id}
                                className={`
                                    flex
                                    cursor-pointer
                                    items-center
                                    min-w-0 gap-2
                                    rounded-lg
                                    border
                                    p-3 min-h-11
                                    transition-colors
                                    ${selectedIds.includes(teacher.id)
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-border bg-background/50 hover:bg-muted/10"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    disabled={saving}
                                    checked={selectedIds.includes(teacher.id)}
                                    onChange={() => toggleTeacher(teacher.id)}
                                    className="
                                        shrink-0 h-4
                                        w-4
                                        accent-primary
                                    "
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold [overflow-wrap:anywhere]">
                                        {teacher.nome}
                                    </p>

                                    <p className="text-xs text-muted [overflow-wrap:anywhere]">
                                        {teacher.funcao || "Função não informada"}
                                    </p>

                                </div>

                                {!teacher.ativo && (
                                    <span className="
                                        rounded-md shrink-0
                                        bg-zinc-500/10
                                        px-2
                                        py-1
                                        text-xs
                                        font-medium
                                        text-zinc-500
                                    ">
                                        Inativo
                                    </span>
                                )}

                            </label>

                        ))}

                    </div>

                ) : (

                    <div className="
                        rounded-lg
                        border
                        border-dashed
                        border-border
                        p-4
                        text-center
                    ">
                        <p className="text-sm font-semibold [overflow-wrap:anywhere]">
                            Nenhum professor cadastrado
                        </p>

                        <p className="mt-1 text-sm text-muted">
                            Cadastre professores antes de vinculá-los às aulas.
                        </p>
                    </div>

                )}

                <p className="text-xs text-muted [overflow-wrap:anywhere]">
                    {selectedIds.length} professor(es) selecionado(s)
                </p>

                <DialogFooter className="
                    mt-3
                    grid grid-cols-2 gap-2 sm:grid
                ">

                    <AppButton
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={saving}
                        className="h-11 w-full px-2 text-xs sm:text-sm"
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        onClick={handleSave}
                        loading={saving}
                        disabled={loading || saving || loadError || loadedSession !== sessionId}
                        className="h-11 w-full px-2 text-xs sm:text-sm"
                    >
                        Salvar professores
                    </AppButton>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
