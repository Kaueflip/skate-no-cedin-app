"use client"

import Image
    from "next/image"

import {
    useState,
} from "react"

import {
    CalendarDays,
    Clock3,
    GraduationCap,
    Phone,
    Trash2,
    User,
    Pencil,
} from "lucide-react"

import type {
    Student,
} from "@/types/student"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    DeleteStudentDialog,
} from "@/components/students/delete-student-dialog"

type Props = {

    student:
    Student | null

    open: boolean

    onOpenChange: (
        open: boolean
    ) => void

    onDeleted: (
        studentId: string
    ) => void

    onEdit: (
        student: Student
    ) => void
}

export function StudentDetailsDialog({
    student,
    open,
    onOpenChange,
    onDeleted,
    onEdit,
}: Props) {

    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false)

    if (!student)
        return null

    return (

        <>

            <Dialog
                open={open}
                onOpenChange={
                    onOpenChange
                }
            >

                <DialogContent
                    className="
                        overflow-hidden

                        rounded-[2rem]

                        border-border

                        bg-card

                        p-0

                        shadow-2xl

                        sm:max-w-2xl
                    "
                >

                    <DialogHeader
                        className="
                            sr-only
                        "
                    >

                        <DialogTitle>

                            Detalhes do aluno

                        </DialogTitle>

                        <DialogDescription>

                            Informações completas do aluno

                        </DialogDescription>

                    </DialogHeader>

                    <div className="
                        relative

                        h-40

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
                        pb-6
                    ">

                        <div className="
                            -mt-16

                            flex
                            flex-col
                            gap-5

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        ">

                            <div className="
                                flex
                                items-end
                                gap-5
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

                                            text-4xl
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

                                    <h2 className="
                                        text-3xl
                                        font-black
                                        tracking-tight
                                    ">

                                        {student.nome}

                                    </h2>

                                    <p className="
                                        mt-2

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
                                gap-3
                            ">

                                <AppButton
                                    variant="secondary"
                                    onClick={() =>
                                        onEdit(
                                            student
                                        )
                                    }
                                >

                                    <Pencil
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Editar

                                </AppButton>

                                <AppButton
                                    variant="danger"
                                    onClick={() =>
                                        setDeleteOpen(
                                            true
                                        )
                                    }
                                >

                                    <Trash2
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    Remover

                                </AppButton>

                            </div>

                        </div>

                        <div className="
                            mt-8

                            grid
                            gap-4

                            sm:grid-cols-2
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

                            <InfoCard
                                icon={
                                    <GraduationCap
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

                        </div>

                        {student.observacoes && (

                            <div className="
                                mt-6

                                rounded-3xl

                                border
                                border-border

                                bg-background/80

                                p-5
                            ">

                                <p className="
                                    mb-2

                                    text-sm
                                    font-semibold

                                    text-muted
                                ">

                                    Observações

                                </p>

                                <p className="
                                    leading-relaxed
                                ">

                                    {
                                        student.observacoes
                                    }

                                </p>

                            </div>

                        )}

                    </div>

                </DialogContent>

            </Dialog>

            <DeleteStudentDialog
                student={student}
                open={deleteOpen}
                onOpenChange={
                    setDeleteOpen
                }
                onDeleted={
                    onDeleted
                }
            />

        </>
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
            rounded-3xl

            border
            border-border

            bg-background/70

            p-5
        ">

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className="
                    flex
                    h-10
                    w-10
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