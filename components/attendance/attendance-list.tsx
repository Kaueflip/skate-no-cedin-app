"use client"

import { Check, Users } from "lucide-react"
import type { Student } from "@/types/student"
import { cn } from "@/lib/utils"
import { StudentAvatar } from "@/components/students/student-avatar"

type Props = {
    students: Student[]
    attendanceMap: Record<string, boolean>
    onToggle: (studentId: string) => void
    disabled?: boolean
}

export function AttendanceList({ students, attendanceMap, onToggle, disabled = false }: Props) {
    if (students.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-border px-3 py-8 text-center">
                <Users className="mx-auto mb-2 h-6 w-6 text-muted" />
                <p className="text-sm font-semibold text-foreground">Nenhum aluno encontrado</p>
                <p className="mt-1 text-xs text-muted">Tente alterar os filtros de busca.</p>
            </div>
        )
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-1.5">
            {students.map((student) => {
                const checked = attendanceMap[student.id] === true
                return (
                    <button
                        key={student.id}
                        type="button"
                        aria-pressed={checked}
                        aria-label={`Presença de ${student.nome}`}
                        disabled={disabled}
                        onClick={() => onToggle(student.id)}
                        className={cn(
                            "flex min-h-14 w-full min-w-0 items-center gap-2.5 rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-60 sm:gap-3 sm:p-3",
                            checked ? "border-emerald-500/40 bg-emerald-500/10 text-foreground" : "border-border bg-background/60 text-foreground hover:bg-accent"
                        )}
                    >
                        <StudentAvatar nome={student.nome} photoUrl={student.foto_principal_url} className="h-10 w-10 shrink-0 rounded-full border-0 sm:h-11 sm:w-11" fallbackClassName="text-xs" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{student.nome}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted [overflow-wrap:anywhere]">{student.turma}{" • "}{student.turno}</p>
                        </div>
                        <span aria-hidden="true" className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                            checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-border bg-background"
                        )}>
                            {checked && <Check className="h-4 w-4" />}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
