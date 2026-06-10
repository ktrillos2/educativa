import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, BookOpen, BarChart2, Settings, ShieldCheck } from "lucide-react"

const navItems = [
  { label: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { label: "Usuarios",     href: "/admin/usuarios",     icon: Users },
  { label: "Cursos",       href: "/admin/cursos",       icon: BookOpen },
  { label: "Reportes",     href: "/admin/reportes",     icon: BarChart2 },
  { label: "Configuración",href: "/admin/configuracion",icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) redirect("/login")
  if (session.role !== "admin") redirect("/estudiante")

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_145)] pt-24 pb-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 rounded-xl overflow-hidden shadow-lg border border-[oklch(0.88_0.04_145)]">

            {/* Sidebar header */}
            <div className="bg-[oklch(0.30_0.10_145)] px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Administración</p>
                <p className="text-white/60 text-xs truncate max-w-[140px]">{session.name}</p>
              </div>
            </div>

            {/* Nav items */}
            <nav className="bg-white p-3 space-y-1">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[oklch(0.35_0.06_145)] hover:bg-[oklch(0.35_0.10_145)] hover:text-white transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Sidebar footer accent */}
            <div className="bg-[oklch(0.30_0.10_145)]/8 px-5 py-3 border-t border-[oklch(0.88_0.04_145)]">
              <p className="text-[oklch(0.40_0.08_145)] text-xs">Panel de control seguro</p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
