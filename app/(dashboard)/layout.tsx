
import type { ReactNode } from "react"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

import { AppSidebar } from "@/components/app-sidebar"

type Props = {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: Props) {

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      className="min-w-0"
    >

      <AppSidebar />

      <SidebarInset className="min-w-0">

        <header className="
                    sticky top-0 z-30
                    flex h-14 shrink-0
                    items-center gap-2
                    border-b border-border
                    bg-background/95
                    px-3
                    backdrop-blur-xl
                    md:h-16 md:px-6
                ">

          <SidebarTrigger
            className="h-11 w-11 shrink-0"
            aria-label="Abrir ou fechar menu"
          />

          <Separator
            orientation="vertical"
            className="mr-1 h-4"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="
                                    text-sm font-semibold
                                ">
                  Skate no Cedin
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </header>

        <div className="
                    flex min-w-0 flex-1 flex-col
                ">
          {children}
        </div>

      </SidebarInset>

    </SidebarProvider>
  )
}
