"use client"

import React, { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Award, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  GraduationCap, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react"
import { COURSE_9_QUESTIONS, FALLBACK_QUESTIONS, Question } from "@/lib/exam-constants"
import { getQualitativeEquivalence } from "@/lib/utils"

interface ProgressRow {
  id: string
  user_id: string
  course_id: string
  module_id: string
  score: number
  completed: boolean
  attempts?: number
  last_score?: number
  updated_at?: string
}

interface UserProgressDialogProps {
  user: {
    id: string
    name: string
    document?: string
    email: string
    phone?: string
    created_at: string
    id_document_url?: string
    role?: string
  }
  enrollments: any[]
  coursesMap: Map<string, any>
  progressList: ProgressRow[]
  trigger?: React.ReactNode
}

export function UserProgressDialog({ user, enrollments, coursesMap, progressList, trigger }: UserProgressDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeCourseId, setActiveCourseId] = useState<string>(enrollments[0]?.course_id || "9")
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  const selectedEnrollment = enrollments.find(e => String(e.course_id) === String(activeCourseId)) || enrollments[0]
  const currentCourse = selectedEnrollment ? coursesMap.get(selectedEnrollment.course_id) : null

  const totalModules = currentCourse?.modules || 4
  const courseProgress = progressList.filter(p => String(p.course_id) === String(activeCourseId) && p.completed)
  
  // Unique module progress count
  const uniqueModulesCount = new Set(courseProgress.map(p => String(p.module_id).replace('modulo-', 'mod-'))).size
  const completedCount = Math.min(uniqueModulesCount, totalModules)
  const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100))
  const isCompleted = completedCount >= totalModules

  // Map progress rows by module_id
  const progressByModule = new Map<string, ProgressRow>()
  progressList.filter(p => String(p.course_id) === String(activeCourseId)).forEach(p => {
    progressByModule.set(p.module_id, p)
  })

  // Get questions for a specific module
  const getQuestions = (modId: string): Question[] => {
    if (activeCourseId === "9" && COURSE_9_QUESTIONS[modId]) {
      return COURSE_9_QUESTIONS[modId]
    }
    return FALLBACK_QUESTIONS
  }

  const isEtdh = currentCourse?.title?.includes("PROGRAMA ACADÉMICO") || currentCourse?.type === "etdh"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button 
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1 border border-primary/20 cursor-pointer"
            title="Ver progreso y exámenes del estudiante"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Progreso: {completedCount}/{totalModules}
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="!w-[95vw] !max-w-7xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="bg-primary text-white p-6 rounded-t-2xl relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pr-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  {user.name}
                </DialogTitle>
                <p className="text-xs text-white/80 mt-0.5">
                  CC / Documento: <span className="font-semibold">{user.document || 'No registrado'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {user.id_document_url && (
                <a 
                  href={user.id_document_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium flex items-center gap-1.5 backdrop-blur-sm"
                >
                  <FileText className="w-4 h-4" />
                  Ver Cédula
                </a>
              )}
              <span className="px-3 py-1.5 bg-white/20 text-white rounded-lg font-semibold capitalize backdrop-blur-sm">
                Rol: {(user.role === 'admin' || user.role === 'ADMIN') ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          </div>

          {/* User Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-white/80" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-white/80" />
              <span>Registrado: {new Date(user.created_at).toLocaleDateString('es-CO')}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Selector de Cursos si tiene más de 1 */}
          {enrollments.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cursos del Estudiante</p>
              <div className="flex flex-wrap gap-2">
                {enrollments.map((e) => {
                  const c = coursesMap.get(e.course_id)
                  const isActive = String(e.course_id) === String(activeCourseId)
                  return (
                    <button
                      key={e.id}
                      onClick={() => setActiveCourseId(e.course_id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {c?.title || `Curso ${e.course_id}`}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Curso Seleccionado Overview */}
          {selectedEnrollment ? (
            <div className="bg-muted/10 border rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    {currentCourse?.category || "Gestión Pública"}
                  </span>
                  <h3 className="text-lg font-bold text-primary mt-1">
                    {currentCourse?.title || "Diplomado en Gestión del Presupuesto Público"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedEnrollment.payment_verified 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedEnrollment.payment_verified ? '✓ Pago Verificado' : '⏳ Pendiente de Pago'}
                  </span>

                  {isCompleted && selectedEnrollment.payment_verified && (
                    <div className="flex gap-2">
                      <a
                        href={`${isEtdh ? '/formacion-academica' : '/diplomados'}/${activeCourseId}/certificado?studentId=${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Certificado
                      </a>
                      <a
                        href={`${isEtdh ? '/formacion-academica' : '/diplomados'}/${activeCourseId}/acta?studentId=${user.id}&download=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-bold hover:bg-orange-700 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Acta
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Avance General
                  </span>
                  <span className="text-primary font-mono">{progressPercent}% ({completedCount}/{totalModules} Módulos)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-2.5 bg-primary transition-all duration-700 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">El estudiante no tiene cursos seleccionados.</p>
          )}

          {/* Desglose de Módulos e Historial de Exámenes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Desglose Detallado por Módulo e Historial de Exámenes
            </h4>

            <div className="space-y-3">
              {Array.from({ length: totalModules }).map((_, idx) => {
                const modId = `mod-${idx + 1}`
                const modProgress = progressByModule.get(modId) || progressByModule.get(`modulo-${idx + 1}`)
                const isApproved = !!modProgress?.completed
                const score = Number(modProgress?.score || 0)
                const attempts = Number(modProgress?.attempts || (modProgress ? 1 : 0))
                const hasFailedAttempt = !isApproved && score > 0
                const equivalence = getQualitativeEquivalence(score)
                const questions = getQuestions(modId)
                const isExpanded = expandedModuleId === modId

                return (
                  <div 
                    key={modId} 
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      isApproved 
                        ? 'border-green-200 bg-white' 
                        : hasFailedAttempt 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    {/* Module Row Header */}
                    <div 
                      onClick={() => setExpandedModuleId(isExpanded ? null : modId)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isApproved 
                            ? 'bg-green-100 text-green-700' 
                            : hasFailedAttempt 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isApproved ? <CheckCircle className="w-5 h-5" /> : hasFailedAttempt ? <XCircle className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                            Módulo {idx + 1}: Desarrollo de Competencias Unidad {idx + 1}
                            {attempts > 1 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <RotateCcw className="w-3 h-3" /> {attempts} Intentos
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isApproved 
                              ? `Aprobado el ${modProgress?.updated_at ? new Date(modProgress.updated_at).toLocaleDateString('es-CO') : 'Recientemente'}` 
                              : hasFailedAttempt 
                              ? `Examen no aprobado (${score.toFixed(0)}%) - Requiere recuperación`
                              : 'Pendiente por realizar'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isApproved ? (
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-green-700">{score.toFixed(0)}%</span>
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">{equivalence.label}</p>
                          </div>
                        ) : hasFailedAttempt ? (
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-red-600">{score.toFixed(0)}%</span>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">No Aprobado</p>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">Sin realizar</span>
                        )}

                        <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-500">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Exam Questions View */}
                    {isExpanded && (
                      <div className="p-5 border-t bg-gray-50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-secondary" /> 
                            Cuestionario y Clave de Respuestas ({questions.length} Preguntas)
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {attempts > 0 && (
                              <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2.5 py-0.5 rounded-full">
                                Total Intentos: {attempts}
                              </span>
                            )}
                            {isApproved ? (
                              <span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Examen Aprobado por el Estudiante
                              </span>
                            ) : hasFailedAttempt ? (
                              <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Examen Reprobado (En Recuperación)
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-0.5 rounded-full">
                                Cuestionario No Iniciado
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {questions.map((q, qIdx) => (
                            <div key={q.id || qIdx} className="bg-white p-4 rounded-xl border space-y-2 shadow-2xs">
                              <p className="text-sm font-bold text-gray-900 leading-snug">
                                <span className="text-primary font-mono mr-1.5">{qIdx + 1}.</span> {q.question}
                              </p>

                              {/* Options */}
                              <div className="grid grid-cols-1 gap-1.5 pl-4 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isCorrect = optIdx === q.correct
                                  return (
                                    <div 
                                      key={optIdx} 
                                      className={`text-xs p-2 rounded-lg flex items-start gap-2 border ${
                                        isCorrect 
                                          ? 'bg-green-50 text-green-900 border-green-300 font-semibold' 
                                          : 'bg-gray-50 text-gray-600 border-transparent'
                                      }`}
                                    >
                                      <span className="font-bold shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                                      <span className="flex-1">{opt}</span>
                                      {isCorrect && (
                                        <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Respuesta Correcta
                                        </span>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Correct Answer Explanation / Feedback */}
                              {q.feedbackCorrect && (
                                <div className="mt-2 text-xs bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 space-y-1">
                                  <p className="font-bold text-[11px] text-blue-800 uppercase tracking-wide">Fundamento Normativo y Técnico:</p>
                                  <p className="leading-relaxed whitespace-pre-line text-blue-950">{q.feedbackCorrect}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
