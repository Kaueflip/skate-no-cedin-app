import { chapters } from "./manual-data"

export function ManualSidebar() {
    return (
        <nav aria-label="Índice do manual" className="min-w-0 space-y-1">
            {chapters.map((chapter, index) => (
                <a key={chapter.id} href={`#${chapter.id}`} className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="shrink-0 text-xs tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 break-words">{chapter.title}</span>
                </a>
            ))}
        </nav>
    )
}
