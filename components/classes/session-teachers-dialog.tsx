
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
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!open || !sessionId) return

        async function loadData() {
            try {
                setLoading(true)

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

                setTeachers(teachersData || [])

                setSelectedIds(
                    (assignmentsData || []).map(
                        (assignment) => assignment.teacher_id
                    )
                )

            } catch (error) {
                console.error("LOAD_SESSION_TEACHERS_ERROR", error)
                toast.error("Erro ao carregar professores.")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [open, sessionId])

    function toggleTeacher(teacherId: string) {
        setSelectedIds((prev) =>
            prev.includes(teacherId)
                ? prev.filter((id) => id !== teacherId)
                : [...prev, teacherId]
        )
    }

    async function handleSave() {
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
            onOpenChange={onOpenChange}
        >
            <DialogContent className="
                max-h-[85vh]
                overflow-y-auto
                rounded-[2rem]
                border-border
                bg-card
                sm:max-w-lg
            ">

                <DialogHeader>

                    <div className="
                        mb-3
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-primary/10
                        text-primary
                    ">
                        <Users className="h-5 w-5" />
                    </div>

                    <DialogTitle className="
                        text-2xl
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
                        py-12
                        text-muted
                    ">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando professores...
                    </div>

                ) : teachers.length > 0 ? (

                    <div className="flex flex-col gap-2">

                        {teachers.map((teacher) => (

                            <label
                                key={teacher.id}
                                className={`
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    border
                                    p-4
                                    transition-colors
                                    ${selectedIds.includes(teacher.id)
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-border bg-background/50 hover:bg-muted/10"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(teacher.id)}
                                    onChange={() => toggleTeacher(teacher.id)}
                                    className="
                                        h-4
                                        w-4
                                        accent-primary
                                    "
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="font-semibold">
                                        {teacher.nome}
                                    </p>

                                    <p className="text-xs text-muted">
                                        {teacher.funcao || "Função não informada"}
                                    </p>

                                </div>

                                {!teacher.ativo && (
                                    <span className="
                                        rounded-full
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
                        rounded-2xl
                        border
                        border-dashed
                        border-border
                        p-8
                        text-center
                    ">
                        <p className="font-semibold">
                            Nenhum professor cadastrado
                        </p>

                        <p className="mt-1 text-sm text-muted">
                            Cadastre professores antes de vinculá-los às aulas.
                        </p>
                    </div>

                )}

                <p className="text-xs text-muted">
                    {selectedIds.length} professor(es) selecionado(s)
                </p>

                <DialogFooter className="
                    mt-4
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                ">

                    <AppButton
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={saving}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </AppButton>

                    <AppButton
                        onClick={handleSave}
                        loading={saving}
                        disabled={loading || saving}
                        className="w-full sm:w-auto"
                    >
                        Salvar professores
                    </AppButton>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
