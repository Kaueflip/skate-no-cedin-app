"use client"

import Image from "next/image"
import Link from "next/link"

import {
    useRef,
    useState,
} from "react"

import {
    Menu,
    X,
    Info,
    ChartNoAxesCombined,
    History,
    GraduationCap,
    Construction,
    Images,
    LayoutDashboard,
    ChevronRight,
    LogIn,
} from "lucide-react"

import {
    ThemeToggle,
} from "@/components/theme/theme-toggle"

type Props = {
    showLinks?: boolean
    showLogin?: boolean
}

const navigationLinks = [
    {
        label: "Sobre",
        mobileLabel: "Sobre o projeto",
        href: "/#sobre",
        icon: Info,
    },
    {
        label: "Indicadores",
        mobileLabel: "Indicadores",
        href: "/#indicadores",
        icon: ChartNoAxesCombined,
    },
    {
        label: "Trajetória",
        mobileLabel: "Trajetória",
        href: "/#trajetoria",
        icon: History,
    },
    {
        label: "Metodologia",
        mobileLabel: "Metodologia",
        href: "/#metodologia",
        icon: GraduationCap,
    },
    {
        label: "Estrutura",
        mobileLabel: "Infraestrutura",
        href: "/#infraestrutura",
        icon: Construction,
    },
    {
        label: "Galeria",
        mobileLabel: "Galeria",
        href: "/#galeria",
        icon: Images,
    },
    {
        label: "Plataforma",
        mobileLabel: "Plataforma",
        href: "/#sistema",
        icon: LayoutDashboard,
    },
]

export function AppNavbar({
    showLinks = true,
    showLogin = true,
}: Props) {

    const [menuOpen, setMenuOpen] = useState(false)

    const menuButtonRef =
        useRef<HTMLButtonElement>(null)

    function closeMenu() {
        setMenuOpen(false)
    }

    return (

        <header
            onKeyDown={(event) => {
                if (event.key === "Escape" && menuOpen) {
                    closeMenu()
                    menuButtonRef.current?.focus()
                }
            }}
            className="
                sticky
                top-0
                z-50

                shrink-0

                border-b
                border-border

                bg-background/95
                backdrop-blur-xl
            "
        >

            <div className="
                mx-auto

                flex
                h-14
                w-full
                max-w-7xl

                items-center
                justify-between

                gap-2
                px-3

                sm:gap-3
                sm:px-4

                md:h-16
                md:px-6
            ">

                {/* LOGOTIPO */}

                <Link
                    href="/"
                    onClick={closeMenu}
                    aria-label="Página inicial - Skate no Cedin"
                    className="
                        flex
                        min-w-0
                        shrink-0
                        items-center
                        gap-2
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

                    <div className="
                        flex
                        flex-col

                        xl:hidden
                        2xl:flex
                    ">

                        <span className="
                            text-sm
                            font-semibold
                            leading-tight
                            text-foreground
                        ">
                            Skate no Cedin
                        </span>

                        <span className="
                            hidden
                            text-[10px]
                            leading-tight
                            text-muted-foreground

                            min-[380px]:block
                        ">
                            Educação e cultura urbana
                        </span>

                    </div>

                </Link>

                {/* NAVEGAÇÃO DESKTOP */}

                {showLinks && (

                    <nav
                        aria-label="Navegação principal"
                        className="
                            hidden
                            min-w-0
                            items-center
                            justify-center
                            gap-4

                            xl:flex
                            2xl:gap-5
                        "
                    >

                        {navigationLinks.map((item) => (

                            <Link
                                key={item.href}
                                href={item.href}
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center

                                    whitespace-nowrap

                                    text-sm
                                    font-medium
                                    text-muted-foreground

                                    transition-colors
                                    hover:text-foreground
                                "
                            >
                                {item.label}
                            </Link>

                        ))}

                    </nav>

                )}

                {/* AÇÕES */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    gap-1

                    sm:gap-2
                    md:gap-3
                ">

                    <div className={
                        showLinks
                            ? "hidden xl:block"
                            : "block"
                    }>
                        <ThemeToggle />
                    </div>

                    {showLogin && (

                        <Link
                            href="/login"
                            className={`
                                ${showLinks
                                    ? "hidden xl:inline-flex"
                                    : "inline-flex"
                                }

                                min-h-11
                                items-center
                                justify-center
                                gap-2

                                rounded-lg

                                bg-primary
                                text-primary-foreground

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                transition-colors
                                hover:bg-primary/90
                                active:opacity-80

                                md:px-5
                            `}
                        >

                            <LogIn className="h-4 w-4" />

                            Entrar

                        </Link>

                    )}

                    {/* MENU MOBILE */}

                    {showLinks && (

                        <button
                            ref={menuButtonRef}
                            type="button"
                            aria-label={
                                menuOpen
                                    ? "Fechar menu"
                                    : "Abrir menu"
                            }
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            onClick={() => {
                                setMenuOpen((prev) => !prev)
                            }}
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0

                                items-center
                                justify-center

                                rounded-lg
                                border
                                border-border

                                text-foreground

                                transition-colors
                                hover:bg-accent

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring

                                xl:hidden
                            "
                        >

                            {menuOpen ? (

                                <X className="h-5 w-5" />

                            ) : (

                                <Menu className="h-5 w-5" />

                            )}

                        </button>

                    )}

                </div>

            </div>

            {/* NAVEGAÇÃO MOBILE */}

            {showLinks && (

                <div
                    id="mobile-navigation"
                    hidden={!menuOpen}
                    className="
                        max-h-[calc(100dvh-3.5rem)]
                        overflow-y-auto
                        overscroll-contain

                        border-t
                        border-border

                        bg-background

                        md:max-h-[calc(100dvh-4rem)]

                        xl:hidden
                    "
                >

                    <div className="
                        mx-auto
                        flex
                        w-full
                        max-w-7xl
                        flex-col
                        gap-3
                        p-3

                        sm:p-4
                        md:px-6
                    ">

                        <nav
                            aria-label="Navegação mobile"
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >

                            {navigationLinks.map((item) => {

                                const Icon = item.icon

                                return (

                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="
                                            flex
                                            min-h-11
                                            items-center
                                            gap-3

                                            rounded-lg
                                            px-3
                                            py-2

                                            text-sm
                                            font-medium
                                            text-foreground

                                            transition-colors
                                            hover:bg-accent
                                            active:bg-accent
                                        "
                                    >

                                        <Icon className="
                                            h-5
                                            w-5
                                            shrink-0
                                            text-muted-foreground
                                        " />

                                        <span className="flex-1">
                                            {item.mobileLabel}
                                        </span>

                                        <ChevronRight className="
                                            h-4
                                            w-4
                                            shrink-0
                                            text-muted-foreground
                                        " />

                                    </Link>

                                )
                            })}

                        </nav>

                        {/* TEMA */}

                        <div className="
                            flex
                            min-h-11
                            items-center
                            justify-between

                            border-t
                            border-border

                            px-3
                            pt-3
                        ">

                            <span className="
                                text-sm
                                font-medium
                                text-muted-foreground
                            ">
                                Aparência
                            </span>

                            <ThemeToggle />

                        </div>

                        {/* ACESSO À PLATAFORMA */}

                        {showLogin && (

                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="
                                    flex
                                    min-h-11
                                    w-full

                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-lg

                                    bg-primary
                                    text-primary-foreground

                                    px-4
                                    py-3

                                    text-sm
                                    font-semibold

                                    transition-colors
                                    hover:bg-primary/90
                                    active:opacity-80
                                "
                            >

                                <LogIn className="h-4 w-4" />

                                Acessar plataforma

                            </Link>

                        )}

                    </div>

                </div>

            )}

        </header>
    )
}