"use client"

import { useState }
    from "react"

import { useStudents }
    from "@/hooks/use-students"

import type { Student }
    from "@/types/student"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { StudentsTable }
    from "@/components/students/students-table"

import { AddStudentDialog }
    from "@/components/students/add-student-dialog"

import { StudentProfileModal }
    from "@/components/students/student-profile-modal"

import { StudentsStats }
    from "@/components/students/students-stats"

import { StudentsFilters }
    from "@/components/students/students-filters"

import { StudentsEmptyState }
    from "@/components/students/students-empty-state"

import { StudentsToolbar }
    from "@/components/students/students-toolbar"

import { StudentsPagination }
    from "@/components/students/students-pagination"

export default function StudentsPage() {

    const {
        students,
        loading,
        fetchStudents,
        addStudent,
        page,
        setPage,
        pageSize,
        total,
        searchTerm,
        setSearchTerm,
        filterShift,
        setFilterShift,
    } = useStudents()

    const [
        selectedStudent,
        setSelectedStudent,
    ] = useState<Student | null>(
        null
    )

    return (

        <div className="flex flex-col gap-6 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-3xl font-bold tracking-tight">

                        Alunos

                    </h1>

                    <p className="text-muted-foreground">

                        Gerencie os alunos do projeto

                    </p>

                </div>

                <AddStudentDialog
                    onAddStudent={
                        addStudent
                    }
                />

            </div>

            <StudentsStats
                students={students}
            />

            <Card>

                <CardHeader>

                    <CardTitle>

                        Lista de Alunos

                    </CardTitle>

                    <CardDescription>

                        {total} alunos encontrados

                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <StudentsFilters
                        searchTerm={
                            searchTerm
                        }
                        onSearchChange={
                            setSearchTerm
                        }
                        filterShift={
                            filterShift
                        }
                        onFilterShiftChange={
                            setFilterShift
                        }
                        loading={loading}
                        onRefresh={
                            fetchStudents
                        }
                    />

                    <StudentsToolbar
                        students={students}
                    />

                    {students.length === 0 ? (

                        <StudentsEmptyState
                            searchTerm={
                                searchTerm
                            }
                        />

                    ) : (

                        <StudentsTable
                            students={students}
                            onSelectStudent={
                                setSelectedStudent
                            }
                        />

                    )}

                    <StudentsPagination
                        page={page}
                        total={total}
                        pageSize={pageSize}
                        onPageChange={
                            setPage
                        }
                    />

                </CardContent>

            </Card>

            <StudentProfileModal
                student={
                    selectedStudent
                }
                open={
                    !!selectedStudent
                }
                onClose={() =>
                    setSelectedStudent(
                        null
                    )
                }
            />

        </div>
    )
}