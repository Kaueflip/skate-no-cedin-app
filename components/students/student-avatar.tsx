
"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { cn } from "@/lib/utils"

type Props = {
    nome: string
    photoUrl?: string | null
    className?: string
    fallbackClassName?: string
}

export function StudentAvatar({
    nome,
    photoUrl,
    className,
    fallbackClassName,
}: Props) {

    const initials = nome
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    return (
        <Avatar
            className={cn(
                "h-11 w-11 shrink-0 border border-border",
                className
            )}
        >
            {photoUrl && (
                <AvatarImage
                    src={photoUrl}
                    alt={nome}
                    className="object-cover"
                />
            )}

            <AvatarFallback
                className={cn(
                    "bg-muted text-sm font-semibold text-foreground",
                    fallbackClassName
                )}
            >
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}
