import { createAdminClient } from "@/utils/supabase/admin"
import { notFound } from "next/navigation"
import { EditCourseForm } from "./edit-course-form"

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

  return <EditCourseForm course={course} />
}
