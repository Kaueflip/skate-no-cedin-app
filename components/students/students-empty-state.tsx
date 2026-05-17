"use client"

import { Users }
    from "lucide-react"

type Props = {
    searchTerm?: string
}

export function StudentsEmptyState({
    searchTerm,
}: Props) {

    return (

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">

            <div className="rounded-full bg-primary/10 p-4">

                <Users className="h-8 w-8 text-primary" />

            </div>

            <h3 className="mt-6 text-lg font-semibold">

                Nenhum aluno encontrado

            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">

                {searchTerm
                    ? `Nenhum resultado para "${searchTerm}".`
                    : "Cadastre alunos para começar a gerenciar o projeto."}

            </p>

        </div>
    )
}