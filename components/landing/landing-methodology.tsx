import { Activity, Brain, Footprints, MessageCircle } from "lucide-react"
import { LandingSection } from "./landing-section"

const stages = [
    { icon: MessageCircle, title: "Acolhimento", text: "Escuta, rodas de conversa, combinados coletivos e preparação para as atividades." },
    { icon: Footprints, title: "Experimentação motora", text: "Familiarização com o skate, exploração do movimento e descoberta das possibilidades corporais." },
    { icon: Activity, title: "Apropriação técnica mediada", text: "Desafios progressivos com orientação pedagógica, respeitando as individualidades." },
    { icon: Brain, title: "Reflexão", text: "Compartilhamento de experiências, autoavaliação e reflexão sobre a cultura urbana." },
]

export function LandingMethodology() {
    return (
        <LandingSection id="metodologia" eyebrow="Metodologia" title="Como aprendemos através do skate" description="As oficinas pedagógicas semanais são articuladas em quatro etapas complementares." alternate>
            <ol className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
                {stages.map(({ icon: Icon, title, text }, index) => (
                    <li key={title} className="flex min-w-0 gap-3 rounded-[10px] border bg-card p-3 sm:p-5 xl:flex-col">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-blue-400"><Icon className="size-5" aria-hidden="true" /></span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-muted">ETAPA {String(index + 1).padStart(2, "0")}</p>
                            <h3 className="mt-1 text-base font-semibold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <article className="mt-3 rounded-[10px] border bg-card p-3 sm:p-5">
                <h3 className="text-base font-semibold">Acompanhamento contínuo e formativo</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">Registros de assiduidade, relatórios comportamentais, devolutivas das famílias e autoavaliação dos estudantes orientam o monitoramento pedagógico. As rodas de conversa também fortalecem a pactuação de combinados e a responsabilidade coletiva pelos materiais.</p>
            </article>
        </LandingSection>
    )
}
