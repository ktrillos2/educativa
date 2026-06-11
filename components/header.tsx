"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronDown } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Diplomados", href: "/diplomados" },
  { label: "Contacto", href: "/contacto" },
]

interface HeaderProps {
  session?: { userId: string; role: string; name: string } | null
}

export function Header({ session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await logoutAction()
      if (res?.success) {
        toast.success("Sesión cerrada correctamente")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Error al cerrar sesión")
      }
    } catch (e) {
      toast.error("Error al cerrar sesión")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300 bg-background shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/image.png"
              alt="Academia de Formación Líderes del Mérito"
              width={100}
              height={100}
              className="h-16 md:h-20 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors text-foreground hover:text-primary"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 w-44 border border-border bg-card shadow-lg py-1 ">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium transition-colors text-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {session ? (
              <>
                {session.role !== 'admin' && (
                  <Link href="/estudiante">
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white font-medium">
                      Mi Aula
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className=" border-primary text-primary hover:bg-primary hover:text-white font-medium"
                >
                  {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                </Button>
                <Link href="/diplomados">
                  <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90  font-bold">
                    Inscribirse
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className=" border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90  font-bold">
                    Inscribirse
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border py-4 shadow-lg rounded-b-md">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4 px-4">
              {session ? (
                <>
                  {session.role !== 'admin' && (
                    <Link href="/estudiante" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent font-medium mb-1">
                        Mi Aula
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    disabled={isLoggingOut}
                    className="w-full bg-transparent  font-medium"
                  >
                    {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                  </Button>
                  <Link href="/diplomados" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-secondary text-secondary-foreground  font-bold">
                      Inscribirse
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent ">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-secondary text-secondary-foreground  font-bold">
                      Inscribirse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
