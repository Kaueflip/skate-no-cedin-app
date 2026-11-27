"use client"

import { useRef, useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"

import { createClient } from "@/lib/supabase-browser"
import { Input } from "@/components/ui/input"
import { AppButton } from "@/components/ui/app-button"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const submitting = useRef(false)

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current) return

        setErrorMessage("")
        if (!email.trim() || !password) {
            setErrorMessage("Informe seu e-mail e sua senha.")
            return
        }

        submitting.current = true
        setLoading(true)
        setShowPassword(false)
        let redirecting = false

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                if (error.status === 429) {
                    setErrorMessage("Muitas tentativas de acesso. Tente novamente mais tarde.")
                } else if (error.code === "invalid_credentials") {
                    setErrorMessage("E-mail ou senha inválidos. Confira suas credenciais.")
                } else {
                    setErrorMessage("Não foi possível entrar. Confira seus dados ou tente novamente.")
                }
                return
            }

            // Mantém a navegação completa usada pelo fluxo de autenticação existente.
            window.location.href = "/dashboard"
            redirecting = true
        } catch {
            setErrorMessage("Não foi possível conectar à plataforma. Tente novamente.")
        } finally {
            if (!redirecting) {
                submitting.current = false
                setLoading(false)
            }
        }
    }

    return (
        <div className="w-full min-w-0 rounded-[10px] border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Acessar sua conta</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Informe suas credenciais para continuar.
                </p>
            </div>

            <form onSubmit={handleLogin} aria-busy={loading} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</label>
                    <div className="relative">
                        <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={email}
                            onChange={(event) => { setEmail(event.target.value); setErrorMessage("") }}
                            placeholder="voce@email.com"
                            required
                            disabled={loading}
                            aria-describedby={errorMessage ? "login-error" : undefined}
                            className="h-11 min-w-0 rounded-lg pl-10 text-base md:text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">Senha</label>
                    <div className="relative">
                        <Lock aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={password}
                            onChange={(event) => { setPassword(event.target.value); setErrorMessage("") }}
                            placeholder="Sua senha"
                            required
                            disabled={loading}
                            aria-describedby={errorMessage ? "login-error" : undefined}
                            className="h-11 min-w-0 rounded-lg pl-10 pr-12 text-base md:text-sm"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            aria-controls="password"
                            disabled={loading}
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute inset-y-0 right-0 flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <p id="login-error" role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm leading-relaxed text-red-700 dark:text-red-300">
                        {errorMessage}
                    </p>
                )}

                <AppButton type="submit" loading={loading} disabled={loading} className="min-h-11 w-full rounded-lg px-3 py-2 text-sm">
                    {loading ? "Entrando..." : "Entrar na plataforma"}
                    {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
                </AppButton>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                <span>Acesso restrito à equipe autorizada.</span>
            </div>
        </div>
    )
}
