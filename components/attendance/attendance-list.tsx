"use client"

import Image from "next/image"
import type { Student } from "@/types/student"
import { Check } from "lucide-react"

type Props = {
    students: Student[]
    attendanceMap: Record<string, boolean>
    onToggle: (studentId: string) => void
}

export function AttendanceList({
    students,
    attendanceMap,
    onToggle,
}: Props) {

    function getInitials(nome: string) {
        return nome
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }

    if (students.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="font-semibold text-foreground">
                    Nenhum aluno encontrado
                </p>
                <p className="mt-1 text-sm text-muted">
                    Tente alterar os filtros de busca.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {students.map((student) => {
                const checked = attendanceMap[student.id] === true

                return (
                    <button
                        key={student.id}
                        type="button"
                        aria-pressed={checked}
                        aria-label={`${student.nome}: ${checked ? "Presente" : "Ausente"}`}
                        onClick={() => onToggle(student.id)}
                        className={`
                            flex w-full items-center justify-between
                            rounded-2xl border p-4 sm:p-5
                            text-left transition-all duration-200
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring
                            focus-visible:ring-offset-2
                            ${checked
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-card text-card-foreground hover:bg-accent"
                            }
                        `}
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className={`
                                relative flex h-12 w-12 shrink-0
                                items-center justify-center
                                overflow-hidden rounded-full
                                ${checked ? "bg-primary-foreground/15" : "bg-muted"}
                            `}>
                                {student.foto_url ? (
                                    <Image
                                        src={student.foto_url}
                                        alt={student.nome}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {getInitials(student.nome)}
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate text-base font-bold">
                                    {student.nome}
                                </h3>

                                <p className={`
                                    mt-0.5 truncate text-sm
                                    ${checked ? "text-primary-foreground/75" : "text-muted"}
                                `}>
                                    {student.turma}
                                    {" • "}
                                    {student.turno}
                                </p>
                            </div>
                        </div>

                        <div className={`
                            ml-3 flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-full border transition-colors
                            ${checked
                                ? "border-primary-foreground/20 bg-primary-foreground text-primary"
                                : "border-border bg-background text-muted"
                            }
                        `}>
                            {checked && <Check className="h-5 w-5" />}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}