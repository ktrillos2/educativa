"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm text-sm text-white no-print"
      style={{ background: "oklch(0.30 0.10 145)" }}
    >
      <Printer className="w-4 h-4" />
      Imprimir / Guardar Ficha
    </button>
  )
}
