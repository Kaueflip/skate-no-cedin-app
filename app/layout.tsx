import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"

import "./globals.css"

import { ThemeProvider } from "next-themes"

import { TooltipProvider } from "@/components/ui/tooltip"

import { Toaster } from "@/components/ui/sonner"

import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Skate no Cedin",
  description: "Sistema de gestão do projeto Skate no Cedin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className={GeistSans.className}>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >

          <TooltipProvider>

            {children}

            <Toaster toastOptions={{
              classNames: {
                toast: `
        border-white/40

        bg-[#eef1fb]

        text-zinc-900

        shadow-xl

        backdrop-blur-2xl
      `,

                description:
                  "text-zinc-500",

                actionButton:
                  "bg-zinc-900 text-white",

                cancelButton:
                  "bg-zinc-200 text-zinc-900",
              },
            }} />

            <Analytics />

          </TooltipProvider>

        </ThemeProvider>

      </body>
    </html>
  )
}