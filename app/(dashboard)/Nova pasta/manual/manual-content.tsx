
import {
    BookOpen,
    Users,
    ClipboardCheck,
    CalendarDays,
    ChartNoAxesCombined,
    GraduationCap,
    ShieldCheck,
    CircleHelp,
    LayoutDashboard,
} from "lucide-react"

import { ManualHeader } from "./manual-header"
import { ManualSidebar } from "./manual-sidebar"
import { ManualStudents } from "./manual-students"
import { ManualAttendance } from "./manual-attendance"
import { ManualClasses } from "./manual-classes"

const chapters = [
    {
        id: "apresentacao",
        number: "01",
        title: "Apresentação do sistema",
        description:
            "Conheça o propósito da plataforma e como ela contribui para a organização do projeto Skate no Cedin.",
        icon: BookOpen,
    },
    {
        id: "conhecendo",
        number: "02",
        title: "Conhecendo a plataforma",
        description:
            "Entenda a navegação, o menu principal e a organização das funcionalidades.",
        icon: LayoutDashboard,
    },
    {
        id: "alunos",
        number: "03",
        title: "Gestão de alunos",
        description:
            "Aprenda a cadastrar, consultar, editar, desativar e reativar alunos.",
        icon: Users,
    },
    {
        id: "frequencia",
        number: "04",
        title: "Controle de frequência",
        description:
            "Veja como registrar presenças e faltas e consultar o histórico individual.",
        icon: ClipboardCheck,
    },
    {
        id: "aulas",
        number: "05",
        title: "Controle de aulas",
        description:
            "Aprenda a registrar aulas, controlar cancelamentos e consultar o calendário.",
        icon: CalendarDays,
    },
    {
        id: "indicadores",
        number: "06",
        title: "Dashboard e indicadores",
        description:
            "Compreenda os indicadores e as informações apresentadas no painel principal.",
        icon: ChartNoAxesCombined,
    },
    {
        id: "rotina",
        number: "07",
        title: "Rotina dos professores",
        description:
            "Conheça a sequência recomendada de utilização do sistema no dia a dia.",
        icon: GraduationCap,
    },
    {
        id: "boas-praticas",
        number: "08",
        title: "Boas práticas",
        description:
            "Consulte orientações para manter os registros corretos e preservar as informações.",
        icon: ShieldCheck,
    },
    {
        id: "duvidas",
        number: "09",
        title: "Perguntas frequentes",
        description:
            "Encontre respostas para as dúvidas mais comuns sobre a utilização da plataforma.",
        icon: CircleHelp,
    },
]

export function ManualContent() {
    return (
        <div className="space-y-8">
            <ManualHeader />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
                <main className="min-w-0 space-y-8">

                    <section
                        id="apresentacao"
                        className="scroll-mt-8 rounded-2xl border bg-card p-6 sm:p-8 space-y-6"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-primary">
                                CAPÍTULO 01
                            </p>

                            <h2 className="text-2xl font-semibold tracking-tight">
                                Apresentação do sistema
                            </h2>

                            <p className="text-sm leading-6 text-muted-foreground">
                                O sistema Skate no Cedin foi desenvolvido para auxiliar
                                na organização, no registro e no acompanhamento das
                                atividades realizadas no projeto de skate.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">1.1 Objetivo da plataforma</h3>

                            <p className="text-sm leading-6 text-muted-foreground">
                                A plataforma centraliza informações dos alunos, registros
                                de frequência, controle das aulas e indicadores gerais
                                do projeto. Seu objetivo é facilitar o acompanhamento
                                das atividades e oferecer informações organizadas
                                para professores e coordenação.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">1.2 Principais funcionalidades</h3>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border bg-primary/[0.04] p-4 space-y-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">Gestão de alunos</h4>
                                    <p className="text-sm leading-5 text-muted-foreground">
                                        Cadastro, consulta, edição e acompanhamento
                                        dos participantes do projeto.
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-primary/[0.04] p-4 space-y-2">
                                    <ClipboardCheck className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">Frequência</h4>
                                    <p className="text-sm leading-5 text-muted-foreground">
                                        Registro de presenças e faltas, com histórico
                                        individual dos alunos.
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-primary/[0.04] p-4 space-y-2">
                                    <CalendarDays className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">Controle de aulas</h4>
                                    <p className="text-sm leading-5 text-muted-foreground">
                                        Registro das aulas realizadas e canceladas,
                                        com consulta por data e calendário mensal.
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-primary/[0.04] p-4 space-y-2">
                                    <ChartNoAxesCombined className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">Indicadores</h4>
                                    <p className="text-sm leading-5 text-muted-foreground">
                                        Visualização de informações gerais sobre alunos,
                                        frequência e atividades do projeto.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">1.3 Quem utiliza o sistema?</h3>

                            <p className="text-sm leading-6 text-muted-foreground">
                                A plataforma é destinada aos professores envolvidos
                                nas atividades do Skate no Cedin e à coordenação
                                responsável pelo acompanhamento do projeto.
                            </p>

                            <p className="text-sm leading-6 text-muted-foreground">
                                Para que as informações representem corretamente
                                a realidade das atividades, é importante que os
                                registros sejam realizados de maneira organizada
                                e consistente.
                            </p>
                        </div>

                        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Importante
                            </div>

                            <p className="mt-2 text-sm leading-5 text-muted-foreground">
                                A qualidade dos indicadores depende da qualidade
                                dos registros realizados. Mantenha as informações
                                dos alunos, as frequências e as aulas sempre
                                atualizadas.
                            </p>
                        </div>
                    </section>


                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Conteúdo do manual
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Selecione um capítulo para consultar as
                                orientações correspondentes.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {chapters.map((chapter) => {
                                const Icon = chapter.icon

                                return (
                                    <a
                                        key={chapter.id}
                                        href={`#${chapter.id}`}
                                        className="group flex items-start gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/10"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {chapter.number}
                                                </span>

                                                <h3 className="font-medium">
                                                    {chapter.title}
                                                </h3>
                                            </div>

                                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                                {chapter.description}
                                            </p>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </section>

                    {chapters.slice(1).map((chapter) => {
                        const Icon = chapter.icon

                        return (
                            <section
                                key={chapter.id}
                                id={chapter.id}
                                className="scroll-mt-8 rounded-xl border bg-card p-6"
                            >

                                {chapter.id === "conhecendo" ? (
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <LayoutDashboard className="h-5 w-5" />
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    CAPÍTULO 02
                                                </p>

                                                <h2 className="text-lg font-semibold">
                                                    Conhecendo a plataforma
                                                </h2>

                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    A plataforma possui uma navegação organizada
                                                    por módulos. Cada área reúne ferramentas
                                                    específicas para o gerenciamento das atividades
                                                    do projeto.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold">2.1 Menu principal</h3>

                                            <p className="text-sm leading-6 text-muted-foreground">
                                                O menu lateral principal permite acessar as
                                                diferentes áreas do sistema.
                                            </p>

                                            <div className="space-y-2">
                                                {[
                                                    {
                                                        icon: LayoutDashboard,
                                                        title: "Dashboard",
                                                        description: "Painel inicial com indicadores e informações gerais."
                                                    },
                                                    {
                                                        icon: CalendarDays,
                                                        title: "Controle de Aulas",
                                                        description: "Registro e consulta das aulas realizadas e canceladas."
                                                    },
                                                    {
                                                        icon: Users,
                                                        title: "Alunos",
                                                        description: "Cadastro e gerenciamento dos participantes."
                                                    },
                                                    {
                                                        icon: ClipboardCheck,
                                                        title: "Frequência",
                                                        description: "Registro e consulta da frequência dos alunos."
                                                    },
                                                    {
                                                        icon: BookOpen,
                                                        title: "Manual do sistema",
                                                        description: "Orientações sobre o funcionamento da plataforma."
                                                    },
                                                ].map((item) => {
                                                    const Icon = item.icon

                                                    return (
                                                        <div
                                                            key={item.title}
                                                            className="flex items-start gap-3 rounded-lg border p-3"
                                                        >
                                                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                                            <div className="space-y-1">
                                                                <h4 className="text-sm font-medium">
                                                                    {item.title}
                                                                </h4>

                                                                <p className="text-sm leading-5 text-muted-foreground">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold">2.2 Área de conteúdo</h3>

                                            <p className="text-sm leading-6 text-muted-foreground">
                                                Ao acessar uma opção do menu, o sistema apresenta
                                                a respectiva página na área principal. Nela ficam
                                                disponíveis os dados, indicadores, filtros e
                                                ferramentas correspondentes à funcionalidade
                                                selecionada.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold">2.3 Organização da navegação</h3>

                                            <p className="text-sm leading-6 text-muted-foreground">
                                                Para utilizar o sistema, selecione a opção desejada
                                                no menu principal. Sempre que precisar retornar
                                                a outra funcionalidade, utilize novamente o menu.
                                            </p>

                                            <p className="text-sm leading-6 text-muted-foreground">
                                                No celular, a navegação principal fica recolhida
                                                para aproveitar melhor o espaço da tela.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <BookOpen className="h-4 w-4 text-primary" />
                                                Dica
                                            </div>

                                            <p className="mt-2 text-sm leading-5 text-muted-foreground">
                                                Consulte este manual sempre que tiver dúvidas
                                                sobre alguma funcionalidade. Os capítulos estão
                                                organizados de acordo com os módulos do sistema.
                                            </p>
                                        </div>
                                    </div>
                                ) : chapter.id === "alunos" ? (
                                    <ManualStudents />
                                ) : chapter.id === "frequencia" ? (
                                    <ManualAttendance />
                                ) : chapter.id === "aulas" ? (
                                    <ManualClasses />
                                ) :

                                    (
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    CAPÍTULO {chapter.number}
                                                </p>

                                                <h2 className="text-lg font-semibold">
                                                    {chapter.title}
                                                </h2>

                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {chapter.description}
                                                </p>

                                                <p className="pt-2 text-xs text-muted-foreground">
                                                    Conteúdo em desenvolvimento.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                            </section>
                        )
                    })}
                </main>

                <aside className="order-first lg:order-last lg:sticky lg:top-6 lg:self-start">
                    <div className="rounded-xl border bg-card p-3">
                        <ManualSidebar />
                    </div>
                </aside>
            </div>
        </div>
    )
}
