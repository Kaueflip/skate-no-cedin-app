import { GraduationCap, MapPin } from "lucide-react"

export function LandingAbout() {
    return (
        <section id="sobre" className="mx-auto max-w-7xl scroll-mt-20 px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-12">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Sobre o projeto</p>
                    <h2 className="mt-2 max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                        Muito além das manobras.
                    </h2>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                        <p className="flex items-start gap-2"><GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> CEDIN Ângela Dalçóquio de Souza</p>
                        <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Itajaí – SC · Educação integral</p>
                    </div>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">
                    <p>Desde 2023, o Skate no Cedin é uma experiência pedagógica contínua no Centro de Educação Integral Ângela Dalçóquio de Souza, em Itajaí (SC), instituição que contempla a Educação Infantil e todo o Ensino Fundamental.</p>
                    <p>A iniciativa nasceu da necessidade de ampliar o repertório cultural dos estudantes e fortalecer sua permanência na jornada escolar ampliada, em um território com acesso limitado a espaços de lazer e esporte educacional.</p>
                    <p>Ao reconhecer o skate como uma prática corporal presente no cotidiano dos educandos, o projeto utiliza a cultura urbana como linguagem pedagógica inclusiva, integrando aprendizagem motora, convivência democrática, regulação emocional e desenvolvimento humano.</p>
                </div>
            </div>
        </section>
    )
}
