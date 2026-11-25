"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"

type Props = {
    periodo: string
    turma: string
    turno: string
    turmas: string[]
    dataInicio: string
    dataFim: string
    periodDescription: string
    invalidCustomPeriod: boolean
}

const fieldClass = "h-11 w-full min-w-0 max-w-full rounded-lg border border-border bg-background px-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
const labelClass = "block text-xs font-medium text-foreground"

export function ReportsFilters(props: Props) {
    const [periodo, setPeriodo] = useState(props.periodo)
    const [dataInicio, setDataInicio] = useState(props.dataInicio)
    const [dataFim, setDataFim] = useState(props.dataFim)

    return (
        <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">
            <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 shrink-0 text-muted" />
                <h2 className="text-base font-semibold">Filtros dos relatórios</h2>
            </div>

            <form method="GET" action="/reports" className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
                <div className="min-w-0 space-y-1.5">
                    <label htmlFor="periodo" className={labelClass}>Período</label>
                    <select id="periodo" name="periodo" value={periodo} onChange={(event) => setPeriodo(event.target.value)} className={fieldClass}>
                        <option value="mes">Mês atual</option>
                        <option value="trimestre">Últimos 3 meses</option>
                        <option value="ano">Ano atual</option>
                        <option value="personalizado">Personalizado</option>
                    </select>
                </div>
                <div className="min-w-0 space-y-1.5">
                    <label htmlFor="turno" className={labelClass}>Turno</label>
                    <select id="turno" name="turno" defaultValue={props.turno} className={fieldClass}>
                        <option value="todos">Todos os turnos</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde (inclui Integral)</option>
                        <option value="Noite">Noite</option>
                    </select>
                </div>
                <div className="col-span-2 min-w-0 space-y-1.5 lg:col-span-1">
                    <label htmlFor="turma" className={labelClass}>Turma</label>
                    <select id="turma" name="turma" defaultValue={props.turma} className={fieldClass}>
                        <option value="todas">Todas as turmas</option>
                        {props.turmas.map((turma) => <option key={turma} value={turma}>{turma}</option>)}
                    </select>
                </div>
                {periodo === "personalizado" && (
                    <div className="col-span-2 grid min-w-0 grid-cols-1 gap-2 min-[380px]:grid-cols-2 lg:col-span-4 lg:row-start-2">
                        <div className="min-w-0 space-y-1.5">
                            <label htmlFor="dataInicio" className={labelClass}>Data inicial</label>
                            <input type="date" id="dataInicio" name="dataInicio" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} max={dataFim || undefined} required className={fieldClass} />
                        </div>
                        <div className="min-w-0 space-y-1.5">
                            <label htmlFor="dataFim" className={labelClass}>Data final</label>
                            <input type="date" id="dataFim" name="dataFim" value={dataFim} onChange={(event) => setDataFim(event.target.value)} min={dataInicio || undefined} required className={fieldClass} />
                        </div>
                    </div>
                )}
                <div className="col-span-2 flex min-w-0 items-end lg:col-span-1 lg:col-start-4 lg:row-start-1">
                    <button type="submit" className="h-11 w-full rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                        Aplicar filtros
                    </button>
                </div>
            </form>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
                <p className="text-xs text-muted">{props.periodDescription}</p>
                <Link href="/reports" className="inline-flex min-h-11 items-center text-xs font-medium text-primary hover:underline">Limpar filtros</Link>
            </div>
            {props.invalidCustomPeriod && <p role="alert" className="text-xs text-destructive">Informe um intervalo de datas válido. Exibindo os resultados do mês atual.</p>}
        </GlassCard>
    )
}
