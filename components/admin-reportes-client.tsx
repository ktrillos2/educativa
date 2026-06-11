"use client"

import { useState, useMemo } from "react"
import { 
  BarChart2, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Users, 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  FileText
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  document: string
  created_at: string
}

interface Enrollment {
  id: string
  user_id: string
  course_id: string
  payment_verified: boolean
  created_at: string
}

interface Course {
  id: string
  title: string
  price: string
  category: string
}

interface Props {
  users: User[]
  enrollments: Enrollment[]
  courses: Course[]
}

export function AdminReportesClient({ users, enrollments, courses }: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "detalles">("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  // Map courses for fast lookup
  const courseMap = useMemo(() => {
    const map = new Map<string, Course>()
    courses.forEach(c => map.set(c.id, c))
    return map
  }, [courses])

  // Parse price string to number (e.g., "$1.150.000" -> 1150000)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0
    const clean = priceStr.replace(/[^0-9]/g, "")
    return parseInt(clean, 10) || 0
  }

  // Formatting currency
  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(val)
  }

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const totalStudents = users.filter(u => u.role !== 'admin').length
    const totalEnrollments = enrollments.length
    const verifiedEnrollments = enrollments.filter(e => e.payment_verified)
    const pendingEnrollments = enrollments.filter(e => !e.payment_verified)
    
    let totalRevenue = 0
    let pendingRevenue = 0

    enrollments.forEach(e => {
      const course = courseMap.get(e.course_id)
      const priceVal = course ? parsePrice(course.price) : 0
      if (e.payment_verified) {
        totalRevenue += priceVal
      } else {
        pendingRevenue += priceVal
      }
    })

    const verificationRate = totalEnrollments > 0 
      ? Math.round((verifiedEnrollments.length / totalEnrollments) * 100) 
      : 0

    return {
      totalStudents,
      totalEnrollments,
      verifiedCount: verifiedEnrollments.length,
      pendingCount: pendingEnrollments.length,
      totalRevenue,
      pendingRevenue,
      verificationRate
    }
  }, [users, enrollments, courseMap])

  // Process data for Courses bar chart
  const courseEnrollmentStats = useMemo(() => {
    const counts: Record<string, { title: string; total: number; verified: number; pending: number }> = {}
    
    courses.forEach(c => {
      counts[c.id] = { title: c.title, total: 0, verified: 0, pending: 0 }
    })

    enrollments.forEach(e => {
      if (counts[e.course_id]) {
        counts[e.course_id].total += 1
        if (e.payment_verified) {
          counts[e.course_id].verified += 1
        } else {
          counts[e.course_id].pending += 1
        }
      }
    })

    return Object.values(counts).sort((a, b) => b.total - a.total)
  }, [courses, enrollments])

  // Filtered detailed enrollments list
  const filteredEnrollmentsList = useMemo(() => {
    return enrollments.map(e => {
      const student = users.find(u => u.id === e.user_id)
      const course = courseMap.get(e.course_id)
      return {
        ...e,
        studentName: student?.name || "Estudiante desconocido",
        studentEmail: student?.email || "N/A",
        studentPhone: student?.phone || "N/A",
        studentDocument: student?.document || "N/A",
        courseTitle: course?.title || `Diplomado (${e.course_id})`,
        coursePrice: course?.price || "$0",
        priceNumber: course ? parsePrice(course.price) : 0
      }
    }).filter(e => {
      const matchesSearch = 
        e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.studentDocument.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCourse = courseFilter === "all" || e.course_id === courseFilter
      
      const matchesPayment = 
        paymentFilter === "all" ||
        (paymentFilter === "verified" && e.payment_verified) ||
        (paymentFilter === "pending" && !e.payment_verified)

      return matchesSearch && matchesCourse && matchesPayment
    })
  }, [enrollments, users, courseMap, searchQuery, courseFilter, paymentFilter])

  // CSV Export Action
  const exportToCSV = () => {
    if (filteredEnrollmentsList.length === 0) return

    // UTF-8 BOM to open correctly in Excel with accents
    const BOM = "\uFEFF"
    const headers = ["Nombre", "Documento", "Email", "Telefono", "Diplomado", "Valor", "Estado Pago", "Fecha Inscripcion"]
    
    const rows = filteredEnrollmentsList.map(e => [
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"${e.studentDocument}"`,
      `"${e.studentEmail}"`,
      `"${e.studentPhone}"`,
      `"${e.courseTitle.replace(/"/g, '""')}"`,
      `"${e.coursePrice}"`,
      e.payment_verified ? "Verificado" : "Pendiente",
      new Date(e.created_at).toLocaleDateString("es-CO")
    ])

    const csvContent = BOM + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_inscripciones_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print Action
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── Title and Print/Export Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Reportes y Analítica</h1>
          <p className="text-[oklch(0.55_0.04_145)] text-sm">Monitorea y analiza el rendimiento financiero y estudiantil de la academia.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white hover:bg-[oklch(0.97_0.01_145)] text-[oklch(0.30_0.10_145)] border border-[oklch(0.88_0.04_145)] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir PDF
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredEnrollmentsList.length === 0}
            className="inline-flex items-center gap-2 bg-[oklch(0.30_0.10_145)] hover:bg-[oklch(0.25_0.10_145)] disabled:bg-[oklch(0.85_0.02_145)] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV/Excel
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-[oklch(0.50_0.04_145)]">Estudiantes Totales</p>
            <div className="p-2 bg-[oklch(0.30_0.10_145)]/10 rounded-lg">
              <Users className="w-4 h-4 text-[oklch(0.30_0.10_145)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[oklch(0.25_0.10_145)] mt-2">{stats.totalStudents}</p>
          <p className="text-[10px] text-[oklch(0.55_0.04_145)] mt-1">Registrados en la plataforma</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-[oklch(0.50_0.04_145)]">Inscripciones Totales</p>
            <div className="p-2 bg-[oklch(0.45_0.12_145)]/10 rounded-lg">
              <BookOpen className="w-4 h-4 text-[oklch(0.45_0.12_145)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[oklch(0.25_0.10_145)] mt-2">{stats.totalEnrollments}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium">
              {stats.verifiedCount} Verif.
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
              {stats.pendingCount} Pend.
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-[oklch(0.50_0.04_145)]">Recaudación Realizada</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-[10px] text-[oklch(0.55_0.04_145)] mt-1">
            Por verificar: <span className="font-semibold text-amber-600">{formatCurrency(stats.pendingRevenue)}</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-[oklch(0.50_0.04_145)]">Tasa de Recaudo</p>
            <div className="p-2 bg-[oklch(0.72_0.14_85)]/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[oklch(0.55_0.14_85)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[oklch(0.25_0.10_145)] mt-2">{stats.verificationRate}%</p>
          <div className="w-full bg-[oklch(0.93_0.01_145)] rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="h-full bg-[oklch(0.30_0.10_145)] transition-all duration-500"
              style={{ width: `${stats.verificationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Tabs selector ── */}
      <div className="border-b border-[oklch(0.88_0.04_145)] flex gap-4 print:hidden">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-[oklch(0.30_0.10_145)] text-[oklch(0.30_0.10_145)]"
              : "border-transparent text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.30_0.10_145)]"
          }`}
        >
          Vista General y Gráficos
        </button>
        <button
          onClick={() => setActiveTab("detalles")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "detalles"
              ? "border-[oklch(0.30_0.10_145)] text-[oklch(0.30_0.10_145)]"
              : "border-transparent text-[oklch(0.55_0.04_145)] hover:text-[oklch(0.30_0.10_145)]"
          }`}
        >
          Detalles y Exportación ({filteredEnrollmentsList.length})
        </button>
      </div>

      {/* ── Content Panes ── */}
      {activeTab === "general" ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Chart Card 1: Enrollments per Course */}
          <div className="md:col-span-2 bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6">
            <h2 className="text-sm font-bold text-[oklch(0.25_0.10_145)] mb-6 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Inscripciones por Diplomado
            </h2>
            
            <div className="space-y-4">
              {courseEnrollmentStats.map((item) => {
                const maxTotal = Math.max(...courseEnrollmentStats.map(x => x.total), 1)
                const percentage = Math.round((item.total / maxTotal) * 100)
                
                return (
                  <div key={item.title} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[oklch(0.30_0.10_145)] truncate max-w-[70%]">{item.title}</span>
                      <span className="text-[oklch(0.40_0.08_145)]">
                        {item.total} inscritos <span className="text-[10px] text-[oklch(0.55_0.04_145)] font-normal">({item.verified} pagos / {item.pending} pend.)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[oklch(0.97_0.01_145)] h-6 rounded-lg overflow-hidden border border-[oklch(0.92_0.02_145)] flex">
                      {/* Bar segment for verified payments */}
                      {item.verified > 0 && (
                        <div 
                          className="bg-[oklch(0.30_0.10_145)] h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-inner"
                          style={{ width: `${(item.verified / maxTotal) * 100}%` }}
                          title={`${item.verified} Pagos verificados`}
                        >
                          {item.verified}
                        </div>
                      )}
                      {/* Bar segment for pending payments */}
                      {item.pending > 0 && (
                        <div 
                          className="bg-amber-400 h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-amber-950 shadow-inner"
                          style={{ width: `${(item.pending / maxTotal) * 100}%` }}
                          title={`${item.pending} Pagos pendientes`}
                        >
                          {item.pending}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {courseEnrollmentStats.length === 0 && (
                <div className="text-center py-12 text-[oklch(0.55_0.04_145)]">
                  No hay inscripciones registradas.
                </div>
              )}
            </div>
          </div>

          {/* Chart Card 2: Financial Summary & State */}
          <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[oklch(0.25_0.10_145)] mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Resumen de Recaudos
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.30_0.10_145)]" />
                    <span className="text-xs font-semibold text-green-900">Verificados</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-[10px] text-green-700">{stats.verifiedCount} transacciones</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-semibold text-amber-900">Pendientes</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-950">{formatCurrency(stats.pendingRevenue)}</p>
                    <p className="text-[10px] text-amber-700">{stats.pendingCount} estudiantes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total general indicator */}
            <div className="mt-6 pt-6 border-t border-[oklch(0.92_0.02_145)]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-[oklch(0.45_0.08_145)]">Recaudo Estimado Total</span>
                <span className="text-lg font-extrabold text-[oklch(0.25_0.10_145)]">
                  {formatCurrency(stats.totalRevenue + stats.pendingRevenue)}
                </span>
              </div>
              <div className="w-full bg-[oklch(0.93_0.01_145)] rounded-full h-2 overflow-hidden flex">
                <div 
                  className="bg-[oklch(0.30_0.10_145)] h-full" 
                  style={{ width: `${stats.verificationRate}%` }} 
                />
                <div 
                  className="bg-amber-400 h-full" 
                  style={{ width: `${100 - stats.verificationRate}%` }} 
                />
              </div>
              <p className="text-[10px] text-[oklch(0.55_0.04_145)] mt-1.5">
                El {stats.verificationRate}% de los ingresos proyectados ha sido verificado.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Detailed Table and Filters ── */
        <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
          
          {/* Table Filters header */}
          <div className="p-4 bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)] flex flex-col md:flex-row gap-3 print:hidden">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[oklch(0.55_0.04_145)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por estudiante, documento o correo..."
                className="w-full bg-white border border-[oklch(0.88_0.04_145)] rounded-lg pl-9 pr-4 py-2 text-xs text-[oklch(0.25_0.10_145)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.30_0.10_145)]"
              />
            </div>

            {/* Course select filter */}
            <div className="relative min-w-[200px]">
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="w-full bg-white border border-[oklch(0.88_0.04_145)] rounded-lg px-3 py-2 text-xs text-[oklch(0.25_0.10_145)] appearance-none focus:outline-none"
              >
                <option value="all">Todos los Diplomados</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Payment Status filter */}
            <div className="relative min-w-[150px]">
              <select
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                className="w-full bg-white border border-[oklch(0.88_0.04_145)] rounded-lg px-3 py-2 text-xs text-[oklch(0.25_0.10_145)] appearance-none focus:outline-none"
              >
                <option value="all">Todos los Estados</option>
                <option value="verified">Pago Verificado</option>
                <option value="pending">Pago Pendiente</option>
              </select>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[oklch(0.97_0.01_145)] border-b border-[oklch(0.88_0.04_145)]">
                <tr>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Estudiante</th>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Contacto</th>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Diplomado Matriculado</th>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Valor</th>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Estado Pago</th>
                  <th className="px-6 py-3.5 font-bold text-[oklch(0.40_0.08_145)]">Fecha Inscripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.94_0.01_145)]">
                {filteredEnrollmentsList.map((e) => (
                  <tr key={e.id} className="hover:bg-[oklch(0.98_0.01_145)] transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-[oklch(0.25_0.10_145)]">{e.studentName}</p>
                      <p className="text-[10px] text-[oklch(0.55_0.04_145)] mt-0.5">CC: {e.studentDocument}</p>
                    </td>
                    <td className="px-6 py-3.5 space-y-0.5 text-[oklch(0.45_0.08_145)]">
                      <p>{e.studentEmail}</p>
                      {e.studentPhone && <p className="text-[10px]">{e.studentPhone}</p>}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-[oklch(0.30_0.10_145)] max-w-xs truncate">
                      {e.courseTitle}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-[oklch(0.30_0.10_145)]">
                      {e.coursePrice}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.payment_verified 
                          ? "bg-[oklch(0.30_0.10_145)]/10 text-[oklch(0.30_0.10_145)] border border-[oklch(0.30_0.10_145)]/20" 
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {e.payment_verified ? "✓ Verificado" : "⏳ Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[oklch(0.45_0.08_145)]">
                      {new Date(e.created_at).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
                {filteredEnrollmentsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[oklch(0.55_0.04_145)]">
                      No se encontraron inscripciones con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ── Desarrollado por K&T (Footer Branding Mark - Rules 9, 10, 11, 12) ── */}
      <div className="pt-8 mt-12 border-t border-[oklch(0.88_0.04_145)] text-center text-xs text-[oklch(0.55_0.04_145)] print:hidden flex flex-col sm:flex-row justify-between items-center gap-3">
        <p>© {new Date().getFullYear()} Academia de Formación Líderes del Mérito S.A.S. Todos los derechos reservados.</p>
        <a 
          href="https://www.kytcode.lat" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium hover:text-[oklch(0.30_0.10_145)] transition-colors flex items-center justify-center gap-1"
        >
          Desarrollado por K&T <span className="text-black">❤</span>
        </a>
      </div>

    </div>
  )
}
