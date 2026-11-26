"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/ui/glass-card"
import type { Cell, ReportTable } from "./report-analytics"

type Props = { tables: ReportTable[]; period: string; turma: string; turno: string; today: string }
type Format = "csv" | "xlsx" | "pdf"
const text = (v: Cell) => v === null ? "—" : String(v)
function csvCell(v: Cell) {
    let value = v === null ? "" : typeof v === "number" ? String(v).replace(".", ",") : v
    if (typeof v === "string" && /^[\s]*[=+\-@\t\r\n]/.test(value)) value = "'" + value
    return `"${value.replace(/"/g, '""')}"`
}
function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove()
    window.setTimeout(()=>URL.revokeObjectURL(url), 10000)
}
const names = ["Geral","Gênero","Idade","Turmas","Freq gênero","Freq idade","Freq turma","Continuidade","Carga horária","Equipe","Professores","Prof por turno","Evolução"]
export function ReportExport({tables,period,turma,turno,today}: Props) {
    const [busy,setBusy] = useState<Format|null>(null)
    const filename = `skate-no-cedin-relatorio-${today}`
    const metadata = [`Período: ${period}`, `Turma: ${turma === "todas" ? "Todas" : turma}`, `Turno: ${turno === "todos" ? "Todos" : turno === "Tarde" ? "Tarde (inclui Integral para alunos)" : turno}`, `Gerado em: ${today.split("-").reverse().join("/")}`, "Uso interno. Contém dados agregados dos alunos e indicadores individuais de professores."]
    async function exportReport(format: Format) {
        if(busy) return
        setBusy(format)
        try {
            if(format === "csv") {
                const rows: Cell[][] = [["Skate no Cedin — Relatório"],...metadata.map(x=>[x]),[]]
                for(const t of tables) { rows.push([t.title], t.headers, ...t.rows); if(t.note) rows.push([t.note]); rows.push([]) }
                download(new Blob(["\uFEFF",rows.map(row=>row.map(csvCell).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"}),`${filename}.csv`)
            } else if(format === "xlsx") {
                const { Workbook } = await import("exceljs")
                const workbook = new Workbook(); workbook.creator="Skate no Cedin"
                const info = workbook.addWorksheet("Informações"); info.addRow(["Skate no Cedin — Relatório"]); metadata.forEach(x=>info.addRow([x])); info.getColumn(1).width=100; info.getColumn(1).alignment={wrapText:true,vertical:"top"}; info.getRow(1).font={bold:true,size:14}
                tables.forEach((t,i)=>{
                    const sheet=workbook.addWorksheet(names[i] || `Seção ${i+1}`,{views:[{state:"frozen",ySplit:1}]})
                    sheet.columns=t.headers.map((header,index)=>({header,width:index===0?42:Math.min(32,Math.max(15,header.length+2))}))
                    sheet.getRow(1).font={bold:true,color:{argb:"FFFFFFFF"}}; sheet.getRow(1).fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF1E3A5F"}}; sheet.getRow(1).alignment={wrapText:true,vertical:"middle"}; sheet.getRow(1).height=32
                    t.rows.forEach(row=>sheet.addRow(row))
                    sheet.eachRow((row,n)=>{if(n>1) row.alignment={wrapText:true,vertical:"top"}})
                    if(t.note){const n=sheet.rowCount+2; sheet.mergeCells(n,1,n,t.headers.length); const cell=sheet.getCell(n,1); cell.value=t.note; cell.alignment={wrapText:true,vertical:"top"}; sheet.getRow(n).height=45}
                })
                const buffer=await workbook.xlsx.writeBuffer()
                const bytes=new Uint8Array(buffer)
                download(new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),`${filename}.xlsx`)
            } else {
                const [{ jsPDF }, { autoTable }] = await Promise.all([import("jspdf"),import("jspdf-autotable")])
                const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"})
                const width=doc.internal.pageSize.getWidth(), height=doc.internal.pageSize.getHeight()
                doc.setFontSize(18); doc.text("Skate no Cedin - Relatório",12,16)
                doc.setFontSize(10); let y=24
                metadata.forEach(line=>{const lines=doc.splitTextToSize(line,width-24);doc.text(lines,12,y);y+=lines.length*5})
                for(const t of tables) {
                    if(y>height-45){doc.addPage();y=15}
                    doc.setFontSize(13);doc.text(t.title,12,y);y+=5
                    let lastY=y
                    autoTable(doc,{startY:y,head:[t.headers],body:t.rows.length?t.rows.map(r=>r.map(text)):[["Sem registros",...t.headers.slice(1).map(()=>"")]],theme:"grid",margin:{top:12,bottom:15,left:12,right:12},styles:{fontSize:8,cellPadding:2,overflow:"linebreak"},headStyles:{fillColor:[30,58,95]},didDrawPage:({cursor})=>{if(cursor)lastY=cursor.y}})
                    y=lastY+5
                    if(t.note){doc.setFontSize(8);const lines=doc.splitTextToSize(t.note,width-24);if(y+lines.length*4>height-15){doc.addPage();y=15}doc.text(lines,12,y);y+=lines.length*4}
                    y+=8
                }
                const pages=doc.getNumberOfPages();for(let n=1;n<=pages;n++){doc.setPage(n);doc.setFontSize(8);doc.text(`Skate no Cedin | Uso interno | ${n}/${pages}`,12,height-7)}
                doc.save(`${filename}.pdf`)
            }
            toast.success("Relatório gerado.")
        } catch(error) { console.error("Erro ao exportar relatório:",error);toast.error("Não foi possível exportar o relatório.") }
        finally {setBusy(null)}
    }
    return <GlassCard className="w-full min-w-0 rounded-[10px] p-3 sm:p-4 lg:p-5">
        <h2 className="text-base font-bold md:text-lg">Exportação de relatórios</h2>
        <p className="mt-1 text-xs text-muted">Exporta os indicadores da seleção atual, incluindo os critérios de cálculo. Não inclui nomes, matrículas, fotos ou datas de nascimento dos alunos. Contém nomes dos professores e sua atuação.</p>
        <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
            {([['pdf','PDF',FileText],['xlsx','Excel',FileSpreadsheet],['csv','CSV',Download]] as const).map(([format,label,Icon])=><button key={format} type="button" disabled={busy!==null} onClick={()=>exportReport(format)} className="flex min-h-11 min-w-0 flex-wrap items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2 text-xs font-semibold hover:bg-accent disabled:opacity-50"><Icon className="h-4 w-4 shrink-0"/>{busy===format?"Gerando…":label}</button>)}
        </div>
    </GlassCard>
}
