"use client"

import { useEffect, useState } from "react"

import { usePathname, useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase"

import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Alunos",
  "/attendance": "Frequência",
  "/progress": "Progressão Técnica",
  "/reports": "Relatórios",
  "/settings": "Configurações",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const currentRoute =
    routeNames[pathname] || "Dashboard"

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {

      router.push("/login")

      return
    }

    setLoading(false)
  }

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  return (

    <SidebarProvider>

      <AppSidebar />

      <SidebarInset>

        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">

          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="mr-2 h-4"
          />

          <Breadcrumb>

            <BreadcrumbList>

              <BreadcrumbItem className="hidden md:block">

                <BreadcrumbLink href="/dashboard">
                  Skate no Cedin
                </BreadcrumbLink>

              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>

                <BreadcrumbPage>
                  {currentRoute}
                </BreadcrumbPage>

              </BreadcrumbItem>

            </BreadcrumbList>

          </Breadcrumb>

        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>

      </SidebarInset>

    </SidebarProvider>
  )
}
