
import Image from "next/image"
import Link from "next/link"

import { Cake } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

import { calculateAge } from "@/lib/calculate-age"

type BirthdayStudent = {
    id: string
    nome: string
    turma: string
    data_nascimento: string
    foto_url: string | null
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
        <GlassCard className="p-6">

            <div className="
                mb-5
                flex
                items-center
                justify-between
            ">

                <div>
                    <h2 className="text-xl font-bold">
                        Aniversariantes de hoje
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Alunos que fazem aniversário hoje
                    </p>
                </div>

                <div className="
                    rounded-2xl
                    bg-primary/10
                    p-3
                    text-primary
                ">
                    <Cake className="h-6 w-6" />
                </div>

            </div>

            {students.length > 0 ? (

                <div className="space-y-3">

                    {students.map((student) => {

                        const age = calculateAge(
                            student.data_nascimento
                        )

                        const birthdayAge = age !== null
                            ? age
                            : currentYear -
                            Number(student.data_nascimento.split("-")[0])

                        return (
                            <Link
                                key={student.id}
                                href={`/students/${student.id}`}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-background/60
                                    p-4
                                    transition-colors
                                    hover:bg-accent
                                "
                            >

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    min-w-0
                                ">

                                    <div className="
                                        relative
                                        h-12
                                        w-12
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border
                                        border-border
                                        bg-primary/10
                                    ">

                                        {student.foto_url ? (
                                            <Image
                                                src={student.foto_url}
                                                alt={student.nome}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                                font-bold
                                                text-primary
                                            ">
                                                {student.nome
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                    </div>

                                    <div className="min-w-0">

                                        <p className="
                                            truncate
                                            font-semibold
                                        ">
                                            {student.nome}
                                        </p>

                                        <p className="
                                            text-sm
                                            text-muted
                                        ">
                                            Turma {student.turma}
                                        </p>

                                    </div>

                                </div>

                                <Badge variant="secondary">
                                    {birthdayAge} anos
                                </Badge>

                            </Link>
                        )
                    })}

                </div>

            ) : (

                <div className="
                    rounded-2xl
                    border
                    border-dashed
                    border-border
                    p-8
                    text-center
                    text-sm
                    text-muted
                ">
                    Nenhum aluno faz aniversário hoje.
                </div>

            )}

        </GlassCard>
    )
}
