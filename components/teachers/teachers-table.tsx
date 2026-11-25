
"use client"

import {
    useRouter,
} from "nextjs-toploader/app"

import type {
    Teacher,
} from "@/types/teacher"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Badge,
} from "@/components/ui/badge"

import {
    TeacherAvatar,
} from "@/components/teachers/teacher-avatar"

type Props = {
    teachers: Teacher[]
}

export function TeachersTable({
    teachers,
}: Props) {

    const router = useRouter()

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

                        <TableHead>
                            Professor
                        </TableHead>

                        <TableHead>
                            Função
                        </TableHead>

                        <TableHead>
                            Contato
                        </TableHead>

                        <TableHead>
                            Início
                        </TableHead>

                        <TableHead>
                            Situação
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {teachers.map((teacher) => (

                        <TableRow
                            key={teacher.id}
                            onClick={() =>
                                router.push(`/teachers/${teacher.id}`)
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

                                    <TeacherAvatar
                                        nome={teacher.nome}
                                        fotoUrl={teacher.foto_url}
                                        size={44}
                                    />

                                    <p className="
                                        font-semibold
                                        text-foreground
                                    ">
                                        {teacher.nome}
                                    </p>

                                </div>

                            </TableCell>

                            <TableCell className="text-muted">
                                {teacher.funcao || "Não informada"}
                            </TableCell>

                            <TableCell className="text-muted">
                                {teacher.contato || "Não informado"}
                            </TableCell>

                            <TableCell className="text-muted">
                                {teacher.data_inicio
                                    ? new Date(
                                        `${teacher.data_inicio}T00:00:00`
                                    ).toLocaleDateString("pt-BR")
                                    : "Não informado"}
                            </TableCell>

                            <TableCell>

                                <Badge
                                    className={`
                                        rounded-xl
                                        px-3
                                        py-1
                                        font-medium
                                        shadow-none
                                        border-transparent

                                        ${teacher.ativo
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "bg-zinc-500/10 text-zinc-500"
                                        }
                                    `}
                                >
                                    {teacher.ativo ? "Ativo" : "Inativo"}
                                </Badge>

                            </TableCell>

                        </TableRow>

                    ))}

                    {teachers.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="
                                    h-24
                                    text-center
                                    text-muted
                                "
                            >
                                Nenhum professor encontrado.
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>

            </Table>

        </div>
    )
}
