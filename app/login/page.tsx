"use client"

import Image from "next/image"

import Link from "next/link"

import { useState }
    from "react"

import { useRouter }
    from "next/navigation"

import { toast }
    from "sonner"

import { createClient }
    from "@/lib/supabase-browser"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Label }
    from "@/components/ui/label"

import { Input }
    from "@/components/ui/input"

import { Button }
    from "@/components/ui/button"

import { AppButton }
    from "@/components/ui/app-button"

export default function LoginPage() {

    const router =
        useRouter()

    const supabase =
        createClient()

    const [email, setEmail] =
        useState("")

    const [
        password,
        setPassword,
    ] = useState("")

    const [loading, setLoading] =
        useState(false)

    async function handleLogin(
        e: React.FormEvent
    ) {

        e.preventDefault()

        /*
        =========================
        VALIDAÇÕES
        =========================
        */

        if (!email.trim()) {

            toast.error(
                "Informe o e-mail"
            )

            return
        }

        if (!password.trim()) {

            toast.error(
                "Informe a senha"
            )

            return
        }

        if (
            password.length < 6
        ) {

            toast.error(
                "Senha inválida"
            )

            return
        }

        try {

            setLoading(true)

            const { error } =
                await supabase.auth
                    .signInWithPassword({
                        email,
                        password,
                    })

            if (error)
                throw error

            toast.success(
                "Login realizado"
            )

            router.push(
                "/dashboard"
            )

            router.refresh()

        } catch {

            toast.error(
                "Email ou senha inválidos"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#e5e8f7]">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_35%)]" />

            <header className="relative z-10 border-b border-zinc-200/70 bg-white/50 backdrop-blur-xl">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >

                        <Image
                            unoptimized
                            src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                            alt="Skate no Cedin"
                            width={52}
                            height={52}
                            className="h-12 w-auto"
                        />

                        <div>

                            <p className="text-sm font-semibold leading-none">

                                Skate no Cedin

                            </p>

                            <p className="text-xs text-zinc-500">

                                Sistema de Gestão

                            </p>

                        </div>

                    </Link>

                    <Link href="/">

                        <Button
                            variant="outline"
                            className="border-zinc-300 bg-white/70"
                        >

                            Voltar ao site

                        </Button>

                    </Link>

                </div>

            </header>

            <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">

                <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">

                    <div className="hidden lg:block">

                        <div className="max-w-xl">

                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">

                                Plataforma Oficial

                            </p>

                            <h1 className="text-6xl font-black leading-none tracking-tight text-zinc-900">

                                Gestão moderna para o projeto.

                            </h1>

                            <p className="mt-8 text-xl leading-relaxed text-zinc-600">

                                Controle alunos, frequência, evolução técnica e relatórios em uma plataforma moderna, rápida e intuitiva.

                            </p>

                            <div className="mt-10 flex gap-4">

                                <div className="rounded-3xl border border-zinc-200/70 bg-white/60 px-6 py-5 backdrop-blur-xl">

                                    <p className="text-3xl font-black">

                                        +100

                                    </p>

                                    <p className="mt-1 text-sm text-zinc-500">

                                        Alunos

                                    </p>

                                </div>

                                <div className="rounded-3xl border border-zinc-200/70 bg-white/60 px-6 py-5 backdrop-blur-xl">

                                    <p className="text-3xl font-black">

                                        100%

                                    </p>

                                    <p className="mt-1 text-sm text-zinc-500">

                                        Inclusivo

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <Card className="border-zinc-200/70 bg-white/70 shadow-2xl backdrop-blur-xl">

                        <CardHeader className="space-y-3 text-center">

                            <div className="flex justify-center">

                                <Image
                                    unoptimized
                                    src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg"
                                    alt="Skate no Cedin"
                                    width={90}
                                    height={90}
                                    className="h-20 w-auto"
                                />

                            </div>

                            <CardTitle className="text-3xl font-black tracking-tight">

                                Entrar

                            </CardTitle>

                            <CardDescription className="text-base text-zinc-500">

                                Acesse o sistema de gestão do projeto

                            </CardDescription>

                        </CardHeader>

                        <CardContent>

                            <form
                                onSubmit={
                                    handleLogin
                                }
                                className="space-y-5"
                            >

                                <div className="space-y-2">

                                    <Label>
                                        E-mail
                                    </Label>

                                    <Input
                                        type="email"
                                        placeholder="seuemail@exemplo.com"
                                        className="h-12 border-zinc-200 bg-white/80"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="space-y-2">

                                    <Label>
                                        Senha
                                    </Label>

                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 border-zinc-200 bg-white/80"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <AppButton
                                    type="submit"
                                    className="w-full bg-foreground
                                        text-background
                                        hover:bg-foreground/90"
                                    loading={loading}
                                >

                                    Entrar no Sistema

                                </AppButton>

                            </form>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </main>
    )
}