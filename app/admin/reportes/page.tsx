import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { AdminReportesClient } from "@/components/admin-reportes-client"

export default async function AdminReportesPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  // Fetch all necessary data concurrently
  const [
    { data: users },
    { data: enrollments },
    { data: courses }
  ] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
    supabase.from("courses").select("*").order("created_at", { ascending: true })
  ])

  return (
    <div className="h-full">
      <AdminReportesClient 
        users={users || []} 
        enrollments={enrollments || []} 
        courses={courses || []} 
      />
    </div>
  )
}
