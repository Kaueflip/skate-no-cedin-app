
import {
    Users,
    UserPlus,
    Pencil,
    UserRound,
    CalendarDays,
    UserCheck,
    UserX,
    RefreshCw,
    Download,
    Search,
    ShieldCheck,
    Info,
} from "lucide-react"

export function ManualStudents() {
    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                        CAPÍTULO 03
                    </p>

                    <h2 className="text-lg font-semibold">
                        Gestão de alunos
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground">
                        A área de gestão de alunos permite cadastrar,
                        consultar e atualizar as informações dos
                        participantes do projeto Skate no Cedin.
                        Também possibilita acompanhar a situação
                        de cada cadastro.
                    </p>
                </div>
            </div>

            {/* 3.1 Cadastro */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.1 Cadastro de um novo aluno
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Para adicionar um participante ao sistema,
                    acesse a página <strong>Alunos</strong> e utilize
                    a opção de adicionar aluno. Preencha as
                    informações solicitadas no formulário.
                </p>

                <div className="rounded-xl border p-4 space-y-3">
                    <h4 className="text-sm font-semibold">
                        Informações do cadastro
                    </h4>

                    <div className="space-y-3">
                        {[
                            {
                                title: "Nome",
                                description: "Nome completo do aluno."
                            },
                            {
                                title: "Data de nascimento",
                                description: "Data utilizada para calcular automaticamente a idade."
                            },
                            {
                                title: "Turma",
                                description: "Identificação da turma à qual o aluno pertence."
                            },
                            {
                                title: "Turno",
                                description: "Manhã, Tarde ou Integral."
                            },
                            {
                                title: "Data de início",
                                description: "Data de entrada do aluno no projeto."
                            },
                            {
                                title: "Nível",
                                description: "Classificação do nível de prática: Iniciante, Básico, Intermediário ou Avançado."
                            },
                            {
                                title: "Foto",
                                description: "Imagem de identificação do aluno, quando disponível."
                            },
                            {
                                title: "Informações do responsável",
                                description: "Nome e contato do responsável."
                            },
                            {
                                title: "Observações",
                                description: "Informações adicionais relevantes para o acompanhamento."
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="space-y-1"
                            >
                                <p className="text-sm font-medium">
                                    {item.title}
                                </p>

                                <p className="text-sm leading-5 text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Atenção à data de nascimento
                    </div>

                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        A idade não precisa ser informada manualmente.
                        O sistema utiliza a data de nascimento para
                        calcular a idade automaticamente, mantendo
                        essa informação atualizada ao longo do tempo.
                    </p>
                </div>
            </section>

            {/* 3.2 Consulta */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.2 Consulta de alunos
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Na página de alunos, é possível localizar
                    participantes por meio da busca e dos filtros
                    disponíveis.
                </p>

                <div className="rounded-xl border p-4 space-y-3">
                    <h4 className="text-sm font-semibold">
                        Filtros de situação
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-primary/[0.04] p-3 space-y-1">
                            <UserCheck className="h-5 w-5 text-emerald-600" />
                            <p className="text-sm font-medium">Ativos</p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Exibe alunos com cadastro ativo.
                            </p>
                        </div>

                        <div className="rounded-lg bg-primary/[0.04] p-3 space-y-1">
                            <UserX className="h-5 w-5 text-destructive" />
                            <p className="text-sm font-medium">Inativos</p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Exibe alunos que foram desativados.
                            </p>
                        </div>

                        <div className="rounded-lg bg-primary/[0.04] p-3 space-y-1">
                            <Users className="h-5 w-5 text-primary" />
                            <p className="text-sm font-medium">Todos</p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Exibe alunos ativos e inativos.
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    A busca também permite localizar alunos por nome,
                    turma, turno e nível. Os filtros podem ser
                    combinados para facilitar a consulta.
                </p>
            </section>

            {/* 3.3 Perfil */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.3 Perfil individual do aluno
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Cada aluno possui uma página individual com
                    suas informações cadastrais e dados de
                    acompanhamento.
                </p>

                <div className="rounded-xl border p-4 space-y-3">
                    <h4 className="text-sm font-semibold">
                        Informações disponíveis
                    </h4>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                            <UserRound className="h-4 w-4 shrink-0 text-primary" />
                            Dados pessoais e informações do cadastro.
                        </li>

                        <li className="flex gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                            Histórico individual de frequência.
                        </li>

                        <li className="flex gap-2">
                            <UserCheck className="h-4 w-4 shrink-0 text-primary" />
                            Indicadores de presença, faltas e percentual de frequência.
                        </li>
                    </ul>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    O histórico individual permite acompanhar
                    a participação do aluno nas atividades
                    registradas no sistema.
                </p>
            </section>

            {/* 3.4 Edição */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Pencil className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.4 Edição de informações
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Quando houver necessidade de corrigir ou
                    atualizar informações, acesse o perfil
                    individual do aluno e utilize a opção
                    <strong> Editar</strong>.
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                    Após realizar as alterações, confira os dados
                    e salve as informações para atualizar o cadastro.
                </p>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Info className="h-4 w-4 text-primary" />
                        Boa prática
                    </div>

                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        Mantenha os dados cadastrais atualizados,
                        especialmente nome, data de nascimento,
                        turno e informações de contato do responsável.
                    </p>
                </div>
            </section>

            {/* 3.5 Desativação */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.5 Desativação de alunos
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Quando um aluno deixar de participar do projeto,
                    seu cadastro poderá ser desativado por meio
                    da opção <strong>Desativar</strong>, disponível
                    no perfil individual.
                </p>

                <div className="rounded-xl border p-4 space-y-3">
                    <h4 className="text-sm font-semibold">
                        O que acontece após a desativação?
                    </h4>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                            O cadastro permanece armazenado no sistema.
                        </li>

                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                            O histórico de frequência é preservado.
                        </li>

                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                            O histórico de evolução também é preservado.
                        </li>

                        <li className="flex gap-2">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                            O aluno deixa de aparecer na listagem padrão de ativos.
                        </li>
                    </ul>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    A desativação não significa excluir o aluno.
                    Ela altera a situação do cadastro para inativo,
                    permitindo preservar o histórico de participação
                    no projeto.
                </p>
            </section>

            {/* 3.6 Reativação */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.6 Reativação de alunos
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    Caso um aluno anteriormente desativado retorne
                    às atividades, é possível recuperar sua situação
                    de ativo.
                </p>

                <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                    <li>Acesse a página de alunos.</li>
                    <li>Selecione o filtro de alunos inativos.</li>
                    <li>Localize o aluno desejado.</li>
                    <li>Abra seu perfil individual.</li>
                    <li>Utilize a opção <strong>Reativar</strong>.</li>
                </ol>

                <p className="text-sm leading-6 text-muted-foreground">
                    Após a reativação, o cadastro volta a ser
                    considerado ativo e seu histórico anterior
                    permanece preservado.
                </p>
            </section>

            {/* 3.7 Exportação */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                        3.7 Exportação de dados
                    </h3>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    A plataforma permite exportar a listagem de
                    alunos em formato CSV, que pode ser aberto
                    em programas de planilhas eletrônicas.
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                    A exportação considera os filtros aplicados
                    na listagem, incluindo a situação dos cadastros.
                    Dessa forma, é possível gerar arquivos com
                    alunos ativos, inativos ou todos os registros.
                </p>

                <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Cuidados com os dados
                    </div>

                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        Os arquivos exportados podem conter informações
                        pessoais dos alunos e responsáveis. Armazene
                        e compartilhe esses arquivos somente quando
                        necessário e com pessoas autorizadas.
                    </p>
                </div>
            </section>

            {/* Resumo */}
            <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Resumo do capítulo
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    A gestão de alunos deve manter os cadastros
                    atualizados e organizados. Sempre que um
                    participante deixar as atividades, utilize
                    a desativação em vez de excluir seu cadastro,
                    preservando o histórico de participação.
                </p>
            </section>
        </div>
    )
}
