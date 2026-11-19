
import {
    CalendarDays,
    Clock3,
    Sun,
    Sunset,
    Plus,
    CheckCircle2,
    XCircle,
    CalendarCheck,
    CalendarRange,
    Trash2,
    BarChart3,
    ShieldCheck,
    Info,
    AlertTriangle,
} from "lucide-react"

export function ManualClasses() {
    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                        CAPÍTULO 05
                    </p>

                    <h2 className="text-lg font-semibold">
                        Controle de aulas
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground">
                        O módulo de controle de aulas permite registrar
                        e acompanhar as atividades realizadas no projeto
                        Skate no Cedin. Por meio dele, os professores
                        podem organizar os registros por data e turno,
                        identificar aulas canceladas e consultar
                        o histórico mensal.
                    </p>
                </div>
            </div>

            {/* 5.1 Acesso */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.1 Acessando o controle de aulas
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Acesse a opção <strong>Controle de Aulas</strong>
                    no menu principal. A página apresenta os registros
                    correspondentes à data selecionada, organizados
                    por turno.
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                    Utilize o seletor de data para consultar ou
                    registrar as atividades de um dia específico.
                </p>
            </section>

            {/* 5.2 Organização dos horários */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.2 Organização dos horários do projeto
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    As atividades do Skate no Cedin são organizadas
                    em dois períodos: matutino e vespertino. Cada
                    período possui duas aulas, separadas pelo intervalo
                    Ciranda.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-amber-500" />
                            <h4 className="font-semibold">Matutino</h4>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    1ª aula
                                </p>
                                <p className="text-lg font-semibold">
                                    07h30 – 09h15
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Duração: 1h45
                                </p>
                            </div>

                            <div className="rounded-lg bg-primary/[0.04] p-3">
                                <p className="text-xs font-medium">
                                    Intervalo Ciranda
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    09h15 – 09h45
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    30 minutos
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    2ª aula
                                </p>
                                <p className="text-lg font-semibold">
                                    09h45 – 11h30
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Duração: 1h45
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sunset className="h-5 w-5 text-orange-500" />
                            <h4 className="font-semibold">Vespertino</h4>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    1ª aula
                                </p>
                                <p className="text-lg font-semibold">
                                    13h00 – 14h45
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Duração: 1h45
                                </p>
                            </div>

                            <div className="rounded-lg bg-primary/[0.04] p-3">
                                <p className="text-xs font-medium">
                                    Intervalo Ciranda
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    14h45 – 15h15
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    30 minutos
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    2ª aula
                                </p>
                                <p className="text-lg font-semibold">
                                    15h15 – 17h00
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Duração: 1h45
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Carga horária prevista
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Cada aula possui 1h45 de duração. Um turno
                        completo corresponde a 3h30 de atividades,
                        e os dois turnos somam 7 horas de aulas
                        por dia.
                    </p>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Os intervalos Ciranda não fazem parte
                        do cálculo da carga horária das aulas.
                    </p>
                </div>
            </section>

            {/* 5.3 Registrar aula */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.3 Como registrar uma aula
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O registro de uma aula permite documentar
                    a realização da atividade em determinada
                    data e turno.
                </p>

                <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
                    <li>
                        Acesse o módulo Controle de Aulas.
                    </li>

                    <li>
                        Selecione a data correspondente à atividade.
                    </li>

                    <li>
                        Localize o turno desejado: Manhã ou Tarde.
                    </li>

                    <li>
                        Utilize a opção de adicionar aula.
                    </li>

                    <li>
                        Confira o registro criado e seu número
                        dentro do turno.
                    </li>

                    <li>
                        Verifique se a aula está identificada
                        corretamente como realizada.
                    </li>
                </ol>

                <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="text-sm font-semibold">
                        Numeração das aulas
                    </h4>

                    <p className="text-sm leading-5 text-muted-foreground">
                        As aulas são identificadas por uma numeração
                        dentro de cada turno e data. Essa organização
                        permite distinguir a primeira e a segunda
                        aula do período.
                    </p>
                </div>
            </section>

            {/* 5.4 Status */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.4 Situação das aulas
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Cada registro possui uma situação que indica
                    se a atividade foi realizada ou cancelada.
                    Essa informação é importante para manter
                    o histórico correto do projeto.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4 space-y-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <h4 className="font-medium">Realizada</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Utilizada quando a aula aconteceu
                            normalmente e deve ser contabilizada
                            como atividade realizada.
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 space-y-2">
                        <XCircle className="h-5 w-5 text-destructive" />

                        <h4 className="font-medium">Cancelada</h4>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Utilizada quando a aula estava prevista,
                            mas não aconteceu.
                        </p>
                    </div>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    A situação de uma aula pode ser alterada
                    diretamente no registro, permitindo corrigir
                    a informação quando necessário.
                </p>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Atenção
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Uma aula cancelada deve permanecer identificada
                        como cancelada, e não ser contabilizada como
                        atividade realizada. Não exclua o registro
                        apenas para indicar que a aula não aconteceu.
                    </p>
                </div>
            </section>

            {/* 5.5 Exclusão */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.5 Exclusão de registros
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O sistema permite excluir um registro de aula
                    quando ele foi criado incorretamente ou não
                    deveria constar no histórico.
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                    Antes de confirmar a exclusão, confira a data,
                    o turno e a numeração da aula selecionada.
                    A exclusão remove o registro do histórico.
                </p>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Utilize com cuidado
                    </div>

                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        Quando a aula aconteceu, mas foi registrada
                        com situação incorreta, prefira alterar
                        seu status em vez de excluir e cadastrar
                        novamente.
                    </p>
                </div>
            </section>

            {/* 5.6 Calendário */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.6 Calendário mensal
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O calendário mensal permite visualizar
                    a distribuição dos registros de aulas
                    ao longo do mês.
                </p>

                <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        Navegação entre os meses.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        Visualização dos dias com registros.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        Consulta das atividades de uma data selecionada.
                    </li>
                </ul>

                <p className="text-sm leading-6 text-muted-foreground">
                    Ao selecionar um dia no calendário, é possível
                    consultar os registros correspondentes àquela
                    data.
                </p>
            </section>

            {/* 5.7 Indicadores */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.7 Indicadores e histórico mensal
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O módulo apresenta indicadores que ajudam
                    a acompanhar a quantidade de atividades
                    registradas no dia e no mês selecionado.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3 space-y-1">
                        <p className="text-sm font-medium">
                            Aulas realizadas
                        </p>
                        <p className="text-sm leading-5 text-muted-foreground">
                            Quantidade de registros identificados
                            com situação realizada.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3 space-y-1">
                        <p className="text-sm font-medium">
                            Aulas canceladas
                        </p>
                        <p className="text-sm leading-5 text-muted-foreground">
                            Quantidade de registros identificados
                            com situação cancelada.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3 space-y-1">
                        <p className="text-sm font-medium">
                            Total de registros
                        </p>
                        <p className="text-sm leading-5 text-muted-foreground">
                            Soma das aulas realizadas e canceladas.
                        </p>
                    </div>

                    <div className="rounded-lg border p-3 space-y-1">
                        <p className="text-sm font-medium">
                            Dias com atividades
                        </p>
                        <p className="text-sm leading-5 text-muted-foreground">
                            Quantidade de datas distintas que
                            possuem pelo menos uma aula realizada.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Como interpretar os indicadores?
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Os indicadores diários apresentam os
                        registros da data selecionada. Já os
                        indicadores mensais consideram os registros
                        do mês consultado.
                    </p>

                    <p className="text-sm leading-5 text-muted-foreground">
                        Uma data com duas aulas realizadas representa
                        dois registros de aula, mas apenas um dia
                        com atividades.
                    </p>
                </div>
            </section>

            {/* 5.8 Boas práticas */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        5.8 Boas práticas no controle de aulas
                    </h3>
                </div>

                <ul className="space-y-3 text-sm leading-5 text-muted-foreground">
                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Registre as aulas de acordo com o que realmente
                        aconteceu.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Confira a data e o turno antes de adicionar
                        um registro.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Utilize o status cancelada quando a atividade
                        prevista não acontecer.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Evite excluir registros que podem ser
                        corrigidos pela alteração de status.
                    </li>

                    <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        Consulte o calendário para conferir
                        o histórico mensal.
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
                    O controle de aulas deve representar fielmente
                    as atividades realizadas no projeto. Registre
                    cada aula na data e no turno corretos, mantenha
                    os status atualizados e utilize o calendário
                    e os indicadores para acompanhar o histórico
                    das atividades.
                </p>
            </section>
        </div>
    )
}
