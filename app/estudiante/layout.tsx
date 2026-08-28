import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"

export default async function EstudianteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_145)] pt-24 pb-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 rounded-xl overflow-hidden shadow-lg border border-[oklch(0.88_0.04_145)]">

            {/* Sidebar header */}
            <div className="bg-[oklch(0.30_0.10_145)] px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Mi Cuenta</p>
                <p className="text-white/60 text-xs truncate max-w-[140px]">{session.name}</p>
              </div>
            </div>

            {/* Nav items */}
            <SidebarNav variant="estudiante" />

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
