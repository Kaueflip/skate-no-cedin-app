import type { ManualChapterData } from "./manual-data"

export function ManualChapter({ chapter, index }: { chapter: ManualChapterData; index: number }) {
    const number = String(index + 1).padStart(2, "0")
    return (
        <section id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="min-w-0 scroll-mt-24 space-y-5 rounded-[10px] border border-border bg-card p-3 sm:p-5 lg:p-6">
            <header className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-foreground" aria-hidden="true">{number}</span>
                <div className="min-w-0 space-y-1">
                    <h2 id={`${chapter.id}-title`} className="break-words text-lg font-semibold tracking-tight sm:text-xl">{chapter.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{chapter.description}</p>
                </div>
            </header>
            {chapter.sections.map((section, i) => (
                <div key={section.title} className="min-w-0 space-y-2 border-t border-border pt-4">
                    <h3 className="break-words text-sm font-semibold sm:text-base">{index + 1}.{i + 1} {section.title}</h3>
                    {section.paragraphs.map((paragraph, j) => <p key={j} className="break-words text-sm leading-relaxed text-muted-foreground">{paragraph}</p>)}
                    {section.steps && <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
                    {section.items && <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
                    {section.note && <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed"><span className="font-semibold">Atenção: </span>{section.note}</div>}
                </div>
            ))}
            <a href="#manual-topo" className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Voltar ao índice ↑</a>
        </section>
    )
}
