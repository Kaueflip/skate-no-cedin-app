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

  async function addStudent(studentData: Omit<Student, "id" | "created_at">) {
    const studentId = crypto.randomUUID();

    /*
    =========================
    INSERT STUDENT
    =========================
    */

    const { error } = await supabase.from("students").insert([
      {
        id: studentId,

        nome: studentData.nome,

        idade: studentData.idade,

        turma: studentData.turma,

        turno: studentData.turno,

        nivel: studentData.nivel,

        foto_url: studentData.foto_url || null,

        responsavel_nome: studentData.responsavel_nome || null,

        responsavel_contato: studentData.responsavel_contato || null,

        observacoes: studentData.observacoes || null,

        ativo: studentData.ativo,

        data_inicio: studentData.data_inicio,
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
