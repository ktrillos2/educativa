import { Settings } from "lucide-react"

export default function AdminConfiguracionPage() {
  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Configuración del Sistema</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Ajustes generales de la plataforma.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
        <div className="w-16 h-16 bg-[oklch(0.97_0.01_145)] rounded-2xl flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-[oklch(0.40_0.08_145)]" />
        </div>
        <h2 className="text-xl font-bold text-[oklch(0.25_0.10_145)] mb-2">Módulo en construcción</h2>
        <p className="text-[oklch(0.55_0.04_145)] max-w-md">
          Las opciones de configuración globales (variables de entorno, correos automáticos, integración de pagos) estarán disponibles próximamente.
        </p>
      </div>
    </div>
  )
}
