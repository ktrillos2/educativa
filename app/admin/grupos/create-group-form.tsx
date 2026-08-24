"use client"

import { useState } from "react"
import { createGroup } from "@/app/actions/grupos"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CreateGroupForm({ courses }: { courses: any[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createGroup(formData)
    setLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Grupo creado exitosamente")
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[oklch(0.88_0.04_145)] space-y-4">
      <h3 className="font-bold text-lg mb-4 text-[oklch(0.25_0.10_145)]">Crear Nuevo Grupo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Diplomado / Curso</label>
          <select name="course_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Selecciona un diplomado...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre del Grupo (Ej. Grupo 1)</label>
          <input type="text" name="name" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Inicio de Inscripción</label>
          <input type="datetime-local" name="registration_start" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fin de Inscripción</label>
          <input type="datetime-local" name="registration_end" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Enlace de WhatsApp (Opcional)</label>
          <input type="url" name="whatsapp_link" placeholder="https://chat.whatsapp.com/..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? "Creando..." : "Crear Grupo"}
      </Button>
    </form>
  )
}
