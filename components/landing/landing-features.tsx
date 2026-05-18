import {
    Activity,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react"

const features = [

    {
        title: "Disciplina",

        description:
            "Desenvolvimento de responsabilidade, rotina e comprometimento.",

        icon:
            ShieldCheck,
    },

    {
        title: "Saúde",

        description:
            "Coordenação motora, equilíbrio, mobilidade e condicionamento físico.",

        icon:
            Activity,
    },

    {
        title: "Cultura",

        description:
            "Vivência da cultura skate de forma positiva e educativa.",

        icon:
            Sparkles,
    },

    {
        title: "Inclusão",

        description:
            "Um ambiente acolhedor para todos os níveis e perfis.",

        icon:
            HeartHandshake,
    },
]

export function LandingFeatures() {

    return (

        <section className="
      border-y
      border-border

      bg-card/30
    ">

            <div className="
        mx-auto

        max-w-7xl

        px-6
        py-24
      ">

                <div className="
          mb-14

          text-center
        ">

                    <p className="
            mb-4

            text-sm
            font-semibold

            uppercase

            tracking-[0.25em]

            text-muted
          ">

                        O que desenvolvemos

                    </p>

                    <h2 className="
            text-4xl
            font-black

            tracking-tight

            lg:text-5xl
          ">

                        Muito além das manobras.

                    </h2>

                </div>

                <div className="
          grid
          gap-6

          md:grid-cols-2

          xl:grid-cols-4
        ">

                    {features.map(
                        (feature) => {

                            const Icon =
                                feature.icon

                            return (

                                <div
                                    key={feature.title}
                                    className="
                    group

                    rounded-3xl

                    border
                    border-border

                    bg-card/80

                    p-8

                    backdrop-blur

                    transition-all

                    hover:-translate-y-1
                    hover:border-primary/20
                    hover:shadow-xl
                  "
                                >

                                    <div className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    bg-primary/10

                    text-primary

                    transition-transform

                    group-hover:scale-110
                  ">

                                        <Icon
                                            className="
                        h-6
                        w-6
                      "
                                        />

                                    </div>

                                    <h3 className="
                    mt-6

                    text-2xl
                    font-bold
                  ">

                                        {feature.title}

                                    </h3>

                                    <p className="
                    mt-4

                    leading-relaxed

                    text-muted
                  ">

                                        {
                                            feature.description
                                        }

                                    </p>

                                </div>
                            )
                        }
                    )}

                </div>

            </div>

        </section>
    )
}