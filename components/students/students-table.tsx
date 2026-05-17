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

    function getLevelVariant(
        nivel: Student["nivel"]
    ) {

        switch (nivel) {

            case "Avançado":
                return "default"

            case "Intermediário":
                return "secondary"

            case "Básico":
                return "outline"

            default:
                return "secondary"
        }
    }

    return (

        <div className="rounded-xl border">

            <Table>

                <TableHeader>

                    <TableRow>

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
                                className="cursor-pointer"
                                onClick={() =>
                                    onSelectStudent?.(
                                        student
                                    )
                                }
                            >

                                <TableCell>

                                    <div className="flex items-center gap-3">

                                        <Avatar>

                                            <AvatarImage
                                                src={
                                                    student.foto_url ||
                                                    ""
                                                }
                                            />

                                            <AvatarFallback>

                                                {getInitials(
                                                    student.nome
                                                )}

                                            </AvatarFallback>

                                        </Avatar>

                                        <div>

                                            <p className="font-medium">

                                                {student.nome}

                                            </p>

                                        </div>

                                    </div>

                                </TableCell>

                                <TableCell>

                                    {student.idade} anos

                                </TableCell>

                                <TableCell>

                                    {student.turma}

                                </TableCell>

                                <TableCell>

                                    {student.turno}

                                </TableCell>

                                <TableCell>

                                    <Badge
                                        variant={getLevelVariant(
                                            student.nivel
                                        )}
                                    >

                                        {student.nivel}

                                    </Badge>

                                </TableCell>

                                <TableCell>

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