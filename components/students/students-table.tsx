"use client"

import {
    useRouter,
} from "next/navigation"

import type {
    Student,
} from "@/types/student"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Badge,
} from "@/components/ui/badge"

type Props = {

    students: Student[]
}

export function StudentsTable({
    students,
}: Props) {

    const router =
        useRouter()

    function getInitials(
        nome: string
    ) {

        return nome
            .split(" ")
            .map(
                (word) =>
                    word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }

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

                <TableHeader
                    className="
                        bg-muted/40
                    "
                >

                    <TableRow
                        className="
                            border-border

                            hover:bg-transparent
                        "
                    >

                        <TableHead>
                            Aluno
                        </TableHead>

                        <TableHead>
                            Idade
                        </TableHead>

                        <TableHead>
                            Turma
                        </TableHead>

                        <TableHead>
                            Turno
                        </TableHead>

                        <TableHead>
                            Nível
                        </TableHead>

                        <TableHead>
                            Início
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {students.map(
                        (student) => (

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

                                    hover:bg-muted/40
                                "
                            >

                                <TableCell>

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <Avatar
                                            className="
                                                h-11
                                                w-11

                                                border
                                                border-border
                                            "
                                        >

                                            <AvatarImage
                                                src={
                                                    student.foto_url ||
                                                    ""
                                                }
                                            />

                                            <AvatarFallback
                                                className="
                                                    bg-muted

                                                    font-semibold

                                                    text-foreground
                                                "
                                            >

                                                {getInitials(
                                                    student.nome
                                                )}

                                            </AvatarFallback>

                                        </Avatar>

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

                                <TableCell
                                    className="
                                        text-muted
                                    "
                                >

                                    {student.idade} anos

                                </TableCell>

                                <TableCell
                                    className="
                                        text-muted
                                    "
                                >

                                    {student.turma}

                                </TableCell>

                                <TableCell
                                    className="
                                        text-muted
                                    "
                                >

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

                                            ${getLevelStyles(
                                            student.nivel
                                        )}
                                        `}
                                    >

                                        {student.nivel}

                                    </Badge>

                                </TableCell>

                                <TableCell
                                    className="
                                        text-muted
                                    "
                                >

                                    {new Date(
                                        student.data_inicio
                                    ).toLocaleDateString(
                                        "pt-BR"
                                    )}

                                </TableCell>

                            </TableRow>
                        )
                    )}

                </TableBody>

            </Table>

        </div>
    )
}