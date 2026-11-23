
"use client"

import dynamic
    from "next/dynamic"

const AddTeacherDialog =
    dynamic(
        () =>
            import(
                "@/components/teachers/add-teacher-dialog"
            ).then(
                (mod) =>
                    mod.AddTeacherDialog
            ),
        {
            ssr: false,
        }
    )

export function AddTeacherButton() {

    return (

        <AddTeacherDialog>

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
                Novo professor
            </button>

        </AddTeacherDialog>
    )
}
