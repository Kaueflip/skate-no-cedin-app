
import Link from "next/link"

import { Cake } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

import {
    StudentAvatar,
} from "@/components/students/student-avatar"

type BirthdayStudent = {
    id: string
    nome: string
    turma: string
    data_nascimento: string
    foto_principal_url?: string | null
}

type Props = {
    students: BirthdayStudent[]
    currentYear: number
}

export function BirthdaysToday({
    students,
    currentYear,
}: Props) {

    return (

        <GlassCard className="
            w-full
            min-w-0
            rounded-[10px]
            p-3
            md:p-5
        ">

            {/* CABEÇALHO */}

            <div className="
                mb-4
                flex
                min-w-0
                items-start
                justify-between
                gap-2
            ">

                <div className="min-w-0 flex-1">

                    <h2 className="
                        text-base
                        font-bold
                        leading-tight
                        md:text-lg
                    ">
                        Aniversariantes de hoje
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        leading-relaxed
                        text-muted
                        md:text-sm
                    ">
                        Alunos que fazem aniversário hoje
                    </p>

                </div>

                <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                ">

                    <Cake className="h-5 w-5" />

                </div>

            </div>

            {/* ANIVERSARIANTES */}

            {students.length > 0 ? (

                <div className="min-w-0 space-y-2">

                    {students.map((student) => {

                        const birthYear = Number(
                            student.data_nascimento.split("-")[0]
                        )

                        const birthdayAge =
                            currentYear - birthYear

                        return (

                            <Link
                                key={student.id}
                                href={`/students/${student.id}`}
                                className="
                                    flex
                                    w-full
                                    min-w-0
                                    items-center
                                    gap-2

                                    rounded-lg
                                    border
                                    border-border
                                    bg-background/60

                                    p-2

                                    transition-colors
                                    hover:bg-accent

                                    sm:gap-3
                                    sm:p-3
                                "
                            >

                                <StudentAvatar
                                    nome={student.nome}
                                    photoUrl={student.foto_principal_url}
                                    className="
                                        h-9
                                        w-9
                                        sm:h-10
                                        sm:w-10
                                    "
                                    fallbackClassName="text-xs"
                                />

                                <div className="
                                    min-w-0
                                    flex-1
                                ">

                                    <p className="
                                        text-sm
                                        font-semibold
                                        leading-snug
                                        [overflow-wrap:anywhere]
                                    ">
                                        {student.nome}
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        leading-relaxed
                                        text-muted
                                        [overflow-wrap:anywhere]
                                    ">
                                        {student.turma}
                                    </p>

                                </div>

                                <Badge
                                    variant="secondary"
                                    className="
                                        shrink-0
                                        whitespace-nowrap
                                        rounded-md
                                        px-2
                                        text-[11px]
                                    "
                                >
                                    {birthdayAge} anos
                                </Badge>

                            </Link>
                        )
                    })}

                </div>

            ) : (

                <div className="
                    rounded-lg
                    border
                    border-dashed
                    border-border
                    px-3
                    py-6
                    text-center
                    text-xs
                    leading-relaxed
                    text-muted

                    md:py-8
                    md:text-sm
                ">
                    Nenhum aluno faz aniversário hoje.
                </div>

            )}

        </GlassCard>
    )
}
