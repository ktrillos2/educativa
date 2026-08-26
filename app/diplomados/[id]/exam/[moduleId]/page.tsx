import { notFound, redirect } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { ExamForm } from "./exam-form"
import { GroupWaiting } from "@/components/group-waiting"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ExamPage(props: { params: Promise<{ id: string; moduleId: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    // Obtener diplomado desde Supabase
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

    if (!course) {
        notFound()
    }

    const adminSupabase = createAdminClient()
    const { count: currentEnrollments } = await adminSupabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id)

    const minStudents = course.min_students ?? 15
    const enrolledCount = currentEnrollments ?? 0
    const isReadyToStart = enrolledCount >= minStudents

    if (!isReadyToStart) {
        return (
            <main className="flex-grow bg-muted/30">
                <section className="pt-[calc(6rem+1cm)] pb-[1cm] bg-primary text-white">
                    <div className="container mx-auto px-4">
                        <Breadcrumb items={[
                            { label: "Inicio", href: "/" },
                            { label: "Diplomados", href: "/diplomados" },
                            { label: course.title, href: `/diplomados/${course.id}` },
                            { label: "Examen" }
                        ]} />
                        <h1 className="text-3xl md:text-4xl font-bold mt-6">Cuestionario: {params.moduleId.replace("-", " ")}</h1>
                    </div>
                </section>
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <GroupWaiting 
                            courseId={course.id}
                            courseTitle={course.title}
                            minStudents={minStudents}
                            enrolledCount={enrolledCount}
                        />
                    </div>
                </section>
            </main>
        )
    }

    const session = await getSession()
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

    if (!isMockPaid) {
        if (!session?.userId) {
            redirect(`/diplomados/${params.id}`)
        }

        const { data: enrollment } = await supabase
            .from("enrollments")
            .select("user_id")
            .eq("user_id", session.userId)
            .eq("course_id", course.id)
            .maybeSingle()

        if (!enrollment) {
            redirect(`/diplomados/${params.id}`)
        }

        // Sequential locking: verify previous module is approved
        // Extract module index from moduleId format "mod-X"
        const moduleIndex = parseInt(params.moduleId.replace("mod-", ""), 10) - 1;
        if (moduleIndex > 0) {
            const previousModId = `mod-${moduleIndex}`; // mod-1 for module 2, etc.
            const { data: previousProgress } = await supabase
                .from("progress")
                .select("completed")
                .eq("user_id", session.userId)
                .eq("course_id", course.id)
                .eq("module_id", previousModId)
                .eq("completed", true)
                .maybeSingle();

            if (!previousProgress) {
                return (
                    <main className="flex-grow bg-muted/30 pt-24">
                        <div className="container mx-auto px-4 max-w-2xl py-20 text-center">
                            <div className="w-16 h-16 bg-gray-100 text-gray-500 flex items-center justify-center rounded-full mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-6V9a4 4 0 00-8 0v2M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Examen bloqueado</h2>
                            <p className="text-gray-600 mb-6">Debes aprobar el examen del módulo anterior antes de continuar con este.</p>
                            <a href={`/diplomados/${params.id}`} className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                Volver al Diplomado
                            </a>
                        </div>
                    </main>
                )
            }
        }
    }

    // Get current progress or create if doesn't exist
    let currentScore = 0

    if (!isMockPaid && session?.userId) {
        const { data: progressCheck } = await supabase
            .from("progress")
            .select("score")
            .eq("user_id", session.userId)
            .eq("course_id", course.id)
            .eq("module_id", params.moduleId)
            .maybeSingle()

        if (progressCheck) {
            currentScore = Number(progressCheck.score)
        } else {
            await supabase
                .from("progress")
                .insert({
                    user_id: session.userId,
                    course_id: course.id,
                    module_id: params.moduleId,
                    score: 0,
                    completed: false
                })
        }
    }

    return (
        <main className="flex-grow bg-muted/30">
            <section className="pt-[calc(6rem+1cm)] pb-[1cm] bg-primary text-white">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[
                        { label: "Inicio", href: "/" },
                        { label: "Diplomados", href: "/diplomados" },
                        { label: course.title, href: `/diplomados/${course.id}` },
                        { label: "Examen" }
                    ]} />
                    <h1 className="text-3xl md:text-4xl font-bold mt-6">Cuestionario: {params.moduleId.replace("-", " ")}</h1>
                    <p className="mt-2 text-white/80">Recuerda que necesitas un mínimo de 60% para aprobar esta unidad. Tienes intentos ilimitados.</p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="bg-white shadow-sm border p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-6">Preguntas de la Unidad</h2>
                        {currentScore >= 60 && (
                            <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200">
                                ¡Felicidades! Ya aprobaste este módulo con un puntaje de {currentScore}%. Puedes volver a intentarlo si deseas mejorar tu calificación.
                            </div>
                        )}

                        <ExamForm courseId={course.id} moduleId={params.moduleId} />
                    </div>
                </div>
            </section>
        </main>
    )
}
