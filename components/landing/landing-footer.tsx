import Image
    from "next/image"

export function LandingFooter() {

    return (

        <footer className="
      border-t
      border-border

      bg-card/40
    ">

            <div className="
        mx-auto

        flex
        max-w-7xl
        flex-col
        items-center
        justify-between
        gap-6

        px-6
        py-8

        md:flex-row
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

                            Cultura • Educação • Skate

                        </p>

                    </div>

                </div>

                <div className="
          flex
          flex-col
          items-center
          gap-1

          text-center

          md:items-end
          md:text-right
        ">

                    <p className="
            text-sm

            text-muted
          ">

                        © 2026 Skate no Cedin • Todos os direitos reservados

                    </p>

                    <a
                        href="
https://instagram.com/kauhaze
            "
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
              text-sm
              font-medium

              text-foreground

              transition-colors

              hover:text-primary
            "
                    >

                        Desenvolvido por KF

                    </a>

                </div>

            </div>

        </footer>
    )
}