import { createClient } from "@/lib/supabase-server"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { TeachersClient } from "@/components/teachers/teachers-client"
import { AddTeacherButton } from "@/components/teachers/add-teacher-button"

export default async function TeachersPage() {
    const supabase = await createClient()
    const { data: teachers, error } = await supabase
        .from("teachers")
        .select("*")
        .order("nome", { ascending: true })

    if (error) {
        console.error("Erro ao carregar professores:", error)
        throw new Error("Não foi possível carregar os professores.")
    }

    const paths = [...new Set((teachers || [])
        .map((teacher) => teacher.foto_url)
        .filter((path): path is string => Boolean(path && !path.startsWith("http"))))]
    const urls = new Map<string, string>()

    if (paths.length > 0) {
        const { data, error: photoError } = await supabase.storage
            .from("teacher-photos")
            .createSignedUrls(paths, 3600)
        if (photoError) console.error("Erro ao carregar fotos:", photoError)
        for (const item of data || []) {
            if (item.path && item.signedUrl && !item.error) {
                urls.set(item.path, item.signedUrl)
            }
        }
    }

    const teachersWithPhotos = (teachers || []).map((teacher) => ({
        ...teacher,
        foto_url: teacher.foto_url?.startsWith("http")
            ? teacher.foto_url
            : urls.get(teacher.foto_url || "") ?? null,
    }))

    return (
        <PageShell>
            <PageHeader
                title="Professores"
                description="Gerencie os professores do projeto"
                action={<AddTeacherButton />}
            />
            <div className="w-full min-w-0">
                <TeachersClient initialTeachers={teachersWithPhotos} />
            </div>
        </PageShell>
    )
}
