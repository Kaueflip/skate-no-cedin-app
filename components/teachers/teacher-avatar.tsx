
"use client"

import { useState } from "react"
import Image from "next/image"

import {
    UserRound,
} from "lucide-react"

type TeacherAvatarProps = {
    nome: string
    fotoUrl?: string | null
    size?: number
}

export function TeacherAvatar({
    nome,
    fotoUrl,
    size = 40,
}: TeacherAvatarProps) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null)

    const initials = nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()

    const showImage = Boolean(fotoUrl) && failedUrl !== fotoUrl

    if (showImage && fotoUrl) {
        return (
            <div
                className="
                    relative
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border
                    border-border
                    bg-muted
                "
                style={{
                    width: size,
                    height: size,
                }}
            >
                <Image
                    src={fotoUrl}
                    alt={nome}
                    fill
                    sizes={`${size}px`}
                    className="object-cover"
                    onError={() => setFailedUrl(fotoUrl)}
                />
            </div>
        )
    }

    return (
        <div
            className="
                flex
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-muted
                font-semibold
                text-muted-foreground
            "
            style={{
                width: size,
                height: size,
            }}
        >
            {initials || <UserRound size={size * 0.5} />}
        </div>
    )
}
