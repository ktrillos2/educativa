"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, BookOpen, Save } from "lucide-react"
import Link from "next/link"
import { createCourse } from "@/app/actions/courses"

export default function CrearCursoPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courseType, setCourseType] = useState("diplomado")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createCourse(formData)
      if (result?.error) {
        setError(result.error)
        setIsPending(false)
      }
      // Si no hay error, el action hace redirect
    } catch (err) {
      setError("Ocurrió un error inesperado.")
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-6">
        <Link href="/admin/cursos" className="inline-flex items-center text-sm text-[oklch(0.55_0.04_145)] hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver a Cursos
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="bg-[oklch(0.30_0.10_145)] px-6 py-5 text-white flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <div>
            <h1 className="text-xl font-bold">Crear Nuevo Curso</h1>
            <p className="text-white/70 text-sm">Añade un diplomado o programa ETDH al catálogo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="id" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                ID del Curso (URL Slug) *
              </label>
              <input
                type="text"
                id="id"
                name="id"
                required
                placeholder="ej: seguridad-salud-trabajo"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <p className="text-xs text-[oklch(0.55_0.04_145)]">No uses espacios ni mayúsculas. Solo letras, números y guiones.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                Tipo de Curso *
              </label>
              <select
                id="type"
                name="type"
                required
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
              >
                <option value="diplomado">Diplomado (Autoestudio)</option>
                <option value="etdh">Programa ETDH (Grupos y Clases)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
              Título del Curso *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="ej: Diplomado en Salud Ocupacional"
              className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
              Descripción Breve
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe de qué trata el curso..."
              className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                Categoría
              </label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="ej: Salud y Bienestar"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                Precio (Valor del Certificado)
              </label>
              <input
                type="text"
                id="price"
                name="price"
                placeholder="ej: $150.000 COP"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                Duración
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="ej: 120 horas"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="modules" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                Cantidad de Módulos
              </label>
              <input
                type="number"
                id="modules"
                name="modules"
                min="1"
                defaultValue="4"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courseType === "etdh" && (
              <div className="space-y-2">
                <label htmlFor="min_students" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                  Cupos Mínimos Requeridos
                </label>
                <input
                  type="number"
                  id="min_students"
                  name="min_students"
                  min="1"
                  defaultValue="15"
                  className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                URL de la Imagen de Portada
              </label>
              <input
                type="url"
                id="image"
                name="image"
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[oklch(0.88_0.04_145)] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg border border-[oklch(0.88_0.04_145)] text-[oklch(0.55_0.04_145)] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Guardando..." : "Crear Curso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
