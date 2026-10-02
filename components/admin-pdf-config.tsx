"use client"

import { useState, useRef } from "react"
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, ExternalLink, Eye, BookOpen, Trash2 } from "lucide-react"
import { deleteGeneralInfoPdf, deleteCourseInfoPdf } from "@/app/actions/pdf-info"

interface PdfSection {
  type: "diplomados" | "etdh"
  label: string
  description: string
  hasContent: boolean
  pdfUrl?: string | null
}

interface CourseItem {
  id: string
  title: string
  type: string
}

interface AdminPdfConfigProps {
  sections: PdfSection[]
  courses?: CourseItem[]
  coursePdfs?: Record<string, string | null>
}

export function AdminPdfConfig({ sections, courses = [], coursePdfs = {} }: AdminPdfConfigProps) {
  return (
    <div className="space-y-8">
      {/* General PDFs Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> PDFs de Información General
        </h2>
        <div className="space-y-6">
          {sections.map((section) => (
            <PdfUploadCard key={section.type} section={section} />
          ))}
        </div>
      </div>

      {/* Individual Course PDFs Section */}
      {courses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" /> PDF Específico por Curso / Diplomado
          </h2>
          <p className="text-xs text-slate-500">
            Selecciona cualquier diplomado o programa del listado para adjuntarle su documento PDF individual ("Por qué cursar nuestro...").
          </p>
          <CoursePdfUploadCard courses={courses} initialCoursePdfs={coursePdfs} />
        </div>
      )}
    </div>
  )
}

function PdfUploadCard({ section }: { section: PdfSection }) {
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; pdfUrl?: string } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const activePdfUrl = result?.pdfUrl !== undefined ? result.pdfUrl : section.pdfUrl

  async function handleDelete() {
    setIsDeleting(true)
    setResult(null)

    const res = await deleteGeneralInfoPdf(section.type)
    if (res.error) {
      setResult({ error: res.error })
    } else {
      setResult({ success: true, pdfUrl: undefined })
    }
    setIsDeleting(false)
    setConfirmDelete(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setResult(null)

    try {
      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (!file) {
        setResult({ error: "No se seleccionó ningún archivo." })
        setIsPending(false)
        return
      }

      // 1. Obtener URL firmada
      const urlResponse = await fetch("/api/general-pdf-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: section.type }),
      })

      const urlData = await urlResponse.json()
      if (!urlResponse.ok || urlData.error) {
        throw new Error(urlData.error || "No se pudo obtener la URL de subida.")
      }

      const { signedUrl } = urlData

      // 2. Subir directo a Supabase
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/pdf" },
      })

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el archivo al almacenamiento.")
      }

      // 3. Confirmar subida
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: section.type }),
      })

      const data = await response.json()
      if (!response.ok || data.error) {
        setResult({ error: data.error || "No se pudo actualizar la configuración." })
      } else {
        setResult({ success: true, pdfUrl: data.pdfUrl })
      }
    } catch (err: any) {
      console.error("Error al subir PDF:", err)
      setResult({ error: err?.message || "Error de conexión al servidor al subir el PDF." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
      <div className="bg-[oklch(0.30_0.10_145)] px-6 py-4 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="font-bold text-base">{section.label}</h3>
            <p className="text-white/70 text-xs">{section.description}</p>
          </div>
        </div>
        {activePdfUrl && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
              <CheckCircle className="w-3.5 h-3.5" /> PDF Activo
            </span>
            {confirmDelete ? (
              <div className="inline-flex items-center gap-1.5 bg-red-950/80 px-2 py-1 rounded-full border border-red-500/50">
                <span className="text-[11px] font-bold text-red-200">¿Eliminar?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "..." : "Sí"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-200 px-2.5 py-1 rounded-full border border-red-400/30 transition-colors"
                title="Eliminar PDF"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
              Subir o Actualizar PDF Principal
            </label>
            <div className="relative">
              <input
                type="file"
                name="pdf_file"
                accept="application/pdf,.pdf"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-[oklch(0.88_0.04_145)] hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-[oklch(0.98_0.005_145)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
              />
            </div>
            {fileName && (
              <p className="text-xs text-[oklch(0.55_0.04_145)] flex items-center gap-1 font-medium">
                <FileText className="w-3.5 h-3.5 text-primary" /> Archivo seleccionado: {fileName}
              </p>
            )}
            <p className="text-xs text-slate-500">
              El PDF se guardará directamente y se visualizará integrado en las ventanas de detalles de los estudiantes.
            </p>
          </div>

          {result?.error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          )}

          {result?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4" /> ¡PDF guardado y publicado correctamente!
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70 text-sm shadow-md"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Subiendo PDF...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Guardar y Publicar PDF
              </>
            )}
          </button>
        </form>

        {activePdfUrl && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary" /> Vista Previa del PDF Actualmente Publicado
              </span>
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Abrir en nueva pestaña <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-80 rounded-lg overflow-hidden border bg-slate-100">
              <iframe
                src={`${activePdfUrl}#toolbar=0`}
                className="w-full h-full"
                title={`PDF ${section.label}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CoursePdfUploadCard({
  courses,
  initialCoursePdfs,
}: {
  courses: CourseItem[]
  initialCoursePdfs: Record<string, string | null>
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "")
  const [coursePdfs, setCoursePdfs] = useState<Record<string, string | null>>(initialCoursePdfs)
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; pdfUrl?: string } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  // Ref para limpiar el input de archivo al cambiar de curso y evitar subir el PDF equivocado
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activePdfUrl = selectedCourseId ? coursePdfs[selectedCourseId] : null
  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  async function handleDeleteCoursePdf() {
    if (!selectedCourseId || !selectedCourse) return

    setIsDeleting(true)
    setResult(null)

    const res = await deleteCourseInfoPdf(selectedCourseId)
    if (res.error) {
      setResult({ error: res.error })
    } else {
      setResult({ success: true, pdfUrl: undefined })
      setCoursePdfs((prev) => ({
        ...prev,
        [selectedCourseId]: null,
      }))
    }
    setIsDeleting(false)
    setShowDeleteConfirm(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedCourseId) return

    setIsPending(true)
    setResult(null)

    try {
      const file = fileInputRef.current?.files?.[0]
      if (!file) {
        setResult({ error: "No se seleccionó ningún archivo." })
        setIsPending(false)
        return
      }

      // 1. Obtener URL firmada
      const urlResponse = await fetch("/api/general-pdf-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", courseId: selectedCourseId }),
      })

      const urlData = await urlResponse.json()
      if (!urlResponse.ok || urlData.error) {
        throw new Error(urlData.error || "No se pudo obtener la URL de subida.")
      }

      const { signedUrl } = urlData

      // 2. Subir directo a Supabase
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/pdf" },
      })

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el archivo al almacenamiento.")
      }

      // 3. Confirmar subida en BD
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", courseId: selectedCourseId }),
      })

      const data = await response.json()
      if (!response.ok || data.error) {
        setResult({ error: data.error || "No se pudo actualizar la configuración del curso." })
      } else {
        setResult({ success: true, pdfUrl: data.pdfUrl })
        setCoursePdfs((prev) => ({
          ...prev,
          [selectedCourseId]: data.pdfUrl,
        }))
      }
    } catch (err: any) {
      console.error("Error al subir PDF del curso:", err)
      setResult({ error: err?.message || "Error de conexión al servidor." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-800 px-6 py-4 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-secondary" />
          <div>
            <h3 className="font-bold text-base">Asignar PDF a Diplomado / Programa Específico</h3>
            <p className="text-white/70 text-xs">Carga o actualiza el PDF individual de cualquier curso</p>
          </div>
        </div>
        {activePdfUrl && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
              <CheckCircle className="w-3.5 h-3.5" /> PDF Activo
            </span>
            {showDeleteConfirm ? (
              <div className="inline-flex items-center gap-1 bg-red-950/80 border border-red-500/50 rounded-full px-2 py-0.5 text-xs">
                <span className="text-red-200 font-medium px-1">¿Eliminar?</span>
                <button
                  type="button"
                  onClick={handleDeleteCoursePdf}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "..." : "Sí"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded-full transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-200 px-2.5 py-1 rounded-full border border-red-400/30 transition-colors disabled:opacity-50"
                title="Eliminar PDF de este curso"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              1. Selecciona el Diplomado o Programa:
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value)
                setResult(null)
                setFileName(null)
                // Limpiar el archivo seleccionado para evitar que se suba al curso equivocado
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm bg-white font-medium text-slate-900"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.type === "etdh" ? "Programa ETDH" : "Diplomado"}) {coursePdfs[c.id] ? "✓ (PDF Cargado)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              2. Adjunta el Archivo PDF para "{selectedCourse?.title}":
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="pdf_file"
              accept="application/pdf,.pdf"
              required
              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
              className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary/50 focus:outline-none text-sm bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/20 file:text-slate-900"
            />
            {fileName && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Archivo a subir: {fileName}
              </p>
            )}
          </div>

          {result?.error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          )}

          {result?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <p className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4" /> ¡PDF guardado correctamente para {selectedCourse?.title}!
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !selectedCourseId}
            className="px-6 py-2.5 rounded-lg bg-secondary text-slate-950 font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-70 text-sm shadow-md"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando PDF...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Guardar PDF del Curso
              </>
            )}
          </button>
        </form>

        {activePdfUrl && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-secondary" /> Vista Previa del PDF Activo de {selectedCourse?.title}
              </span>
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Abrir en nueva pestaña <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-80 rounded-lg overflow-hidden border bg-slate-100">
              <iframe
                src={`${activePdfUrl}#toolbar=0`}
                className="w-full h-full"
                title={`PDF ${selectedCourse?.title}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
