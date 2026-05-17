"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { createClient }
    from "@/lib/supabase-browser"

import { Button }
    from "@/components/ui/button"

import { Input }
    from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

import { toast }
    from "sonner"

export default function LoginPage() {

    const router =
        useRouter()

    const supabase =
        createClient()

    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [loading, setLoading] =
        useState(false)

    async function handleLogin() {

        try {

            setLoading(true)

            const { error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

            if (error)
                throw error

            toast.success(
                "Login realizado"
            )

            router.push("/dashboard")

            router.refresh()

        } catch (error) {

            toast.error(
                "Email ou senha inválidos"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="flex min-h-screen items-center justify-center p-6">

            <Card className="w-full max-w-sm">

                <CardHeader>

                    <CardTitle>
                        Skate no Cedin
                    </CardTitle>

                    <CardDescription>
                        Faça login para continuar
                    </CardDescription>

                </CardHeader>

                <CardContent className="space-y-4">

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"}
                    </Button>

                </CardContent>

            </Card>

        </div>
    )
}