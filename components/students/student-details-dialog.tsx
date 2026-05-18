"use client"

import Image
    from "next/image"

import {
    Phone,
    User,
    Calendar,
    GraduationCap,
    Clock3,
    Activity,
} from "lucide-react"

import type {
    Student,
} from "@/types/student"

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

import { Badge }
    from "@/components/ui/badge"

import {
    DialogTitle,
} from "@/components/ui/dialog"

type Props = {

    student:
    Student | null

    open: boolean

    onOpenChange:
    (open: boolean) => void
}

export function StudentDetailsDialog({
    student,
    open,
    onOpenChange,
}: Props) {

    if (!student)
        return null

    const attendance = 92

    return (

        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >

            <DialogContent
                className="
    max-h-[92vh]

    overflow-y-auto

    p-0

    sm:max-w-2xl
  "
            >

                <DialogTitle
                    className="sr-only"
                >

                    Detalhes do aluno

                </DialogTitle>

                <div className="
          relative

          overflow-hidden
        ">

                    <div className="
            absolute
            inset-0

            bg-gradient-to-b
            from-primary/10
            to-transparent
          " />

                    <div className="
            relative

            flex
            flex-col
            items-center

            px-6
            pt-8
            pb-6

            text-center
          ">

                        <div className="
              relative

              h-35
              w-35

              overflow-hidden

              rounded-full

              border-4
              border-background

              bg-input

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
                                    sizes="152px"
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
                  font-bold

                  text-muted
                ">

                                    {
                                        student.nome?.[0]
                                    }

                                </div>
                            )}

                        </div>

                        <div className="
              mt-5
              space-y-2
            ">

                            <h2 className="
                text-2xl
                font-semibold

                tracking-tight
              ">

                                {student.nome}

                            </h2>

                            <div className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
              ">

                                <Badge
                                    variant="secondary"
                                >

                                    {student.nivel}

                                </Badge>

                                <Badge
                                    variant="outline"
                                >

                                    Turma {student.turma}

                                </Badge>

                            </div>

                        </div>

                        <div className="
              mt-6

              flex
              w-full
              max-w-sm
              items-center
              gap-3
            ">

                            <div className="
                flex-1

                rounded-2xl

                border
                border-border

                bg-card/60

                p-4

                backdrop-blur
              ">

                                <div className="
                  flex
                  items-center
                  justify-between
                ">

                                    <div className="
                    text-left
                  ">

                                        <p className="
                      text-xs

                      text-muted
                    ">

                                            Frequência

                                        </p>

                                        <p className="
                      mt-1

                      text-2xl
                      font-semibold
                    ">

                                            {attendance}%

                                        </p>

                                    </div>

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

                                        <Activity
                                            className="
                        h-5
                        w-5
                      "
                                        />

                                    </div>

                                </div>

                                <div className="
                  mt-4

                  h-2

                  overflow-hidden

                  rounded-full

                  bg-border
                ">

                                    <div
                                        className="
                      h-full

                      rounded-full

                      bg-primary
                    "
                                        style={{
                                            width:
                                                `${attendance}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="
          px-6
          pb-6
        ">

                    <div className="
            grid
            gap-4

            sm:grid-cols-2
          ">

                        <InfoCard
                            icon={
                                <Calendar
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
                                <Clock3
                                    className="
                    h-5
                    w-5
                  "
                                />
                            }
                            label="Turno"
                            value={student.turno}
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
                            label="Responsável"
                            value={
                                student.responsavel_nome ||
                                "-"
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
                                "-"
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
                            label="Data de início"
                            value={
                                student.data_inicio
                                    ? new Date(
                                        student.data_inicio
                                    ).toLocaleDateString(
                                        "pt-BR"
                                    )
                                    : "-"
                            }
                            className="
                sm:col-span-2
              "
                        />

                    </div>

                    {student.observacoes && (

                        <div className="
              mt-6
            ">

                            <div className="
                rounded-3xl

                border
                border-border

                bg-card/60

                p-5

                backdrop-blur
              ">

                                <p className="
                  text-sm
                  font-medium
                ">

                                    Observações

                                </p>

                                <p className="
                  mt-3

                  whitespace-pre-line

                  text-sm
                  leading-relaxed

                  text-muted
                ">

                                    {
                                        student.observacoes
                                    }

                                </p>

                            </div>

                        </div>
                    )}

                </div>

            </DialogContent>

        </Dialog>
    )
}

type InfoCardProps = {

    icon:
    React.ReactNode

    label: string

    value:
    React.ReactNode

    className?: string
}

function InfoCard({
    icon,
    label,
    value,
    className,
}: InfoCardProps) {

    return (

        <div className={`
      rounded-3xl

      border
      border-border

      bg-card/60

      p-5

      backdrop-blur

      ${className || ""}
    `}>

            <div className="
        flex
        items-start
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

                <div className="
          min-w-0

          flex-1
        ">

                    <p className="
            text-sm

            text-muted
          ">

                        {label}

                    </p>

                    <div className="
            mt-1

            wrap-break-word

            font-medium
          ">

                        {value}

                    </div>

                </div>

            </div>

        </div>
    )
}