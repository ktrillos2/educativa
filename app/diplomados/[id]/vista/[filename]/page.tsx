import { Breadcrumb } from "@/components/breadcrumb"
import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { GroupWaiting } from "@/components/group-waiting"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DocumentViewerPage(props: { params: Promise<{ id: string, filename: string }> }) {
    const params = await props.params
    const session = await getSession()
    if (!session?.userId) {
        redirect(`/diplomados/${params.id}`)
    }

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

    if (!course) {
        notFound()
    }

    const { count: currentEnrollments } = await adminSupabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id)

    const minStudents = course.min_students ?? 15
    const enrolledCount = currentEnrollments ?? 0
    const isReadyToStart = enrolledCount >= minStudents

    if (!isReadyToStart) {
        return (
            <main className="flex-grow pt-24 bg-muted/20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <Breadcrumb items={[
                            { label: "Inicio", href: "/" },
                            { label: "Diplomados", href: "/diplomados" },
                            { label: "Volver", href: `/diplomados/${params.id}` },
                            { label: decodeURIComponent(params.filename) }
                        ]} />
                    </div>
                    <GroupWaiting 
                        courseId={course.id}
                        courseTitle={course.title}
                        minStudents={minStudents}
                        enrolledCount={enrolledCount}
                    />
                </div>
            </main>
        )
    }

    return (
        <main className="flex-grow pt-24 bg-muted/20 pb-12">
            <div className="container mx-auto px-4 h-[80vh] flex flex-col">
                <div className="mb-6">
                    <Breadcrumb items={[
                        { label: "Inicio", href: "/" },
                        { label: "Diplomados", href: "/diplomados" },
                        { label: "Volver", href: `/diplomados/${params.id}` },
                        { label: decodeURIComponent(params.filename) }
                    ]} />
                </div>

                <div className="flex-grow bg-white shadow-sm border border-border overflow-hidden">
                    <iframe
                        src={`/api/file/${params.filename}?courseId=${params.id}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none"
                        title={decodeURIComponent(params.filename)}
                    />
                </div>
            </div>
        </main>
    )
}
