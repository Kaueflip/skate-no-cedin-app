import Image
    from "next/image"

import {
    ThemeToggle,
} from "@/components/theme/theme-toggle"

import Link
    from "next/link"

type Props = {

    showLinks?:
    boolean

    showLogin?:
    boolean
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

      border-b
      border-border

      bg-background/80

      backdrop-blur-xl
    ">

            <div className="
        mx-auto

        flex
        h-16
        max-w-7xl
        items-center
        justify-between

        px-6
      ">

                <Link
                    href="/"
                    className="
            flex
            items-center
            gap-3
          "
                >

                    <Image
                        unoptimized
                        src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                        alt="Skate no Cedin"
                        width={52}
                        height={52}
                        className="
              h-12
              w-auto

              dark:hidden
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

              h-12
              w-auto

              dark:block
            "
                    />

                    {/*   <div>

                        <p className="
              text-sm
              font-semibold
              leading-none
            ">

                            Skate no Cedin

                        </p>

                        <p className="
              text-xs

              text-muted
            ">

                            Plataforma

                        </p>

                    </div> */}

                </Link>

                {showLinks && (

                    <nav className="
            hidden
            items-center
            gap-8

            md:flex
          ">

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

                <div className="
          flex
          items-center
          gap-3
        ">

                    <ThemeToggle />

                    {showLogin && (

                        <Link
                            href="/login"
                            className="
                rounded-2xl

                bg-primary

                px-5
                py-2

                text-sm
                font-semibold

                text-primary-foreground

                transition-all

                hover:bg-accent-hover
                hover:scale-[1.02]
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