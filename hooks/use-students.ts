"use client";

import { useEffect, useState, useCallback } from "react";

import { createClient } from "@/lib/supabase-browser";

import type { Student } from "@/types/student";

const supabase = createClient();

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterShift, setFilterShift] = useState("all");

  const pageSize = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);

    const from = (page - 1) * pageSize;

    const to = from + pageSize - 1;

    let query = supabase.from("students").select("*", {
      count: "exact",
    });

    /*
      =========================
      BUSCA POR NOME
      =========================
      */

    if (searchTerm) {
      query = query.ilike("nome", `%${searchTerm}%`);
    }

    /*
      =========================
      FILTRO TURNO
      =========================
      */

    if (filterShift !== "all") {
      query = query.eq("turno", filterShift);
    }

    /*
      =========================
      EXECUTAR QUERY
      =========================
      */

    const { data, error, count } = await query
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    setStudents(data || []);

    setTotal(count || 0);

    setLoading(false);
  }, [page, searchTerm, filterShift]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!mounted) return;

      await fetchStudents();
    }

    load();

    return () => {
      mounted = false;
    };
  }, [fetchStudents]);

  async function addStudent(studentData: {
    name: string;

    age: string;

    schoolClass: string;

    shift: string;

    level: string;

    responsavelNome?: string;

    responsavelContato?: string;

    observacoes?: string;

    foto: File | null;
  }) {
    const studentId = crypto.randomUUID();

    let fotoUrl = "";

    /*
    =========================
    UPLOAD FOTO
    =========================
    */

    if (studentData.foto) {
      const fileExt = studentData.foto.name.split(".").pop();

      const filePath = `${studentId}/perfil.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("alunos")
        .upload(filePath, studentData.foto, {
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);

        return;
      }

      const { data } = supabase.storage.from("alunos").getPublicUrl(filePath);

      fotoUrl = data.publicUrl;
    }

    /*
    =========================
    INSERT STUDENT
    =========================
    */

    const { error } = await supabase.from("students").insert([
      {
        id: studentId,

        nome: studentData.name,

        idade: Number(studentData.age),

        turma: studentData.schoolClass,

        turno: studentData.shift,

        nivel: studentData.level,

        foto_url: fotoUrl,

        responsavel_nome: studentData.responsavelNome || null,

        responsavel_contato: studentData.responsavelContato || null,

        observacoes: studentData.observacoes || null,

        ativo: true,

        data_inicio: new Date().toISOString().split("T")[0],
      },
    ]);

    if (error) {
      console.error(error);

      return;
    }

    await fetchStudents();
  }

  return {
    students,

    loading,

    fetchStudents,

    addStudent,

    page,

    setPage,

    pageSize,

    total,

    searchTerm,

    setSearchTerm,

    filterShift,

    setFilterShift,
  };
}
