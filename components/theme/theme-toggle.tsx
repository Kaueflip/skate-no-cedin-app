"use client"

import dynamic
    from "next/dynamic"

import {
    Moon,
    Sun,
} from "lucide-react"

import {
    useTheme,
} from "next-themes"

function ThemeToggleComponent() {

    const {
        resolvedTheme,
        setTheme,
    } = useTheme()

    const isDark =
        resolvedTheme === "dark"

    return (

        <button
            type="button"
            onClick={() =>
                setTheme(
                    isDark
                        ? "light"
                        : "dark"
                )
            }
            className="
        inline-flex
        h-11
        w-11
        items-center
        justify-center

        rounded-2xl

        border
        border-border

        bg-card/80

        backdrop-blur

        transition-all

        hover:bg-card
        hover:scale-[1.02]
      "
            aria-label="
        Alternar tema
      "
        >

            {isDark ? (

                <Sun
                    className="
            h-5
            w-5
          "
                />

            ) : (

                <Moon
                    className="
            h-5
            w-5
          "
                />

            )}

        </button>
    )
}

export const ThemeToggle =
    dynamic(
        async () => (
            ThemeToggleComponent
        ),
        {
            ssr: false,
        }
    )