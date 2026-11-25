"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, type MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useTheme } from "next-themes"

import {
  LogOut,
  LayoutDashboard,
  Users,
  BarChart3,
  ChevronUp,
  User2,
  Moon,
  Sun,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react"

import { createClient } from "@/lib/supabase-browser"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Controle de Aulas", url: "/classes", icon: CalendarDays },
  { title: "Alunos", url: "/students", icon: Users },
  { title: "Frequência", url: "/attendance", icon: ClipboardCheck },
  { title: "Professores", url: "/teachers", icon: BriefcaseBusiness },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Manual do Sistema", url: "/manual", icon: BookOpen },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { resolvedTheme, setTheme } = useTheme()
  const { setOpen, setOpenMobile } = useSidebar()

  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current === pathname) return

    previousPathname.current = pathname
    setOpen(false)
    setOpenMobile(false)
  }, [pathname, setOpen, setOpenMobile])

  function closeSidebar() {
    setOpen(false)
    setOpenMobile(false)
  }

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    closeSidebar()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    closeSidebar()
    router.push("/login")
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border bg-sidebar backdrop-blur-2xl"
    >
      <SidebarHeader className="p-3 pr-14 md:pr-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-auto rounded-xl border border-border bg-card p-2.5 shadow-sm backdrop-blur-2xl transition-all hover:bg-white/70 dark:hover:bg-white/4"
            >
              <Link href="/dashboard" onClick={handleNavigation}>
                <div className="flex min-w-0 items-center gap-2">
                  <Image
                    unoptimized
                    src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                    alt="Skate no Cedin"
                    width={52}
                    height={52}
                    className="h-10 w-auto shrink-0 dark:hidden"
                  />
                  <Image
                    unoptimized
                    src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png"
                    alt="Skate no Cedin"
                    width={52}
                    height={52}
                    className="hidden h-10 w-auto shrink-0 dark:block"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">

                    <span className="text-xs text-muted">
                      Sistema de Gestão
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-1">
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 gap-1">
              {menuItems.map((item) => {
                const active =
                  pathname === item.url ||
                  pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`h-11 rounded-xl px-3 transition-all ${active
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-accent-hover hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground"
                        : "bg-transparent text-muted hover:bg-white/70 hover:text-foreground dark:hover:bg-white/4"
                        }`}
                    >
                      <Link
                        href={item.url}
                        onClick={handleNavigation}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 rounded-xl border border-border bg-card px-3 shadow-sm backdrop-blur-2xl hover:bg-white/70 dark:hover:bg-white/4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div className="flex min-w-0 flex-col items-start">
                    <span className="text-sm font-semibold text-foreground">Professor</span>
                    <span className="text-xs text-muted">Administração</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-muted" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-60 rounded-xl border border-border bg-card backdrop-blur-2xl"
              >
                <DropdownMenuItem className="min-h-11">Meu Perfil</DropdownMenuItem>
                <DropdownMenuItem className="min-h-11">Configurações</DropdownMenuItem>
                <DropdownMenuItem
                  className="min-h-11"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {resolvedTheme === "dark" ? "Modo Claro" : "Modo Escuro"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="min-h-11 text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
