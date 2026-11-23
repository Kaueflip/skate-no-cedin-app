
import {
    Users,
    UserCheck,
    UserX,
    CalendarCheck,
} from "lucide-react"

import { createClient }
    from "@/lib/supabase-server"

import { PageShell }
    from "@/components/layout/page-shell"

import { PageHeader }
    from "@/components/layout/page-header"

import { StatCard }
    from "@/components/dashboard/stat-card"

import {
    TeachersClient,
} from "@/components/teachers/teachers-client"

import {
    AddTeacherButton,
} from "@/components/teachers/add-teacher-button"

export default async function TeachersPage() {

    const supabase = await createClient()

    const [
        { data: teachers },
        { count: linkedClasses },
    ] = await Promise.all([

        supabase
            .from("teachers")
            .select("*")
            .order("nome", { ascending: true }),

        supabase
            .from("class_session_teachers")
            .select("*", {
                count: "exact",
                head: true,
            }),

    ])

    const teachersWithPhotos = await Promise.all(
        (teachers || []).map(async (teacher) => {

            if (!teacher.foto_url) {
                return teacher
            }

            const {
                data,
                error,
            } = await supabase
                .storage
                .from("teacher-photos")
                .createSignedUrl(
                    teacher.foto_url,
                    60 * 60
                )

            return {
                ...teacher,
                foto_url: error
                    ? null
                    : data.signedUrl,
            }
        })
    )

    const totalTeachers = teachers?.length || 0

    const activeTeachers = teachers?.filter(
        (teacher) => teacher.ativo
    ).length || 0

    const inactiveTeachers = teachers?.filter(
        (teacher) => !teacher.ativo
    ).length || 0

    return (

        <PageShell>

            <PageHeader
                title="Professores"
                description="Gerencie os professores do projeto"
                action={<AddTeacherButton />}
            />

            <section className="
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-4
            ">

                <StatCard
                    title="Total"
                    value={totalTeachers}
                    icon={
                        <Users className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Ativos"
                    value={activeTeachers}
                    icon={
                        <UserCheck className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Inativos"
                    value={inactiveTeachers}
                    icon={
                        <UserX className="h-5 w-5" />
                    }
                />

                <StatCard
                    title="Aulas vinculadas"
                    value={linkedClasses || 0}
                    icon={
                        <CalendarCheck className="h-5 w-5" />
                    }
                />

            </section>

            <div className="mt-8">

                <TeachersClient
                    initialTeachers={teachersWithPhotos}
                />

            </div>

        </PageShell>
    )
}
