import {
    notFound,
} from "next/navigation"

import type { ReactNode } from "react"
import { TeacherAvatar } from "@/components/teachers/teacher-avatar"

import Link
    from "next/link"

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Phone,
    BriefcaseBusiness,
    GraduationCap,
} from "lucide-react"

import {
    createClient,
} from "@/lib/supabase-server"

import {
    PageShell,
} from "@/components/layout/page-shell"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    TeacherPageActions,
} from "@/components/teachers/teacher-page-actions"

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function TeacherPage({
    params,
}: Props) {

    const { id } = await params

    const supabase = await createClient()

    const {
        data: teacher,
        error: teacherError,
    } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", id)
        .single()

    if (teacherError || !teacher) {
        notFound()
    }

    let profilePhotoUrl: string | null = null

    if (teacher.foto_url) {

        if (teacher.foto_url.startsWith("http")) {

            profilePhotoUrl = teacher.foto_url

        } else {

            const {
                data: signedData,
                error: signedError,
            } = await supabase
                .storage
                .from("teacher-photos")
                .createSignedUrl(
                    teacher.foto_url,
                    3600
                )

            if (!signedError && signedData) {
                profilePhotoUrl = signedData.signedUrl
            }
        }
    }

    const {
        data: classAssignments,
        error: assignmentsError,
    } = await supabase
        .from("class_session_teachers")
        .select(`
            id,
            class_sessions (
                id,
                class_date,
                turno,
                aula_numero,
                status
            )
        `)
        .eq("teacher_id", id)

    if (assignmentsError) {
        console.error(
            "Erro ao carregar histórico do professor:",
            assignmentsError
        )
    }

    const sessions = (classAssignments || [])
        .flatMap((assignment) => assignment.class_sessions || [])
        .sort((a, b) =>
            b.class_date.localeCompare(a.class_date)
        )

    const nightClasses = sessions.filter((session) => session.turno === "Noite").length
    const totalClasses = sessions.length

    const morningClasses = sessions.filter(
        (session) => session.turno === "Manhã"
    ).length

    const afternoonClasses = sessions.filter(
        (session) => session.turno === "Tarde"
    ).length

    return (
        <PageShell>
            <div className="flex w-full min-w-0 flex-col gap-3 md:gap-5">
                <div><AppButton asChild variant="ghost" className="h-11 gap-2 px-2 text-sm">
                    <Link href="/teachers"><ArrowLeft className="h-4 w-4" /> Voltar aos professores</Link>
                </AppButton></div>
                <section className="w-full min-w-0 rounded-[10px] border border-border bg-card p-3 shadow-sm sm:p-4 lg:p-5">
                    <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <TeacherAvatar nome={teacher.nome} fotoUrl={profilePhotoUrl} size={72} />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Perfil do professor</p>
                                <h1 className="mt-1 text-lg font-black leading-tight tracking-tight [overflow-wrap:anywhere] md:text-2xl">{teacher.nome}</h1>
                                <p className="mt-1 text-xs text-muted [overflow-wrap:anywhere] md:text-sm">{teacher.funcao || "Função não informada"}</p>
                                <span className={`mt-2 inline-flex rounded-md px-2 py-1 text-[11px] font-semibold ${teacher.ativo ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>{teacher.ativo ? "Ativo" : "Inativo"}</span>
                            </div>
                        </div>
                        <div className="w-full min-w-0 border-t border-border pt-3 lg:w-auto lg:shrink-0 lg:border-0 lg:pt-0">
                            <TeacherPageActions teacher={teacher} currentPhotoUrl={profilePhotoUrl} />
                        </div>
                    </div>
                </section>
                <section className="min-w-0 rounded-[10px] border border-border bg-card p-3 sm:p-4 lg:p-5">
                    <h2 className="mb-3 text-base font-bold md:text-lg">Dados do professor</h2>
                    <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-3">
                        <InfoCard icon={<BriefcaseBusiness />} label="Função" value={teacher.funcao || "Não informada"} className="col-span-2 lg:col-span-1" />
                        <InfoCard icon={<Phone />} label="Contato" value={teacher.contato || "Não informado"} />
                        <InfoCard icon={<CalendarDays />} label="Data de início" value={teacher.data_inicio ? teacher.data_inicio.split("-").reverse().join("/") : "Não informada"} />
                    </div>
                </section>
                <section className="min-w-0 rounded-[10px] border border-border bg-card p-3 sm:p-4 lg:p-5">
                    <h2 className="mb-1 text-base font-bold md:text-lg">Histórico de aulas</h2>
                    <p className="mb-3 text-xs text-muted">Aulas vinculadas a este professor</p>
                    {assignmentsError ? <p role="alert" className="rounded-lg border border-border p-3 text-sm text-destructive">Não foi possível carregar o histórico de aulas.</p> : <>
                        <div className="mb-3 grid min-w-0 grid-cols-2 gap-2 xl:grid-cols-4">
                            <InfoCard icon={<GraduationCap />} label="Total vinculado" value={String(totalClasses)} />
                            <InfoCard icon={<Clock3 />} label="Manhã" value={String(morningClasses)} />
                            <InfoCard icon={<Clock3 />} label="Tarde" value={String(afternoonClasses)} />
                            <InfoCard icon={<Clock3 />} label="Noite" value={String(nightClasses)} />
                        </div>
                        {sessions.length > 0 ? (
                            <div className="divide-y divide-border rounded-lg border border-border">
                                {sessions.map((session) => (
                                    <div key={session.id} className="flex min-w-0 items-center justify-between gap-2 p-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold tabular-nums">{session.class_date.split("-").reverse().join("/")}</p>
                                            <p className="mt-0.5 text-xs text-muted">{session.turno} • {session.aula_numero ? `${session.aula_numero}ª aula` : "Aula não informada"}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium capitalize ${session.status === "realizada" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : session.status === "cancelada" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-muted/20 text-muted-foreground"}`}>{session.status || "Não informado"}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center">
                            <CalendarDays className="mx-auto mb-2 h-6 w-6 text-muted" />
                            <p className="text-sm font-semibold">Nenhuma aula vinculada</p>
                            <p className="mt-1 text-xs text-muted">O histórico aparecerá quando o professor for vinculado às aulas.</p>
                        </div>}
                    </>}
                </section>
            </div>
        </PageShell>
    )
}

function InfoCard({ icon, label, value, className = "" }: { icon: ReactNode; label: string; value: string; className?: string }) {
    return <div className={`min-w-0 rounded-lg border border-border bg-background/70 p-2.5 md:p-3 ${className}`}>
        <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-primary [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
            <span className="min-w-0 text-[11px] leading-tight text-muted md:text-xs">{label}</span>
        </div>
        <p className="mt-1.5 text-sm font-semibold [overflow-wrap:anywhere]">{value}</p>
    </div>
}
