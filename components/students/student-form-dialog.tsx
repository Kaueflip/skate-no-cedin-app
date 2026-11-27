"use client"

import Image from "next/image"
import { Camera } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase-browser"
import { AppButton } from "@/components/ui/app-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { uploadStudentPhoto } from "@/services/student-photo-upload-service"
import type { Student } from "@/types/student"
import { ageOnDate, classTurno, initialForm, todayInBrasilia, StudentFormFields, type SchoolClass, type StudentFormData } from "./student-form-fields"

export function StudentFormDialog({ student, open, onOpenChange, children }: {
    student?: Student
    open: boolean
    onOpenChange: (open: boolean) => void
    children?: ReactNode
}) {
    const busy = useRef(false)
    function changeOpen(next: boolean) {
        if (!busy.current) onOpenChange(next)
    }
    return <Dialog open={open} onOpenChange={changeOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        {open && <FormContent key={student?.id ?? "new"} student={student} busy={busy} onClose={() => onOpenChange(false)} />}
    </Dialog>
}

function FormContent({ student, busy, onClose }: { student?: Student; busy: { current: boolean }; onClose: () => void }) {
    const router = useRouter()
    const [supabase] = useState(createClient)
    const [form, setForm] = useState(() => initialForm(student))
    const [today] = useState(todayInBrasilia)
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const [loadingClasses, setLoadingClasses] = useState(true)
    const [classError, setClassError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)
    const [saving, setSaving] = useState(false)
    const [photo, setPhoto] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const previewRef = useRef<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const year = Number(today.slice(0, 4))

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const { data, error } = await supabase.from("school_classes").select("id, nome, turno").eq("ativo", true).eq("ano_letivo", year).order("nome")
                if (error) throw error
                if (!cancelled) setClasses(data ?? [])
            } catch (error) {
                if (!cancelled) {
                    console.error("LOAD_SCHOOL_CLASSES_ERROR", error)
                    setClassError("Não foi possível carregar as turmas escolares.")
                }
            } finally {
                if (!cancelled) setLoadingClasses(false)
            }
        }
        void load()
        return () => { cancelled = true }
    }, [supabase, year, attempt])

    useEffect(() => () => {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }, [])

    function change<K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    function clearPhoto() {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current)
        previewRef.current = null
        setPhoto(null)
        setPreview(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
            toast.error("Selecione uma imagem JPG, PNG ou WebP de até 5 MB.")
            return
        }
        if (previewRef.current) URL.revokeObjectURL(previewRef.current)
        const url = URL.createObjectURL(file)
        previewRef.current = url
        setPhoto(file)
        setPreview(url)
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (busy.current || loadingClasses || classError) return
        const date = todayInBrasilia()
        if (!form.nome.trim() || !form.school_class_id || ageOnDate(form.data_nascimento, date) === null) {
            toast.error("Preencha o nome, a data de nascimento válida e a turma escolar.")
            return
        }
        const matricula = form.matricula_escolar.trim()
        if (matricula && !/^\d{11}$/.test(matricula)) {
            toast.error("A matrícula escolar deve conter exatamente 11 dígitos.")
            return
        }
        const selected = classes.find(c => c.id === form.school_class_id)
        const preserveClass = !selected && !!student?.school_class_id && student.school_class_id === form.school_class_id
        const turno = selected ? classTurno(selected.turno) : preserveClass ? student?.turno : null
        const turma = selected?.nome ?? (preserveClass ? student?.turma : undefined)
        if (!turno || !turma) {
            toast.error("Selecione uma turma escolar com turno válido.")
            return
        }
        const payload = {
            nome: form.nome.trim(), data_nascimento: form.data_nascimento,
            school_class_id: form.school_class_id, turma, turno,
            matricula_escolar: matricula || null, genero: form.genero.trim() || null,
            nivel: form.nivel, responsavel_nome: form.responsavel_nome.trim(),
            responsavel_contato: form.responsavel_contato.trim(), observacoes: form.observacoes.trim(),
        }
        busy.current = true
        setSaving(true)
        try {
            if (student) {
                const { error } = await supabase.from("students").update(payload).eq("id", student.id).select("id").single()
                if (error) throw error
            } else {
                const { data, error } = await supabase.from("students").insert({ ...payload, data_inicio: date }).select("id").single()
                if (error) throw error
                if (!data?.id) throw new Error("Não foi possível confirmar o cadastro.")
                if (photo) {
                    try { await uploadStudentPhoto(supabase, data.id, photo, true) }
                    catch (error) {
                        console.error("ADD_STUDENT_PHOTO_ERROR", error)
                        toast.warning("Aluno cadastrado, mas a foto não foi enviada. Adicione-a pela galeria.")
                    }
                }
            }
            toast.success(student ? "Aluno atualizado com sucesso" : "Aluno cadastrado com sucesso")
            onClose()
            router.refresh()
        } catch (error) {
            console.error("SAVE_STUDENT_ERROR", error)
            const info = error as { code?: string } | null
            toast.error(info?.code === "23505" ? "Já existe um registro com estes dados. Verifique a matrícula." : student ? "Não foi possível atualizar o aluno." : "Não foi possível cadastrar o aluno.")
        } finally {
            busy.current = false
            setSaving(false)
        }
    }

    return <DialogContent
        className="flex max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] min-w-0 max-w-[580px] flex-col gap-0 overflow-hidden rounded-[10px] p-0 sm:max-h-[min(90dvh,800px)] sm:w-full [&>button:last-child]:right-2 [&>button:last-child]:top-2 [&>button:last-child]:h-11 [&>button:last-child]:w-11 [&>button:last-child]:rounded-lg"
        onOpenAutoFocus={event => { event.preventDefault(); headingRef.current?.focus() }}
        onEscapeKeyDown={event => { if (busy.current) event.preventDefault() }}
        onInteractOutside={event => { event.preventDefault() }}
    >
        <DialogHeader className="shrink-0 gap-1 border-b border-border px-3 py-3 pr-14 sm:px-5 sm:pr-14">
            <DialogTitle ref={headingRef} tabIndex={-1} className="text-lg outline-none sm:text-xl">{student ? "Editar aluno" : "Novo aluno"}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">{student ? "Atualize os dados do aluno." : "Cadastre um aluno no Skate no Cedin."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-3 sm:px-5 sm:py-4">
                {!student && <div className="flex min-w-0 items-center gap-3">
                    <button type="button" disabled={saving} aria-label="Selecionar foto do aluno" onClick={() => inputRef.current?.click()} className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-input focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
                        {preview ? <Image src={preview} alt="Prévia da foto" fill unoptimized sizes="76px" className="object-cover" /> : <Camera className="h-6 w-6 text-muted-foreground" />}
                    </button>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={selectPhoto} disabled={saving} />
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-semibold">Foto do aluno</p><p className="text-xs text-muted-foreground">Opcional · JPG, PNG ou WebP · até 5 MB</p>
                        <div className="flex flex-wrap gap-1">
                            <AppButton type="button" variant="secondary" disabled={saving} onClick={() => inputRef.current?.click()} className="min-h-11 rounded-lg px-3 py-2 text-xs">{photo ? "Trocar foto" : "Selecionar foto"}</AppButton>
                            {photo && <AppButton type="button" variant="ghost" disabled={saving} onClick={clearPhoto} className="min-h-11 rounded-lg px-2 py-2 text-xs">Remover</AppButton>}
                        </div>
                    </div>
                </div>}
                <StudentFormFields form={form} onChange={change} classes={classes} loadingClasses={loadingClasses} classError={classError} retryClasses={() => { setLoadingClasses(true); setClassError(null); setAttempt(n => n + 1) }} today={today} disabled={saving} student={student} />
                <p className="text-xs text-muted-foreground">* Campos obrigatórios</p>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border bg-card px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
                <AppButton type="button" variant="secondary" disabled={saving} onClick={onClose} className="min-h-11 min-w-0 rounded-lg px-2 py-2 text-xs sm:text-sm">Cancelar</AppButton>
                <AppButton type="submit" loading={saving} disabled={loadingClasses || !!classError} className="min-h-11 min-w-0 rounded-lg px-2 py-2 text-xs sm:text-sm">{student ? "Salvar alterações" : "Salvar aluno"}</AppButton>
            </div>
        </form>
    </DialogContent>
}
