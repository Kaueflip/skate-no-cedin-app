export type Student = {
  id: string;

  nome: string;

  data_nascimento: string | null;

  turma: string;

  turno: "Manhã" | "Tarde" | "Integral";

  data_inicio: string;

  nivel: "Iniciante" | "Básico" | "Intermediário" | "Avançado";

  foto_url?: string | null;

  created_at: string;

  responsavel_nome?: string | null;

  responsavel_contato?: string | null;

  observacoes?: string | null;

  ativo: boolean;
};
