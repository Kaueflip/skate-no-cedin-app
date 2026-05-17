"use client"

import type { Student }
    from "@/types/student"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Badge }
    from "@/components/ui/badge"

import {
    Calendar,
    GraduationCap,
    Users,
    Cake,
} from "lucide-react"

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

    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                    <DialogTitle>
                        Perfil do Aluno
                    </DialogTitle>

                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">

                    <Avatar className="h-24 w-24">

                        <AvatarImage
                            src={
                                student.foto_url ||
                                ""
                            }
                        />

                        <AvatarFallback className="text-2xl">

                            {getInitials(
                                student.nome
                            )}

                        </AvatarFallback>

                    </Avatar>

                    <div className="text-center">

                        <h2 className="text-2xl font-bold">

                            {student.nome}

                        </h2>

                        <p className="text-muted-foreground">

                            {student.turma}

                        </p>

                    </div>

                    <Badge>

                        {student.nivel}

                    </Badge>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border p-4">

                        <div className="flex items-center gap-2">

                            <Cake className="h-4 w-4 text-primary" />

                            <span className="text-sm text-muted-foreground">
                                Idade
                            </span>

                        </div>

                        <p className="mt-2 text-lg font-semibold">

                            {student.idade} anos

                        </p>

                    </div>

                    <div className="rounded-xl border p-4">

                        <div className="flex items-center gap-2">

                            <Users className="h-4 w-4 text-primary" />

                            <span className="text-sm text-muted-foreground">
                                Turno
                            </span>

                        </div>

                        <p className="mt-2 text-lg font-semibold">

                            {student.turno}

                        </p>

                    </div>

                    <div className="rounded-xl border p-4">

                        <div className="flex items-center gap-2">

                            <GraduationCap className="h-4 w-4 text-primary" />

                            <span className="text-sm text-muted-foreground">
                                Nível
                            </span>

                        </div>

                        <p className="mt-2 text-lg font-semibold">

                            {student.nivel}

                        </p>

                    </div>

                    <div className="rounded-xl border p-4">

                        <div className="flex items-center gap-2">

                            <Calendar className="h-4 w-4 text-primary" />

                            <span className="text-sm text-muted-foreground">
                                Início
                            </span>

                        </div>

                        <p className="mt-2 text-lg font-semibold">

                            {new Date(
                                student.data_inicio
                            ).toLocaleDateString(
                                "pt-BR"
                            )}

                        </p>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    )
}