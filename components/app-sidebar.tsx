"use client"

import Image from "next/image"

import {
  LogOut,
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

import Link from "next/link"

import {
  useRouter,
  usePathname,
} from "next/navigation"

import { useTheme }
  from "next-themes"

import { createClient }
  from "@/lib/supabase-browser"

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

  const pathname =
    usePathname()

  const router =
    useRouter()

  const supabase =
    createClient()

  const {
    resolvedTheme,
    setTheme,
  } = useTheme()

  async function handleLogout() {

    await supabase.auth
      .signOut()

    router.push("/login")
  }

  return (

    <Sidebar
      className="
        border-r
        border-border

        bg-sidebar

        backdrop-blur-2xl
      "
    >

      <SidebarHeader className="p-4">

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              size="lg"
              asChild
              className="
                h-auto

                rounded-2xl

                border
                border-border

                bg-card

                p-4

                shadow-sm

                backdrop-blur-2xl

                transition-all

                hover:bg-white/70

                dark:hover:bg-white/4
              "
            >

              <Link href="/dashboard">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <>
                    <Image
                      unoptimized
                      src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                      alt="Skate no Cedin"
                      width={52}
                      height={52}
                      className="
                        h-12
                        w-auto

                        dark:hidden
                      "
                    />

                    <Image
                      unoptimized
                      src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo-light-cedin.png"
                      alt="Skate no Cedin"
                      width={52}
                      height={52}
                      className="
                        hidden

                        h-12
                        w-auto

                        dark:block
                      "
                    />
                  </>

                  <div className="
                    flex
                    flex-col
                    gap-1
                  ">

                    <span className="
                      text-sm
                      font-semibold

                      text-sidebar-foreground
                    ">

                      Skate no Cedin

                    </span>

                    <span className="
                      text-xs

                      text-muted
                    ">

                      Sistema de Gestão

                    </span>

                  </div>

                </div>

              </Link>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarHeader>

      <SidebarContent className="px-3">

        <SidebarGroup>

          <SidebarGroupLabel
            className="
              px-3

              text-xs
              font-semibold
              uppercase

              tracking-[0.2em]

              text-muted
            "
          >

            Navegação

          </SidebarGroupLabel>

          <SidebarGroupContent>

            <SidebarMenu className="mt-3 gap-2">

              {menuItems.map((item) => {

                const active =
                  pathname ===
                  item.url

                return (

                  <SidebarMenuItem
                    key={item.title}
                  >

                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`
                        h-12

                        rounded-2xl

                        px-4

                        transition-all

                        ${active
                          ? `
                              bg-primary
                              text-primary-foreground

                              shadow-sm

                              hover:bg-accent-hover
                              hover:text-primary-foreground
                            `
                          : `
                              bg-transparent

                              text-muted

                              hover:bg-white/70
                              hover:text-foreground

                              dark:hover:bg-white/4
                            `
                        }
                      `}
                    >

                      <Link
                        href={item.url}
                      >

                        <item.icon
                          className="h-5 w-5"
                        />

                        <span className="
                          text-sm
                          font-medium
                        ">

                          {item.title}

                        </span>

                      </Link>

                    </SidebarMenuButton>

                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-4">

        <SidebarMenu>

          <SidebarMenuItem>

            <DropdownMenu>

              <DropdownMenuTrigger
                asChild
              >

                <SidebarMenuButton
                  className="
                    h-14

                    rounded-2xl

                    border
                    border-border

                    bg-card

                    px-4

                    shadow-sm

                    backdrop-blur-2xl

                    hover:bg-white/70

                    dark:hover:bg-white/4
                  "
                >

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-full

                    bg-primary

                    text-primary-foreground
                  ">

                    <User2
                      className="
                        h-5
                        w-5
                      "
                    />

                  </div>

                  <div className="
                    flex
                    flex-col
                    items-start
                  ">

                    <span className="
                      text-sm
                      font-semibold

                      text-foreground
                    ">

                      Professor

                    </span>

                    <span className="
                      text-xs

                      text-muted
                    ">

                      Administração

                    </span>

                  </div>

                  <ChevronUp
                    className="
                      ml-auto
                      h-4
                      w-4

                      text-muted
                    "
                  />

                </SidebarMenuButton>

              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="
                  w-60

                  rounded-2xl

                  border
                  border-border

                  bg-card

                  backdrop-blur-2xl
                "
              >

                <DropdownMenuItem>

                  Meu Perfil

                </DropdownMenuItem>

                <DropdownMenuItem>

                  Configurações

                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setTheme(
                      resolvedTheme === "dark"
                        ? "light"
                        : "dark"
                    )
                  }
                >

                  {resolvedTheme === "dark"
                    ? (
                      <Sun className="
                        mr-2
                        h-4
                        w-4
                      " />
                    )
                    : (
                      <Moon className="
                        mr-2
                        h-4
                        w-4
                      " />
                    )
                  }

                  {resolvedTheme === "dark"
                    ? "Modo Claro"
                    : "Modo Escuro"
                  }

                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="
                    text-red-500
                  "
                >

                  <LogOut className="
                    mr-2
                    h-4
                    w-4
                  " />

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