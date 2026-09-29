import { AdminPdfConfig } from "@/components/admin-pdf-config"
import { getPdfUrl } from "@/app/actions/pdf-info"
import { createAdminClient } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export default async function AdminConfiguracionPage() {
  const supabase = createAdminClient()

  // Fetch general PDF URLs
  const diplomadosPdfUrl = await getPdfUrl("info_diplomados_pdf")
  const etdhPdfUrl = await getPdfUrl("info_etdh_pdf")

  // Fetch all courses to allow uploading PDF for any course directly
  const { data: rawCourses } = await supabase
    .from("courses")
    .select("id, title, type")
    .order("title")

  const courses = rawCourses || []

  // Check PDF status for each course
  const coursePdfs: Record<string, string | null> = {}
  for (const c of courses) {
    coursePdfs[c.id] = await getPdfUrl(`course_pdf_${c.id}`)
  }

  const sections = [
    {
      type: "diplomados" as const,
      label: "PDF Principal de Diplomados",
      description: "PDF general que se despliega al hacer clic en '¿Por qué cursar nuestros Diplomados?'",
      hasContent: Boolean(diplomadosPdfUrl),
      pdfUrl: diplomadosPdfUrl,
    },
    {
      type: "etdh" as const,
      label: "PDF Principal de Programas Académicos (ETDH)",
      description: "PDF general que se despliega al hacer clic en '¿Por qué cursar nuestros programas ETDH?'",
      hasContent: Boolean(etdhPdfUrl),
      pdfUrl: etdhPdfUrl,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Gestión de Documentos PDF</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">
          Sube y administra los documentos PDF oficiales de Diplomados, Programas ETDH y de cada curso individual.
        </p>
      </div>

      <AdminPdfConfig sections={sections} courses={courses} coursePdfs={coursePdfs} />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
        <p className="font-bold">💡 Instrucciones de Funcionamiento:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Documentos Generales:</strong> Sube los PDFs principales para la sección general de Diplomados y Programas ETDH.</li>
          <li><strong>Documentos por Curso:</strong> Selecciona cualquier diplomado o programa del listado para asignarle su PDF específico de forma directa.</li>
          <li><strong>Visualización Integrada:</strong> Los PDFs se muestran en un visor interactivo dentro de la plataforma sin distorsionar el contenido.</li>
        </ul>
      </div>
    </div>
  )
}
