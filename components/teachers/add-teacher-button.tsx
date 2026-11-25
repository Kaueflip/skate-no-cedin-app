"use client"

import dynamic from "next/dynamic"
import { Plus } from "lucide-react"
import { AppButton } from "@/components/ui/app-button"

const AddTeacherDialog = dynamic(() => import("@/components/teachers/add-teacher-dialog").then((mod) => mod.AddTeacherDialog), { ssr: false })

export function AddTeacherButton() {
    return <AddTeacherDialog>
        <AppButton type="button" className="h-11 shrink-0 gap-1.5 rounded-lg px-3 text-xs sm:px-4 sm:text-sm">
            <Plus className="h-4 w-4 shrink-0" />
            Novo professor
        </AppButton>
    </AddTeacherDialog>
}
