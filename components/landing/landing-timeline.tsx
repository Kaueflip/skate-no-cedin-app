import { LandingSection } from "./landing-section"

const milestones = [
    { date: "2023", title: "Nascimento do projeto", text: "Início das atividades pedagógicas com skate para ampliar o repertório cultural e fortalecer os vínculos com a escola." },
    { date: "Estruturação", title: "Ampliação dos recursos", text: "Após a construção da quadra escolar, a captação pela Lei de Incentivo ao Esporte possibilitou a aquisição de skates, equipamentos de proteção e obstáculos móveis." },
    { date: "2025", title: "Implantação da minirrampa", text: "Construção da minirrampa em concreto, ampliando as possibilidades de vivências nas modalidades bowl, park e vertical." },
    { date: "2026", title: "Gestão digital", text: "Desenvolvimento da plataforma para organizar cadastros, frequência, aulas, equipe e indicadores do projeto." },
    { date: "Próximos passos", title: "Acompanhamento pedagógico digital", text: "Planejamento de ferramentas para registrar as aprendizagens e a evolução dos estudantes." },
]

export function LandingTimeline() {
    return (
        <LandingSection id="trajetoria" eyebrow="Nossa história" title="Uma trajetória de construção coletiva">
            <ol className="grid gap-4 border-l border-border pl-5 sm:gap-5 lg:grid-cols-2 lg:border-0 lg:pl-0">
                {milestones.map(({ date, title, text }) => (
                    <li key={date} className="relative min-w-0 rounded-[10px] border bg-card p-3 sm:p-5">
                        <span className="absolute -left-[26px] top-5 size-2.5 rounded-full bg-blue-500 ring-4 ring-background lg:hidden" aria-hidden="true" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-blue-400">{date}</p>
                        <h3 className="mt-2 text-base font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                    </li>
                ))}
            </ol>
        </LandingSection>
    )
}
