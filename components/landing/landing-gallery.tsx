import Image
    from "next/image"

const images = [

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(2).webp`,
        height:
            "h-[420px]",
    },

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(1).webp`,
        height:
            "h-[200px]",
    },

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(4).webp`,
        height:
            "h-[200px]",
    },

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(3).webp`,
        height:
            "h-[420px]",
    },

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(6).webp`,
        height:
            "h-[200px]",
    },

    {
        src: `https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(5).webp`,
        height:
            "h-[200px]",
    },
]

export function LandingGallery() {

    return (

        <section
            id="galeria"
            className="
        border-y
        border-border

        bg-card/30
      "
        >

            <div className="
        mx-auto

        max-w-7xl

        px-6
        py-24
      ">

                <div className="
          mb-14

          flex
          flex-col
          gap-4

          text-center
        ">

                    <p className="
            text-sm
            font-semibold

            uppercase

            tracking-[0.25em]

            text-muted
          ">

                        Galeria

                    </p>

                    <h2 className="
            text-4xl
            font-black

            tracking-tight

            lg:text-5xl
          ">

                        Vivências do projeto.

                    </h2>

                    <p className="
            mx-auto

            max-w-2xl

            text-lg

            text-muted
          ">

                        Cada sessão representa evolução,
                        amizade, cultura e transformação
                        através do skate.

                    </p>

                </div>

                <div className="
          grid
          gap-4

          md:grid-cols-2

          lg:grid-cols-4
        ">

                    <div className="
            overflow-hidden

            rounded-4xl

            border
            border-border

            bg-card
          ">

                        <Image
                            unoptimized
                            src={images[0].src}
                            alt="Skate no Cedin"
                            width={1200}
                            height={800}
                            className="
                h-105
                w-full

                object-cover

                transition-transform
                duration-500

                hover:scale-105
              "
                        />

                    </div>

                    <div className="
            grid
            gap-4
          ">

                        {[images[1], images[2]]
                            .map((image) => (

                                <div
                                    key={image.src}
                                    className="
                    overflow-hidden

                    rounded-4xl

                    border
                    border-border

                    bg-card
                  "
                                >

                                    <Image
                                        unoptimized
                                        src={image.src}
                                        alt="Skate no Cedin"
                                        width={1200}
                                        height={800}
                                        className={`
                      ${image.height}

                      w-full

                      object-cover

                      transition-transform
                      duration-500

                      hover:scale-105
                    `}
                                    />

                                </div>
                            ))}

                    </div>

                    <div className="
            overflow-hidden

            rounded-4xl

            border
            border-border

            bg-card
          ">

                        <Image
                            unoptimized
                            src={images[3].src}
                            alt="Skate no Cedin"
                            width={1200}
                            height={800}
                            className="
                h-105
                w-full

                object-cover

                transition-transform
                duration-500

                hover:scale-105
              "
                        />

                    </div>

                    <div className="
            grid
            gap-4
          ">

                        {[images[4], images[5]]
                            .map((image) => (

                                <div
                                    key={image.src}
                                    className="
                    overflow-hidden

                    rounded-4xl

                    border
                    border-border

                    bg-card
                  "
                                >

                                    <Image
                                        unoptimized
                                        src={image.src}
                                        alt="Skate no Cedin"
                                        width={1200}
                                        height={800}
                                        className={`
                      ${image.height}

                      w-full

                      object-cover

                      transition-transform
                      duration-500

                      hover:scale-105
                    `}
                                    />

                                </div>
                            ))}

                    </div>

                </div>

            </div>

        </section>
    )
}