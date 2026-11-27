import { ManualChapter } from "./manual-chapter"
import { chapters } from "./manual-data"

export function ManualAttendance() {
    return <ManualChapter chapter={chapters[3]!} index={3} />
}
