"use client"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronUp,
  User2,
  Moon,
  Sun,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Alunos",
    url: "/students",
    icon: Users,
  },
  {
    title: "Frequência",
    url: "/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Progressão Técnica",
    url: "/progress",
    icon: TrendingUp,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">SC</span>
                </div >
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Skate no Cedin</span>
                  <span className="text-xs text-muted-foreground">Sistema de Gestão</span>
                </div>
              </Link >
            </SidebarMenuButton >
          </SidebarMenuItem >
        </SidebarMenu >
      </SidebarHeader >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>Professor</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {mounted && theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>{mounted && theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu >
          </SidebarMenuItem >
        </SidebarMenu >
      </SidebarFooter >
    </Sidebar >
  )
}
