import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Skate no Cedin - Projeto Pedagógico de Skate Escolar',
  description: 'Sistema de gestão pedagógica e esportiva para aulas de skate em escolas públicas. Acompanhe frequência, progressão técnica e métricas educacionais.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://vcurlhurvhjgmxxhsasd.supabase.co/storage/v1/object/public/assets/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
