"use client"

import Image
    from "next/image"

import type {
    Student,
} from "@/types/student"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Badge }
    from "@/components/ui/badge"

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

    return (

        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >

            <DialogContent
                className="
          sm:max-w-xl
        "
            >

                <DialogHeader>

                    <DialogTitle>

                        Aluno

                    </DialogTitle>

                </DialogHeader>

                <div className="
          flex
          flex-col
          items-center
          gap-5
        ">

                    <div className="
            relative

            h-28
            w-28

            overflow-hidden

            rounded-full

            border
            border-border

            bg-input
          ">

                        {student.foto_url ? (

                            <Image
                                src={
                                    student.foto_url
                                }
                                alt={student.nome}
                                fill
                                sizes="112px"
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

                text-3xl
                font-bold

                text-muted
              ">

                                {
                                    student.nome[0]
                                }

                            </div>
                        )}

                    </div>

                    <div className="
            text-center
          ">

                        <h2 className="
              text-2xl
              font-semibold
            ">

                            {student.nome}

                        </h2>

                        <p className="
              text-muted
            ">

                            Turma {student.turma}

                        </p>

                    </div>

                    <div className="
            grid
            w-full
            gap-4

            md:grid-cols-2
          ">

                        <Info
                            label="Idade"
                            value={
                                `${student.idade} anos`
                            }
                        />

                        <Info
                            label="Turno"
                            value={student.turno}
                        />

                        <Info
                            label="Nível"
                            value={

                                <Badge
                                    variant="secondary"
                                >

                                    {student.nivel}

                                </Badge>
                            }
                        />

                        <Info
                            label="Responsável"
                            value={
                                student.responsavel_nome ||
                                "-"
                            }
                        />

                        <Info
                            label="Contato"
                            value={
                                student.responsavel_contato ||
                                "-"
                            }
                        />

                    </div>

                    {student.observacoes && (

                        <div className="
              w-full
              space-y-2
            ">

                            <p className="
                text-sm
                font-medium
              ">

                                Observações

                            </p>

                            <div className="
                rounded-2xl

                border
                border-border

                bg-input

                p-4

                text-sm

                text-muted
              ">

                                {
                                    student.observacoes
                                }

                            </div>

                        </div>
                    )}

                </div>

            </DialogContent>

        </Dialog>
    )
}

function Info({
    label,
    value,
}: {
    label: string
    value:
    React.ReactNode
}) {

    return (

        <div className="
      space-y-1
    ">

            <p className="
        text-sm

        text-muted
      ">

                {label}

            </p>

            <div className="
        font-medium
      ">

                {value}

            </div>

        </div>
    )
}