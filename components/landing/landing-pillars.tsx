import { Activity, Brain, Flag, HeartHandshake, School, ShieldCheck, Sparkles, Users } from "lucide-react"
import { LandingSection } from "./landing-section"

const pillars = [
    { icon: Activity, title: "Desenvolvimento motor", description: "Equilíbrio, coordenação motora, consciência corporal e autonomia." },
    { icon: HeartHandshake, title: "Inclusão social", description: "Democratização do acesso ao esporte, à cultura e ao lazer." },
    { icon: Brain, title: "Desenvolvimento emocional", description: "Autoconfiança, regulação emocional e persistência diante dos desafios." },
    { icon: Users, title: "Convivência democrática", description: "Respeito, cooperação e construção coletiva de combinados." },
    { icon: Sparkles, title: "Cultura urbana", description: "Valorização das práticas corporais e dos saberes do território." },
    { icon: Flag, title: "Protagonismo estudantil", description: "Participação ativa, autonomia e responsabilidade na preservação dos materiais." },
    { icon: School, title: "Educação Integral", description: "Integração das dimensões motoras, cognitivas, sociais e afetivas." },
    { icon: ShieldCheck, title: "Segurança e cuidado", description: "Uso responsável dos equipamentos, proteção individual e cuidado com os espaços." },
]

export function LandingPillars() {
    return (
        <LandingSection id="pilares" eyebrow="Fundamentos pedagógicos" title="Aprendizagem para além do esporte" alternate>
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:gap-3 xl:grid-cols-4">
                {pillars.map(({ icon: Icon, title, description }) => (
                    <article key={title} className="min-w-0 rounded-[10px] border bg-card p-3 sm:p-5">
                        <Icon className="size-6 text-primary dark:text-blue-400" aria-hidden="true" />
                        <h3 className="mt-3 break-words text-sm font-semibold sm:text-base">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                    </article>
                ))}
            </div>
        </LandingSection>
    )
}
