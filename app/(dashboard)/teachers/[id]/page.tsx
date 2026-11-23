
import {
    notFound,
} from "next/navigation"

import Image
    from "next/image"

import Link
    from "next/link"

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Phone,
    UserRound,
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

    const totalClasses = sessions.length

    const morningClasses = sessions.filter(
        (session) => session.turno === "Manhã"
    ).length

    const afternoonClasses = sessions.filter(
        (session) => session.turno === "Tarde"
    ).length

    return (

        <PageShell>

            <div className="mb-8">

                <Link href="/teachers">

                    <AppButton variant="secondary">

                        <ArrowLeft className="h-4 w-4" />

                        Voltar

                    </AppButton>

                </Link>

            </div>

            <div className="
                overflow-hidden
                rounded-4xl
                border
                border-border
                bg-card
                shadow-sm
            ">

                <div className="relative p-6 pb-8">

                    <div className="
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">

                        <div className="
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-end
                        ">

                            <div className="
                                relative
                                h-32
                                w-32
                                shrink-0
                                overflow-hidden
                                rounded-4xl
                                border-4
                                border-card
                                bg-background
                                shadow-xl
                            ">

                                {profilePhotoUrl ? (

                                    <Image
                                        src={profilePhotoUrl}
                                        alt={teacher.nome}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />

                                ) : (

                                    <div className="
                                        flex
                                        h-full
                                        w-full
                                        items-center
                                        justify-center
                                        text-5xl
                                        font-black
                                        text-muted
                                    ">
                                        {teacher.nome
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                )}

                            </div>

                            <div>

                                <p className="
                                    mb-2
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-[0.25em]
                                    text-primary
                                ">
                                    Perfil do professor
                                </p>

                                <h1 className="
                                    text-4xl
                                    font-black
                                    tracking-tight
                                ">
                                    {teacher.nome}
                                </h1>

                                <div className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                ">

                                    <p className="text-lg text-muted">
                                        {teacher.funcao || "Função não informada"}
                                    </p>

                                    <span className={`
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        ${teacher.ativo
                                            ? "bg-emerald-500/10 text-emerald-600"
                                            : "bg-red-500/10 text-red-600"
                                        }
                                    `}>
                                        {teacher.ativo ? "Ativo" : "Inativo"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="
                        mt-10
                        grid
                        gap-5
                        md:grid-cols-2
                        xl:grid-cols-3
                    ">

                        <InfoCard
                            icon={<BriefcaseBusiness className="h-5 w-5" />}
                            label="Função"
                            value={teacher.funcao || "Não informada"}
                        />

                        <InfoCard
                            icon={<Phone className="h-5 w-5" />}
                            label="Contato"
                            value={teacher.contato || "Não informado"}
                        />

                        <InfoCard
                            icon={<CalendarDays className="h-5 w-5" />}
                            label="Data de início"
                            value={
                                teacher.data_inicio
                                    ? new Date(
                                        `${teacher.data_inicio}T12:00:00`
                                    ).toLocaleDateString("pt-BR")
                                    : "Não informada"
                            }
                        />

                    </div>

                    <section className="mt-8">

                        <h2 className="
                            mb-5
                            text-xl
                            font-bold
                        ">
                            Resumo das aulas
                        </h2>

                        <div className="
                            grid
                            gap-5
                            md:grid-cols-3
                        ">

                            <InfoCard
                                icon={<GraduationCap className="h-5 w-5" />}
                                label="Total de aulas vinculadas"
                                value={String(totalClasses)}
                            />

                            <InfoCard
                                icon={<Clock3 className="h-5 w-5" />}
                                label="Aulas no período da manhã"
                                value={String(morningClasses)}
                            />

                            <InfoCard
                                icon={<Clock3 className="h-5 w-5" />}
                                label="Aulas no período da tarde"
                                value={String(afternoonClasses)}
                            />

                        </div>

                    </section>

                    <section className="
                        mt-8
                        rounded-4xl
                        border
                        border-border
                        bg-background/80
                        p-6
                    ">

                        <div className="
                            mb-5
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Histórico de aulas
                                </h2>

                                <p className="mt-1 text-sm text-muted">
                                    Aulas vinculadas a este professor
                                </p>
                            </div>

                            <span className="
                                rounded-xl
                                bg-primary/10
                                px-3
                                py-1
                                text-sm
                                font-semibold
                                text-primary
                            ">
                                {totalClasses} aulas
                            </span>

                        </div>

                        {sessions.length > 0 ? (

                            <div className="
                                overflow-x-auto
                                rounded-2xl
                                border
                                border-border
                            ">

                                <table className="w-full text-sm">

                                    <thead className="bg-muted/10">

                                        <tr className="text-left">

                                            <th className="p-4 font-semibold">
                                                Data
                                            </th>

                                            <th className="p-4 font-semibold">
                                                Turno
                                            </th>

                                            <th className="p-4 font-semibold">
                                                Aula
                                            </th>

                                            <th className="p-4 font-semibold">
                                                Situação
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {sessions.map((session) => (

                                            <tr
                                                key={session.id}
                                                className="border-t border-border"
                                            >

                                                <td className="p-4 text-muted">
                                                    {new Date(
                                                        `${session.class_date}T12:00:00`
                                                    ).toLocaleDateString("pt-BR")}
                                                </td>

                                                <td className="p-4 text-muted">
                                                    {session.turno}
                                                </td>

                                                <td className="p-4 text-muted">
                                                    {session.aula_numero
                                                        ? `${session.aula_numero}ª aula`
                                                        : "Não informado"}
                                                </td>

                                                <td className="p-4">

                                                    <span className="
                                                        rounded-lg
                                                        bg-muted/20
                                                        px-2
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                    ">
                                                        {session.status || "Não informado"}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="
                                rounded-2xl
                                border
                                border-dashed
                                border-border
                                p-10
                                text-center
                            ">

                                <UserRound className="
                                    mx-auto
                                    mb-3
                                    h-8
                                    w-8
                                    text-muted
                                " />

                                <p className="font-semibold">
                                    Nenhuma aula vinculada
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-muted
                                ">
                                    O histórico aparecerá aqui quando o professor for vinculado às aulas.
                                </p>

                            </div>

                        )}

                    </section>

                </div>

            </div>

        </PageShell>
    )
}

type InfoCardProps = {
    icon: React.ReactNode
    label: string
    value: string
}

function InfoCard({
    icon,
    label,
    value,
}: InfoCardProps) {

    return (

        <div className="
            rounded-4xl
            border
            border-border
            bg-background/70
            p-5
        ">

            <div className="
                flex
                items-center
                gap-4
            ">

                <div className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                ">
                    {icon}
                </div>

                <div>

                    <p className="text-sm text-muted">
                        {label}
                    </p>

                    <p className="mt-1 font-semibold">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    )
}
