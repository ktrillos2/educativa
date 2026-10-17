import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import AdminAutoEvalClient from "./admin-autoeval-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Resultados de Autoevaluación – Panel de Administración",
  description: "Monitoreo y consolidado de resultados del instrumento de autoevaluación y percepción de calidad formativa de los programas.",
}

export default async function AdminAutoEvalPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/admin")
  }

  const supabase = createAdminClient()

  // Consultar respuestas
  let responses: any[] = []
  try {
    const { data, error } = await supabase
      .from("auto_evaluation_responses")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      responses = data
    }
  } catch (err) {
    console.warn("Tabla auto_evaluation_responses aún no creada o sin datos:", err)
  }

  // Enriquecer con nombres de usuarios y cursos
  const userIds = Array.from(new Set(responses.map((r) => r.user_id)))
  const courseIds = Array.from(new Set(responses.map((r) => r.program_id)))

  const [{ data: users }, { data: courses }] = await Promise.all([
    userIds.length > 0
      ? supabase.from("users").select("id, name, email, document").in("id", userIds)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase.from("courses").select("id, title").in("id", courseIds)
      : Promise.resolve({ data: [] }),
  ])

  const userMap = new Map((users || []).map((u) => [u.id, u]))
  const courseMap = new Map((courses || []).map((c) => [c.id, c]))

  const enrichedResponses = responses.map((r) => ({
    ...r,
    user: userMap.get(r.user_id) || { name: "Usuario no registrado", email: "", document: "" },
    course: courseMap.get(r.program_id) || { title: r.program_id },
  }))

  return (
    <div className="space-y-6">
      <AdminAutoEvalClient initialResponses={enrichedResponses} />

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-200 mt-12">
        <a
          href="https://www.kytcode.lat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-black font-medium transition-colors"
        >
          <span>Desarrollado por K&T</span>
          <span className="text-black dark:text-white" aria-label="amor">
            ❤️
          </span>
        </a>{" "}
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
