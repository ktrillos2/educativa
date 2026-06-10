import { notFound, redirect } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { ExamForm } from "./exam-form"

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
