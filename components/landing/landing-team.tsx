import { GraduationCap, HeartHandshake, Users } from "lucide-react"
import { LandingSection } from "./landing-section"

const roles = [
    { icon: GraduationCap, title: "Professores", text: "Mediação das oficinas, orientação das práticas corporais e acompanhamento formativo." },
    { icon: Users, title: "Equipe escolar", text: "Articulação das atividades à proposta de Educação Integral e à rotina da unidade." },
    { icon: HeartHandshake, title: "Famílias", text: "Participação nas vivências, reuniões e devolutivas pedagógicas." },
]

export function LandingTeam() {
    return (
        <LandingSection id="equipe" eyebrow="Construção coletiva" title="Quem faz o projeto acontecer" description="A experiência é construída no diálogo entre professores, equipe escolar, estudantes e famílias.">
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                {roles.map(({ icon: Icon, title, text }) => (
                    <article key={title} className="flex gap-3 rounded-[10px] border bg-card p-3 sm:flex-col sm:p-5">
                        <Icon className="size-6 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" />
                        <div><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></div>
                    </article>
                ))}
            </div>
        </LandingSection>
    )
}
