export type Student = {
  id: string
  nome: string
  idade: number
  turma: string

  turno: "Manhã" | "Tarde"

  data_inicio: string

  nivel:
    | "Iniciante"
    | "Básico"
    | "Intermediário"
    | "Avançado"

  foto_url?: string

  created_at: string
}