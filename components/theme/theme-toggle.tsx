"use client"

import {
    Moon,
    Sun,
} from "lucide-react"

import { useTheme }
    from "next-themes"

export function ThemeToggle() {

    const {
        resolvedTheme,
        setTheme,
    } = useTheme()

    const isDark =
        resolvedTheme === "dark"

    return (

        <button
            onClick={() =>
                setTheme(
                    isDark
                        ? "light"
                        : "dark"
                )
            }
            className="
        flex
        h-11
        w-11
        items-center
        justify-center

        rounded-2xl

        border
        border-white/40

        bg-white/70

        shadow-sm

        backdrop-blur-xl

        transition-all

        hover:bg-white

        dark:border-white/10

        dark:bg-zinc-900/70

        dark:hover:bg-zinc-900
      "
        >

            {isDark ? (

                <Sun className="h-5 w-5" />

            ) : (

                <Moon className="h-5 w-5" />

            )}

        </button>
    )
}