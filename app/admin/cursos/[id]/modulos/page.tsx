import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getCourseModulesData } from "@/app/actions/admin-modules"
import { ModuleManager } from "./module-manager"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminCursoModulosPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getSession()

  if (!session?.userId) {
    redirect("/login")
  }

  const data = await getCourseModulesData(decodeURIComponent(params.id))

  if ("error" in data || !data.course) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in pt-6">
      <ModuleManager
        course={data.course}
        initialModulesCount={data.modulesCount}
        initialPdfFilesStatus={data.pdfFilesStatus}
        initialExamPdfStatus={data.examPdfStatus}
        initialExamsData={data.examsData}
      />
    </div>
  )
}
