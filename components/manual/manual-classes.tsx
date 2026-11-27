import { ManualChapter } from "./manual-chapter"
import { chapters } from "./manual-data"

export function ManualClasses() {
    return <ManualChapter chapter={chapters[4]!} index={4} />
}
