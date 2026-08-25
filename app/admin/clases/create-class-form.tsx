"use client"

import { useState } from "react"
import { createLiveClass } from "@/app/actions/classes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CreateClassForm({ groups }: { groups: any[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createLiveClass(formData)
    setLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Clase programada exitosamente")
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[oklch(0.88_0.04_145)] space-y-4">
      <h3 className="font-bold text-lg mb-4 text-[oklch(0.25_0.10_145)]">Programar Nueva Clase</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Grupo (Cohorte)</label>
          <select name="group_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Selecciona un grupo...</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name} - {g.course?.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Título de la Clase</label>
          <input type="text" name="title" required placeholder="Ej. Bienvenida y Módulo 1" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de Inicio</label>
          <input type="datetime-local" name="scheduled_at" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de Finalización</label>
          <input type="datetime-local" name="scheduled_end_at" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción (Opcional)</label>
          <input type="text" name="description" placeholder="Temas a tratar..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? "Programando..." : "Programar Clase"}
      </Button>
    </form>
  )
}
