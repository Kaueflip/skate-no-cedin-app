"use client"

import dynamic
    from "next/dynamic"

const AddStudentDialog =
    dynamic(
        () =>
            import(
                "@/components/students/add-student-dialog"
            ).then(
                (mod) =>
                    mod.AddStudentDialog
            ),
        {
            ssr: false,
        }
    )

export function AddStudentButton() {

    return (

        <AddStudentDialog>

            <button
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          mb-5
          rounded-2xl

          bg-primary

          px-6
          py-3

          text-sm
          font-semibold

          text-primary-foreground

          shadow-sm

          transition-all

          hover:bg-accent-hover
          hover:scale-[1.02]
        "
            >

                Novo aluno

            </button>

        </AddStudentDialog>
    )
}