import Image
    from "next/image"

import {
    ThemeToggle,
} from "@/components/theme/theme-toggle"

export function LandingHeader() {

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

                <div className="
          flex
          items-center
          gap-3
        ">

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

                    <div>

                        {/*    <p className="
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

                            Projeto Social

                        </p> */}

                    </div>

                </div>

                <nav className="
          hidden
          items-center
          gap-8

          md:flex
        ">

                    <a
                        href="#sobre"
                        className="
              text-sm
              font-medium

              text-muted

              transition-colors

              hover:text-foreground
            "
                    >

                        Sobre

                    </a>

                    <a
                        href="#galeria"
                        className="
              text-sm
              font-medium

              text-muted

              transition-colors

              hover:text-foreground
            "
                    >

                        Galeria

                    </a>

                    <a
                        href="#sistema"
                        className="
              text-sm
              font-medium

              text-muted

              transition-colors

              hover:text-foreground
            "
                    >

                        Plataforma

                    </a>

                </nav>

                <div className="
          flex
          items-center
          gap-3
        ">

                    <ThemeToggle />

                    <a
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

                    </a>

                </div>

            </div>

        </header>
    )
}