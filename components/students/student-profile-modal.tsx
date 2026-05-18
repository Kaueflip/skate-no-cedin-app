"use client"

import Image from "next/image"

import type { Student }
    from "@/types/student"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Badge }
    from "@/components/ui/badge"

type Props = {
    student: Student | null

    open: boolean

    onClose: () => void
}

export function StudentProfileModal({
    student,
    open,
    onClose,
}: Props) {

    if (!student)
        return null

    function getInitials(
        nome: string
    ) {

        return nome
            .split(" ")
            .map((word) =>
                word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }

    function getLevelStyles(
        nivel: Student["nivel"]
    ) {

        switch (nivel) {

            case "Iniciante":

                return `
          bg-zinc-900
          text-white

          hover:bg-zinc-800
        `

            case "Básico":

                return `
          border-transparent

          bg-zinc-200

          text-zinc-900

          hover:bg-zinc-200
        `

            case "Intermediário":

                return `
          border-transparent

          bg-zinc-300

          text-zinc-900

          hover:bg-zinc-300
        `

            case "Avançado":

                return `
          border-transparent

          bg-zinc-800

          text-white

          hover:bg-zinc-700
        `

            default:

                return `
          bg-zinc-200
          text-zinc-900
        `
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent
                className="
          max-h-[90vh]
          overflow-y-auto

          rounded-[2rem]

          border
          border-white/40

          bg-[#eef1fb]

          shadow-2xl

          backdrop-blur-2xl

          sm:max-w-[720px]
        "
            >

                <DialogHeader>

                    <DialogTitle
                        className="
              text-3xl
              font-black
              tracking-tight

              text-zinc-900
            "
                    >

                        Perfil do Aluno

                    </DialogTitle>

                    <DialogDescription
                        className="
              text-zinc-500
            "
                    >

                        Informações completas do aluno

                    </DialogDescription>

                </DialogHeader>

                <div className="
          mt-6
          flex
          flex-col
          gap-8
        ">

                    <div className="
            flex
            flex-col
            gap-6

            sm:flex-row
            sm:items-center
          ">

                        <Avatar
                            className="
                h-28
                w-28

                border
                border-white/40

                shadow-sm
              "
                        >

                            <AvatarImage
                                src={
                                    student.foto_url ||
                                    ""
                                }
                            />

                            <AvatarFallback
                                className="
                  bg-white

                  text-2xl
                  font-bold

                  text-zinc-700
                "
                            >

                                {getInitials(
                                    student.nome
                                )}

                            </AvatarFallback>

                        </Avatar>

                        <div className="
              flex-1
            ">

                            <h2 className="
                text-3xl
                font-black
                tracking-tight

                text-zinc-900
              ">

                                {student.nome}

                            </h2>

                            <div className="
                mt-4
                flex
                flex-wrap
                gap-3
              ">

                                <Badge
                                    className={`
                    rounded-xl

                    px-4
                    py-1

                    ${getLevelStyles(
                                        student.nivel
                                    )}
                  `}
                                >

                                    {student.nivel}

                                </Badge>

                                <Badge
                                    className="
                    rounded-xl

                    border-transparent

                    bg-white

                    px-4
                    py-1

                    text-zinc-700

                    hover:bg-white
                  "
                                >

                                    {student.turno}

                                </Badge>

                            </div>

                        </div>

                    </div>

                    <div className="
            grid
            gap-4

            sm:grid-cols-2
          ">

                        <InfoCard
                            title="Idade"
                            value={`${student.idade} anos`}
                        />

                        <InfoCard
                            title="Turma"
                            value={student.turma}
                        />

                        <InfoCard
                            title="Data de Início"
                            value={new Date(
                                student.data_inicio
                            ).toLocaleDateString(
                                "pt-BR"
                            )}
                        />

                        <InfoCard
                            title="Contato"
                            value={
                                student.responsavel_contato ||
                                "Não informado"
                            }
                        />

                    </div>

                    <div className="
            rounded-[1.5rem]

            border
            border-white/40

            bg-white/60

            p-6

            backdrop-blur-xl
          ">

                        <h3 className="
              text-lg
              font-bold

              text-zinc-900
            ">

                            Responsável

                        </h3>

                        <p className="
              mt-2

              text-zinc-600
            ">

                            {student.responsavel_nome ||
                                "Não informado"}
                        </p>

                    </div>

                    <div className="
            rounded-[1.5rem]

            border
            border-white/40

            bg-white/60

            p-6

            backdrop-blur-xl
          ">

                        <h3 className="
              text-lg
              font-bold

              text-zinc-900
            ">

                            Observações

                        </h3>

                        <p className="
              mt-2

              whitespace-pre-line

              text-zinc-600
            ">

                            {student.observacoes ||
                                "Nenhuma observação cadastrada."}
                        </p>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    )
}

type InfoCardProps = {
    title: string

    value: string
}

function InfoCard({
    title,
    value,
}: InfoCardProps) {

    return (

        <div
            className="
        rounded-[1.5rem]

        border
        border-white/40

        bg-white/60

        p-5

        backdrop-blur-xl
      "
        >

            <p className="
        text-sm
        text-zinc-500
      ">

                {title}

            </p>

            <h3 className="
        mt-2

        text-xl
        font-bold

        text-zinc-900
      ">

                {value}

            </h3>

        </div>
    )
}