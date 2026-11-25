
import { createClient } from "@/lib/supabase-server"

import { PageShell } from "@/components/layout/page-shell"

import { PageHeader } from "@/components/layout/page-header"

import {
    StudentsClient,
} from "@/components/students/students-client"

import {
    AddStudentButton,
} from "@/components/students/add-student-button"

import {
    attachStudentPrimaryPhotos,
} from "@/services/student-photo-service"

export default async function StudentsPage() {

    const supabase = await createClient()

    const {
        data: students,
        error,
    } = await supabase
        .from("students")
        .select("*")
        .order("nome", {
            ascending: true,
        })

    if (error) {
        throw new Error("Não foi possível carregar os alunos.")
    }

    const studentsWithPhotos =
        await attachStudentPrimaryPhotos(
            supabase,
            students || []
        )

    return (

        <PageShell>

            <PageHeader
                title="Alunos"
                description="Gerencie os alunos do projeto"
                action={<AddStudentButton />}
            />

            <div className="
                w-full
                min-w-0
            ">

                <StudentsClient
                    initialStudents={studentsWithPhotos}
                />

            </div>

        </PageShell>
    )
}
