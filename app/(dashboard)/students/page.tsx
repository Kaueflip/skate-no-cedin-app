"use client"

import { useState }
    from "react"

import type { Student }
    from "@/types/student"

import { useStudents }
    from "@/hooks/use-students"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

import { StudentsTable }
    from "@/components/students/students-table"

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

        <main className="
      min-h-screen

     bg-background
    ">

            <div className="
        flex
        flex-col
        gap-8

        p-6

        lg:p-10
      ">

                <div className="
          flex
          flex-col
          gap-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        ">

                    <div>



                        <h1 className="
              mt-2

              text-4xl
              font-black
              tracking-tight

              text-zinc-900
            ">

                            Alunos

                        </h1>

                        <p className="
              mt-3

              text-lg
              text-zinc-600
            ">

                            Gerencie os alunos do projeto Skate no Cedin

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

                <Card
                    className="
            rounded-[2rem]

            border
            border-white/40

            bg-white/70

            shadow-sm

            backdrop-blur-xl
          "
                >

                    <CardHeader className="pb-2">

                        <div className="
              flex
              flex-col
              gap-3

              lg:flex-row
              lg:items-center
              lg:justify-between
            ">

                            <div>

                                <CardTitle className="
                  text-2xl
                  font-black
                  tracking-tight

                  text-zinc-900
                ">

                                    Lista de Alunos

                                </CardTitle>

                                <CardDescription className="
                  mt-1

                  text-base
                  text-zinc-500
                ">

                                    {total} alunos encontrados

                                </CardDescription>

                            </div>

                        </div>

                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div className="
              rounded-[1.5rem]

              border
              border-white/40

              bg-white/60

              p-5

              backdrop-blur-xl
            ">

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

                        </div>

                        <div className="
              rounded-[1.5rem]

              border
              border-white/40

              bg-white/60

              p-5

              backdrop-blur-xl
            ">

                            <StudentsToolbar
                                students={students}
                            />

                        </div>

                        <div className="
              overflow-hidden

              rounded-[1.5rem]

              border
              border-white/40

              bg-white/60

              backdrop-blur-xl
            ">

                            {students.length === 0 ? (

                                <div className="p-10">

                                    <StudentsEmptyState
                                        searchTerm={
                                            searchTerm
                                        }
                                    />

                                </div>

                            ) : (

                                <StudentsTable
                                    students={students}
                                    onSelectStudent={
                                        setSelectedStudent
                                    }
                                />

                            )}

                        </div>

                        <div className="
              rounded-[1.5rem]

              border
              border-white/40

              bg-white/60

              p-5

              backdrop-blur-xl
            ">

                            <StudentsPagination
                                page={page}
                                total={total}
                                pageSize={pageSize}
                                onPageChange={
                                    setPage
                                }
                            />

                        </div>

                    </CardContent>

                </Card>

            </div>

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

        </main>
    )
}