import { createAdminClient } from "@/utils/supabase/admin"
import { notFound } from "next/navigation"
import { EditCourseForm } from "./edit-course-form"
import { getPdfUrl } from "@/app/actions/pdf-info"

export const dynamic = "force-dynamic"

export default async function EditarCursoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const courseId = decodeURIComponent(params.id)
  const supabase = createAdminClient()
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single()

  if (error || !course) {
    notFound()
  }

  const slug = courseId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  const currentPdfUrl =
    (await getPdfUrl(`course_pdf_${courseId}`)) ||
    (await getPdfUrl(`course_info_${courseId}`)) ||
    (await getPdfUrl(`course_pdf_${slug}`)) ||
    (await getPdfUrl(`course_info_${slug}`))

  return <EditCourseForm course={course} currentPdfUrl={currentPdfUrl} />
}
