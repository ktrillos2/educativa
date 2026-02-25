"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronDown } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  {
    label: "Oferta Académica",
    href: "#oferta",
    children: [
      { label: "Diplomados", href: "/diplomados" },
      { label: "Formación Académica", href: "/formacion-academica" },
    ],
  },
  { label: "Contacto", href: "/contacto" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300 bg-card/95 backdrop-blur shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/image.png"
              alt="Academia de Formación Líderes del Mérito"
              width={100}
              height={100}
              className="h-20 w-auto"
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
                      <div className="absolute top-full left-0 w-44 border border-border bg-card shadow-lg py-1 rounded-md">
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
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-primary text-primary hover:bg-primary hover:text-white"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md">
              Inscribirse
            </Button>
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
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full bg-transparent rounded-md">
                  Iniciar Sesión
                </Button>
              </Link>
              <Button size="sm" className="w-full bg-secondary text-secondary-foreground rounded-md">
                Inscribirse
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
