"use client"

import type { ReactNode } from "react"

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

export default function DashboardLayout({
  children,
}: Props) {

  return (

    <SidebarProvider>

      <AppSidebar />

      <SidebarInset>

        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

          <SidebarTrigger />

          <Separator
            orientation="vertical"
            className="mr-2 h-4"
          />

          <Breadcrumb>

            <BreadcrumbList>

              <BreadcrumbItem>

                <BreadcrumbPage>
                  Skate no Cedin
                </BreadcrumbPage>

              </BreadcrumbItem>

            </BreadcrumbList>

          </Breadcrumb>

        </header>

        <main className="flex flex-1 flex-col">

          {children}

        </main>

      </SidebarInset>

    </SidebarProvider>
  )
}