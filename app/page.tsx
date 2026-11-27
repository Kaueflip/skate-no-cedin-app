import type { Metadata } from "next"
import { AppNavbar } from "@/components/navigation/app-navbar"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStats } from "@/components/landing/landing-stats"
import { LandingAbout } from "@/components/landing/landing-about"
import { LandingPillars } from "@/components/landing/landing-pillars"
import { LandingTimeline } from "@/components/landing/landing-timeline"
import { LandingMethodology } from "@/components/landing/landing-methodology"
import { LandingInfrastructure } from "@/components/landing/landing-infrastructure"
import { LandingImpact } from "@/components/landing/landing-impact"
import { LandingActivities } from "@/components/landing/landing-activities"
import { LandingTeam } from "@/components/landing/landing-team"
import { LandingGallery } from "@/components/landing/landing-gallery"
import { LandingPlatform } from "@/components/landing/landing-platform"
import { LandingFooter } from "@/components/landing/landing-footer"

const title = "Skate no Cedin | Cultura urbana e Educação Integral"
const description = "Desde 2023, o Skate no Cedin conecta esporte, cultura urbana e desenvolvimento humano no CEDIN Ângela Dalçóquio de Souza, em Itajaí (SC). Conheça a trajetória, metodologia e indicadores do projeto."

export const metadata: Metadata = {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "pt_BR" },
}

const sections = [
    ["sobre", "Sobre"], ["numeros", "Indicadores"], ["pilares", "Pilares"],
    ["trajetoria", "Trajetória"], ["metodologia", "Metodologia"],
    ["infraestrutura", "Estrutura"], ["impacto", "Impacto"],
    ["atividades", "Horários"], ["equipe", "Equipe"], ["galeria", "Galeria"],
]

export default function LandingPage() {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <AppNavbar />
            <main>
                <LandingHero />
                <nav aria-label="Seções do projeto" className="border-b bg-card/30">
                    <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2 sm:flex-wrap sm:px-6">
                        {sections.map(([id, label]) => (
                            <a key={id} href={`#${id}`} className="inline-flex min-h-11 shrink-0 items-center rounded-lg border bg-card px-3 text-xs font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm">{label}</a>
                        ))}
                    </div>
                </nav>
                <LandingStats />
                <LandingAbout />
                <LandingPillars />
                <LandingTimeline />
                <LandingMethodology />
                <LandingInfrastructure />
                <LandingImpact />
                <LandingActivities />
                <LandingTeam />
                <LandingGallery />
                <LandingPlatform />
            </main>
            <LandingFooter />
        </div>
    )
}
