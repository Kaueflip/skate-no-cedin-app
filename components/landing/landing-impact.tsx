import { Handshake, Heart, School, TrendingUp, Users } from "lucide-react"
import { LandingSection } from "./landing-section"

const outcomes = [
    { icon: TrendingUp, title: "Melhoria da frequência discente", text: "Fortalecimento dos vínculos dos estudantes com a unidade escolar." },
    { icon: Handshake, title: "Redução dos conflitos interpessoais", text: "Cooperação, respeito e convivência coletiva." },
    { icon: Heart, title: "Fortalecimento da autoconfiança", text: "Valorização das conquistas individuais e das possibilidades de aprendizagem." },
    { icon: School, title: "Apropriação do espaço escolar", text: "A escola como polo seguro de socialização, esporte e lazer." },
]

export function LandingImpact() {
    return (
        <LandingSection id="impacto" eyebrow="Impacto social" title="Transformações percebidas" description="Resultados qualitativos relatados na experiência pedagógica, sem estimativas percentuais ou atribuição causal comprovada." alternate>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                {outcomes.map(({ icon: Icon, title, text }) => (
                    <article key={title} className="flex min-w-0 gap-3 rounded-[10px] border bg-card p-3 sm:p-5">
                        <Icon className="mt-0.5 size-6 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" />
                        <div><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></div>
                    </article>
                ))}
            </div>
            <article className="mt-3 flex gap-3 rounded-[10px] border bg-card p-3 sm:p-5">
                <Users className="mt-0.5 size-6 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" />
                <div><h3 className="text-base font-semibold">Família e comunidade</h3><p className="mt-2 text-sm leading-relaxed text-muted">As famílias participam por meio de reuniões informativas, vivências práticas, mostras internas e devolutivas sobre as experiências dos estudantes.</p></div>
            </article>
        </LandingSection>
    )
}
