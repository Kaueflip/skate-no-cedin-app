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
        border-white/40

        bg-white/60

        backdrop-blur-2xl

        dark:border-white/10

        dark:bg-[#0d0d10]/90
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
                border-white/40

                bg-white/60

                p-4

                shadow-sm

                transition-all

                hover:bg-white/80

                dark:border-white/10

                dark:bg-zinc-900/70

                dark:hover:bg-zinc-900
              "
            >

              <Link href="/dashboard">

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

                    text-zinc-900

                    dark:text-white
                  ">

                    Skate no Cedin

                  </span>

                  <span className="
                    text-xs

                    text-zinc-500

                    dark:text-zinc-400
                  ">

                    Sistema de Gestão

                  </span>

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

              text-zinc-400
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
                              bg-zinc-900
                              text-white

                              shadow-sm

                              hover:bg-zinc-800
                              hover:text-white

                              dark:bg-white
                              dark:text-zinc-900

                              dark:hover:bg-zinc-200
                            `
                          : `
                              bg-transparent

                              text-zinc-600

                              hover:bg-white/70
                              hover:text-zinc-900

                              dark:text-zinc-400

                              dark:hover:bg-zinc-900
                              dark:hover:text-white
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
                    border-white/40

                    bg-white/60

                    px-4

                    shadow-sm

                    hover:bg-white/80

                    dark:border-white/10

                    dark:bg-zinc-900/70

                    dark:hover:bg-zinc-900
                  "
                >

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-full

                    bg-zinc-900

                    text-white

                    dark:bg-white

                    dark:text-zinc-900
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

                      text-zinc-900

                      dark:text-white
                    ">

                      Professor

                    </span>

                    <span className="
                      text-xs

                      text-zinc-500

                      dark:text-zinc-400
                    ">

                      Administração

                    </span>

                  </div>

                  <ChevronUp
                    className="
                      ml-auto
                      h-4
                      w-4

                      text-zinc-500

                      dark:text-zinc-400
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
                  border-white/40

                  bg-white/90

                  backdrop-blur-xl

                  dark:border-white/10

                  dark:bg-zinc-900/95
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

                    dark:text-red-400
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