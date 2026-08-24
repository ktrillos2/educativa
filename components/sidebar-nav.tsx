"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart2,
  Settings,
  Award,
  Video,
  type LucideIcon,
} from "lucide-react"

// ── Nav item definitions live here (client-only) so icons are never serialized ──

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin",           icon: LayoutDashboard },
  { label: "Usuarios",  href: "/admin/usuarios",  icon: Users },
  { label: "Cursos",    href: "/admin/cursos",     icon: BookOpen },
  { label: "Grupos",    href: "/admin/grupos",     icon: Users },
  { label: "Clases",    href: "/admin/clases",     icon: Video },
  { label: "Reportes",  href: "/admin/reportes",   icon: BarChart2 },
]

const ESTUDIANTE_NAV: NavItem[] = [
  { label: "Mi Dashboard",  href: "/estudiante",                   icon: LayoutDashboard },
  { label: "Mis Cursos",    href: "/estudiante/cursos",            icon: BookOpen },
  { label: "Certificados",  href: "/estudiante/certificados",      icon: Award },
]

// ── Root hrefs that must match exactly (not startsWith) ──
const EXACT_MATCH = new Set(["/admin", "/estudiante"])

interface SidebarNavProps {
  variant: "admin" | "estudiante"
}

export function SidebarNav({ variant }: SidebarNavProps) {
  const pathname = usePathname()
  const items = variant === "admin" ? ADMIN_NAV : ESTUDIANTE_NAV

  return (
    <nav className="bg-white p-3 space-y-1">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = EXACT_MATCH.has(href)
          ? pathname === href
          : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              isActive
                ? "bg-[oklch(0.35_0.10_145)] text-white font-semibold"
                : "text-[oklch(0.35_0.06_145)] hover:bg-[oklch(0.35_0.10_145)] hover:text-white"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-opacity ${
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              }`}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
