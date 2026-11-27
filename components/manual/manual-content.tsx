import { ManualHeader } from "./manual-header"
import { ManualSidebar } from "./manual-sidebar"
import { ManualChapter } from "./manual-chapter"
import { chapters } from "./manual-data"

export function ManualContent() {
    return (
        <div className="min-w-0 space-y-4 sm:space-y-6">
            <ManualHeader />
            <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
                <details className="min-w-0 rounded-[10px] border border-border bg-card p-3 lg:hidden">
                    <summary className="min-h-11 cursor-pointer rounded-lg py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Conteúdo do manual · {chapters.length} capítulos</summary>
                    <ManualSidebar />
                </details>
                <aside className="hidden min-w-0 rounded-[10px] border border-border bg-card p-3 lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
                    <h2 className="mb-2 text-sm font-semibold">Conteúdo do manual</h2>
                    <ManualSidebar />
                </aside>
                <div className="min-w-0 space-y-4 sm:space-y-5">
                    {chapters.map((chapter, index) => <ManualChapter key={chapter.id} chapter={chapter} index={index} />)}
                </div>
            </div>
        </div>
    )
}
