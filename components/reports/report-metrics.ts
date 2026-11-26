export type RosterStudent = {
    id: string
    turma: string
    turno: string
    genero: string | null
    data_nascimento: string | null
}

export type ReportSession = {
    id: string
    class_date: string
    turno: string
    aula_numero: number
    status: string
}

export type ReportTeacher = {
    id: string
    nome: string
    funcao: string | null
    ativo: boolean
}

export type ReportAssignment = {
    id: string
    class_session_id: string
    teacher_id: string
}

// Paginação explícita: evita truncar relatórios no limite de linhas do PostgREST.
export async function readAll<T>(
    fetchPage: (from: number, to: number) => PromiseLike<{
        data: T[] | null
        error: unknown
    }>,
    label: string
): Promise<T[]> {
    const rows: T[] = []
    const size = 500
    for (let from = 0; ; ) {
        const { data, error } = await fetchPage(from, from + size - 1)
        if (error) {
            console.error(`Erro ao carregar ${label}:`, error)
            throw new Error(`Não foi possível carregar ${label}.`)
        }
        if (!data?.length) return rows
        rows.push(...data)
        from += data.length
    }
}

export function ageOnDate(birth: string | null, today: string): number | null {
    if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth > today) return null
    const date = new Date(`${birth}T00:00:00Z`)
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birth) return null
    const age = Number(today.slice(0, 4)) - Number(birth.slice(0, 4))
        - (today.slice(5) < birth.slice(5) ? 1 : 0)
    return age >= 0 ? age : null
}

export function ageStats(students: RosterStudent[], today: string) {
    const groups = [
        { label: "Até 5 anos", count: 0 },
        { label: "6 a 8 anos", count: 0 },
        { label: "9 a 11 anos", count: 0 },
        { label: "12 a 14 anos", count: 0 },
        { label: "15 anos ou mais", count: 0 },
        { label: "Não informada / inválida", count: 0 },
    ]
    const ages: number[] = []
    for (const student of students) {
        const age = ageOnDate(student.data_nascimento, today)
        if (age === null) { groups[5].count++; continue }
        ages.push(age)
        const index = age <= 5 ? 0 : age <= 8 ? 1 : age <= 11 ? 2 : age <= 14 ? 3 : 4
        groups[index].count++
    }
    return {
        groups,
        total: students.length,
        known: ages.length,
        average: ages.length ? ages.reduce((sum, age) => sum + age, 0) / ages.length : null,
        youngest: ages.length ? ages.reduce((a, b) => Math.min(a, b)) : null,
        oldest: ages.length ? ages.reduce((a, b) => Math.max(a, b)) : null,
    }
}

export function genderCounts(students: RosterStudent[]) {
    let male = 0
    let female = 0
    for (const student of students) {
        const value = student.genero?.trim().toLowerCase()
        if (value === "m" || value === "masculino") male++
        else if (value === "f" || value === "feminino") female++
    }
    return { male, female, unknown: students.length - male - female }
}

// Duração prevista de cada sessão, não tempo de ponto ou tempo individual de aluno.
export function sessionMinutes(session: ReportSession): number | null {
    if ((session.turno === "Manhã" || session.turno === "Tarde") &&
        (session.aula_numero === 1 || session.aula_numero === 2)) return 105
    return null
}

export function summarizeSessions(sessions: ReportSession[]) {
    const realized = sessions.filter((s) => s.status === "realizada")
    const canceled = sessions.filter((s) => s.status === "cancelada")
    const minutes = (rows: ReportSession[]) => rows.reduce((sum, s) => sum + (sessionMinutes(s) ?? 0), 0)
    return {
        total: sessions.length,
        realized: realized.length,
        canceled: canceled.length,
        realizedMinutes: minutes(realized),
        canceledMinutes: minutes(canceled),
        unknownRealized: realized.filter((s) => sessionMinutes(s) === null).length,
        unknownCanceled: canceled.filter((s) => sessionMinutes(s) === null).length,
        days: new Set(realized.map((s) => s.class_date)).size,
        lastRealized: realized.reduce<string | null>((last, s) => !last || s.class_date > last ? s.class_date : last, null),
    }
}

export function teachingStats(sessions: ReportSession[], teachers: ReportTeacher[], assignments: ReportAssignment[]) {
    const sessionById = new Map(sessions.map((s) => [s.id, s]))
    const teacherById = new Map(teachers.map((t) => [t.id, t]))
    const assignedBySession = new Map<string, Set<string>>()
    const sessionsByTeacher = new Map<string, ReportSession[]>()
    let unmatched = 0
    for (const assignment of assignments) {
        const session = sessionById.get(assignment.class_session_id)
        if (!session || !teacherById.has(assignment.teacher_id)) { unmatched++; continue }
        const assigned = assignedBySession.get(session.id) ?? new Set<string>()
        if (assigned.has(assignment.teacher_id)) continue
        assigned.add(assignment.teacher_id)
        assignedBySession.set(session.id, assigned)
        const linked = sessionsByTeacher.get(assignment.teacher_id) ?? []
        linked.push(session)
        sessionsByTeacher.set(assignment.teacher_id, linked)
    }
    const byTeacher = teachers.map((teacher) => {
        const linked = sessionsByTeacher.get(teacher.id) ?? []
        return {
            ...teacher,
            ...summarizeSessions(linked),
            shifts: ["Manhã", "Tarde", "Noite"].map((label) => ({ label, ...summarizeSessions(linked.filter((s) => s.turno === label)) })),
        }
    }).filter((t) => t.ativo || t.total > 0)
        .sort((a, b) => b.realizedMinutes - a.realizedMinutes || b.realized - a.realized || a.nome.localeCompare(b.nome, "pt-BR"))
    const realized = sessions.filter((s) => s.status === "realizada")
    const covered = realized.filter((s) => (assignedBySession.get(s.id)?.size ?? 0) > 0).length
    return {
        byTeacher,
        participating: byTeacher.filter((t) => t.realized > 0).length,
        activeWithoutRealized: byTeacher.filter((t) => t.ativo && t.realized === 0).length,
        linked: covered,
        unlinked: realized.length - covered,
        coTeaching: realized.filter((s) => (assignedBySession.get(s.id)?.size ?? 0) > 1).length,
        totalTeacherMinutes: byTeacher.reduce((sum, t) => sum + t.realizedMinutes, 0),
        unknownTeacherAssignments: byTeacher.reduce((sum, t) => sum + t.unknownRealized, 0),
        unmatched,
    }
}

export function formatHours(minutes: number) {
    return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, "0")}`
}
