
import type { ReactNode } from "react"

import { notFound } from "next/navigation"

import {
    CalendarDays,
    Clock3,
    GraduationCap,
    Phone,
    User,
    Cake,
    ArrowLeft,
    IdCard,
} from "lucide-react"

import Link from "next/link"

import { createClient } from "@/lib/supabase-server"

import {
    getStudentPrimaryPhotoUrls,
} from "@/services/student-photo-service"

import { PageShell } from "@/components/layout/page-shell"

import { AppButton } from "@/components/ui/app-button"

import { cn } from "@/lib/utils"

import {
    StudentAvatar,
} from "@/components/students/student-avatar"

import {
    StudentPageActions,
} from "@/components/students/student-page-actions"

import {
    StudentAttendanceHistory,
} from "@/components/students/student-attendance-history"

import {
    StudentPhotoGallery,
} from "@/components/students/student-photo-gallery"

import { calculateAge } from "@/lib/calculate-age"

type Props = {
    params: Promise<{
        id: string
    }>
}

function formatDate(
    date: string | null | undefined
) {

    if (!date) return "Não informada"

    const [year, month, day] = date.split("-")

    return `${day}/${month}/${year}`
}

export default async function StudentPage({
    params,
}: Props) {

    const { id } = await params

    const supabase = await createClient()

    // DADOS DO ALUNO

    const { data: student } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single()

    if (!student) {
        notFound()
    }

    // FOTO PRINCIPAL E FREQUÊNCIA

    const [
        primaryPhotos,
        {
            data: attendance,
            error: attendanceError,
        },
    ] = await Promise.all([

        getStudentPrimaryPhotoUrls(
            supabase,
            [student.id]
        ),

        supabase
            .from("attendance")
            .select("id, class_date, present")
            .eq("student_id", id)
            .order("class_date", {
                ascending: false,
            }),

    ])

    if (attendanceError) {
        console.error(
            "Erro ao carregar frequência:",
            attendanceError
        )
    }

    const profilePhotoUrl =
        primaryPhotos.get(student.id) ?? null

    const age = calculateAge(
        student.data_nascimento
    )

    const genderLabels: Record<string, string> = {
        M: "Masculino",
        F: "Feminino",
    }

    const gender = student.genero
        ? genderLabels[student.genero] || student.genero
        : "Não informado"

    return (

        <PageShell>

            <div className="
                flex
                w-full
                min-w-0
                flex-col
                gap-3

                md:gap-5
            ">

                {/* VOLTAR */}

                <div>

                    <AppButton
                        asChild
                        variant="ghost"
                        className="
                            h-11
                            gap-2
                            px-2
                            text-sm
                        "
                    >

                        <Link href="/students">

                            <ArrowLeft className="h-4 w-4" />

                            Voltar aos alunos

                        </Link>

                    </AppButton>

                </div>

                {/* IDENTIFICAÇÃO DO ALUNO */}

                <section className="
                    w-full
                    min-w-0

                    rounded-[10px]
                    border
                    border-border
                    bg-card

                    p-3

                    shadow-sm

                    sm:p-4
                    lg:p-5
                ">

                    <div className="
                        flex
                        min-w-0
                        flex-col
                        gap-4

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">

                        <div className="
                            flex
                            min-w-0
                            items-center
                            gap-3

                            md:gap-4
                        ">

                            <StudentAvatar
                                nome={student.nome}
                                photoUrl={profilePhotoUrl}
                                className="
                                 h-[72px]
                                    w-[72px]
                                    rounded-full
                                    border-0
                                    md:h-24
                                    md:w-24
                                "
                                fallbackClassName="
                                  rounded-full
                                    text-2xl
                                    md:text-3xl
                                "
                            />

                            <div className="min-w-0 flex-1">

                                <p className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-primary

                                    md:text-xs
                                ">
                                    Perfil do aluno
                                </p>

                                <h1 className="
                                    mt-1

                                    text-lg
                                    font-black
                                    leading-tight
                                    tracking-tight

                                    [overflow-wrap:anywhere]

                                    sm:text-xl
                                    md:text-2xl
                                    lg:text-3xl
                                ">
                                    {student.nome}
                                </h1>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-muted

                                    md:text-sm
                                ">
                                    {student.nivel}
                                    {" • "}
                                    {student.turno}
                                </p>

                                <div className="mt-2">

                                    <span className={cn(
                                        `
                                            inline-flex
                                            items-center
                                            gap-1.5

                                            rounded-md

                                            px-2
                                            py-1

                                            text-[11px]
                                            font-semibold
                                        `,
                                        student.ativo !== false
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    )}>

                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            student.ativo !== false
                                                ? "bg-emerald-500"
                                                : "bg-red-500"
                                        )} />

                                        {student.ativo !== false
                                            ? "Ativo"
                                            : "Inativo"}

                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* AÇÕES DO PERFIL */}

                        <div className="
                            w-full
                            min-w-0

                            border-t
                            border-border
                            pt-3

                            lg:w-auto
                            lg:shrink-0
                            lg:border-0
                            lg:pt-0
                        ">

                            <StudentPageActions
                                student={student}
                            />

                        </div>

                    </div>

                </section>

                {/* DADOS DO ALUNO */}

                <section className="
                    w-full
                    min-w-0

                    rounded-[10px]
                    border
                    border-border
                    bg-card

                    p-3
                    shadow-sm

                    sm:p-4
                    lg:p-5
                ">

                    <div className="mb-3">

                        <h2 className="
                            text-base
                            font-bold

                            md:text-lg
                        ">
                            Dados do aluno
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-muted
                        ">
                            Informações pessoais e escolares
                        </p>

                    </div>

                    <div className="
                        grid
                        min-w-0
                        grid-cols-2
                        gap-2

                        md:gap-3
                        lg:grid-cols-3
                        xl:grid-cols-4
                    ">

                        <InfoCard
                            icon={<GraduationCap />}
                            label="Turma"
                            value={student.turma}
                            className="
                                col-span-2
                                lg:col-span-3
                                xl:col-span-2
                            "
                        />

                        <InfoCard
                            icon={<IdCard />}
                            label="Matrícula escolar"
                            value={
                                student.matricula_escolar ||
                                "Não informada"
                            }
                        />

                        <InfoCard
                            icon={<Clock3 />}
                            label="Turno"
                            value={student.turno}
                        />

                        <InfoCard
                            icon={<User />}
                            label="Idade"
                            value={
                                age !== null
                                    ? `${age} anos`
                                    : "Não informada"
                            }
                        />

                        <InfoCard
                            icon={<Cake />}
                            label="Nascimento"
                            value={
                                formatDate(
                                    student.data_nascimento
                                )
                            }
                        />

                        <InfoCard
                            icon={<CalendarDays />}
                            label="Data de início"
                            value={
                                formatDate(
                                    student.data_inicio
                                )
                            }
                        />

                        <InfoCard
                            icon={<User />}
                            label="Gênero"
                            value={gender}
                        />

                        <InfoCard
                            icon={<User />}
                            label="Responsável"
                            value={
                                student.responsavel_nome ||
                                "Não informado"
                            }
                            className="col-span-2"
                        />

                        <InfoCard
                            icon={<Phone />}
                            label="Contato"
                            value={
                                student.responsavel_contato ||
                                "Não informado"
                            }
                            className="
                                col-span-2
                                lg:col-span-1
                                xl:col-span-2
                            "
                        />

                    </div>

                </section>

                {/* GALERIA DE FOTOS */}

                <section className="
                    w-full
                    min-w-0

                    rounded-[10px]
                    border
                    border-border
                    bg-card

                    p-3
                    shadow-sm

                    sm:p-4
                    lg:p-5
                ">

                    <StudentPhotoGallery
                        key={student.id}
                        studentId={student.id}
                    />

                </section>

                {/* HISTÓRICO DE FREQUÊNCIA */}

                <section className="w-full min-w-0">

                    <StudentAttendanceHistory
                        attendance={attendance || []}
                    />

                </section>

                {/* OBSERVAÇÕES */}

                <section className="
                    w-full
                    min-w-0

                    rounded-[10px]
                    border
                    border-border
                    bg-card

                    p-3
                    shadow-sm

                    sm:p-4
                    lg:p-5
                ">

                    <h2 className="
                        mb-2

                        text-base
                        font-bold

                        md:text-lg
                    ">
                        Observações
                    </h2>

                    <p className="
                        whitespace-pre-wrap

                        text-sm
                        leading-relaxed
                        text-muted

                        [overflow-wrap:anywhere]
                    ">
                        {student.observacoes?.trim() ||
                            "Nenhuma observação registrada."}
                    </p>

                </section>

            </div>

        </PageShell>
    )
}

type InfoCardProps = {
    icon: ReactNode
    label: string
    value: string
    className?: string
}

function InfoCard({
    icon,
    label,
    value,
    className,
}: InfoCardProps) {

    return (

        <div className={cn(
            `
                flex
                min-w-0
                flex-col
                justify-center
                gap-1.5

                rounded-lg

                border
                border-border
                bg-background/70

                p-2.5

                md:gap-2
                md:p-3
            `,
            className
        )}>

            <div className="
                flex
                min-w-0
                items-center
                gap-1.5
            ">

                <div className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center

                    text-primary

                    [&>svg]:h-3.5
                    [&>svg]:w-3.5
                ">

                    {icon}

                </div>

                <p className="
                    min-w-0

                    text-[11px]
                    font-medium
                    leading-tight
                    text-muted

                    md:text-xs
                ">

                    {label}

                </p>

            </div>

            <p className="
                min-w-0

                text-xs
                font-semibold
                leading-relaxed
                text-foreground

                [overflow-wrap:anywhere]

                sm:text-sm
            ">

                {value}

            </p>

        </div>
    )
}
