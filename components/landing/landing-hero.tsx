export function LandingHero() {

    return (

        <section className="
      relative

      overflow-hidden

      border-b
      border-border
    ">

            <div className="
        absolute
        inset-0

        bg-background
      " />

            <div className="
        relative

        mx-auto

        flex
        max-w-7xl
        flex-col
        items-center

        px-6
        py-24

        text-center

        lg:py-36
      ">

                <div className="
          mb-6

          inline-flex
          items-center

          rounded-full

          border
          border-border

          bg-card/80

          px-4
          py-2

          text-sm

          backdrop-blur
        ">

                    Projeto Social • Skate • Educação

                </div>

                <h1 className="
          max-w-5xl

          text-5xl
          font-black
          tracking-tight

          sm:text-6xl

          lg:text-7xl
        ">

                    Skate no Cedin

                </h1>

                <p className="
          mt-8

          max-w-3xl

          text-lg
          leading-relaxed

          text-muted

          sm:text-xl
        ">

                    Muito além do skate.
                    Um projeto que transforma vidas através da cultura urbana,
                    educação, disciplina, amizade e desenvolvimento humano.

                </p>

                <div className="
          mt-10

          flex
          flex-col
          gap-4

          sm:flex-row
        ">

                    <a
                        href="/login"
                        className="
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

                        Entrar no Sistema

                    </a>

                    <a
                        href="#sobre"
                        className="
              rounded-2xl

              border
              border-border

              bg-card/70

              px-8
              py-4

              text-base
              font-semibold

              backdrop-blur

              transition-all

              hover:bg-card
              hover:scale-[1.02]
            "
                    >

                        Conhecer Projeto

                    </a>

                </div>

                <div className="
          mt-20

          grid
          w-full
          max-w-5xl

          grid-cols-2
          gap-4

          md:grid-cols-4
        ">

                    {[
                        {
                            value: "+100",
                            label: "Alunos Impactados",
                        },
                        {
                            value: "2019",
                            label: "Desde",
                        },
                        {
                            value: "2",
                            label: "Turnos",
                        },
                        {
                            value: "100%",
                            label: "Inclusivo",
                        },
                    ].map((item) => (

                        <div
                            key={item.label}
                            className="
                rounded-3xl

                border
                border-border

                bg-card/80

                p-6

                backdrop-blur
              "
                        >

                            <p className="
                text-4xl
                font-black
              ">

                                {item.value}

                            </p>

                            <p className="
                mt-2

                text-sm

                text-muted
              ">

                                {item.label}

                            </p>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    )
}