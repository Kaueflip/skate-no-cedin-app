import { Activity, Blocks, Construction, Layers, LayoutGrid, ShieldCheck } from "lucide-react"
import { LandingSection } from "./landing-section"

const resources = [
    { icon: Layers, title: "Skates", text: "Equipamentos para vivências e aprendizagens motoras." },
    { icon: ShieldCheck, title: "Equipamentos de proteção", text: "Proteção individual durante as práticas corporais." },
    { icon: LayoutGrid, title: "Quadra escolar", text: "Espaço de experimentação e convivência." },
    { icon: Blocks, title: "Obstáculos móveis", text: "Diversificação dos desafios motores." },
    { icon: Construction, title: "Minirrampa de concreto", text: "Implantada em 2025." },
    { icon: Activity, title: "Modalidades", text: "Vivências de bowl, park e vertical." },
]

export function LandingInfrastructure() {
    return (
        <LandingSection id="infraestrutura" eyebrow="Recursos e espaços" title="Estrutura para aprender, experimentar e conviver" description="A captação de recursos pela Lei de Incentivo ao Esporte ampliou as possibilidades de prática do skate na escola.">
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                {resources.map(({ icon: Icon, title, text }) => (
                    <article key={title} className="min-w-0 rounded-[10px] border bg-card p-3 sm:p-5">
                        <Icon className="size-6 text-primary dark:text-blue-400" aria-hidden="true" />
                        <h3 className="mt-3 text-sm font-semibold sm:text-base">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                    </article>
                ))}
            </div>
        </LandingSection>
    )
}
