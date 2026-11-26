import { ageOnDate, ageStats, genderCounts, summarizeSessions, teachingStats, formatHours, type RosterStudent, type ReportSession, type ReportTeacher, type ReportAssignment } from "./report-metrics"

export type AttendanceRow = { id: string; student_id: string; class_date: string; present: boolean }
export type ReportStudent = RosterStudent & { ativo: boolean; created_at: string | null; school_class_id: string | null }
export type Cell = string | number | null
export type ReportTable = { title: string; headers: string[]; rows: Cell[][]; note?: string }
export const ageLabels = ["Até 5 anos", "6 a 8 anos", "9 a 11 anos", "12 a 14 anos", "15 anos ou mais", "Não informada / inválida"]
export const genderLabels = ["Masculino", "Feminino", "Não informado / outro"]
export function genderLabel(value: string | null) {
    const v = value?.trim().toLowerCase()
    return v === "m" || v === "masculino" ? genderLabels[0] : v === "f" || v === "feminino" ? genderLabels[1] : genderLabels[2]
}
export function ageLabel(age: number | null) {
    return ageLabels[age === null ? 5 : age <= 5 ? 0 : age <= 8 ? 1 : age <= 11 ? 2 : age <= 14 ? 3 : 4]
}
export const rate = (n: number, d: number) => d ? Math.round(n / d * 1000) / 10 : null
export const displayRate = (v: number | null) => v === null ? "—" : `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
export const displayDate = (v: string | null) => v ? v.split("-").reverse().join("/") : "—"
const dayMs = 86400000
const stamp = (v: string) => Date.parse(`${v}T00:00:00Z`)
const iso = (v: number) => new Date(v).toISOString().slice(0, 10)
export function comparisonPeriod(start: string, end: string, today: string) {
    const startMs = stamp(start)
    const effectiveEnd = Math.min(stamp(end), stamp(today) + dayMs)
    const days = Math.max(0, Math.round((effectiveEnd - startMs) / dayMs))
    if (!days) return null
    const priorStart = startMs - days * dayMs
    if (priorStart < stamp("0001-01-01")) return null
    return { days, currentStart: start, currentEnd: iso(effectiveEnd), previousStart: iso(priorStart), previousEnd: start }
}
export function continuity(rows: AttendanceRow[], previous: AttendanceRow[], period: ReturnType<typeof comparisonPeriod>) {
    const current = new Set(rows.filter(r => period && r.present && r.class_date >= period.currentStart && r.class_date < period.currentEnd).map(r => r.student_id))
    const base = new Set(previous.filter(r => period && r.present && r.class_date >= period.previousStart && r.class_date < period.previousEnd).map(r => r.student_id))
    const returned = [...base].filter(id => current.has(id)).length
    return { previous: base.size, current: current.size, returned, notReturned: base.size - returned, newToComparison: current.size - returned, rate: rate(returned, base.size) }
}
function attendanceGroups(rows: AttendanceRow[], labels: string[], key: (row: AttendanceRow) => string) {
    const result = new Map(labels.map(label => [label, { label, present: 0, absent: 0 }]))
    for (const row of rows) {
        const label = key(row)
        const group = result.get(label) ?? { label, present: 0, absent: 0 }
        if (row.present) group.present++
        else group.absent++
        result.set(label, group)
    }
    return [...result.values()].map(g => ({ ...g, total: g.present + g.absent, rate: rate(g.present, g.present + g.absent) }))
}
export function analytics(students: ReportStudent[], rows: AttendanceRow[], previous: AttendanceRow[], sessions: ReportSession[], start: string, end: string, today: string) {
    const studentMap = new Map(students.map(s => [s.id, s]))
    const active = students.filter(s => s.ativo)
    const classes = new Map<string, { label: string; count: number; male: number; female: number; unknown: number }>()
    for (const s of active) {
        const label = s.turma || "Sem turma"
        const item = classes.get(label) ?? { label, count: 0, male: 0, female: 0, unknown: 0 }
        item.count++
        const gender = genderLabel(s.genero)
        if (gender === genderLabels[0]) item.male++
        else if (gender === genderLabels[1]) item.female++
        else item.unknown++
        classes.set(label, item)
    }
    const classDistribution = [...classes.values()].sort((a,b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR", {numeric:true}))
        .map(g => ({ ...g, rate: rate(g.count, active.length) }))
    const byGender = attendanceGroups(rows, genderLabels, r => genderLabel(studentMap.get(r.student_id)?.genero ?? null))
    const byAge = attendanceGroups(rows, ageLabels, r => ageLabel(ageOnDate(studentMap.get(r.student_id)?.data_nascimento ?? null, r.class_date)))
    const byClass = attendanceGroups(rows, classDistribution.map(g => g.label), r => studentMap.get(r.student_id)?.turma || "Sem turma")
        .sort((a,b) => a.label.localeCompare(b.label, "pt-BR", {numeric:true}))
    const period = comparisonPeriod(start, end, today)
    // Diariamente para intervalos curtos; mensalmente para intervalos maiores.
    const effectiveEnd = Math.min(stamp(end), stamp(today) + dayMs)
    const days = Math.max(0, (effectiveEnd - stamp(start)) / dayMs)
    const daily = days <= 31
    const bucket = (date: string) => daily ? date : date.slice(0,7)
    const trendMap = new Map<string, { key: string; present: number; absent: number; realized: number; canceled: number; minutes: number; unknown: number; participants: Set<string> }>()
    function get(key: string) {
        let value = trendMap.get(key)
        if (!value) { value = { key, present: 0, absent: 0, realized: 0, canceled: 0, minutes: 0, unknown: 0, participants: new Set() }; trendMap.set(key, value) }
        return value
    }
    // Preenche lacunas de calendário. Não inventa registros de faltas.
    if (days > 0 && days <= 366 * 5) {
        if (daily) for (let d = stamp(start); d < effectiveEnd; d += dayMs) get(iso(d))
        else {
            let d = new Date(`${start.slice(0,7)}-01T00:00:00Z`)
            while (d.getTime() < effectiveEnd) {
                get(d.toISOString().slice(0,7)); d.setUTCMonth(d.getUTCMonth() + 1)
            }
        }
    }
    for (const r of rows) {
        const g = get(bucket(r.class_date))
        if (r.present) { g.present++; g.participants.add(r.student_id) } else g.absent++
    }
    for (const s of sessions) {
        const g = get(bucket(s.class_date))
        const m = summarizeSessions([s]); g.realized += m.realized; g.canceled += m.canceled; g.minutes += m.realizedMinutes; g.unknown += m.unknownRealized
    }
    const trend = [...trendMap.values()].sort((a,b) => a.key.localeCompare(b.key)).map(({ participants, ...g }) => ({...g, participants: participants.size, rate: rate(g.present, g.present + g.absent) }))
    return { classDistribution, byGender, byAge, byClass, period, retention: continuity(rows, previous, period), daily, trend }
}
export type Analytics = ReturnType<typeof analytics>
export function buildTables({ active, a, sessions, teachers, assignments, today, newStudents, presences, absences }: { active: ReportStudent[]; a: Analytics; sessions: ReportSession[]; teachers: ReportTeacher[]; assignments: ReportAssignment[]; today: string; newStudents: number; presences: number; absences: number }): ReportTable[] {
    const s = summarizeSessions(sessions), t = teachingStats(sessions, teachers, assignments), age = ageStats(active, today), gender = genderCounts(active)
    const attendanceTable = (title: string, groups: Analytics["byGender"], note: string): ReportTable => ({title, headers:["Grupo", "Presenças", "Faltas", "Registros", "Frequência (%)"], rows: groups.map(g => [g.label,g.present,g.absent,g.total,g.rate]), note})
    const h = (minutes: number, unknown: number) => minutes || !unknown ? formatHours(minutes) : "—"
    const sessionRow = (label: string, list: ReportSession[]): Cell[] => { const x = summarizeSessions(list); return [label,x.realized,x.canceled,x.days,h(x.realizedMinutes,x.unknownRealized),h(x.canceledMinutes,x.unknownCanceled),x.unknownRealized,x.unknownCanceled] }
    const sessionHeaders = ["Grupo","Realizadas","Canceladas","Dias ativos","Horas realizadas conhecidas","Horas canceladas conhecidas","Realizadas sem duração","Canceladas sem duração"]
    const p = a.period
    return [
        {title:"Indicadores gerais", headers:["Indicador","Valor"], rows:[["Alunos ativos",active.length],["Novos cadastros ativos",newStudents],["Professores ativos",teachers.filter(t=>t.ativo).length],["Presenças",presences],["Faltas",absences],["Frequência (%)",rate(presences,presences+absences)],["Aulas realizadas",s.realized],["Aulas canceladas",s.canceled]],note:"Alunos ativos e professores ativos são do cadastro atual. Novos cadastros: alunos atualmente ativos criados no período."},
        {title:"Distribuição por gênero",headers:["Gênero","Alunos","Percentual (%)"],rows:[[genderLabels[0],gender.male,rate(gender.male,active.length)],[genderLabels[1],gender.female,rate(gender.female,active.length)],[genderLabels[2],gender.unknown,rate(gender.unknown,active.length)]]},
        {title:"Faixas etárias",headers:["Faixa","Alunos","Percentual (%)"],rows:age.groups.map(g=>[g.label,g.count,rate(g.count,age.total)]),note:`Idade em ${displayDate(today)}; média: ${age.average === null ? "—" : age.average.toFixed(1)}; mínima: ${age.youngest ?? "—"}; máxima: ${age.oldest ?? "—"}; idades válidas: ${age.known}.`},
        {title:"Alunos por turma",headers:["Turma","Ativos","Masculino","Feminino","Não informado / outro","Percentual (%)"],rows:a.classDistribution.map(g=>[g.label,g.count,g.male,g.female,g.unknown,g.rate]),note:"Cadastro atual. Turma oficial pelo vínculo escolar, quando disponível; senão, texto cadastrado."},
        attendanceTable("Frequência por gênero",a.byGender,"Gênero do cadastro atual; inclui históricos de alunos inativos."),
        attendanceTable("Frequência por idade",a.byAge,"Idade em cada data de chamada; denominador = registros de presença e falta."),
        attendanceTable("Frequência por turma",a.byClass,"Turma atual do aluno, não turma histórica na data da chamada."),
        {title:"Continuidade de participação",headers:["Indicador","Valor"],rows:[["Presentes no período anterior",a.retention.previous],["Presentes no período atual",a.retention.current],["Retornaram",a.retention.returned],["Sem retorno registrado",a.retention.notReturned],["Presentes só na seleção atual",a.retention.newToComparison],["Continuidade (%)",a.retention.rate]],note:p?`Comparação: ${displayDate(p.previousStart)} a ${displayDate(iso(stamp(p.previousEnd)-dayMs))} versus ${displayDate(p.currentStart)} a ${displayDate(iso(stamp(p.currentEnd)-dayMs))}. Não mede evasão formal.`:"Sem período decorrido comparável."},
        {title:"Carga horária",headers:sessionHeaders,rows:[sessionRow("Total",sessions),...['Manhã','Tarde','Noite'].map(shift=>sessionRow(shift,sessions.filter(x=>x.turno===shift)))],note:"105 minutos por sessão da manhã/tarde; Noite e outros horários não definidos não somam horas. Turma não filtra sessões."},
        {title:"Equipe",headers:["Indicador","Valor"],rows:[["Professores participantes",t.participating],["Horas-professor conhecidas",h(t.totalTeacherMinutes,t.unknownTeacherAssignments)],["Aulas com professor",t.linked],["Aulas sem professor",t.unlinked],["Aulas em equipe",t.coTeaching],["Ativos sem aula realizada",t.activeWithoutRealized],["Vínculos sem duração",t.unknownTeacherAssignments],["Vínculos não associados",t.unmatched]],note:"Horas estimadas por vínculos, não controle de ponto."},
        {title:"Por professor",headers:["Professor","Função","Situação","Vinculadas","Realizadas","Canceladas","Horas conhecidas","Dias","Última realizada","Sem duração"],rows:t.byTeacher.map(x=>[x.nome,x.funcao||"—",x.ativo?"Ativo":"Inativo",x.total,x.realized,x.canceled,h(x.realizedMinutes,x.unknownRealized),x.days,displayDate(x.lastRealized),x.unknownRealized])},
        {title:"Professores por turno",headers:["Professor","Turno","Realizadas","Canceladas","Horas conhecidas","Sem duração"],rows:t.byTeacher.flatMap(x=>x.shifts.map(y=>[x.nome,y.label,y.realized,y.canceled,h(y.realizedMinutes,y.unknownRealized),y.unknownRealized]))},
        {title:"Evolução temporal",headers:[a.daily?"Dia":"Mês","Presenças","Faltas","Frequência (%)","Alunos presentes distintos","Aulas realizadas","Aulas canceladas","Horas conhecidas","Aulas sem duração"],rows:a.trend.map(x=>[x.key,x.present,x.absent,x.rate,x.participants,x.realized,x.canceled,h(x.minutes,x.unknown),x.unknown]),note:"Sem registros não significa ausência. Aulas não são filtradas por turma. Alunos distintos não devem ser somados entre períodos."},
    ]
}
