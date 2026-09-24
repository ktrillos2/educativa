"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, BookOpen, Save } from "lucide-react"
import Link from "next/link"
import { updateCourse } from "@/app/actions/courses"
import { ImageUploadZone } from "@/components/image-upload-zone"

export function EditCourseForm({ course }: { course: any }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courseType, setCourseType] = useState(course.type || "diplomado")
  const [title, setTitle] = useState(course.title || "")
  const [description, setDescription] = useState(course.description || "")
  const [category, setCategory] = useState(course.category || "")
  const [price, setPrice] = useState(course.price || "")
  const [duration, setDuration] = useState(course.duration || "")
  
  // Extract min_students from 'students' if it's etdh
  let minStudentsDefault = 15
  if (course.type === 'etdh' && course.students) {
    const match = course.students.match(/(\d+)/)
    if (match) {
      minStudentsDefault = parseInt(match[1], 10)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await updateCourse(formData)
      if (result?.error) {
        setError(result.error)
        setIsPending(false)
      }
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
        throw err
      }
      setError("Ocurrió un error inesperado al guardar.")
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
            <h1 className="text-xl font-bold">Editar Curso</h1>
            <p className="text-white/70 text-sm">Modifica los detalles del curso {course.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8" autoComplete="off">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input type="hidden" name="id" value={course.id} />
          
          <div className="grid md:grid-cols-2 gap-6">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
                defaultValue={course.modules}
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
                  defaultValue={minStudentsDefault}
                  className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            )}
            
            <div className="md:col-span-2">
              <ImageUploadZone defaultUrl={course.image || ""} />
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
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
