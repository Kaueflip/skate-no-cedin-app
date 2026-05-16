"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import type { Student } from "@/types/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterShift, setFilterShift] = useState("all");

  const pageSize = 10;

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [page, searchTerm, filterShift]);

  const [stats, setStats] = useState({
    total: 0,
    morning: 0,
    afternoon: 0,
    beginners: 0,
    advanced: 0,
    averageAge: 0,
  });

  async function fetchStats() {
    const { data, error } = await supabase
      .from("alunos_stats")
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setStats({
      total: data.total || 0,

      morning: data.morning || 0,

      afternoon: data.afternoon || 0,

      beginners: data.beginners || 0,

      advanced: data.advanced || 0,

      averageAge: data.average_age || 0,
    });
  }

  async function fetchStudents() {
    setLoading(true);

    const from = (page - 1) * pageSize;

    const to = from + pageSize - 1;

    let query = supabase.from("alunos").select("*", {
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
  }

  async function addStudent(studentData: {
    name: string;
    age: string;
    schoolClass: string;
    shift: string;
    level: string;
    foto: File | null;
  }) {
    const alunoId = crypto.randomUUID();

    let fotoUrl = "";

    /*
    =========================
    UPLOAD FOTO
    =========================
    */

    if (studentData.foto) {
      const fileExt = studentData.foto.name.split(".").pop();

      const filePath = `${alunoId}/perfil.${fileExt}`;

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
    INSERT ALUNO
    =========================
    */

    const { error } = await supabase.from("alunos").insert([
      {
        id: alunoId,

        nome: studentData.name,

        idade: Number(studentData.age),

        turma: studentData.schoolClass,

        turno: studentData.shift,

        nivel: studentData.level,

        foto_url: fotoUrl,

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

    stats,
  };
}
