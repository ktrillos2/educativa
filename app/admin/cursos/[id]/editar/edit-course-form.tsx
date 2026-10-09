"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, BookOpen, Save, Loader2, FileText, ExternalLink, CheckCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { updateCourse } from "@/app/actions/courses"
import { deleteCourseInfoPdf } from "@/app/actions/pdf-info"
import { ImageUploadZone, ImageUploadZoneRef } from "@/components/image-upload-zone"

export function EditCourseForm({ course, currentPdfUrl }: { course: any; currentPdfUrl?: string | null }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isDeletingPdf, setIsDeletingPdf] = useState(false)
  const [confirmDeletePdf, setConfirmDeletePdf] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pdfUrlState, setPdfUrlState] = useState<string | null>(currentPdfUrl || null)
  const [courseType, setCourseType] = useState(course.type || "diplomado")
  const [title, setTitle] = useState(course.title || "")
  const [description, setDescription] = useState(course.description || "")
  const [category, setCategory] = useState(course.category || "")
  const [price, setPrice] = useState(course.price || "")
  const [duration, setDuration] = useState(course.duration || "")
  const imageZoneRef = useRef<ImageUploadZoneRef>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  
  // Extract min_students from 'students' if it's etdh
  let minStudentsDefault = 15
  if (course.type === 'etdh' && course.students) {
    const match = course.students.match(/(\d+)/)
    if (match) {
      minStudentsDefault = parseInt(match[1], 10)
    }
  }

  async function handleDeletePdf() {
    setIsDeletingPdf(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await deleteCourseInfoPdf(course.id)
      if (res.error) {
        setError(res.error)
      } else {
        setPdfUrlState(null)
        if (pdfInputRef.current) {
          pdfInputRef.current.value = ""
        }
        setSuccessMessage("PDF eliminado exitosamente.")
      }
    } catch (err: any) {
      console.error("Error al eliminar PDF:", err)
      setError("No se pudo eliminar el PDF.")
    } finally {
      setIsDeletingPdf(false)
      setConfirmDeletePdf(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Append image_file from ImageUploadZone ref if present
      const selectedFile = imageZoneRef.current?.getSelectedFile()
      if (selectedFile) {
        formData.set("image_file", selectedFile)
      }

      let uploadedPdf = false

      // 1. If a PDF file was selected, upload it using direct upload
      const pdfFileInput = formData.get("pdf_file") as File | null
      if (pdfFileInput && pdfFileInput.size > 0) {
        // a) Obtener URL firmada
        const ts = Date.now()
        const urlResponse = await fetch("/api/general-pdf-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "course", courseId: course.id, ts }),
        })
        
        const urlData = await urlResponse.json()
        if (!urlResponse.ok || urlData.error) {
          setError(`[Error al Guardar PDF] ${urlData.error || "No se pudo obtener url de subida."}`)
          setIsPending(false)
          return
        }

        const { signedUrl } = urlData

        // b) Subir directo a Supabase
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: pdfFileInput,
          headers: { "Content-Type": pdfFileInput.type || "application/pdf" },
        })

        if (!uploadResponse.ok) {
          setError(`[Error al Guardar PDF] Error al subir el documento al almacenamiento.`)
          setIsPending(false)
          return
        }

        // c) Confirmar en la BD
        const pdfResponse = await fetch("/api/upload-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "course", courseId: course.id, ts }),
        })

        const pdfResult = await pdfResponse.json()
        if (!pdfResponse.ok || pdfResult.error) {
          setError(`[Error al Guardar PDF] ${pdfResult.error || "No se pudo actualizar la configuración."}`)
          setIsPending(false)
          return
        }

        uploadedPdf = true
        // Delete pdf_file from formData so server action does not upload it twice
        formData.delete("pdf_file")
      }

      // 2. Execute course update server action
      const result = await updateCourse(formData)
      if (result?.error) {
        setError(result.error)
        setIsPending(false)
      } else {
        const targetId = result?.finalId || course.id
        if (uploadedPdf && pdfResult?.pdfUrl) {
          setPdfUrlState(pdfResult.pdfUrl)
        }
        setSuccessMessage(
          uploadedPdf
            ? "¡Curso y nuevo documento PDF guardados y publicados exitosamente!"
            : "¡Datos del curso guardados exitosamente!"
        )
        setIsPending(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
        throw err
      }
      console.error("Error al guardar cambios del curso:", err)
      setError(`Error al guardar los cambios: ${err?.message || "Ocurrió un error inesperado."}`)
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-green-900">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>PDF guardado exitosamente</span>
              </div>
              <a
                href={`/api/file/${encodeURIComponent(`Info - ${course.id}.pdf`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-300 text-green-800 font-bold text-xs hover:bg-green-100 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-green-600" /> Ver PDF <ExternalLink className="w-3 h-3" />
              </a>
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
                Precio (ej: $150.000 COP)
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
                Duración (ej: 120 horas)
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
            
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="pdf_file" className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                  Documento de Información (PDF) (Opcional)
                </label>
                {pdfUrlState && (
                  <div className="flex items-center gap-2">
                    <a
                      href={pdfUrlState}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ver PDF actual <ExternalLink className="w-3 h-3" />
                    </a>
                    {confirmDeletePdf ? (
                      <div className="inline-flex items-center gap-1.5 bg-red-50 p-1 rounded-md border border-red-200 animate-fade-in">
                        <span className="text-[11px] font-bold text-red-700 pl-1">¿Eliminar PDF?</span>
                        <button
                          type="button"
                          onClick={handleDeletePdf}
                          disabled={isDeletingPdf}
                          className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {isDeletingPdf ? "..." : "Sí"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeletePdf(false)}
                          className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeletePdf(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md border border-red-200 transition-colors"
                        title="Eliminar PDF actual"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar PDF
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="pdf_file"
                name="pdf_file"
                ref={pdfInputRef}
                accept="application/pdf,.pdf"
                className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="text-xs text-[oklch(0.55_0.04_145)]">
                {pdfUrlState
                  ? "Sube un nuevo archivo PDF si deseas reemplazar el documento actualmente guardado."
                  : "Sube un archivo PDF de información para este curso. Se mostrará en el botón \"¿Por qué cursar?\"."}
              </p>
            </div>

            <div className="md:col-span-2">
              <ImageUploadZone ref={imageZoneRef} defaultUrl={course.image || ""} />
            </div>
          </div>

          <div className="pt-6 border-t border-[oklch(0.88_0.04_145)] flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[oklch(0.88_0.04_145)] text-[oklch(0.55_0.04_145)] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
