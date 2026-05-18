"use client"

import Image from "next/image"

import { useState } from "react"

import type { Student }
    from "@/types/student"

import { toast }
    from "sonner"

import { Plus }
    from "lucide-react"

import { AppButton }
    from "@/components/ui/app-button"

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

function formatPhone(
    value: string
) {

    const numbers =
        value.replace(/\D/g, "")

    if (numbers.length <= 2) {

        return numbers
    }

    if (numbers.length <= 7) {

        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}


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

                <AppButton>

                    <Plus className="mr-2 h-4 w-4" />

                    Novo Aluno

                </AppButton>

            </DialogTrigger>

            <DialogContent
                className="
                      max-h-[90vh]
    overflow-y-auto

    border-white/40

    bg-[#eef1fb]

    shadow-2xl

    backdrop-blur-2xl

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

                <div className="
  grid
  gap-6

  py-4
">

                    <div className="
    flex
    flex-col
    gap-4

    sm:flex-row
    sm:items-center
  ">

                        <div className="
      flex
      h-24
      w-24
      shrink-0
      items-center
      justify-center

      overflow-hidden

      rounded-full

      border
      border-white/40

      bg-white

      shadow-sm
    ">

                            {foto ? (

                                <Image
                                    src={URL.createObjectURL(foto)}
                                    alt="Preview"
                                    width={96}
                                    height={96}
                                    className="
            h-full
            w-full
            object-cover
          "
                                />

                            ) : (

                                <span className="
          text-xs
          text-zinc-500
        ">

                                    Sem foto

                                </span>
                            )}

                        </div>

                        <div className="
      flex-1
      space-y-2
    ">

                            <Label>
                                Foto do aluno
                            </Label>

                            <Input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="
          h-11

          rounded-xl

          border-white/40

          bg-white
        "
                                onChange={(e) =>
                                    setFoto(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Nome Completo *
                        </Label>

                        <Input
                            value={newStudent.nome}
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,

                                    nome:
                                        e.target.value,
                                })
                            }
                            placeholder="Nome do aluno"
                            required
                            className="
        h-11

        rounded-xl

        border-white/40

        bg-white
      "
                        />

                    </div>

                    <div className="
    grid
    gap-4

    sm:grid-cols-2
  ">

                        <div className="space-y-2">

                            <Label>
                                Idade *
                            </Label>

                            <Input
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
                                required
                                min={1}
                                className="
          h-11

          rounded-xl

          border-white/40

          bg-white
        "
                            />

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Turma *
                            </Label>

                            <Input
                                value={newStudent.turma}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,

                                        turma:
                                            e.target.value,
                                    })
                                }
                                placeholder="6º A"
                                required
                                className="
          h-11

          rounded-xl

          border-white/40

          bg-white
        "
                            />

                        </div>

                    </div>

                    <div className="
    grid
    gap-4

    sm:grid-cols-2
  ">

                        <div className="space-y-2">

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

                                <SelectTrigger
                                    className="
            h-11

            rounded-xl

            border-white/40

            bg-white
          "
                                >

                                    <SelectValue />

                                </SelectTrigger>

                                <SelectContent className="
    rounded-2xl

    border
    border-white/40

    bg-[#eef1fb]/95

    shadow-xl

    backdrop-blur-2xl
  ">

                                    <SelectItem value="Manhã" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Manhã
                                    </SelectItem>

                                    <SelectItem value="Tarde" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Tarde
                                    </SelectItem>

                                </SelectContent >

                            </Select>

                        </div>

                        <div className="space-y-2">

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

                                <SelectTrigger
                                    className="
            h-11

            rounded-xl

            border-white/40

            bg-white
          "
                                >

                                    <SelectValue />

                                </SelectTrigger>

                                <SelectContent className="
    rounded-2xl

    border
    border-white/40

    bg-[#eef1fb]/95

    shadow-xl

    backdrop-blur-2xl
  ">

                                    <SelectItem value="Iniciante" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Iniciante
                                    </SelectItem>

                                    <SelectItem value="Básico" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Básico
                                    </SelectItem>

                                    <SelectItem value="Intermediário" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Intermediário
                                    </SelectItem>

                                    <SelectItem value="Avançado" className="
  rounded-xl

  focus:bg-white/80
  focus:text-zinc-900
">
                                        Avançado
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>

                    </div>

                    <div className="space-y-2">

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
                            className="
        h-11

        rounded-xl

        border-white/40

        bg-white
      "
                        />

                    </div>

                    <div className="space-y-2">

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
                                        formatPhone(
                                            e.target.value
                                        ),
                                })
                            }
                            placeholder="(47) 99999-9999"
                            inputMode="numeric"
                            maxLength={15}
                            className="
        h-11

        rounded-xl

        border-white/40

        bg-white
      "
                        />

                    </div>

                    <div className="space-y-2">

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
                            className="
        min-h-[120px]

        rounded-xl

        border-white/40

        bg-white

        resize-none
      "
                        />

                    </div>

                </div>

                <DialogFooter>

                    <AppButton
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

                    </AppButton>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}