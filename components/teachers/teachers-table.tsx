"use client"

import Link from "next/link"
import { ChevronRight, Users } from "lucide-react"
import type { Teacher } from "@/types/teacher"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TeacherAvatar } from "@/components/teachers/teacher-avatar"

type Props = { teachers: Teacher[] }

function StatusBadge({ active }: { active: boolean }) {
    return <Badge className={cn("shrink-0 rounded-md border-transparent px-2 py-0.5 text-[11px] font-medium shadow-none",
        active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted/20 text-muted-foreground")}>
        {active ? "Ativo" : "Inativo"}
    </Badge>
}

export function TeachersTable({ teachers }: Props) {
    if (!teachers.length) return (
        <div className="flex w-full min-w-0 flex-col items-center gap-2 rounded-[10px] border border-dashed border-border bg-card px-3 py-8 text-center">
            <Users className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-semibold">Nenhum professor encontrado</p>
            <p className="text-xs text-muted">Tente alterar a busca ou os filtros.</p>
        </div>
    )
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-[10px] border border-border bg-card/80 shadow-sm">
            <div className="divide-y divide-border lg:hidden">
                {teachers.map((teacher) => (
                    <Link key={teacher.id} href={`/teachers/${teacher.id}`}
                        className="flex w-full min-w-0 items-center gap-2.5 p-3 transition-colors hover:bg-accent active:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                        <TeacherAvatar nome={teacher.nome} fotoUrl={teacher.foto_url} size={44} />
                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{teacher.nome}</p>
                            <p className="text-xs text-muted [overflow-wrap:anywhere]">{teacher.funcao || "Função não informada"}</p>
                            {teacher.contato && <p className="text-xs text-muted [overflow-wrap:anywhere]">{teacher.contato}</p>}
                            <StatusBadge active={teacher.ativo} />
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                    </Link>
                ))}
            </div>
            <div className="hidden w-full min-w-0 overflow-x-auto lg:block">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow><TableHead>Professor</TableHead><TableHead>Função</TableHead><TableHead>Contato</TableHead><TableHead>Início</TableHead><TableHead>Situação</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow key={teacher.id} className="border-border hover:bg-muted/10">
                                <TableCell className="py-3">
                                    <Link href={`/teachers/${teacher.id}`} className="flex min-w-0 items-center gap-2.5 rounded-md hover:text-primary focus-visible:ring-2 focus-visible:ring-ring">
                                        <TeacherAvatar nome={teacher.nome} fotoUrl={teacher.foto_url} size={40} />
                                        <span className="max-w-64 whitespace-normal text-sm font-semibold [overflow-wrap:anywhere]">{teacher.nome}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="max-w-64 whitespace-normal text-xs text-muted [overflow-wrap:anywhere]">{teacher.funcao || "Não informada"}</TableCell>
                                <TableCell className="text-xs text-muted">{teacher.contato || "Não informado"}</TableCell>
                                <TableCell className="text-xs text-muted tabular-nums">{teacher.data_inicio ? teacher.data_inicio.split("-").reverse().join("/") : "Não informado"}</TableCell>
                                <TableCell><StatusBadge active={teacher.ativo} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
