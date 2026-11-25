
import Image from "next/image"

import Link from "next/link"

import {
    ThemeToggle,
} from "@/components/theme/theme-toggle"

type Props = {
    showLinks?: boolean
    showLogin?: boolean
}

export function AppNavbar({
    showLinks = true,
    showLogin = true,
}: Props) {

    return (

        <header className="
            sticky
            top-0
            z-50

            shrink-0

            border-b
            border-border

            bg-background/95

            md:bg-background/80
            md:backdrop-blur-xl
        ">

            <div className="
                mx-auto

                flex
                h-14
                w-full
                max-w-7xl
                items-center
                justify-between

                gap-3
                px-3

                sm:px-4

                md:h-16
                md:px-6
            ">

                {/* LOGOTIPO */}

                <Link
                    href="/"
                    aria-label="Página inicial - Skate no Cedin"
                    className="
                        flex
                        min-w-0
                        shrink-0
                        items-center
                    "
                >

                    <Image
                        unoptimized
                        src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                        alt="Skate no Cedin"
                        width={52}
                        height={52}
                        className="
                            h-9
                            w-auto

                            dark:hidden

                            md:h-12
                        "
                    />

                    <Image
                        unoptimized
                        src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png"
                        alt="Skate no Cedin"
                        width={52}
                        height={52}
                        className="
                            hidden

                            h-9
                            w-auto

                            dark:block

                            md:h-12
                        "
                    />

                </Link>

                {/* NAVEGAÇÃO DESKTOP */}

                {showLinks && (

                    <nav
                        aria-label="Navegação principal"
                        className="
                            hidden
                            items-center
                            gap-6

                            md:flex

                            lg:gap-8
                        "
                    >

                        <Link
                            href="/#sobre"
                            className="
                                text-sm
                                font-medium
                                text-muted
                                transition-colors
                                hover:text-foreground
                            "
                        >
                            Sobre
                        </Link>

                        <Link
                            href="/#galeria"
                            className="
                                text-sm
                                font-medium
                                text-muted
                                transition-colors
                                hover:text-foreground
                            "
                        >
                            Galeria
                        </Link>

                        <Link
                            href="/#sistema"
                            className="
                                text-sm
                                font-medium
                                text-muted
                                transition-colors
                                hover:text-foreground
                            "
                        >
                            Plataforma
                        </Link>

                    </nav>

                )}

                {/* AÇÕES */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    gap-2

                    md:gap-3
                ">

                    <ThemeToggle />

                    {showLogin && (

                        <Link
                            href="/login"
                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center

                                rounded-lg

                                bg-primary
                                text-primary-foreground

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                transition-colors

                                hover:bg-accent-hover
                                active:opacity-80

                                md:px-5
                            "
                        >
                            Entrar
                        </Link>

                    )}

                </div>

            </div>

        </header>
    )
}
