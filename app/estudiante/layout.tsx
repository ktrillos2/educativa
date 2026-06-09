import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EstudianteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card rounded-lg border shadow-sm p-4 sticky top-28">
            <h2 className="font-semibold text-lg mb-4">Mi Cuenta</h2>
            <nav className="space-y-2">
              <a href="/estudiante" className="block px-3 py-2 bg-primary/10 text-primary rounded-md font-medium">Dashboard</a>
              <a href="#" className="block px-3 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">Mis Cursos</a>
              <a href="#" className="block px-3 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">Certificados</a>
              <a href="#" className="block px-3 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">Configuración</a>
            </nav>
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
