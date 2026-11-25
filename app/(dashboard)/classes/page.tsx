
import { createClient } from "@/lib/supabase-server"

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

    // DATA ATUAL - FUSO DE BRASÍLIA

    const today = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(new Date())

    // AULAS DO DIA

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

        console.error(
            "Erro ao carregar aulas:",
            error
        )

        throw new Error(
            "Não foi possível carregar as aulas."
        )
    }

    return (

        <PageShell>

            <PageHeader
                title="Controle de aulas"
                description="Registre e acompanhe as aulas do projeto."
            />

            <div className="
                w-full
                min-w-0
            ">

                <ClassesClient
                    initialSessions={sessions || []}
                    initialDate={today}
                />

            </div>

        </PageShell>
    )
}
