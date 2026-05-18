import type { Metadata }
  from "next"

import { GeistSans }
  from "geist/font/sans"

import "./globals.css"

import {
  ThemeProvider,
} from "@/components/theme/theme-provider"

import {
  TooltipProvider,
} from "@/components/ui/tooltip"

import {
  Toaster,
} from "@/components/ui/sonner"

import {
  Analytics,
} from "@vercel/analytics/react"


export const metadata:
  Metadata = {

  title:
    "Skate no Cedin",

  description:
    "Sistema de gestão do projeto Skate no Cedin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children:
  React.ReactNode
}>) {

  return (

    <html
      lang="pt-BR"
      suppressHydrationWarning
    >

      <body
        className={`
          ${GeistSans.className}

          min-h-screen

          bg-[#e5e8f7]

          text-zinc-900

          antialiased

          dark:bg-zinc-950

          dark:text-white
        `}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >

          <TooltipProvider>

            {children}

            <Toaster
              toastOptions={{
                classNames: {

                  toast: `
                    border-white/40

                    bg-[#eef1fb]

                    text-zinc-900

                    shadow-xl

                    backdrop-blur-2xl

                    dark:border-white/10

                    dark:bg-zinc-900/95

                    dark:text-white
                  `,

                  description: `
                    text-zinc-500

                    dark:text-zinc-400
                  `,

                  actionButton: `
                    bg-zinc-900

                    text-white

                    dark:bg-white

                    dark:text-zinc-900
                  `,

                  cancelButton: `
                    bg-zinc-200

                    text-zinc-900

                    dark:bg-zinc-800

                    dark:text-white
                  `,
                },
              }}
            />

            <Analytics />

          </TooltipProvider>

        </ThemeProvider>

      </body>

    </html>
  )
}