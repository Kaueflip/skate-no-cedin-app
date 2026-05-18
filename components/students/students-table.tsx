"use client"

import type { Student }
    from "@/types/student"

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

import { Badge }
    from "@/components/ui/badge"

type Props = {
    students: Student[]

    onSelectStudent?: (
        student: Student
    ) => void
}

export function StudentsTable({
    students,
    onSelectStudent,
}: Props) {

    function getInitials(
        nome: string
    ) {

        return nome
            .split(" ")
            .map((word) =>
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
        `

            case "Básico":

                return `
          border-transparent

          bg-zinc-200

          text-zinc-900

          hover:bg-zinc-200
        `

            case "Intermediário":

                return `
          border-transparent

          bg-zinc-300

          text-zinc-900

          hover:bg-zinc-300
        `

            case "Avançado":

                return `
          border-transparent

          bg-zinc-800

          text-white

          hover:bg-zinc-700
        `

            default:

                return `
          bg-zinc-200
          text-zinc-900
        `
        }
    }

    return (

        <div
            className="
        overflow-hidden

        rounded-[1.5rem]

        border
        border-white/40

        bg-white/60

        backdrop-blur-xl
      "
        >

            <Table className="overflow-hidden">

                <TableHeader
                    className="
            bg-white/40
          "
                >

                    <TableRow
                        className="
              border-white/40

              hover:bg-transparent
            "
                    >

                        <TableHead className="h-14 text-zinc-700">
                            Aluno
                        </TableHead>

                        <TableHead className="text-zinc-700">
                            Idade
                        </TableHead>

                        <TableHead className="text-zinc-700">
                            Turma
                        </TableHead>

                        <TableHead className="text-zinc-700">
                            Turno
                        </TableHead>

                        <TableHead className="text-zinc-700">
                            Nível
                        </TableHead>

                        <TableHead className="text-zinc-700">
                            Início
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {students.map(
                        (student) => (

                            <TableRow
                                key={student.id}
                                className="
                  cursor-pointer

                  border-white/30

                  transition-colors

                  hover:bg-white/40
                "
                                onClick={() =>
                                    onSelectStudent?.(
                                        student
                                    )
                                }
                            >

                                <TableCell>

                                    <div className="
                    flex
                    items-center
                    gap-3
                  ">

                                        <Avatar
                                            className="
                        h-10
                        w-10

                        border
                        border-white/40
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
                          bg-white

                          text-zinc-700
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
                        text-zinc-900
                      ">

                                                {student.nome}

                                            </p>

                                        </div>

                                    </div>

                                </TableCell>

                                <TableCell className="text-zinc-700">

                                    {student.idade} anos

                                </TableCell>

                                <TableCell className="text-zinc-700">

                                    {student.turma}

                                </TableCell>

                                <TableCell className="text-zinc-700">

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

                                <TableCell className="text-zinc-700">

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