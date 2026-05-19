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

                rounded-[2rem]

                border
                border-border

                bg-card

                shadow-sm
            ">

                <div className="
                    relative

                    h-48

                    bg-gradient-to-br
                    from-primary
                    to-primary/70
                ">

                    <div className="
                        absolute
                        inset-0

                        bg-black/10
                    " />

                </div>

                <div className="
                    relative

                    px-6
                    pb-8
                ">

                    <div className="
                        -mt-16

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

                                rounded-[2rem]

                                border-4
                                border-card

                                bg-background

                                shadow-xl
                            ">

                                {student.foto_url ? (

                                    <Image
                                        src={
                                            student.foto_url
                                        }
                                        alt={
                                            student.nome
                                        }
                                        fill
                                        className="
                                            object-cover
                                        "
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

                                <p className="
                                    mt-3

                                    text-lg

                                    text-muted
                                ">

                                    {student.nivel}
                                    {" • "}
                                    {student.turno}

                                </p>

                            </div>

                        </div>

                        <div className="
                            flex
                            flex-wrap
                            gap-3
                        ">

                            <AppButton>

                                Editar aluno

                            </AppButton>

                            <AppButton
                                variant="danger"
                            >

                                Remover aluno

                            </AppButton>

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
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            }
                            label="Idade"
                            value={
                                `${student.idade} anos`
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

                    {student.observacoes && (

                        <div className="
                            mt-6

                            rounded-[2rem]

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

                                {
                                    student.observacoes
                                }

                            </p>

                        </div>

                    )}

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
            rounded-[2rem]

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