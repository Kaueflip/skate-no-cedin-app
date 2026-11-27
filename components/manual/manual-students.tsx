import { ManualChapter } from "./manual-chapter"
import { chapters } from "./manual-data"

export function ManualStudents() {
    return <ManualChapter chapter={chapters[2]!} index={2} />
}
