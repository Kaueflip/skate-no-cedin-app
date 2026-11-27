import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

export function LandingHero() {
    return (
        <section className="border-b border-border">
            <div className="mx-auto grid max-w-7xl items-center gap-6 px-3 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
                <div className="min-w-0">
                    <p className="flex items-center gap-2 text-xs font-semibold text-muted sm:text-sm">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" />
                        Desde 2023 · Itajaí, Santa Catarina
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">
                        Skate · Cultura urbana · Educação Integral
                    </p>
                    <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        Skate no Cedin
                    </h1>
                    <p className="mt-3 text-xl font-semibold leading-snug sm:text-2xl">
                        Cultura urbana como linguagem pedagógica.
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
                        Uma experiência de Educação Integral que conecta esporte, cultura, educação e desenvolvimento humano, fortalecendo o protagonismo dos estudantes e seus vínculos com a escola.
                    </p>
                    <div className="mt-6 grid gap-2 min-[380px]:grid-cols-2 sm:flex sm:gap-3">
                        <a href="#sobre" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2">
                            Conhecer projeto <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                        </a>
                        <a href="#indicadores" className="inline-flex min-h-11 items-center justify-center rounded-lg border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2">
                            Ver indicadores
                        </a>
                    </div>
                    <Link href="/login" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
                        Acesso à plataforma de gestão
                    </Link>
                </div>
                <div className="min-w-0 overflow-hidden rounded-[10px] border bg-card">
                    <Image
                        unoptimized
                        src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(2).webp"
                        alt="Registro fotográfico das atividades do Skate no Cedin"
                        width={1200}
                        height={800}
                        preload
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="aspect-[4/3] h-auto w-full object-cover lg:aspect-square"
                    />
                    <p className="px-3 py-2 text-xs text-muted">CEDIN Ângela Dalçóquio de Souza</p>
                </div>
            </div>
        </section>
    )
}
