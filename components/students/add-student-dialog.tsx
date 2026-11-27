"use client"

import { useState, type ReactNode } from "react"
import { StudentFormDialog } from "./student-form-dialog"

export function AddStudentDialog({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    return <StudentFormDialog open={open} onOpenChange={setOpen}>{children}</StudentFormDialog>
}
