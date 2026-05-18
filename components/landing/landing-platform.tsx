import {
    BarChart3,
    Users,
    ShieldCheck,
    ClipboardCheck,
} from "lucide-react"

const items = [

    {
        title: "Gestão de alunos",
        icon:
            Users,
    },

    {
        title: "Controle de presença",
        icon:
            ClipboardCheck,
    },

    {
        title: "Métricas e relatórios",
        icon:
            BarChart3,
    },

    {
        title: "Organização segura",
        icon:
            ShieldCheck,
    },
]

export function LandingPlatform() {

    return (

        <section
            id="sistema"
            className="
        mx-auto

        max-w-7xl

        px-6
        py-24
      "
        >

            <div className="
        overflow-hidden

        rounded-[2rem]

        border
        border-border

        bg-card
      ">

                <div className="
          grid
          gap-12

          p-10

          lg:grid-cols-2
          lg:p-16
        ">

                    <div>

                        <p className="
              mb-4

              text-sm
              font-semibold

              uppercase

              tracking-[0.25em]

              text-muted
            ">

                            Sistema de Gestão

                        </p>

                        <h2 className="
              text-4xl
              font-black

              tracking-tight

              lg:text-5xl
            ">

                            Plataforma completa para gestão das aulas.

                        </h2>

                        <p className="
              mt-6

              max-w-xl

              text-lg
              leading-relaxed

              text-muted
            ">

                            Controle de alunos,
                            presença, evolução técnica,
                            relatórios e métricas
                            do projeto em um único lugar.

                        </p>

                        <a
                            href="/login"
                            className="
                mt-10

                inline-flex
                items-center
                justify-center

                rounded-2xl

                bg-primary

                px-8
                py-4

                text-base
                font-semibold

                text-primary-foreground

                transition-all

                hover:bg-accent-hover
                hover:scale-[1.02]
              "
                        >

                            Acessar Plataforma

                        </a>

                    </div>

                    <div className="
            grid
            gap-4

            sm:grid-cols-2
          ">

                        {items.map(
                            (item) => {

                                const Icon =
                                    item.icon

                                return (

                                    <div
                                        key={item.title}
                                        className="
                      rounded-3xl

                      border
                      border-border

                      bg-background/60

                      p-6

                      transition-all

                      hover:border-primary/20
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

                      text-lg
                      font-semibold
                    ">

                                            {item.title}

                                        </h3>

                                    </div>
                                )
                            }
                        )}

                    </div>

                </div>

            </div>

        </section>
    )
}