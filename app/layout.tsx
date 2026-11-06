import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/lib/auth"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lideresdelmerito.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Academia de Formación Líderes del Mérito S.A.S.",
    template: "%s | Líderes del Mérito",
  },
  description:
    "Formación profesional de excelencia. Diplomados, cursos y certificaciones para impulsar tu carrera profesional en el sector público y privado.",
  keywords: [
    "diplomados",
    "formación profesional",
    "sector público",
    "certificaciones",
    "educación continua",
    "Líderes del Mérito",
    "Colombia",
  ],
  authors: [{ name: "Academia Líderes del Mérito S.A.S." }],
  creator: "Academia Líderes del Mérito S.A.S.",
  publisher: "Academia Líderes del Mérito S.A.S.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: BASE_URL,
    siteName: "Academia Líderes del Mérito S.A.S.",
    title: "Academia de Formación Líderes del Mérito S.A.S.",
    description:
      "Formación profesional de excelencia. Diplomados, cursos y certificaciones para impulsar tu carrera profesional.",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Academia Líderes del Mérito – Formación Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia de Formación Líderes del Mérito S.A.S.",
    description:
      "Formación profesional de excelencia. Diplomados, cursos y certificaciones para impulsar tu carrera.",
    images: ["/images/og-default.png"],
  },
  icons: {
    icon: "/images/image.png",
    shortcut: "/images/image.png",
    apple: "/images/image.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/image.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/image.png" />
      </head>
      <body className={`font-sans antialiased overflow-x-hidden w-full max-w-full`}>
        <div className="print:hidden">
          <Header session={session} />
        </div>
        {children}
        <div className="print:hidden">
          <Footer />
          <WhatsAppButton />
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
