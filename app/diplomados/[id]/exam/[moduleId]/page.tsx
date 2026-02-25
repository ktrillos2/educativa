import { notFound, redirect } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { diplomados } from "@/lib/data"
import { ExamForm } from "./exam-form"

export default async function ExamPage(props: { params: Promise<{ id: string; moduleId: string }> }) {
    const params = await props.params
    const course = diplomados.find(d => d.id === params.id)

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

        const enrollment = await db.execute({
            sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND course_id = ?",
            args: [session.userId, course.id]
        })

        if (enrollment.rows.length === 0 || !enrollment.rows[0].payment_verified) {
            redirect(`/diplomados/${params.id}`)
        }
    }

    // Get current progress or create if doesn't exist
    let progressStrId = ""
    let currentScore = 0

    if (!isMockPaid && session?.userId) {
        const progressCheck = await db.execute({
            sql: "SELECT id, score, completed FROM progress WHERE user_id = ? AND course_id = ? AND module_id = ?",
            args: [session.userId, course.id, params.moduleId]
        })

        if (progressCheck.rows.length > 0) {
            progressStrId = String(progressCheck.rows[0].id)
            currentScore = Number(progressCheck.rows[0].score)
        } else {
            progressStrId = crypto.randomUUID()
            await db.execute({
                sql: "INSERT INTO progress (id, user_id, course_id, module_id) VALUES (?, ?, ?, ?)",
                args: [progressStrId, session.userId, course.id, params.moduleId]
            })
        }
    }

    return (
        <main className="flex-grow bg-muted/30">
            <section className="pb-12 bg-primary text-white">
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
                    <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-6">Preguntas de la Unidad</h2>
                        {currentScore >= 60 && (
                            <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded">
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
