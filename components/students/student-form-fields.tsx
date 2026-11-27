"use client"

import { useId, type ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Student } from "@/types/student"

export type SchoolClass = { id: string; nome: string; turno: string }
export type StudentFormData = {
    nome: string
    data_nascimento: string
    school_class_id: string
    matricula_escolar: string
    genero: string
    nivel: Student["nivel"]
    responsavel_nome: string
    responsavel_contato: string
    observacoes: string
}

export function todayInBrasilia() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date())
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? ""
    return `${get("year")}-${get("month")}-${get("day")}`
}

export function ageOnDate(birth: string, today: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth < "0001-01-01" || birth > today) return null
    const parsed = new Date(`${birth}T00:00:00Z`)
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== birth) return null
    return Number(today.slice(0, 4)) - Number(birth.slice(0, 4)) - (today.slice(5) < birth.slice(5) ? 1 : 0)
}

export function classTurno(turno: string): Student["turno"] | null {
    switch (turno.trim().toLowerCase()) {
        case "matutino": case "manhã": return "Manhã"
        case "vespertino": case "tarde": return "Tarde"
        case "matutino e vespertino": case "integral": return "Integral"
        default: return null
    }
}

export function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits
    const local = digits.slice(2)
    if (local.length <= 4) return `(${digits.slice(0, 2)}) ${local}`
    const split = local.length === 9 ? 5 : 4
    return `(${digits.slice(0, 2)}) ${local.slice(0, split)}${local.length > split ? `-${local.slice(split)}` : ""}`
}

export function initialForm(student?: Student): StudentFormData {
    const raw = student?.genero ?? ""
    const normalized = raw.trim().toLowerCase()
    return {
        nome: student?.nome ?? "", data_nascimento: student?.data_nascimento ?? "",
        school_class_id: student?.school_class_id ?? "", matricula_escolar: student?.matricula_escolar ?? "",
        genero: ["m", "masculino"].includes(normalized) ? "Masculino" : ["f", "feminino"].includes(normalized) ? "Feminino" : raw,
        nivel: student?.nivel ?? "Iniciante", responsavel_nome: student?.responsavel_nome ?? "",
        responsavel_contato: student?.responsavel_contato ?? "", observacoes: student?.observacoes ?? "",
    }
}

const inputClass = "h-11 min-w-0 rounded-lg px-3 text-base md:text-sm"
const selectClass = "h-11 w-full min-w-0 rounded-lg border border-border bg-input px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:text-sm"
const levels = ["Iniciante", "Básico", "Intermediário", "Avançado"] as const
const genders = ["Masculino", "Feminino", "Não informado"]

function Field({ id, label, children, full = false }: { id: string; label: string; children: ReactNode; full?: boolean }) {
    return <div className={`min-w-0 space-y-1.5 ${full ? "col-span-full" : ""}`}>
        <Label htmlFor={id} className="text-xs leading-normal sm:text-sm">{label}</Label>
        {children}
    </div>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return <section className="min-w-0 space-y-3 border-t border-border pt-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[380px]:grid-cols-2">{children}</div>
    </section>
}

export function StudentFormFields({ form, onChange, classes, loadingClasses, classError, retryClasses, today, disabled, student }: {
    form: StudentFormData
    onChange: <K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) => void
    classes: SchoolClass[]
    loadingClasses: boolean
    classError: string | null
    retryClasses: () => void
    today: string
    disabled: boolean
    student?: Student
}) {
    const prefix = useId()
    const id = (name: string) => `${prefix}-${name}`
    const age = ageOnDate(form.data_nascimento, today)
    const selected = classes.find(c => c.id === form.school_class_id)
    const oldClass = student?.school_class_id === form.school_class_id && !selected ? student : undefined
    const turno = selected ? classTurno(selected.turno) : oldClass?.turno
    return <fieldset disabled={disabled} className="min-w-0 space-y-4">
        <Section title="Dados pessoais">
            <Field id={id("nome")} label="Nome completo *" full>
                <Input id={id("nome")} className={inputClass} autoComplete="off" required value={form.nome} onChange={e => onChange("nome", e.target.value)} placeholder="Nome do aluno" />
            </Field>
            <Field id={id("nascimento")} label="Nascimento *">
                <Input id={id("nascimento")} className={inputClass} type="date" max={today} required value={form.data_nascimento} onChange={e => onChange("data_nascimento", e.target.value)} />
                {age !== null && <p className="text-xs text-muted-foreground">{age} {age === 1 ? "ano" : "anos"}</p>}
            </Field>
            <Field id={id("genero")} label="Gênero">
                <select id={id("genero")} className={selectClass} value={form.genero} onChange={e => onChange("genero", e.target.value)}>
                    <option value="">Selecione</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    {form.genero && !genders.includes(form.genero) && <option value={form.genero}>{form.genero} (atual)</option>}
                </select>
            </Field>
        </Section>
        <Section title="Dados escolares">
            <Field id={id("matricula")} label="Matrícula escolar" full>
                <Input id={id("matricula")} className={inputClass} type="text" inputMode="numeric" maxLength={11} pattern="[0-9]{11}" value={form.matricula_escolar} onChange={e => onChange("matricula_escolar", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="11 dígitos" />
            </Field>
            <Field id={id("turma")} label="Turma escolar *" full>
                <select id={id("turma")} className={selectClass} required disabled={loadingClasses || !!classError} value={form.school_class_id} onChange={e => onChange("school_class_id", e.target.value)}>
                    <option value="">{loadingClasses ? "Carregando turmas…" : "Selecione a turma"}</option>
                    {student?.school_class_id && !classes.some(c => c.id === student.school_class_id) && <option value={student.school_class_id}>{student.turma} (vínculo atual)</option>}
                    {classes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                {selected && <p className="break-words text-xs text-muted-foreground">{selected.nome}</p>}
                {oldClass && !loadingClasses && <p className="text-xs text-muted-foreground">Turma anterior preservada. Selecione uma turma atual para alterá-la.</p>}
                {classError && <div role="alert" className="text-xs text-destructive">{classError} <button type="button" onClick={retryClasses} className="min-h-11 font-semibold underline">Tentar novamente</button></div>}
                {!loadingClasses && !classError && !classes.length && <p className="text-xs text-muted-foreground">Nenhuma turma ativa encontrada no ano letivo atual.</p>}
            </Field>
            <Field id={id("turno")} label="Turno automático">
                <Input id={id("turno")} className={`${inputClass} cursor-default text-foreground`} readOnly tabIndex={-1} value={turno ?? ""} placeholder="Selecione a turma" />
                <p className="text-xs text-muted-foreground">
                    Definido pela turma escolar.
                </p>
            </Field>
            <Field id={id("nivel")} label="Nível">
                <select id={id("nivel")} className={selectClass} value={form.nivel} onChange={e => onChange("nivel", e.target.value as Student["nivel"])}>
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                    {!levels.includes(form.nivel) && <option value={form.nivel}>{form.nivel}</option>}
                </select>
            </Field>
        </Section>
        <Section title="Responsável">
            <Field id={id("responsavel")} label="Nome do responsável" full>
                <Input id={id("responsavel")} className={inputClass} value={form.responsavel_nome} onChange={e => onChange("responsavel_nome", e.target.value)} placeholder="Nome completo" />
            </Field>
            <Field id={id("contato")} label="Contato" full>
                <Input id={id("contato")} className={inputClass} type="tel" inputMode="tel" value={form.responsavel_contato} onChange={e => onChange("responsavel_contato", formatPhone(e.target.value))} placeholder="(47) 99999-9999" />
            </Field>
            <Field id={id("observacoes")} label="Observações" full>
                <Textarea id={id("observacoes")} className="min-h-20 min-w-0 resize-y rounded-lg px-3 py-2 text-base md:text-sm" rows={3} value={form.observacoes} onChange={e => onChange("observacoes", e.target.value)} placeholder="Informações adicionais…" />
            </Field>
        </Section>
    </fieldset>
}
