
"use client"

import Link from "next/link"

import {
    ChevronRight,
    Users,
} from "lucide-react"

import type { Student } from "@/types/student"

import { cn } from "@/lib/utils"

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

function getLevelStyles(
    nivel: Student["nivel"]
) {

    switch (nivel) {

        case "Iniciante":

            return `
                border-border
                bg-foreground/5
                text-foreground
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

function formatDate(
    date: string | null | undefined
) {

    if (!date) return "Não informado"

    return date.split("-").reverse().join("/")
}

function StudentLevelBadge({
    nivel,
}: {
    nivel: Student["nivel"]
}) {

    return (

        <Badge
            className={cn(
                `
                    rounded-md
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    shadow-none

                    lg:text-xs
                `,
                getLevelStyles(nivel)
            )}
        >

            {nivel}

        </Badge>
    )
}

export function StudentsTable({
    students,
}: Props) {

    if (students.length === 0) {

        return (

            <div className="
                flex
                w-full
                min-w-0
                flex-col
                items-center
                justify-center
                gap-2

                rounded-[10px]
                border
                border-dashed
                border-border
                bg-card

                px-4
                py-10

                text-center
            ">

                <div className="
                    mb-1
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-lg
                    bg-primary/10
                    text-primary
                ">

                    <Users className="h-5 w-5" />

                </div>

                <p className="
                    text-sm
                    font-semibold
                    text-foreground
                ">
                    Nenhum aluno encontrado
                </p>

                <p className="
                    text-xs
                    leading-relaxed
                    text-muted
                ">
                    Tente alterar os filtros de busca.
                </p>

            </div>
        )
    }

    return (

        <div className="
            w-full
            min-w-0

            overflow-hidden
            rounded-[10px]

            border
            border-border
            bg-card/80

            shadow-sm
        ">

            {/* LISTAGEM MOBILE */}

            <div className="
                divide-y
                divide-border

                lg:hidden
            ">

                {students.map((student) => {

                    const age = calculateAge(
                        student.data_nascimento
                    )

                    return (

                        <Link
                            key={student.id}
                            href={`/students/${student.id}`}
                            className="
                                flex
                                w-full
                                min-w-0
                                items-center
                                gap-2.5

                                p-3

                                transition-colors

                                hover:bg-accent
                                active:bg-accent

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-inset
                                focus-visible:ring-ring

                                sm:gap-3
                                sm:p-4
                            "
                        >

                            {/* AVATAR */}

                            <StudentAvatar
                                nome={student.nome}
                                photoUrl={student.foto_principal_url}
                                className="
                                    h-11
                                    w-11
                                    shrink-0
                                    rounded-full
                                    border-0

                                    sm:h-12
                                    sm:w-12
                                "
                                fallbackClassName="text-xs"
                            />

                            {/* INFORMAÇÕES */}

                            <div className="
                                min-w-0
                                flex-1
                            ">

                                <p className="
                                    text-sm
                                    font-semibold
                                    leading-snug
                                    text-foreground

                                    [overflow-wrap:anywhere]
                                ">

                                    {student.nome}

                                </p>

                                <div className="
                                    mt-1

                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-1.5
                                    gap-y-0.5

                                    text-[11px]
                                    text-muted
                                ">

                                    <span>

                                        {age !== null
                                            ? `${age} anos`
                                            : "Idade não informada"}

                                    </span>

                                    <span aria-hidden="true">
                                        •
                                    </span>

                                    <span>
                                        {student.turno}
                                    </span>

                                </div>

                                <p className="
                                    mt-0.5
                                    text-[11px]
                                    leading-relaxed
                                    text-muted

                                    [overflow-wrap:anywhere]

                                    sm:text-xs
                                ">

                                    {student.turma}

                                </p>

                                <div className="
                                    mt-1.5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-1.5
                                ">

                                    <StudentLevelBadge
                                        nivel={student.nivel}
                                    />

                                    {student.ativo === false && (

                                        <Badge className="
                                            rounded-md
                                            border-transparent
                                            bg-red-500/10
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            text-red-600
                                            dark:text-red-400
                                        ">

                                            Inativo

                                        </Badge>

                                    )}

                                </div>

                            </div>

                            <ChevronRight className="
                                h-4
                                w-4
                                shrink-0
                                text-muted
                            " />

                        </Link>
                    )
                })}

            </div>

            {/* TABELA DESKTOP */}

            <div className="
                hidden
                w-full
                min-w-0
                overflow-x-auto

                lg:block
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
                                    className="
                                        border-border
                                        transition-colors
                                        hover:bg-muted/10
                                    "
                                >

                                    <TableCell className="py-3">

                                        <Link
                                            href={`/students/${student.id}`}
                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2.5
                                                rounded-md
                                                hover:text-primary
                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-ring
                                            "
                                        >

                                            <StudentAvatar
                                                nome={student.nome}
                                                photoUrl={student.foto_principal_url}
                                                className="
                                                    h-10
                                                    w-10
                                                    rounded-full
                                                    border-0
                                                "
                                            />

                                            <div className="
                                                min-w-0
                                                max-w-64
                                            ">

                                                <p className="
                                                    whitespace-normal
                                                    text-sm
                                                    font-semibold

                                                    [overflow-wrap:anywhere]
                                                ">

                                                    {student.nome}

                                                </p>

                                                {student.ativo === false && (

                                                    <span className="
                                                        text-[11px]
                                                        font-medium
                                                        text-red-500
                                                    ">

                                                        Inativo

                                                    </span>

                                                )}

                                            </div>

                                        </Link>

                                    </TableCell>

                                    <TableCell className="
                                        whitespace-nowrap
                                        text-xs
                                        text-muted
                                    ">

                                        {age !== null
                                            ? `${age} anos`
                                            : "Não informado"}

                                    </TableCell>

                                    <TableCell className="
                                        max-w-64
                                        whitespace-normal
                                        text-xs
                                        text-muted

                                        [overflow-wrap:anywhere]
                                    ">

                                        {student.turma}

                                    </TableCell>

                                    <TableCell className="
                                        whitespace-nowrap
                                        text-xs
                                        text-muted
                                    ">

                                        {student.turno}

                                    </TableCell>

                                    <TableCell>

                                        <StudentLevelBadge
                                            nivel={student.nivel}
                                        />

                                    </TableCell>

                                    <TableCell className="
                                        whitespace-nowrap
                                        text-xs
                                        tabular-nums
                                        text-muted
                                    ">

                                        {formatDate(
                                            student.data_inicio
                                        )}

                                    </TableCell>

                                </TableRow>
                            )
                        })}

                    </TableBody>

                </Table>

            </div>

        </div>
    )
}
