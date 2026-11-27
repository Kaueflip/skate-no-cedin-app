import Image from "next/image"
import Link from "next/link"

const links = [
    { href: "#sobre", title: "Sobre" },
    { href: "#indicadores", title: "Indicadores" },
    { href: "#trajetoria", title: "Trajetória" },
    { href: "#metodologia", title: "Metodologia" },
    { href: "#impacto", title: "Impacto" },
    { href: "#atividades", title: "Atividades" },
    { href: "#equipe", title: "Equipe" },
    { href: "#galeria", title: "Galeria" },
    { href: "#sistema", title: "Plataforma" },
]

export function LandingFooter() {
    return (
        <footer className="border-t bg-card/40">
            <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
                <div className="grid gap-4 md:grid-cols-2 md:items-start">
                    <div className="flex items-center gap-3">
                        <Image unoptimized src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg" alt="Skate no Cedin" width={52} height={52} className="h-10 w-auto dark:hidden" />
                        <Image unoptimized src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png" alt="Skate no Cedin" width={52} height={52} className="hidden h-10 w-auto dark:block" />
                        <div>
                            <p className="text-sm font-semibold">Skate no Cedin</p>
                            <p className="text-xs text-muted">Cultura · Educação · Skate</p>
                        </div>
                    </div>
                    <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
                        {links.map(({ href, title }) => (
                            <a key={href} href={href} className="inline-flex min-h-11 items-center text-sm text-muted hover:text-foreground">{title}</a>
                        ))}
                        <Link href="/login" className="inline-flex min-h-11 items-center text-sm font-semibold">Entrar</Link>
                    </nav>
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t pt-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>© Skate no Cedin · Todos os direitos reservados</p>
                    <a href="https://instagram.com/kauhaze" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-foreground hover:underline">Desenvolvido por KF</a>
                </div>
            </div>
        </footer>
    )
}
