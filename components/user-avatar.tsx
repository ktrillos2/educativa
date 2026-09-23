"use client"

import React from "react"
import { Crown } from "lucide-react"

interface UserAvatarProps {
  name?: string
  role?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showBadge?: boolean
}

const GRADIENTS = [
  "from-emerald-500 to-teal-700 text-white shadow-emerald-500/20",
  "from-indigo-500 to-purple-600 text-white shadow-indigo-500/20",
  "from-blue-500 to-cyan-600 text-white shadow-blue-500/20",
  "from-rose-500 to-pink-600 text-white shadow-rose-500/20",
  "from-amber-500 to-orange-600 text-white shadow-amber-500/20",
  "from-teal-600 to-emerald-800 text-white shadow-teal-500/20",
  "from-violet-600 to-indigo-800 text-white shadow-violet-500/20",
  "from-sky-500 to-indigo-600 text-white shadow-sky-500/20",
]

function getInitials(name?: string) {
  if (!name || name.trim() === "") return "U"
  const parts = name.trim().split(" ").filter(Boolean)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getGradientIndex(name: string = ""): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % GRADIENTS.length
}

export function UserAvatar({
  name = "Usuario",
  role = "student",
  size = "md",
  className = "",
  showBadge = true,
}: UserAvatarProps) {
  const initials = getInitials(name)
  const isAdmin = role === "admin" || role === "teacher"

  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-bold",
    md: "w-10 h-10 text-sm font-extrabold",
    lg: "w-12 h-12 text-base font-extrabold",
    xl: "w-14 h-14 text-xl font-black",
  }[size]

  // Estilo para administradores / profesores vs estudiantes
  const gradientClass = isAdmin
    ? "from-[oklch(0.32_0.12_145)] to-[oklch(0.20_0.08_145)] text-white ring-2 ring-[oklch(0.80_0.10_145)] shadow-emerald-900/30"
    : GRADIENTS[getGradientIndex(name)]

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses} ${gradientClass} rounded-full bg-gradient-to-br flex items-center justify-center shadow-sm select-none border border-white/20 transition-transform hover:scale-105`}
      >
        <span className="drop-shadow-xs tracking-wider">{initials}</span>
      </div>

      {showBadge && isAdmin && (
        <span
          className="absolute -bottom-0.5 -right-0.5 bg-amber-400 text-slate-950 p-0.5 rounded-full ring-2 ring-white shadow-xs font-bold flex items-center justify-center text-[9px]"
          title="Staff / Docente"
        >
          <Crown className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
        </span>
      )}
    </div>
  )
}
