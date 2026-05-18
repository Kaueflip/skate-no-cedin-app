import Image
    from "next/image"

import type {
    ReactNode,
} from "react"

import {
    AppNavbar,
} from "@/components/navigation/app-navbar"

type Props = {

    children:
    ReactNode
}

export function AuthShell({
    children,
}: Props) {

    return (

        <>

            <AppNavbar
                showLinks={false}
                showLogin={false}
            />

            <main className="
        relative

        flex
        min-h-screen

        overflow-hidden

        bg-background
      ">

                <div className="
          absolute
          inset-0

          bg-background
        " />

                <div className="
          absolute

          left-1/2
          top-0

          h-[600px]
          w-[600px]

          -translate-x-1/2

          rounded-full

          bg-primary/10

          blur-3xl
        " />

                <section className="
          relative

          hidden
          flex-1
          flex-col
          justify-between

          px-10
          pb-10
          pt-24

          lg:flex
        ">

                    <div className="
            max-w-lg
          ">

                        <div className="
              inline-flex
              items-center

              rounded-full

              border
              border-border

              bg-card/80

              px-4
              py-2

              text-[15px]

              backdrop-blur
            ">

                            Projeto Social • Skate • Educação

                        </div>

                        <h1 className="
              mt-8

              text-5xl
              font-black
              leading-tight
              tracking-tight
            ">

                            Gestão moderna para projetos que transformam vidas.

                        </h1>

                        <p className="
              mt-6

              text-lg
              leading-relaxed

              text-muted
            ">

                            Plataforma completa para controle de alunos,
                            presença, evolução e métricas do projeto.

                        </p>

                    </div>

                    <div className="
            flex
            items-center
            gap-3
          ">

                        <Image
                            unoptimized
                            src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                            alt="Skate no Cedin"
                            width={48}
                            height={48}
                            className="
                h-10
                w-auto

                dark:hidden
              "
                        />

                        <Image
                            unoptimized
                            src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png"
                            alt="Skate no Cedin"
                            width={48}
                            height={48}
                            className="
                hidden

                h-10
                w-auto

                dark:block
              "
                        />

                        {/*           <div>

                            <p className="
                text-sm
                font-semibold
              ">

                                Skate no Cedin

                            </p>

                            <p className="
                text-xs

                text-muted
              ">

                                Plataforma de Gestão

                            </p>

                        </div> */}

                    </div>

                </section>

                <section className="
          relative

          flex
          flex-1
          items-center
          justify-center

          px-6
          pb-12
          pt-24
        ">

                    <div className="
            w-full
            max-w-lg
          ">

                        {children}

                    </div>

                </section>

            </main>

        </>
    )
}