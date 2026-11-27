import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

import { AppNavbar } from "@/components/navigation/app-navbar"
import { AuthBranding } from "@/components/auth/auth-branding"

type Props = {
    children: ReactNode
}

export function AuthShell({ children }: Props) {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <AppNavbar showLinks={false} showLogin={false} />

            <main className="grid min-w-0 flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <AuthBranding />

                <section
                    aria-labelledby="auth-heading"
                    className="flex min-w-0 flex-col items-center justify-center px-3 py-5 sm:px-6 sm:py-8 lg:px-10"
                >
                    <div className="w-full min-w-0 max-w-md">
                        <Link
                            href="/"
                            className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Voltar ao site
                        </Link>

                        <div className="mb-4 sm:mb-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Skate no Cedin · Educação Integral
                            </p>
                            <h1 id="auth-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                Plataforma de gestão
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                Educação, esporte e cultura urbana.
                            </p>
                        </div>

                        {children}

                        <footer className="mt-5 text-center text-xs leading-relaxed text-muted-foreground sm:mt-6">
                            <p className="font-medium text-foreground">CEDIN Ângela Dalçóquio de Souza</p>
                            <p>Itajaí · Santa Catarina</p>
                            <p className="mt-2">Skate no Cedin · Desde 2023</p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    )
}
