"use client"

import {
    Moon,
    Sun,
} from "lucide-react"

import {
    useEffect,
    useState,
} from "react"

import {
    useTheme,
} from "next-themes"

export function ThemeToggle() {

    const {
        theme,
        setTheme,
    } = useTheme()

    const [
        mounted,
        setMounted,
    ] = useState(false)

    useEffect(() => {

        setMounted(true)

    }, [])

    if (!mounted) {

        return (

            <div className="
        h-11
        w-11

        rounded-2xl

        border
        border-border

        bg-card/80
      " />
        )
    }

    const isDark =
        theme === "dark"

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