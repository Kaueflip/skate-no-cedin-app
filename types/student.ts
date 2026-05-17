export type Student = {
  id: string;

  nome: string;

  idade: number;

  turma: string;

  turno: "Manhã" | "Tarde";

  data_inicio: string;

  nivel: "Iniciante" | "Básico" | "Intermediário" | "Avançado";

  foto_url?: string | null;

  created_at: string;

  responsavel_nome?: string | null;

  responsavel_contato?: string | null;

  observacoes?: string | null;

  ativo: boolean;
};
