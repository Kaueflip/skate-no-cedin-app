import { BookOpen } from "lucide-react"

export function ManualHeader() {
    return (
        <header id="manual-topo" className="scroll-mt-24 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <BookOpen className="size-4 shrink-0" aria-hidden="true" />
                <span>Documentação / Manual do sistema</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manual do Sistema</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Guia de utilização da plataforma Skate no Cedin para professores e coordenação.</p>
            <p className="text-xs text-muted-foreground">Revisão de novembro de 2026</p>
        </header>
    )
}
