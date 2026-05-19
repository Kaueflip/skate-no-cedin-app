"use client"

import {
    useState,
} from "react"

import type {
    Student,
} from "@/types/student"

import {
    AppButton,
} from "@/components/ui/app-button"

import {
    EditStudentDialog,
} from "@/components/students/edit-student-dialog"

import {
    DeleteStudentDialog,
} from "@/components/students/delete-student-dialog"

type Props = {

    student: Student
}

export function StudentPageActions({
    student,
}: Props) {

    const [
        editOpen,
        setEditOpen,
    ] = useState(false)

    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false)

    return (

        <>

            <div className="
                flex
                flex-wrap
                gap-3
            ">

                <AppButton
                    onClick={() =>
                        setEditOpen(
                            true
                        )
                    }
                >

                    Editar aluno

                </AppButton>

                <AppButton
                    variant="danger"
                    onClick={() =>
                        setDeleteOpen(
                            true
                        )
                    }
                >

                    Remover aluno

                </AppButton>

            </div>

            <EditStudentDialog
                student={student}
                open={editOpen}
                onOpenChange={
                    setEditOpen
                }
            />

            <DeleteStudentDialog
                student={student}
                open={deleteOpen}
                onOpenChange={
                    setDeleteOpen
                }
            />

        </>
    )
}