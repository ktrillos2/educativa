"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  BookOpen,
  Upload,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  HelpCircle,
  FileCheck,
  Sparkles,
  Eye,
  FileSearch,
} from "lucide-react"
import {
  uploadModulePdfAction,
  saveCourseExamsAction,
  parseExamTextAction,
  parsePdfFileAction,
  deleteModulePdfAction,
} from "@/app/actions/admin-modules"
import {
  uploadGeneralInfoPdf,
  uploadCourseInfoPdf,
  deleteGeneralInfoPdf,
  deleteCourseInfoPdf,
} from "@/app/actions/pdf-info"
import { Question } from "@/lib/exam-constants"

interface ModuleManagerProps {
  course: {
    id: string
    title: string
    category: string
    type: string
    modules: number
  }
  initialModulesCount: number
  initialPdfFilesStatus: Record<string, boolean>
  initialExamPdfStatus: Record<string, boolean>
  initialExamsData: Record<string, Question[]>
  initialCoursePdfUrl?: string | null
}

export function ModuleManager({
  course,
  initialModulesCount,
  initialPdfFilesStatus,
  initialExamPdfStatus,
  initialExamsData,
  initialCoursePdfUrl,
}: ModuleManagerProps) {
  const [modulesCount, setModulesCount] = useState<number>(initialModulesCount)
  const [pdfStatus, setPdfStatus] = useState<Record<string, any>>(initialPdfFilesStatus)
  const [examPdfStatus, setExamPdfStatus] = useState<Record<string, boolean>>(initialExamPdfStatus)
  const [examsData, setExamsData] = useState<Record<string, Question[]>>(initialExamsData)
  const [selectedModule, setSelectedModule] = useState<number>(1)

  // Course Info PDF state
  const [coursePdfUrl, setCoursePdfUrl] = useState<string | null>(initialCoursePdfUrl || null)
  const [isUploadingCoursePdf, setIsUploadingCoursePdf] = useState(false)
  const [coursePdfMessage, setCoursePdfMessage] = useState<{ text: string; error?: boolean } | null>(null)
  const [confirmDeleteCoursePdf, setConfirmDeleteCoursePdf] = useState(false)

  const [uploadingModule, setUploadingModule] = useState<number | null>(null)
  const [uploadMessage, setUploadMessage] = useState<{ text: string; error?: boolean } | null>(null)

  const [isPending, startTransition] = useTransition()
  const [saveMessage, setSaveMessage] = useState<{ text: string; error?: boolean } | null>(null)

  // Estados para modales/mensajes de confirmación
  const [confirmDeleteModule, setConfirmDeleteModule] = useState<number | null>(null)
  const [confirmDeletePdf, setConfirmDeletePdf] = useState<{type: "content"|"exam", moduleNum: number} | null>(null)

  const activeModuleKey = `mod-${selectedModule}`
  const activeQuestions = examsData[activeModuleKey] || []

  // Handlers for Course Specific PDF
  async function handleCoursePdfSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploadingCoursePdf(true)
    setCoursePdfMessage(null)

    try {
      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (!file) {
        setCoursePdfMessage({ text: "No se seleccionó ningún archivo.", error: true })
        setIsUploadingCoursePdf(false)
        return
      }

      const ts = Date.now()
      const urlResponse = await fetch("/api/general-pdf-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", courseId: course.id, ts }),
      })

      const urlData = await urlResponse.json()
      if (!urlResponse.ok || urlData.error) throw new Error(urlData.error || "No se pudo obtener la URL de subida.")

      const uploadResponse = await fetch(urlData.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/pdf" },
      })

      if (!uploadResponse.ok) throw new Error("Error al subir el archivo al almacenamiento.")

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", courseId: course.id, ts }),
      })

      const data = await response.json()
      if (!response.ok || data.error) {
        setCoursePdfMessage({ text: data.error || "No se pudo actualizar la configuración.", error: true })
      } else {
        setCoursePdfMessage({ text: "PDF del curso guardado exitosamente", error: false })
        setCoursePdfUrl(data.pdfUrl || `/api/file/Info - ${course.id}.pdf`)
      }
    } catch (err: any) {
      console.error("Error al subir PDF del curso:", err)
      setCoursePdfMessage({ text: err?.message || "Error de conexión al servidor al subir el PDF.", error: true })
    } finally {
      setIsUploadingCoursePdf(false)
    }
  }

  async function handleDeleteCoursePdf() {
    setIsUploadingCoursePdf(true)
    setCoursePdfMessage(null)

    const res = await deleteCourseInfoPdf(course.id)
    if (res.error) {
      setCoursePdfMessage({ text: res.error, error: true })
    } else {
      setCoursePdfMessage({ text: "PDF del curso eliminado exitosamente", error: false })
      setCoursePdfUrl(null)
    }
    setIsUploadingCoursePdf(false)
    setConfirmDeleteCoursePdf(false)
  }

  // Add a new empty question
  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `m${selectedModule}-q${activeQuestions.length + 1}`,
      question: "Nueva pregunta para la evaluación",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: 0,
      feedbackCorrect: "¡Respuesta correcta!",
      feedbackIncorrect: "Revisa el material del módulo.",
    }
    setExamsData((prev) => ({
      ...prev,
      [activeModuleKey]: [...(prev[activeModuleKey] || []), newQ],
    }))
  }

  // Delete question
  const handleDeleteQuestion = (idx: number) => {
    setExamsData((prev) => {
      const current = [...(prev[activeModuleKey] || [])]
      current.splice(idx, 1)
      return {
        ...prev,
        [activeModuleKey]: current,
      }
    })
  }

  // Edit question field
  const handleQuestionChange = (idx: number, field: keyof Question, value: any) => {
    setExamsData((prev) => {
      const current = [...(prev[activeModuleKey] || [])]
      current[idx] = { ...current[idx], [field]: value }
      return {
        ...prev,
        [activeModuleKey]: current,
      }
    })
  }

  // Edit question option
  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setExamsData((prev) => {
      const current = [...(prev[activeModuleKey] || [])]
      const newOpts = [...current[qIdx].options]
      newOpts[optIdx] = value
      current[qIdx] = { ...current[qIdx], options: newOpts }
      return {
        ...prev,
        [activeModuleKey]: current,
      }
    })
  }

  // Handle PDF upload for module — Sube directo a Supabase con signed URL
  const handlePdfUpload = async (modIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploadingModule(modIdx)
    setUploadMessage(null)

    try {
      const ts = Date.now()
      // 1. Obtener URL firmada
      const urlResponse = await fetch("/api/module-pdf-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, moduleIndex: modIdx, ts }),
      })

      const urlData = await urlResponse.json()
      if (!urlResponse.ok || urlData.error) {
        throw new Error(urlData.error || `Error obteniendo URL (HTTP ${urlResponse.status})`)
      }

      const { signedUrl } = urlData

      // 2. Subir archivo directamente a Supabase
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/pdf",
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`Error subiendo a Supabase (HTTP ${uploadResponse.status})`)
      }

      // 3. Confirmar subida y actualizar BD
      const confirmResponse = await fetch("/api/upload-module-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, moduleIndex: modIdx, ts }),
      })

      const result = await confirmResponse.json()
      if (!confirmResponse.ok || result.error) {
        throw new Error(result.error || `Error confirmando (HTTP ${confirmResponse.status})`)
      }

      setPdfStatus((prev) => ({ ...prev, [`mod-${modIdx}`]: ts }))
      if (modIdx > modulesCount) {
        setModulesCount(modIdx)
      }
      setUploadMessage({ text: result.message || "PDF subido con éxito.", error: false })

    } catch (err: any) {
      console.error("[handlePdfUpload] Error:", err)
      setUploadMessage({ text: err?.message || "Error inesperado al subir el PDF.", error: true })
    } finally {
      setUploadingModule(null)
    }
  }


  // Delete PDF file
  const handleDeletePdf = (type: "content" | "exam", moduleNum: number) => {
    setConfirmDeletePdf({ type, moduleNum })
  }

  const executeDeletePdf = async () => {
    if (!confirmDeletePdf) return
    const { type, moduleNum } = confirmDeletePdf
    
    setSaveMessage(null)
    const result = await deleteModulePdfAction(course.id, moduleNum, type)
    
    if (result.error) {
      setSaveMessage({ text: result.error, error: true })
    } else {
      setSaveMessage({ text: result.message || "PDF eliminado exitosamente", error: false })
      const targetKey = `mod-${moduleNum}`
      if (type === "content") {
        setPdfStatus(prev => ({ ...prev, [targetKey]: false }))
      } else {
        setExamPdfStatus(prev => ({ ...prev, [targetKey]: false }))
      }
    }
    setConfirmDeletePdf(null)
  }

  // Save changes
  const handleSaveAll = () => {
    setSaveMessage(null)
    startTransition(async () => {
      const result = await saveCourseExamsAction(course.id, modulesCount, examsData)
      if (result.error) {
        setSaveMessage({ text: result.error, error: true })
      } else {
        setSaveMessage({ text: result.message || "Guardado exitosamente.", error: false })
      }
    })
  }

  // Add new module to course
  const handleAddModule = () => {
    const nextCount = modulesCount + 1
    setModulesCount(nextCount)
    setSelectedModule(nextCount)
    // Limpiar el mensaje de subida para que no se herede del módulo anterior
    setUploadMessage(null)

    const modKey = `mod-${nextCount}`
    if (!examsData[modKey]) {
      setExamsData((prev) => ({
        ...prev,
        [modKey]: [
          {
            id: `m${nextCount}-q1`,
            question: "¿Cuál es el concepto central de este módulo?",
            options: ["Concepto principal", "Opción secundaria", "Otra alternativa", "Ninguna de las anteriores"],
            correct: 0,
            feedbackCorrect: "¡Excelente!",
            feedbackIncorrect: "Revisa la documentación.",
          },
        ],
      }))
    }
  }

  // Remove the last module
  const handleRemoveModule = () => {
    if (modulesCount <= 1) return // Do not remove if only 1 module is left
    setConfirmDeleteModule(modulesCount)
  }

  const executeRemoveModule = () => {
    if (!confirmDeleteModule) return

    const newCount = confirmDeleteModule - 1
    const keyToRemove = `mod-${confirmDeleteModule}`

    setModulesCount(newCount)
    if (selectedModule > newCount) {
      setSelectedModule(newCount)
    }

    const newExamsData = { ...examsData }
    delete newExamsData[keyToRemove]
    setExamsData(newExamsData)
    
    // Auto-guardado para asegurar que la base de datos se actualice inmediatamente
    startTransition(async () => {
      const result = await saveCourseExamsAction(course.id, newCount, newExamsData)
      if (result.error) {
        setSaveMessage({ text: result.error, error: true })
      } else {
        setSaveMessage({ text: "Módulo eliminado exitosamente.", error: false })
      }
    })
    
    setConfirmDeleteModule(null)
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/admin/cursos"
            className="inline-flex items-center text-sm font-medium text-[oklch(0.55_0.04_145)] hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver a Cursos
          </Link>
          <h1 className="text-3xl font-extrabold text-[oklch(0.25_0.10_145)] tracking-tight">
            Gestión de Módulos y Evaluaciones
          </h1>
          <p className="text-sm text-[oklch(0.55_0.04_145)] mt-1">
            Curso: <strong className="text-primary">{course.title}</strong> (ID: {course.id})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={course.type === "etdh" ? `/formacion-academica/${course.id}` : `/diplomados/${course.id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-lg border border-[oklch(0.88_0.04_145)] text-xs font-bold text-[oklch(0.35_0.10_145)] hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Vista Previa
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Global Status Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            saveMessage.error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {saveMessage.error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{saveMessage.text}</span>
        </div>
      )}



      {/* Module Selector Bar */}
      <section className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-[oklch(0.25_0.10_145)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Módulos del Curso ({modulesCount})
            </h2>
            <p className="text-xs text-[oklch(0.55_0.04_145)]">
              Selecciona un módulo para gestionar su PDF de estudio y sus preguntas de evaluación.
            </p>
          </div>
          <div className="flex gap-2">
            {modulesCount > 1 && (
              <button
                onClick={handleRemoveModule}
                className="px-3.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Eliminar Último
              </button>
            )}
            <button
              onClick={handleAddModule}
              className="px-3.5 py-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir Módulo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: modulesCount }).map((_, idx) => {
            const mNum = idx + 1
            const mKey = `mod-${mNum}`
            const hasPdf = pdfStatus[mKey]
            const qCount = examsData[mKey]?.length || 0
            const isSelected = selectedModule === mNum

            return (
              <div
                key={mKey}
                onClick={() => {
                  setSelectedModule(mNum)
                  // Limpiar el mensaje de subida al cambiar de módulo para evitar
                  // que el mensaje del módulo anterior se muestre en el nuevo módulo
                  setUploadMessage(null)
                }}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white border-[oklch(0.88_0.04_145)] hover:border-primary/40 text-[oklch(0.25_0.10_145)]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-white/80" : "text-secondary"}`}>
                      Unidad {mNum}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                      {hasPdf ? (
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSelected ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                            PDF ✓
                          </span>
                          <a
                            href={`/api/file/Modulo ${mNum} - ${course.id}${hasPdf && hasPdf !== true ? ` - ${hasPdf}` : ""}.pdf?courseId=${course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`p-0.5 rounded transition-colors ${isSelected ? "bg-white/20 hover:bg-white/40 text-white" : "bg-primary/10 hover:bg-primary/20 text-primary"}`}
                            title="Ver PDF de Contenido"
                          >
                            <Eye className="w-3 h-3" />
                          </a>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeletePdf("content", mNum); }}
                            className={`p-0.5 rounded transition-colors ${isSelected ? "bg-red-500/20 hover:bg-red-500/40 text-red-100" : "bg-red-100 hover:bg-red-200 text-red-600"}`}
                            title="Eliminar PDF de Contenido"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSelected ? "bg-white/10 text-white/70" : "bg-amber-100 text-amber-700"}`}>
                          Sin PDF
                        </span>
                      )}
                      {examPdfStatus[mKey] && (
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                            Eval ✓
                          </span>
                          <a
                            href={`/api/file/${encodeURIComponent(`Cuestionario Modulo ${mNum} - ${course.id}.pdf`)}?courseId=${course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`p-0.5 rounded transition-colors ${isSelected ? "bg-white/20 hover:bg-white/40 text-white" : "bg-primary/10 hover:bg-primary/20 text-primary"}`}
                            title="Ver PDF de Evaluación"
                          >
                            <Eye className="w-3 h-3" />
                          </a>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeletePdf("exam", mNum); }}
                            className={`p-0.5 rounded transition-colors ${isSelected ? "bg-red-500/20 hover:bg-red-500/40 text-red-100" : "bg-red-100 hover:bg-red-200 text-red-600"}`}
                            title="Eliminar PDF de Evaluación"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mt-1">Módulo {mNum}</h3>
                </div>
                <span className={`text-xs mt-3 ${isSelected ? "text-white/80" : "text-[oklch(0.55_0.04_145)]"}`}>
                  {qCount} {qCount === 1 ? "Pregunta" : "Preguntas"}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Main Grid: Left PDF Upload, Right Evaluation Editor */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: PDF Material Upload */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-[oklch(0.25_0.10_145)]">Material PDF: Módulo {selectedModule}</h2>
                <p className="text-xs text-[oklch(0.55_0.04_145)]">Documento guías que estudia el estudiante</p>
              </div>
            </div>

            <div className="p-5 border-2 border-dashed border-[oklch(0.88_0.04_145)] rounded-xl bg-[oklch(0.98_0.01_145)] text-center space-y-4">
              <FileText className="w-12 h-12 text-[oklch(0.60_0.04_145)] mx-auto" />
              
              <div>
                <p className="text-sm font-bold text-[oklch(0.25_0.10_145)]">
                  {pdfStatus[activeModuleKey] ? `Modulo ${selectedModule} - ${course.id}.pdf` : "Ningún PDF cargado aún"}
                </p>
                <p className="text-xs text-[oklch(0.55_0.04_145)] mt-1">
                  Se guardará como: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">Modulo {selectedModule} - {course.id}.pdf</code>
                </p>
              </div>

              {pdfStatus[activeModuleKey] && (
                <div className="flex justify-center items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                    <FileCheck className="w-4 h-4" /> PDF Guardado
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingModule === selectedModule ? "Subiendo y extrayendo..." : "Subir PDF del Módulo"}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePdfUpload(selectedModule, e)}
                    className="hidden"
                    disabled={uploadingModule === selectedModule}
                  />
                </label>
              </div>

              {uploadMessage && (
                <p className={`text-xs font-bold pt-2 ${uploadMessage.error ? "text-red-600" : "text-green-600"}`}>
                  {uploadMessage.text}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[oklch(0.88_0.04_145)]">
              <h3 className="text-xs font-bold text-[oklch(0.35_0.10_145)] uppercase tracking-wider mb-2">Instrucciones de Transformación</h3>
              <p className="text-xs text-[oklch(0.55_0.04_145)] leading-relaxed">
                Al subir el archivo PDF del módulo, el sistema lee automáticamente su contenido para extraer las preguntas de evaluación si el PDF las contiene. 
                También estará disponible de inmediato en la vista del diplomado y en el aula virtual.
              </p>
            </div>
          </div>


        </section>

        {/* Right Column: Evaluations Editor */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[oklch(0.88_0.04_145)]">
              <div>
                <h2 className="font-bold text-lg text-[oklch(0.25_0.10_145)] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Evaluaciones - Módulo {selectedModule}
                </h2>
                <p className="text-xs text-[oklch(0.55_0.04_145)]">
                  {activeQuestions.length} {activeQuestions.length === 1 ? "pregunta configurada" : "preguntas configuradas"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddQuestion}
                  className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Pregunta
                </button>
              </div>
            </div>

            {/* Questions List */}
            {activeQuestions.length === 0 ? (
              <div className="py-12 text-center text-[oklch(0.55_0.04_145)]">
                <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hay preguntas para este módulo.</p>
                <button
                  onClick={handleAddQuestion}
                  className="mt-3 text-xs font-bold text-primary hover:underline"
                >
                  + Agregar la primera pregunta
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeQuestions.map((q, qIdx) => (
                  <div
                    key={q.id || `q-${qIdx}`}
                    className="p-5 rounded-xl border border-[oklch(0.88_0.04_145)] bg-[oklch(0.99_0.005_145)] space-y-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="px-2.5 py-1 rounded bg-secondary/10 text-secondary font-bold text-xs">
                        Pregunta #{qIdx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar pregunta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Question text */}
                    <div>
                      <label className="block text-xs font-bold text-[oklch(0.30_0.10_145)] mb-1">
                        Enunciado de la Pregunta
                      </label>
                      <textarea
                        rows={2}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                        className="w-full p-3 rounded-lg border border-[oklch(0.88_0.04_145)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        placeholder="Escribe el enunciado de la pregunta..."
                      />
                    </div>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-[oklch(0.30_0.10_145)]">
                        Opciones de Respuesta (Marca la Correcta)
                      </label>
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx)
                        const isCorrect = q.correct === optIdx

                        return (
                          <div key={optIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuestionChange(qIdx, "correct", optIdx)}
                              className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                                isCorrect
                                  ? "bg-green-600 text-white ring-2 ring-green-600 ring-offset-1"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={isCorrect ? "Respuesta correcta seleccionada" : "Marcar como correcta"}
                            >
                              {letter}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              className={`flex-grow px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 ${
                                isCorrect
                                  ? "border-green-300 bg-green-50/40 text-green-900 font-medium"
                                  : "border-[oklch(0.88_0.04_145)] bg-white"
                              }`}
                              placeholder={`Opción ${letter}`}
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* Feedback - Respuesta Correcta */}
                    <div className="pt-2 space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-green-700 mb-1">
                          Retroalimentación — Respuesta Correcta (Opcional)
                        </label>
                        <textarea
                          rows={3}
                          value={q.feedbackCorrect || ""}
                          onChange={(e) => handleQuestionChange(qIdx, "feedbackCorrect", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50/30 text-xs text-[oklch(0.35_0.10_145)] focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                          placeholder="Ej: Fundamento normativo: Decreto 111 de 1996, artículo 6..."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-red-600 mb-1">
                          Retroalimentación — Respuesta Incorrecta (Opcional)
                        </label>
                        <textarea
                          rows={3}
                          value={q.feedbackIncorrect || ""}
                          onChange={(e) => handleQuestionChange(qIdx, "feedbackIncorrect", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-red-200 bg-red-50/30 text-xs text-[oklch(0.35_0.10_145)] focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                          placeholder="Ej: Por qué no las demás opciones: A desconoce la regla..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Botón de Guardar Inferior */}
                <div className="mt-8 pt-6 border-t border-[oklch(0.88_0.04_145)] flex justify-end">
                  <button
                    onClick={handleSaveAll}
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>



      {/* Footer Signature */}
      <footer className="pt-8 text-center text-xs text-[oklch(0.65_0.04_145)] border-t border-[oklch(0.88_0.04_145)]">
        <a
          href="https://www.kytcode.lat"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[oklch(0.30_0.10_145)] transition-colors inline-flex items-center gap-1"
        >
          Desarrollado por K&T <span className="text-black">❤</span> {new Date().getFullYear()}
        </a>
      </footer>

      {/* Modales de Confirmación */}
      {confirmDeleteModule !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">¿Eliminar Módulo {confirmDeleteModule}?</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Esta acción eliminará el módulo y perderás todas sus preguntas no guardadas. <br/><strong>No se puede deshacer.</strong>
                </p>
              </div>
              <div className="flex items-center gap-3 w-full pt-4">
                <button
                  onClick={() => setConfirmDeleteModule(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeRemoveModule}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeletePdf !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">¿Eliminar PDF?</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Estás a punto de eliminar el PDF de <strong>{confirmDeletePdf.type === "content" ? "estudio" : "evaluación"}</strong> del Módulo {confirmDeletePdf.moduleNum}.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full pt-4">
                <button
                  onClick={() => setConfirmDeletePdf(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDeletePdf}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
