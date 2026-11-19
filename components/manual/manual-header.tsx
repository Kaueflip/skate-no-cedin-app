
import {
    BookOpen,
    GraduationCap,
} from "lucide-react"

export function ManualHeader() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Documentação</span>
                <span>/</span>
                <span className="text-foreground">
                    Manual do sistema
                </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">


                    <h1 className="text-3xl font-semibold tracking-tight">
                        Manual do Sistema
                    </h1>

                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Guia de utilização da plataforma para professores
                        e coordenação do projeto Skate no Cedin.
                    </p>
                </div>
            </div>
        </div>
    )
}
