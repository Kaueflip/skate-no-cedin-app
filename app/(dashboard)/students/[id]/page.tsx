import {
    notFound,
} from "next/navigation"

import Image
    from "next/image"

import {
    CalendarDays,
    Clock3,
    GraduationCap,
    Phone,
    User,
    Cake,
    ArrowLeft,
} from "lucide-react"

import Link
    from "next/link"

import {
    createClient,
} from "@/lib/supabase-server"

import {
    PageShell,
} from "@/components/layout/page-shell"

import {
    AppButton,
} from "@/components/ui/app-button"

import { StudentPageActions } from "@/components/students/student-page-actions"

import { calculateAge } from "@/lib/calculate-age"

import {
    StudentAttendanceHistory,
} from "@/components/students/student-attendance-history"

import {
    StudentPhotoGallery,
} from "@/components/students/student-photo-gallery"

type Props = {

    params: Promise<{
        id: string
    }>
}

export default async function StudentPage({
    params,
}: Props) {

    const {
        id,
    } = await params

    const supabase =
        await createClient()

    const {
        data: student,
    } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single()

    if (!student)
        notFound()

    const { data: primaryPhoto } = await supabase
        .from("student_photos")
        .select("storage_path")
        .eq("student_id", id)
        .eq("is_primary", true)
        .maybeSingle()

    let profilePhotoUrl = student.foto_url

    if (primaryPhoto?.storage_path) {
        const { data: signedData, error: signedError } =
            await supabase.storage
                .from("student-photos")
                .createSignedUrl(primaryPhoto.storage_path, 3600)

        if (!signedError && signedData) {
            profilePhotoUrl = signedData.signedUrl
        }
    }

    const {
        data: attendance,
        error: attendanceError,
    } = await supabase
        .from("attendance")
        .select("id, class_date, present")
        .eq("student_id", id)
        .order("class_date", {
            ascending: false,
        })

    if (attendanceError) {
        console.error(
            "Erro ao carregar frequência:",
            attendanceError
        )
    }

    return (

        <PageShell>

            <div className="
                mb-8
            ">

                <Link
                    href="/students"
                >

                    <AppButton
                        variant="secondary"
                    >

                        <ArrowLeft
                            className="
                                h-4
                                w-4
                            "
                        />

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



                <div className="
                    relative
                    p-6
                    pb-8
                ">

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
                                        alt={student.nome}
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

                                        {student.nome
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

                                    Perfil do aluno

                                </p>

                                <h1 className="
                                    text-4xl
                                    font-black
                                    tracking-tight
                                ">

                                    {student.nome}

                                </h1>

                                <div className="
    mt-3
    flex
    flex-wrap
    items-center
    gap-3
">
                                    <p className="
        text-lg
        text-muted
    ">
                                        {student.nivel}
                                        {" • "}
                                        {student.turno}
                                    </p>

                                    <span className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${student.ativo !== false
                                            ? "bg-emerald-500/10 text-emerald-600"
                                            : "bg-red-500/10 text-red-600"
                                        }
    `}>
                                        {student.ativo !== false ? "Ativo" : "Inativo"}
                                    </span>
                                </div>

                            </div>

                        </div>

                        <StudentPageActions
                            student={student}
                        />

                    </div>

                    <div className="
                        mt-10

                        grid
                        gap-5

                        md:grid-cols-2
                        xl:grid-cols-3
                    ">

                        <InfoCard
                            icon={
                                <GraduationCap
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="Turma"
                            value={
                                student.turma
                            }
                        />

                        <InfoCard
                            icon={
                                <Clock3
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="Turno"
                            value={
                                student.turno
                            }
                        />

                        <InfoCard
                            icon={
                                <User
                                    className="h-5 w-5"
                                />
                            }
                            label="Idade"
                            value={
                                calculateAge(student.data_nascimento) !== null
                                    ? `${calculateAge(student.data_nascimento)} anos`
                                    : "Não informada"
                            }
                        />

                        <InfoCard
                            icon={
                                <Cake
                                    className="h-5 w-5"
                                />
                            }
                            label="Data de nascimento"
                            value={
                                student.data_nascimento
                                    ? new Date(
                                        `${student.data_nascimento}T12:00:00`
                                    ).toLocaleDateString("pt-BR")
                                    : "Não informada"
                            }
                        />

                        <InfoCard
                            icon={
                                <CalendarDays
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="
                                Data de início
                            "
                            value={
                                new Date(
                                    student.data_inicio
                                ).toLocaleDateString(
                                    "pt-BR"
                                )
                            }
                        />

                        <InfoCard
                            icon={
                                <User
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="
                                Responsável
                            "
                            value={
                                student.responsavel_nome ||
                                "Não informado"
                            }
                        />

                        <InfoCard
                            icon={
                                <Phone
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="Contato"
                            value={
                                student.responsavel_contato ||
                                "Não informado"
                            }
                        />

                    </div>

                    <div className="mt-8 rounded-4xl border border-border bg-background/80 p-6">
                        <StudentPhotoGallery
                            studentId={student.id}
                        />
                    </div>

                    <StudentAttendanceHistory
                        attendance={attendance || []}
                    />

                    <div className="
    mt-6
    rounded-4xl
    border
    border-border
    bg-background/80
    p-6
">



                        <h2 className="
        mb-3
        text-lg
        font-bold
    ">
                            Observações
                        </h2>

                        <p className="
        leading-relaxed
        text-muted
    ">
                            {student.observacoes?.trim() || "Nenhuma observação registrada."}
                        </p>
                    </div>

                </div>

            </div>

        </PageShell>
    )
}

type InfoCardProps = {

    icon:
    React.ReactNode

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
                    items-center
                    justify-center

                    rounded-2xl

                    bg-primary/10

                    text-primary
                ">

                    {icon}

                </div>

                <div>

                    <p className="
                        text-sm

                        text-muted
                    ">

                        {label}

                    </p>

                    <p className="
                        mt-1

                        font-semibold
                    ">

                        {value}

                    </p>

                </div>

            </div>

        </div>
    )
}