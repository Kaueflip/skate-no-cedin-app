"use client"

import { useState }
    from "react"

import type { Student }
    from "@/types/student"

import { toast }
    from "sonner"

import { Button }
    from "@/components/ui/button"

import { Input }
    from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { Textarea }
    from "@/components/ui/textarea"

import { Plus }
    from "lucide-react"

type Props = {
    onAddStudent: (
        student: Omit<
            Student,
            "id" |
            "created_at"
        >
    ) => Promise<void>
}

export function AddStudentDialog({
    onAddStudent,
}: Props) {

    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [nome, setNome] =
        useState("")

    const [idade, setIdade] =
        useState("")

    const [turma, setTurma] =
        useState("")

    const [
        responsavelNome,
        setResponsavelNome,
    ] = useState("")

    const [
        responsavelContato,
        setResponsavelContato,
    ] = useState("")

    const [
        observacoes,
        setObservacoes,
    ] = useState("")

    const [turno, setTurno] =
        useState<
            "Manhã" |
            "Tarde"
        >("Manhã")

    const [nivel, setNivel] =
        useState<
            Student["nivel"]
        >("Iniciante")

    async function handleSubmit() {

        try {

            setLoading(true)

            await onAddStudent({
                nome,

                idade:
                    Number(idade),

                turma,

                turno,

                nivel,

                data_inicio:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                foto_url: null,

                responsavel_nome:
                    responsavelNome,

                responsavel_contato:
                    responsavelContato,

                observacoes,

                ativo: true,
            })

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

        setNome("")
        setIdade("")
        setTurma("")
        setResponsavelNome("")
        setResponsavelContato("")
        setObservacoes("")
        setTurno("Manhã")
        setNivel("Iniciante")
    }

    return (

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogTrigger asChild>

                <Button>

                    <Plus />

                    Novo Aluno

                </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                    <DialogTitle>

                        Novo Aluno

                    </DialogTitle>

                    <DialogDescription>

                        Cadastre um novo aluno
                        no sistema

                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-4">

                    <Input
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) =>
                            setNome(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        type="number"
                        placeholder="Idade"
                        value={idade}
                        onChange={(e) =>
                            setIdade(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Turma"
                        value={turma}
                        onChange={(e) =>
                            setTurma(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Responsável"
                        value={responsavelNome}
                        onChange={(e) =>
                            setResponsavelNome(
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Contato"
                        value={responsavelContato}
                        onChange={(e) =>
                            setResponsavelContato(
                                e.target.value
                            )
                        }
                    />

                    <Textarea
                        placeholder="Observações"
                        value={observacoes}
                        onChange={(e) =>
                            setObservacoes(
                                e.target.value
                            )
                        }
                    />

                    <Select
                        value={turno}
                        onValueChange={(
                            value
                        ) =>
                            setTurno(
                                value as
                                "Manhã" |
                                "Tarde"
                            )
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

                    <Select
                        value={nivel}
                        onValueChange={(
                            value
                        ) =>
                            setNivel(
                                value as
                                Student["nivel"]
                            )
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

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >

                        {loading
                            ? "Salvando..."
                            : "Cadastrar"}

                    </Button>

                </div>

            </DialogContent>

        </Dialog>
    )
}