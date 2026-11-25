
import type { Metadata } from "next"

import { GeistSans } from "geist/font/sans"

import "./globals.css"

import NextTopLoader from "nextjs-toploader"

import {
  ThemeProvider,
} from "@/components/theme/theme-provider"

import {
  TooltipProvider,
} from "@/components/ui/tooltip"

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

      <body
        className={`
                    ${GeistSans.className}

                    min-h-dvh

                    bg-background
                    text-foreground

                    antialiased
                `}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >

          <NextTopLoader
            color="#3b82f6"
            height={3}
            initialPosition={0.08}
            crawl={true}
            showSpinner={false}
            shadow={false}
            zIndex={2000}
            showForHashAnchor={false}
          />

          <TooltipProvider>

            {children}

            <Toaster
              toastOptions={{
                classNames: {

                  toast: `
                                        rounded-[10px]
                                        border-border
                                        bg-card
                                        text-card-foreground
                                        shadow-lg
                                    `,

                  description: `
                                        text-muted-foreground
                                    `,

                  actionButton: `
                                        rounded-md
                                        bg-primary
                                        text-primary-foreground
                                    `,

                  cancelButton: `
                                        rounded-md
                                        bg-secondary
                                        text-secondary-foreground
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
