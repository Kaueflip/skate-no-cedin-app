"use client"

import {
    useState,
} from "react"

import {
    Loader2,
    Mail,
    Lock,
} from "lucide-react"

import {
    createClient,
} from "@/lib/supabase-browser"

import { Input }
    from "@/components/ui/input"

import { AppButton }
    from "@/components/ui/app-button"

import { toast }
    from "sonner"

export function LoginForm() {

    const [
        email,
        setEmail,
    ] = useState("")

    const [
        password,
        setPassword,
    ] = useState("")

    const [
        loading,
        setLoading,
    ] = useState(false)

    async function handleLogin(
        event:
            React.FormEvent
    ) {

        event.preventDefault()

        try {

            setLoading(true)

            const supabase =
                createClient()

            const {
                error,
            } = await supabase.auth
                .signInWithPassword({

                    email,

                    password,
                })

            if (error)
                throw error

            window.location.href =
                "/dashboard"

        } catch (error) {

            console.error(
                "LOGIN_ERROR",
                error
            )

            toast.error(
                "E-mail ou senha inválidos"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="
      rounded-4xl

      border
      border-border

      bg-card/80

      p-8

      shadow-2xl

      backdrop-blur-xl
    ">

            <div className="
        mb-8
      ">

                <p className="
          text-sm
          font-semibold

          uppercase

          tracking-[0.25em]

          text-primary
        ">

                    Acessar plataforma

                </p>

                <h2 className="
          mt-4

          text-3xl
          font-black

          tracking-tight
        ">

                    Entrar

                </h2>

                <p className="
          mt-3

          text-muted
        ">

                    Faça login para acessar o sistema de gestão do projeto.

                </p>

            </div>

            <form
                onSubmit={handleLogin}
                className="
          space-y-5
        "
            >

                <div className="
          space-y-2
        ">

                    <label className="
            text-sm
            font-medium
          ">

                        E-mail

                    </label>

                    <div className="
            relative
          ">

                        <Mail
                            className="
                absolute
                left-4
                top-1/2

                h-4
                w-4

                -translate-y-1/2

                text-muted
              "
                        />

                        <Input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="
                voce@email.com
              "
                            required
                            className="
                h-12

                pl-11
              "
                        />

                    </div>

                </div>

                <div className="
          space-y-2
        ">

                    <label className="
            text-sm
            font-medium
          ">

                        Senha

                    </label>

                    <div className="
            relative
          ">

                        <Lock
                            className="
                absolute
                left-4
                top-1/2

                h-4
                w-4

                -translate-y-1/2

                text-muted
              "
                        />

                        <Input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="
                Sua senha
              "
                            required
                            className="
                h-12

                pl-11
              "
                        />

                    </div>

                </div>

                <AppButton
                    type="submit"
                    loading={loading}
                    className="
            h-12
            w-full
          "
                >

                    {loading ? (

                        <Loader2
                            className="
                h-4
                w-4

                animate-spin
              "
                        />

                    ) : (

                        "Entrar"

                    )}

                </AppButton>

            </form>

        </div>
    )
}