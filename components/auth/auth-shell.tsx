
import Image from "next/image"

import type { ReactNode } from "react"

import { AppNavbar } from "@/components/navigation/app-navbar"

type Props = {
    children: ReactNode
}

export function AuthShell({
    children,
}: Props) {

    return (
        <div className="flex min-h-dvh flex-col bg-background">

            <AppNavbar
                showLinks={false}
                showLogin={false}
            />

            <main className="
                relative
                flex
                min-w-0
                flex-1
                flex-col
                bg-background
                lg:flex-row
            ">

                {/* EFEITO DE FUNDO */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        overflow-hidden
                    "
                >
                    <div className="
                        absolute
                        left-1/2
                        top-0
                        h-48
                        w-48
                        -translate-x-1/2
                        rounded-full
                        bg-primary/5
                        blur-3xl
                        lg:h-[600px]
                        lg:w-[600px]
                        lg:bg-primary/10
                    " />
                </div>

                {/* APRESENTAÇÃO DESKTOP */}

                <section className="
                    relative
                    hidden
                    min-w-0
                    flex-1
                    flex-col
                    justify-between
                    px-10
                    py-8
                    lg:flex
                    xl:px-16
                ">

                    <div className="max-w-xl">

                        <div className="
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            border-border
                            bg-card/80
                            px-3
                            py-2
                            text-xs
                            font-medium
                        ">
                            Projeto Social • Skate • Educação
                        </div>

                        <h1 className="
                            mt-6
                            text-4xl
                            font-black
                            leading-tight
                            tracking-tight
                            text-foreground
                            xl:text-5xl
                        ">
                            Gestão moderna para projetos que transformam vidas.
                        </h1>

                        <p className="
                            mt-4
                            max-w-md
                            text-base
                            leading-relaxed
                            text-muted
                            xl:text-lg
                        ">
                            Plataforma completa para controle de alunos,
                            presença, evolução e métricas do projeto.
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <Image
                            unoptimized
                            src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                            alt="Skate no Cedin"
                            width={48}
                            height={48}
                            className="h-10 w-auto dark:hidden"
                        />

                        <Image
                            unoptimized
                            src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png"
                            alt="Skate no Cedin"
                            width={48}
                            height={48}
                            className="hidden h-10 w-auto dark:block"
                        />

                    </div>

                </section>

                {/* FORMULÁRIO */}

                <section className="
                    relative
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    px-3
                    py-4
                    sm:px-6
                    lg:px-10
                    lg:py-8
                ">

                    <div className="
                        w-full
                        min-w-0
                        max-w-md
                    ">
                        {children}
                    </div>

                </section>

            </main>

        </div>
    )
}
