"use client"

import Image from "next/image"

import type { Student }
    from "@/types/student"

import { Check }
    from "lucide-react"

type Props = {
    students: Student[]

    attendanceMap:
    Record<string, boolean>

    onToggle: (
        studentId: string
    ) => void
}

export function AttendanceList({
    students,
    attendanceMap,
    onToggle,
}: Props) {

    function getInitials(
        nome: string
    ) {

        return nome
            .split(" ")
            .map((word) =>
                word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }

    return (

        <div className="
      flex
      flex-col
      gap-4
    ">

            {students.map(
                (student) => {

                    const checked =
                        attendanceMap[
                        student.id
                        ]

                    return (

                        <button
                            key={student.id}
                            onClick={() =>
                                onToggle(
                                    student.id
                                )
                            }
                            className={`
                flex
                items-center
                justify-between

                rounded-[1.5rem]

                border

                p-5

                text-left

                transition-all

                ${checked
                                    ? `
                      border-zinc-900

                      bg-zinc-900

                      text-white
                    `
                                    : `
                      border-white/40

                      bg-white/70

                      text-zinc-900

                      hover:bg-white
                    `
                                }
              `}
                        >

                            <div className="
                flex
                items-center
                gap-4
              ">

                                <div className="
                  relative

                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  overflow-hidden

                  rounded-full

                  bg-white
                ">

                                    {student.foto_url ? (

                                        <Image
                                            src={
                                                student.foto_url
                                            }
                                            alt={student.nome}
                                            fill
                                            className="
                        object-cover
                      "
                                        />

                                    ) : (

                                        <span className="
                      text-sm
                      font-bold

                      text-zinc-700
                    ">

                                            {getInitials(
                                                student.nome
                                            )}

                                        </span>
                                    )}

                                </div>

                                <div>

                                    <h3 className="
                    text-lg
                    font-bold
                  ">

                                        {student.nome}

                                    </h3>

                                    <p className={`
                    text-sm

                    ${checked
                                            ? `
                          text-zinc-300
                        `
                                            : `
                          text-zinc-500
                        `
                                        }
                  `}>

                                        {student.turma}
                                        {" • "}
                                        {student.turno}

                                    </p>

                                </div>

                            </div>

                            <div className={`
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-full

                border

                ${checked
                                    ? `
                      border-white/20

                      bg-white

                      text-zinc-900
                    `
                                    : `
                      border-zinc-300
                    `
                                }
              `}>

                                {checked && (

                                    <Check
                                        className="
                      h-5
                      w-5
                    "
                                    />

                                )}

                            </div>

                        </button>
                    )
                }
            )}

        </div>
    )
}