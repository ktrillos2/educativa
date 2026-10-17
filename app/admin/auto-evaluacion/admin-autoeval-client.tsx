"use client"

import React, { useState } from "react"
import { Award, CheckCircle, Search, Filter, Eye, ChevronDown, ChevronUp, Calendar, User, BookOpen } from "lucide-react"

interface EvaluationResponse {
  id: string
  program_id: string
  user_id: string
  answers: Record<string, number>
  created_at: string
  user: {
    name: string
    email: string
    document: string
  }
  course: {
    title: string
  }
}

const DIMENSIONS: { id: string; label: string }[] = [
  { id: "claridad", label: "01. Claridad y pertinencia" },
  { id: "organizacion", label: "02. Organización" },
  { id: "cumplimiento", label: "03. Cumplimiento programación" },
  { id: "formador", label: "04. Dominio del formador" },
  { id: "materiales", label: "05. Recursos y materiales" },
  { id: "metodologia", label: "06. Metodología e interacción" },
  { id: "evaluacion", label: "07. Evaluación de aprendizaje" },
  { id: "aplicabilidad", label: "08. Aplicabilidad e impacto" },
]

function calculateStats(answers: Record<string, number> = {}) {
  const dimensionScores: Record<string, { count: number; sum: number; avg: number }> = {}

  DIMENSIONS.forEach((dim) => {
    let count = 0
    let sum = 0
    Object.entries(answers).forEach(([key, val]) => {
      if (key.startsWith(`${dim.id}_`) && val > 0) {
        count++
        sum += val
      }
    })
    dimensionScores[dim.id] = {
      count,
      sum,
      avg: count > 0 ? Number((sum / count).toFixed(2)) : 0,
    }
  })

  let totalValid = 0
  let totalSum = 0
  Object.values(answers).forEach((val) => {
    if (val > 0) {
      totalValid++
      totalSum += val
    }
  })

  const overallAvg = totalValid > 0 ? Number((totalSum / totalValid).toFixed(2)) : 0
  return { dimensionScores, overallAvg, totalValid }
}

export default function AdminAutoEvalClient({
  initialResponses,
}: {
  initialResponses: EvaluationResponse[]
}) {
  const [responses] = useState<EvaluationResponse[]>(initialResponses)
  const [search, setSearch] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Obtener lista única de programas
  const programs = Array.from(new Set(responses.map((r) => r.course.title)))

  // Filtrado
  const filtered = responses.filter((r) => {
    const matchesSearch =
      r.user.name.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.toLowerCase()) ||
      r.user.document.toLowerCase().includes(search.toLowerCase()) ||
      r.course.title.toLowerCase().includes(search.toLowerCase())

    const matchesProgram =
      selectedProgram === "all" || r.course.title === selectedProgram

    return matchesSearch && matchesProgram
  })

  // Promedio general de todas las respuestas
  const totalEvaluations = responses.length
  const globalSum = responses.reduce((acc, r) => acc + calculateStats(r.answers).overallAvg, 0)
  const globalAverage = totalEvaluations > 0 ? (globalSum / totalEvaluations).toFixed(2) : "0.00"

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Resultados de Autoevaluación del Participante
        </h1>
        <p className="text-gray-600 text-sm">
          Consolidado institucional del instrumento de percepción y calidad formativa completado por los estudiantes previo a su certificación.
        </p>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total Autoevaluaciones
            </span>
            <p className="text-3xl font-black text-emerald-900 mt-1">{totalEvaluations}</p>
            <p className="text-xs text-emerald-700 mt-1">Diligenciadas en plataforma</p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Satisfacción Global
            </span>
            <p className="text-3xl font-black text-blue-900 mt-1">{globalAverage} / 5.0</p>
            <p className="text-xs text-blue-700 mt-1">Promedio ponderado total</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              Dimensiones Evaluadas
            </span>
            <p className="text-3xl font-black text-purple-900 mt-1">8</p>
            <p className="text-xs text-purple-700 mt-1">Contenidos, docentes, metodología, etc.</p>
          </div>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por estudiante, cédula o programa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full md:w-64 py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todos los programas</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Award className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-lg text-gray-700">No hay autoevaluaciones registradas</p>
            <p className="text-sm mt-1">
              Las autoevaluaciones de los estudiantes aparecerán aquí una vez las completen antes de generar su certificado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Programa</th>
                  <th className="py-3.5 px-4 text-center">Fecha</th>
                  <th className="py-3.5 px-4 text-center">Calificación Promedio</th>
                  <th className="py-3.5 px-4 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((item) => {
                  const stats = calculateStats(item.answers)
                  const isExpanded = expandedId === item.id

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900">
                          <div>{item.user.name}</div>
                          <div className="text-xs text-gray-500 font-normal">
                            Doc: {item.user.document || "N/A"} · {item.user.email}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 max-w-xs truncate">
                          <span className="font-semibold text-gray-800">{item.course.title}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-xs text-gray-500 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              stats.overallAvg >= 4.0
                                ? "bg-green-100 text-green-800"
                                : stats.overallAvg >= 3.0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            ★ {stats.overallAvg} / 5.0
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                Ocultar <ChevronUp className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                Ver desglose <ChevronDown className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Desglose de dimensiones expandible */}
                      {isExpanded && (
                        <tr className="bg-gray-50/60">
                          <td colSpan={5} className="p-4 md:p-6 border-b border-gray-200">
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
                              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Desglose de Resultados por Dimensión · {item.user.name}
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {DIMENSIONS.map((dim) => {
                                  const dimStat = stats.dimensionScores[dim.id]
                                  return (
                                    <div
                                      key={dim.id}
                                      className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col justify-between"
                                    >
                                      <p className="text-xs font-semibold text-gray-700 line-clamp-1" title={dim.label}>
                                        {dim.label}
                                      </p>
                                      <div className="flex items-baseline justify-between mt-2">
                                        <span className="text-xs text-gray-500">
                                          {dimStat.count} resp. válidas
                                        </span>
                                        <span className="text-sm font-black text-emerald-700">
                                          {dimStat.avg > 0 ? `${dimStat.avg} / 5.0` : "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
