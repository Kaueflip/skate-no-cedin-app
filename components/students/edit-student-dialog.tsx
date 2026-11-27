"use client"

import type { Student } from "@/types/student"
import { StudentFormDialog } from "./student-form-dialog"

export function EditStudentDialog({ student, open, onOpenChange }: { student: Student; open: boolean; onOpenChange: (open: boolean) => void }) {
    return <StudentFormDialog student={student} open={open} onOpenChange={onOpenChange} />
}
