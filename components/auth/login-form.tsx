
"use client"

import { useState } from "react"

import { Mail, Lock } from "lucide-react"

import { createClient } from "@/lib/supabase-browser"

import { Input } from "@/components/ui/input"

import { AppButton } from "@/components/ui/app-button"

import { toast } from "sonner"

export function LoginForm() {

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)

    async function handleLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault()

        if (loading) return

        try {

            setLoading(true)

            const supabase = createClient()

            const { error } = await supabase.auth
                .signInWithPassword({
                    email: email.trim(),
                    password,
                })

            if (error) throw error

            window.location.href = "/dashboard"

        } catch (error) {

            console.error("LOGIN_ERROR", error)

            toast.error("E-mail ou senha inválidos")

            setLoading(false)
        }
    }

    return (

        <div className="
            w-full
            rounded-[10px]
            border
            border-border
            bg-card/80
            p-4
            shadow-sm

            sm:p-6

            lg:p-8
            lg:shadow-xl
            lg:backdrop-blur-xl
        ">

            {/* CABEÇALHO */}

            <div className="mb-5 sm:mb-6">

                <p className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-primary
                ">
                    Acessar plataforma
                </p>

                <h2 className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-tight
                    text-foreground

                    sm:text-3xl
                ">
                    Entrar
                </h2>

                <p className="
                    mt-2
                    text-sm
                    leading-relaxed
                    text-muted
                ">
                    Faça login para acessar o sistema de gestão do projeto.
                </p>

            </div>

            {/* FORMULÁRIO */}

            <form
                onSubmit={handleLogin}
                className="space-y-4"
            >

                {/* E-MAIL */}

                <div className="space-y-1.5">

                    <label
                        htmlFor="email"
                        className="
                            text-xs
                            font-medium
                            text-foreground

                            sm:text-sm
                        "
                    >
                        E-mail
                    </label>

                    <div className="relative">

                        <Mail
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted
                            "
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="voce@email.com"
                            required
                            disabled={loading}
                            className="
                                h-11
                                rounded-lg
                                pl-10
                                text-base
                                md:text-sm
                            "
                        />

                    </div>

                </div>

                {/* SENHA */}

                <div className="space-y-1.5">

                    <label
                        htmlFor="password"
                        className="
                            text-xs
                            font-medium
                            text-foreground

                            sm:text-sm
                        "
                    >
                        Senha
                    </label>

                    <div className="relative">

                        <Lock
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted
                            "
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Sua senha"
                            required
                            disabled={loading}
                            className="
                                h-11
                                rounded-lg
                                pl-10
                                text-base
                                md:text-sm
                            "
                        />

                    </div>

                </div>

                {/* BOTÃO DE ACESSO */}

                <AppButton
                    type="submit"
                    loading={loading}
                    className="
                        h-11
                        w-full
                        rounded-lg
                        text-sm
                    "
                >
                    {loading ? "Entrando..." : "Entrar"}
                </AppButton>

            </form>

        </div>
    )
}
