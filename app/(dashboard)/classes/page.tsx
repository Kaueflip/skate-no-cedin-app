
import {
    CalendarDays,
} from "lucide-react"

import {
    createClient,
} from "@/lib/supabase-server"

import {
    ClassesClient,
} from "@/components/classes/classes-client"

import {
    PageShell,
} from "@/components/layout/page-shell"

import {
    PageHeader,
} from "@/components/layout/page-header"

export default async function ClassesPage() {
    const supabase = await createClient()

    const today = new Date()
        .toLocaleDateString("en-CA", {
            timeZone: "America/Sao_Paulo",
        })

    const {
        data: sessions,
        error,
    } = await supabase
        .from("class_sessions")
        .select("*")
        .eq("class_date", today)
        .order("turno")
        .order("aula_numero")

    if (error) {
        console.error("Erro ao carregar aulas:", error)
    }

    return (
        <PageShell>
            <PageHeader
                title="Controle de Aulas"
                description="Registre e acompanhe as aulas realizadas pelo projeto"
            />

            <div className="mt-8">
                <ClassesClient
                    initialSessions={sessions || []}
                    initialDate={today}
                />
            </div>
        </PageShell>
    )
}
