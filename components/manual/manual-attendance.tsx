
import {
    ClipboardCheck,
    CalendarDays,
    Users,
    Filter,
    CheckCircle2,
    XCircle,
    Clock3,
    History,
    ShieldCheck,
    AlertTriangle,
    Info,
} from "lucide-react"

export function ManualAttendance() {
    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ClipboardCheck className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                        CAPÍTULO 04
                    </p>

                    <h2 className="text-lg font-semibold">
                        Controle de frequência
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground">
                        O controle de frequência permite registrar
                        a participação dos alunos nas atividades
                        do Skate no Cedin. Esses registros possibilitam
                        acompanhar a presença, as faltas e o histórico
                        individual de cada participante.
                    </p>
                </div>
            </div>

            {/* 4.1 Acesso */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.1 Acessando o controle de frequência
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Para registrar a frequência, acesse a opção
                    <strong> Frequência</strong> no menu principal.
                    A página apresenta a relação de alunos e as
                    ferramentas necessárias para registrar
                    a participação nas aulas.
                </p>

                <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="text-sm font-semibold">
                        Antes de iniciar
                    </h4>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            Confira a data do registro.
                        </li>

                        <li className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            Selecione o turno correspondente.
                        </li>

                        <li className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            Confira a relação de alunos exibida.
                        </li>
                    </ul>
                </div>
            </section>

            {/* 4.2 Turnos */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.2 Filtros por turno
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O sistema permite filtrar os alunos de acordo
                    com o turno em que participam das atividades.
                    Essa organização facilita o registro e evita
                    confusões entre as turmas.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border p-4 space-y-2">
                        <Clock3 className="h-5 w-5 text-primary" />

                        <h4 className="font-medium">Manhã</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Exibe somente os alunos cadastrados
                            no turno da manhã.
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 space-y-2">
                        <Clock3 className="h-5 w-5 text-primary" />

                        <h4 className="font-medium">Tarde</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Exibe os alunos da tarde e também
                            os alunos do turno Integral.
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 space-y-2">
                        <Users className="h-5 w-5 text-primary" />

                        <h4 className="font-medium">Todos</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Exibe todos os alunos, independentemente
                            do turno cadastrado.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Regra do turno Integral
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Os alunos cadastrados como Integral participam
                        das atividades no período da tarde. Por isso,
                        aparecem no filtro Tarde e devem ter sua
                        frequência registrada junto aos demais alunos
                        desse período.
                    </p>
                </div>
            </section>

            {/* 4.3 Registro */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.3 Como registrar a frequência
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O registro é realizado individualmente para
                    cada aluno. O professor deve conferir a
                    participação dos estudantes e marcar aqueles
                    que estiveram presentes na atividade.
                </p>

                <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
                    <li>
                        Acesse a página de frequência.
                    </li>

                    <li>
                        Confira a data correspondente ao registro.
                    </li>

                    <li>
                        Selecione o turno desejado.
                    </li>

                    <li>
                        Localize os alunos na relação apresentada.
                    </li>

                    <li>
                        Marque os alunos que estiveram presentes.
                    </li>

                    <li>
                        Confira novamente as marcações e a relação
                        de alunos antes de salvar.
                    </li>

                    <li>
                        Confirme o registro da frequência.
                    </li>
                </ol>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4 space-y-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <h4 className="font-medium">Presença</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Aluno marcado como presente recebe
                            o registro de presença na data.
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 space-y-2">
                        <XCircle className="h-5 w-5 text-destructive" />

                        <h4 className="font-medium">Falta</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Aluno não marcado recebe o registro
                            de falta quando a frequência é salva.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4.4 Atenção ao salvar */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.4 Atenção ao salvar a frequência
                    </h3>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Cuidado com os alunos não marcados
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Ao salvar, o sistema registra presença para
                        os alunos marcados e falta para todos os
                        alunos não marcados que estão visíveis
                        no filtro selecionado.
                    </p>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Portanto, antes de confirmar, verifique
                        se todos os alunos presentes foram marcados
                        corretamente.
                    </p>
                </div>

                <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="text-sm font-semibold">
                        O filtro também influencia o registro
                    </h4>

                    <p className="text-sm leading-6 text-muted-foreground">
                        O sistema salva a frequência somente dos
                        alunos exibidos na listagem filtrada.
                        Por exemplo, ao selecionar Manhã, os alunos
                        da Tarde não terão seus registros alterados
                        por essa operação.
                    </p>
                </div>
            </section>

            {/* 4.5 Registro por data */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.5 Organização dos registros por data
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Cada registro de frequência está associado
                    a um aluno e a uma data. Dessa maneira,
                    o sistema mantém um histórico organizado
                    da participação de cada estudante.
                </p>

                <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="text-sm font-semibold">
                        Regra de registro
                    </h4>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Cada aluno possui um único registro
                        de frequência por data. Caso o registro
                        da mesma data seja atualizado, as
                        informações anteriores são substituídas
                        pelas novas marcações.
                    </p>
                </div>
            </section>

            {/* 4.6 Histórico */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.6 Histórico individual de frequência
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O perfil individual de cada aluno apresenta
                    informações sobre sua frequência ao longo
                    do período registrado no sistema.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">Presenças</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Quantidade de registros em que o aluno
                            esteve presente.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">Faltas</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Quantidade de registros em que o aluno
                            esteve ausente.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">Total de registros</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Soma das presenças e faltas registradas.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">Percentual de frequência</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Proporção de presenças em relação
                            ao total de registros.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Como interpretar o percentual?
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                        O percentual representa a relação entre
                        a quantidade de presenças e o total de
                        registros de frequência do aluno.
                    </p>

                    <p className="text-sm font-medium">
                        Fórmula:
                    </p>

                    <div className="rounded-lg bg-background p-3 text-center text-sm font-medium">
                        (Presenças ÷ Total de registros) × 100
                    </div>
                </div>
            </section>

            {/* 4.7 Boas práticas */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        4.7 Boas práticas no registro de frequência
                    </h3>
                </div>

                <ul className="space-y-3 text-sm leading-5 text-muted-foreground">
                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Realize o registro de acordo com a participação
                        efetiva dos alunos.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Confira o turno antes de iniciar o preenchimento.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Verifique todos os alunos não marcados antes
                        de confirmar as faltas.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Evite realizar registros duplicados ou em datas
                        incorretas.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Consulte o histórico individual quando precisar
                        acompanhar a participação de um aluno.
                    </li>
                </ul>
            </section>

            {/* Resumo */}
            <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Resumo do capítulo
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O registro de frequência deve refletir a
                    participação real dos alunos. Confira a data,
                    o turno e todas as marcações antes de salvar.
                    Lembre-se de que os alunos não marcados serão
                    registrados como faltantes e que somente os
                    alunos exibidos no filtro serão afetados.
                </p>
            </section>
        </div>
    )
}
