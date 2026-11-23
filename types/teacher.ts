export type Teacher = {
  id: string;
  nome: string;
  contato: string | null;
  foto_url: string | null;
  funcao: string | null;
  data_inicio: string | null;
  ativo: boolean;
  created_at: string;
};

export type TeacherFormData = {
  nome: string;
  contato: string;
  foto_url: string;
  funcao: string;
  data_inicio: string;
};
