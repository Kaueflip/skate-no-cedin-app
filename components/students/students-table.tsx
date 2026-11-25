
"use client"

import { useRouter } from "nextjs-toploader/app"

import type { Student } from "@/types/student"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import {
    StudentAvatar,
} from "@/components/students/student-avatar"

import { calculateAge } from "@/lib/calculate-age"

type Props = {
    students: Student[]
}

export function StudentsTable({
    students,
}: Props) {

    const router = useRouter()

    function getLevelStyles(
        nivel: Student["nivel"]
    ) {
        switch (nivel) {

            case "Iniciante":
                return `
                    bg-zinc-900
                    text-white
                    hover:bg-zinc-800
                    dark:bg-zinc-100
                    dark:text-zinc-900
                `

            case "Básico":
                return `
                    border-transparent
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                `

            case "Intermediário":
                return `
                    border-transparent
                    bg-amber-500/10
                    text-amber-600
                    dark:text-amber-400
                `

            case "Avançado":
                return `
                    border-transparent
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                `

            default:
                return `
                    bg-secondary
                    text-secondary-foreground
                `
        }
    }

    return (
        <div className="
            overflow-hidden
            rounded-[2rem]
            border
            border-border
            bg-card/80
            shadow-sm
            backdrop-blur-xl
        ">
            <Table>

                <TableHeader className="bg-muted/10">

                    <TableRow className="
                        border-border
                        hover:bg-transparent
                    ">

                        <TableHead>Aluno</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Turno</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Início</TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {students.map((student) => {

                        const age = calculateAge(
                            student.data_nascimento
                        )

                        return (
                            <TableRow
                                key={student.id}
                                onClick={() =>
                                    router.push(
                                        `/students/${student.id}`
                                    )
                                }
                                className="
                                    cursor-pointer
                                    border-border
                                    transition-colors
                                    hover:bg-muted/10
                                "
                            >

                                <TableCell>

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <StudentAvatar
                                            nome={student.nome}
                                            photoUrl={
                                                student.foto_principal_url
                                            }
                                        />

                                        <div>
                                            <p className="
                                                font-semibold
                                                text-foreground
                                            ">
                                                {student.nome}
                                            </p>
                                        </div>

                                    </div>

                                </TableCell>

                                <TableCell className="text-muted">

                                    {age !== null
                                        ? `${age} anos`
                                        : "Não informado"}

                                </TableCell>

                                <TableCell className="text-muted">

                                    {student.turma}

                                </TableCell>

                                <TableCell className="text-muted">

                                    {student.turno}

                                </TableCell>

                                <TableCell>

                                    <Badge
                                        className={`
                                            rounded-xl
                                            px-3
                                            py-1
                                            font-medium
                                            shadow-none
                                            ${getLevelStyles(student.nivel)}
                                        `}
                                    >
                                        {student.nivel}
                                    </Badge>

                                </TableCell>

                                <TableCell className="text-muted">

                                    {new Date(
                                        student.data_inicio
                                    ).toLocaleDateString(
                                        "pt-BR",
                                        {
                                            timeZone: "UTC",
                                        }
                                    )}

                                </TableCell>

                            </TableRow>
                        )
                    })}

                </TableBody>

            </Table>

        </div>
    )
}
