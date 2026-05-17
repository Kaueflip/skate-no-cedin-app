import Image from "next/image"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#e5e8f7] text-zinc-900">
      <section className="relative overflow-hidden border-b border-zinc-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:py-36">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm backdrop-blur">
            Projeto Social • Skate • Educação
          </div>

          <h1 className="max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Skate no Cedin
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
            Muito além do skate. Um projeto que transforma vidas através da cultura urbana,
            educação, disciplina, amizade e desenvolvimento humano.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/login"
              className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
            >
              Entrar no Sistema
            </a>

            <a
              href="#sobre"
              className="rounded-2xl border border-white/20 bg-white/70 px-8 py-4 text-base font-semibold backdrop-blur transition hover:bg-white/10"
            >
              Conhecer Projeto
            </a>
          </div>

          <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 backdrop-blur">
              <p className="text-4xl font-black">+100</p>
              <p className="mt-2 text-sm text-zinc-500">
                Alunos Impactados
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 backdrop-blur">
              <p className="text-4xl font-black">2019</p>
              <p className="mt-2 text-sm text-zinc-500">
                Desde
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 backdrop-blur">
              <p className="text-4xl font-black">2</p>
              <p className="mt-2 text-sm text-zinc-500">
                Turnos
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 backdrop-blur">
              <p className="text-4xl font-black">100%</p>
              <p className="mt-2 text-sm text-zinc-500">
                Inclusivo
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="sobre"
        className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-2"
      >
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Sobre o Projeto
          </p>

          <h2 className="text-4xl font-black leading-tight lg:text-5xl">
            O skate como ferramenta de transformação social.
          </h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-zinc-600">
          <p>
            O Skate no Cedin nasceu com o objetivo de oferecer acesso ao skate de forma
            educativa, segura e inclusiva.
          </p>

          <p>
            Mais do que ensinar manobras, o projeto desenvolve disciplina, autonomia,
            confiança, convivência social e senso de comunidade.
          </p>

          <p>
            Cada aula é construída para fortalecer o desenvolvimento físico, emocional e
            cultural dos alunos.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200/80 bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
              O que desenvolvemos
            </p>

            <h2 className="text-4xl font-black lg:text-5xl">
              Muito além das manobras.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-8">
              <h3 className="text-2xl font-bold">
                Disciplina
              </h3>

              <p className="mt-4 leading-relaxed text-zinc-500">
                Desenvolvimento de responsabilidade, rotina e comprometimento.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-8">
              <h3 className="text-2xl font-bold">
                Saúde
              </h3>

              <p className="mt-4 leading-relaxed text-zinc-500">
                Coordenação motora, equilíbrio, mobilidade e condicionamento físico.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-8">
              <h3 className="text-2xl font-bold">
                Cultura
              </h3>

              <p className="mt-4 leading-relaxed text-zinc-500">
                Vivência da cultura skate de forma positiva e educativa.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-8">
              <h3 className="text-2xl font-bold">
                Inclusão
              </h3>

              <p className="mt-4 leading-relaxed text-zinc-500">
                Um ambiente acolhedor para todos os níveis e perfis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200/80 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Galeria
            </p>

            <h2 className="text-4xl font-black lg:text-5xl">
              Vivências do projeto.
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-zinc-500">
              Cada sessão representa evolução, amizade, cultura e transformação através do skate.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

              <Image
                unoptimized
                src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(2).webp"
                alt="Skate"
                width={1200}
                height={800}
                className="h-[420px] w-full object-cover transition duration-500 hover:scale-105"
              />

            </div>

            <div className="grid gap-4">

              <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

                <Image
                  unoptimized
                  src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(1).webp"
                  alt="Skate"
                  width={1200}
                  height={800}
                  className="h-[200px] w-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

              <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

                <Image
                  unoptimized
                  src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(4).webp"
                  alt="Skate"
                  width={1200}
                  height={800}
                  className="h-[200px] w-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

            </div>

            <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

              <Image
                unoptimized
                src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(3).webp"
                alt="Skate"
                width={1200}
                height={800}
                className="h-[420px] w-full object-cover transition duration-500 hover:scale-105"
              />

            </div>

            <div className="grid gap-4">

              <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

                <Image
                  unoptimized
                  src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(6).webp"
                  alt="Skate"
                  width={1200}
                  height={800}
                  className="h-[200px] w-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

              <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/70 shadow-sm">

                <Image
                  unoptimized
                  src="https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/landing%20page/galeria/inst-cedin%20(5).webp"
                  alt="Skate"
                  width={1200}
                  height={800}
                  className="h-[200px] w-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

            </div>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[2rem] border border-zinc-200/80 bg-gradient-to-br from-white to-[#dfe3f5] p-10 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Sistema de Gestão
            </p>

            <h2 className="text-4xl font-black lg:text-5xl">
              Plataforma completa para gestão das aulas.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Controle de alunos, presença, evolução técnica, relatórios e métricas do
              projeto em um único lugar.
            </p>

            <a
              href="/login"
              className="mt-10 inline-flex rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
            >
              Acessar Plataforma
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200/80 py-8 text-center text-sm text-zinc-500">
        © 2026 Skate no Cedin • Todos os direitos reservados
      </footer>
    </main>
  )
}
