import { GlassCard } from "@/components/ui/glass-card"
import { formatHours } from "./report-metrics"
import { displayRate, displayDate, type Analytics } from "./report-analytics"

const panel = "w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5"
const heading = "text-base font-bold md:text-lg"
const sub = "mt-1 text-xs leading-relaxed text-muted md:text-sm"
function Metric({ label, value }: { label: string; value: string | number }) {
    return <div className="min-w-0 rounded-lg border border-border bg-background/60 p-2.5">
        <p className="text-xs leading-tight text-muted">{label}</p>
        <p className="mt-1 text-xl font-bold tabular-nums [overflow-wrap:anywhere]">{value}</p>
    </div>
}
function Bar({ value, color = "bg-primary" }: { value: number | null; color?: string }) {
    return <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30" aria-hidden="true"><div className={`h-full rounded-full ${color}`} style={{width: `${value ?? 0}%`}} /></div>
}
function AttendanceBreakdown({ title, description, groups }: { title: string; description: string; groups: Analytics["byGender"] }) {
    return <GlassCard className={panel}>
        <h2 className={heading}>{title}</h2><p className={sub}>{description}</p>
        <div className="mt-3 grid min-w-0 gap-2 xl:grid-cols-2">
            {groups.map(g => <div key={g.label} className="min-w-0 rounded-lg border border-border bg-background/60 p-3">
                <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <p className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">{g.label}</p>
                    <p className="shrink-0 text-sm font-bold tabular-nums">{displayRate(g.rate)}</p>
                </div>
                <Bar value={g.rate} color="bg-emerald-500" />
                <div className="mt-2 flex flex-wrap justify-between gap-1 text-xs tabular-nums text-muted">
                    <span>{g.present} presenças</span><span>{g.absent} faltas</span><span>{g.total} registros</span>
                </div>
            </div>)}
            {!groups.length && <p className="text-xs text-muted">Nenhum grupo na seleção.</p>}
        </div>
        <p className="mt-3 text-xs text-muted">Percentual = presenças ÷ registros. Sem registros, a taxa é exibida como —. Alunos inativos com histórico são incluídos.</p>
    </GlassCard>
}
const inclusiveEnd = (end: string) => new Date(Date.parse(`${end}T00:00:00Z`) - 86400000).toISOString().slice(0,10)
function Trend({ data }: { data: Analytics }) {
    const maxRecords = Math.max(1,...data.trend.map(g=>g.present+g.absent))
    const maxClasses = Math.max(1,...data.trend.map(g=>g.realized+g.canceled))
    const label = (key: string) => data.daily ? displayDate(key) : `${key.slice(5)}/${key.slice(0,4)}`
    return <GlassCard className={panel}>
        <h2 className={heading}>Evolução temporal</h2><p className={sub}>Série {data.daily ? "diária" : "mensal"} de frequência e aulas no período.</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500"/>Presenças / realizadas</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-red-500"/>Faltas / canceladas</span>
        </div>
        <div className="mt-3 max-h-[36rem] space-y-2 overflow-y-auto" tabIndex={0} aria-label="Histórico temporal">
            {data.trend.map(g=><div key={g.key} className="min-w-0 rounded-lg border border-border bg-background/60 p-2.5">
                <div className="flex flex-wrap justify-between gap-1 text-sm font-semibold"><span>{label(g.key)}</span><span>{displayRate(g.rate)}</span></div>
                <div className="mt-2 grid min-w-0 gap-3 md:grid-cols-2">
                    <div className="space-y-1"><p className="text-xs text-muted">{g.present} presenças · {g.absent} faltas</p>
                        <div className="flex h-2 overflow-hidden rounded-full bg-muted/30" aria-hidden="true"><span className="bg-emerald-500" style={{width:`${g.present/maxRecords*100}%`}}/><span className="bg-red-500" style={{width:`${g.absent/maxRecords*100}%`}}/></div>
                        <p className="text-xs text-muted">{g.participants} alunos distintos presentes</p>
                    </div>
                    <div className="space-y-1"><p className="text-xs text-muted">{g.realized} realizadas · {g.canceled} canceladas</p>
                        <div className="flex h-2 overflow-hidden rounded-full bg-muted/30" aria-hidden="true"><span className="bg-emerald-500" style={{width:`${g.realized/maxClasses*100}%`}}/><span className="bg-red-500" style={{width:`${g.canceled/maxClasses*100}%`}}/></div>
                        <p className="text-xs text-muted">{g.minutes || !g.unknown ? formatHours(g.minutes) : "—"} conhecidas{g.unknown ? ` · ${g.unknown} sem duração` : ""}</p>
                    </div>
                </div>
            </div>)}
            {!data.trend.length && <p className="text-xs text-muted">Sem dados no intervalo.</p>}
        </div>
        <p className="mt-3 text-xs text-muted">As escalas são próprias para frequência e aulas. Dias sem registros não são faltas. O filtro de turma não se aplica às aulas. Intervalos superiores a cinco anos exibem somente períodos com registros.</p>
    </GlassCard>
}
export function AdditionalReports({ data }: { data: Analytics }) {
    const total = data.classDistribution.reduce((sum,g)=>sum+g.count,0)
    const p = data.period, r = data.retention
    return <>
        <GlassCard className={panel}>
            <h2 className={heading}>Alunos por turma</h2><p className={sub}>{total} alunos ativos no cadastro atual.</p>
            <div className="mt-3 space-y-3">
                {data.classDistribution.map(g=><div key={g.label} className="min-w-0 space-y-1.5">
                    <div className="flex min-w-0 items-start justify-between gap-2 text-sm"><span className="min-w-0 font-medium [overflow-wrap:anywhere]">{g.label}</span><span className="shrink-0 tabular-nums">{g.count} · {displayRate(g.rate)}</span></div>
                    <Bar value={g.rate}/><p className="text-xs text-muted">{g.male} masculino · {g.female} feminino · {g.unknown} não informado/outro</p>
                </div>)}
                {!total && <p className="text-xs text-muted">Nenhum aluno ativo na seleção.</p>}
            </div>
            <p className="mt-3 text-xs text-muted">Usa o nome da turma oficial quando existe vínculo escolar; caso contrário, o texto cadastrado. Rótulos legados sem vínculo podem permanecer separados.</p>
        </GlassCard>
        <AttendanceBreakdown title="Frequência por gênero" description="Distribuição de registros pelo gênero cadastrado atualmente." groups={data.byGender}/>
        <AttendanceBreakdown title="Frequência por faixa etária" description="Idade em anos completos calculada na data de cada chamada." groups={data.byAge}/>
        <AttendanceBreakdown title="Frequência por turma" description="Registros agrupados pela turma atual do aluno." groups={data.byClass}/>
        <GlassCard className={panel}>
            <h2 className={heading}>Retenção / continuidade de participação</h2><p className={sub}>Retorno de alunos com pelo menos uma presença no intervalo anterior de mesma duração.</p>
            {p ? <><p className="mt-3 text-xs text-muted">Anterior: {displayDate(p.previousStart)} a {displayDate(inclusiveEnd(p.previousEnd))}<br/>Atual: {displayDate(p.currentStart)} a {displayDate(inclusiveEnd(p.currentEnd))} · {p.days} dias em cada intervalo</p>
                <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 xl:grid-cols-3">
                    <Metric label="Continuidade" value={displayRate(r.rate)}/><Metric label="Presentes anteriormente" value={r.previous}/><Metric label="Retornaram" value={r.returned}/><Metric label="Sem retorno registrado" value={r.notReturned}/><Metric label="Presentes no atual" value={r.current}/><Metric label="Presentes só no atual" value={r.newToComparison}/>
                </div><div className="mt-3"><Bar value={r.rate} color="bg-emerald-500"/></div>
                {r.rate===null && <p className="mt-2 text-xs text-muted">Não há participantes no período anterior para calcular a taxa.</p>}
            </> : <p className="mt-3 text-xs text-muted">Não há intervalo decorrido comparável.</p>}
            <p className="mt-3 text-xs leading-relaxed text-muted">Não comprova evasão ou desistência. Férias, feriados e registros incompletos podem influenciar a comparação. O período atual é limitado até hoje; os filtros usam a turma e o turno atuais.</p>
        </GlassCard>
        <Trend data={data}/>
    </>
}
