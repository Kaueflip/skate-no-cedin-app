import Image from "next/image"

const images = [
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(2).webp",
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(1).webp",
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(4).webp",
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(3).webp",
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(6).webp",
    "https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(5).webp",
]

export function LandingGallery() {
    return (
        <section id="galeria" className="scroll-mt-20 border-y bg-card/30">
            <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Galeria</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Vivências do projeto</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">Registros das atividades e da cultura do skate no Cedin.</p>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                    {images.map((src, i) => (
                        <figure key={src} className={`min-w-0 overflow-hidden rounded-[10px] border bg-card ${i === 0 || i === images.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}>
                            <Image
                                unoptimized
                                src={src}
                                alt={`Registro ${i + 1} das vivências do Skate no Cedin`}
                                width={1200}
                                height={800}
                                sizes={i === 0 || i === images.length - 1 ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
