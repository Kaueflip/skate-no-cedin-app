"use client"

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

import { Button }
    from "@/components/ui/button"

type Props = {
    page: number

    total: number

    pageSize: number

    onPageChange: (
        page: number
    ) => void
}

export function StudentsPagination({
    page,
    total,
    pageSize,
    onPageChange,
}: Props) {

    const totalPages =
        Math.ceil(
            total / pageSize
        )

    const start =
        total === 0
            ? 0
            : (page - 1) * pageSize + 1

    const end =
        Math.min(
            page * pageSize,
            total
        )

    return (

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-sm text-muted-foreground">

                Mostrando{" "}

                <span className="font-medium">

                    {start}

                </span>

                {" "}até{" "}

                <span className="font-medium">

                    {end}

                </span>

                {" "}de{" "}

                <span className="font-medium">

                    {total}

                </span>

                {" "}alunos

            </div>

            <div className="flex items-center gap-2">

                <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() =>
                        onPageChange(
                            page - 1
                        )
                    }
                >

                    <ChevronLeft className="h-4 w-4" />

                </Button>

                <div className="flex items-center gap-2 text-sm">

                    Página

                    <span className="font-semibold">

                        {page}

                    </span>

                    de

                    <span className="font-semibold">

                        {totalPages || 1}

                    </span>

                </div>

                <Button
                    variant="outline"
                    size="icon"
                    disabled={
                        page >= totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            page + 1
                        )
                    }
                >

                    <ChevronRight className="h-4 w-4" />

                </Button>

            </div>

        </div>
    )
}