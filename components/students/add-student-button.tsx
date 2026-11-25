
"use client"

import dynamic from "next/dynamic"

import { Plus } from "lucide-react"

import { AppButton } from "@/components/ui/app-button"

const AddStudentDialog = dynamic(

    () =>
        import(
            "@/components/students/add-student-dialog"
        ).then(
            (mod) => mod.AddStudentDialog
        ),

    {
        ssr: false,
    }
)

export function AddStudentButton() {

    return (

        <AddStudentDialog>

            <AppButton
                type="button"
                className="
                    h-11
                    shrink-0
                    gap-1.5

                    rounded-lg

                    px-3
                    text-xs

                    sm:gap-2
                    sm:px-4
                    sm:text-sm
                "
            >

                <Plus className="
                    h-4
                    w-4
                    shrink-0
                " />

                Novo aluno

            </AppButton>

        </AddStudentDialog>
    )
}
