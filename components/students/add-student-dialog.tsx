"use client"

import Image from "next/image"

import { useState } from "react"

import type { Student }
    from "@/types/student"

import { toast }
    from "sonner"

import { Plus }
    from "lucide-react"

import { Button }
    from "@/components/ui/button"

import { Input }
    from "@/components/ui/input"

import { Label }
    from "@/components/ui/label"

import { Textarea }
    from "@/components/ui/textarea"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    onAddStudent: (
        student: Omit<
            Student,
            "id" |
            "created_at"
        >,

        foto: File | null
    ) => Promise<void>
}

export function AddStudentDialog({
    onAddStudent,
}: Props) {

    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [foto, setFoto] =
        useState<File | null>(
            null
        )

    const [newStudent, setNewStudent] =
        useState({
            nome: "",

            idade: "",

            turma: "",

            turno: "Manhã" as
                "Manhã" |
                "Tarde",

            nivel: "Iniciante" as
                Student["nivel"],

            responsavel_nome: "",

            responsavel_contato: "",

            observacoes: "",
        })

    async function handleSubmit() {

        /*
        =========================
        VALIDAÇÕES
        =========================
        */

        if (!newStudent.nome.trim()) {

            toast.error(
                "Informe o nome do aluno"
            )

            return
        }

        if (!newStudent.idade) {

            toast.error(
                "Informe a idade"
            )

            return
        }

        if (!newStudent.turma.trim()) {

            toast.error(
                "Informe a turma"
            )

            return
        }

        if (
            Number(newStudent.idade) <= 0
        ) {

            toast.error(
                "Idade inválida"
            )

            return
        }

        try {

            setLoading(true)

            await onAddStudent(
                {
                    nome:
                        newStudent.nome,

                    idade:
                        Number(
                            newStudent.idade
                        ),

                    turma:
                        newStudent.turma,

                    turno:
                        newStudent.turno,

                    nivel:
                        newStudent.nivel,

                    responsavel_nome:
                        newStudent
                            .responsavel_nome,

                    responsavel_contato:
                        newStudent
                            .responsavel_contato,

                    observacoes:
                        newStudent
                            .observacoes,

                    ativo: true,

                    foto_url: null,

                    data_inicio:
                        new Date()
                            .toISOString()
                            .split("T")[0],
                },

                foto
            )

            toast.success(
                "Aluno cadastrado"
            )

            resetForm()

            setOpen(false)

        } catch {

            toast.error(
                "Erro ao cadastrar aluno"
            )

        } finally {

            setLoading(false)
        }
    }

    function resetForm() {

        setFoto(null)

        setNewStudent({
            nome: "",

            idade: "",

            turma: "",

            turno: "Manhã",

            nivel: "Iniciante",

            responsavel_nome: "",

            responsavel_contato: "",

            observacoes: "",
        })
    }

    return (

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogTrigger asChild>

                <Button>

                    <Plus className="mr-2 h-4 w-4" />

                    Novo Aluno

                </Button>

            </DialogTrigger>

            <DialogContent
                className="
                   max-h-[90vh]
                   overflow-y-auto
                   sm:max-w-[520px]"
            >

                <DialogHeader>

                    <DialogTitle>

                        Adicionar Aluno

                    </DialogTitle>

                    <DialogDescription>

                        Preencha os dados
                        do novo aluno

                    </DialogDescription>

                </DialogHeader>

                <div className="grid gap-5 py-4">

                    <div className="flex items-center gap-4">

                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-muted">

                            {foto ? (

                                <Image
                                    src={URL.createObjectURL(foto)}
                                    alt="Preview"
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />

                            ) : (

                                <span className="text-xs text-muted-foreground">

                                    Sem foto

                                </span>
                            )}

                        </div>

                        <div className="flex-1 space-y-2">

                            <Label>
                                Foto do aluno
                            </Label>

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFoto(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="grid gap-2">

                        <Label>
                            Nome Completo *
                        </Label>

                        <Input
                            required
                            value={newStudent.nome}
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,

                                    nome:
                                        e.target.value,
                                })
                            }
                            placeholder="Nome do aluno"
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="grid gap-2">

                            <Label>
                                Idade *
                            </Label>

                            <Input
                                required
                                min={1}
                                type="number"
                                value={newStudent.idade}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,

                                        idade:
                                            e.target.value,
                                    })
                                }
                                placeholder="10"
                            />

                        </div>

                        <div className="grid gap-2">

                            <Label>
                                Turma *
                            </Label>

                            <Input
                                required
                                value={newStudent.turma}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,

                                        turma:
                                            e.target.value,
                                    })
                                }
                                placeholder="6º A"
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="grid gap-2">

                            <Label>
                                Turno
                            </Label>

                            <Select
                                value={newStudent.turno}
                                onValueChange={(value) =>
                                    setNewStudent({
                                        ...newStudent,

                                        turno:
                                            value as
                                            "Manhã" |
                                            "Tarde",
                                    })
                                }
                            >

                                <SelectTrigger>

                                    <SelectValue />

                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="Manhã">
                                        Manhã
                                    </SelectItem>

                                    <SelectItem value="Tarde">
                                        Tarde
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>

                        <div className="grid gap-2">

                            <Label>
                                Nível
                            </Label>

                            <Select
                                value={newStudent.nivel}
                                onValueChange={(value) =>
                                    setNewStudent({
                                        ...newStudent,

                                        nivel:
                                            value as
                                            Student["nivel"],
                                    })
                                }
                            >

                                <SelectTrigger>

                                    <SelectValue />

                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="Iniciante">
                                        Iniciante
                                    </SelectItem>

                                    <SelectItem value="Básico">
                                        Básico
                                    </SelectItem>

                                    <SelectItem value="Intermediário">
                                        Intermediário
                                    </SelectItem>

                                    <SelectItem value="Avançado">
                                        Avançado
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>

                    </div>

                    <div className="grid gap-2">

                        <Label>
                            Responsável
                        </Label>

                        <Input
                            value={
                                newStudent
                                    .responsavel_nome
                            }
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,

                                    responsavel_nome:
                                        e.target.value,
                                })
                            }
                            placeholder="Nome do responsável"
                        />

                    </div>

                    <div className="grid gap-2">

                        <Label>
                            Contato
                        </Label>

                        <Input
                            value={
                                newStudent
                                    .responsavel_contato
                            }
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,

                                    responsavel_contato:
                                        e.target.value,
                                })
                            }
                            placeholder="(47) 99999-9999"
                        />

                    </div>

                    <div className="grid gap-2">

                        <Label>
                            Observações
                        </Label>

                        <Textarea
                            value={
                                newStudent
                                    .observacoes
                            }
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,

                                    observacoes:
                                        e.target.value,
                                })
                            }
                            placeholder="Observações adicionais"
                        />

                    </div>

                </div>

                <DialogFooter>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                                        h-11
                                        w-full
                                        text-base
                                        font-medium
                                    "
                    >

                        {loading
                            ? "Salvando..."
                            : "Cadastrar Aluno"}

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}