import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

const MODULES_BUCKET = "course-modules"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params
    const decodedFilename = decodeURIComponent(filename)

    const examMatch = decodedFilename.match(/^Cuestionario Modulo (\d+) - (.+)\.pdf$/i)
    const moduleMatch = decodedFilename.match(/^Modulo (\d+) - (.+?)(?: - (\d+))?\.pdf$/i)
    const infoMatch = decodedFilename.match(/^Info - (.+?)(?: - (\d+))?\.pdf$/i)
    const generalMatch = decodedFilename.match(/^General - (diplomados|etdh)(?: - (\d+))?\.pdf$/i)

    let storagePath: string | null = null

    console.log(`[API /api/file] Petición recibida: "${decodedFilename}"`)

    if (generalMatch) {
        const gType = generalMatch[1].toLowerCase()
        const ts = generalMatch[2]
        storagePath = ts ? `info/general-${gType}-${ts}.pdf` : `info/general-${gType}.pdf`
    } else if (infoMatch) {
        const courseId = infoMatch[1]
        const ts = infoMatch[2]
        storagePath = ts ? `${courseId}/info-${ts}.pdf` : `${courseId}/info.pdf`
    } else if (examMatch) {
        const moduleIndex = examMatch[1]
        const courseId = examMatch[2]
        storagePath = `${courseId}/cuestionario-modulo-${moduleIndex}.pdf`
    } else if (moduleMatch) {
        const moduleIndex = moduleMatch[1]
        const courseId = moduleMatch[2]
        const ts = moduleMatch[3]
        storagePath = ts ? `${courseId}/modulo-${moduleIndex}-${ts}.pdf` : `${courseId}/modulo-${moduleIndex}.pdf`
    }

    console.log(`[API /api/file] RUTA RESUELTA STORAGE: "${storagePath}" (Match General: ${Boolean(generalMatch)})`)

    if (!storagePath) {
        console.error(`[API /api/file] No se pudo resolver storagePath para "${decodedFilename}"`)
        return new NextResponse("File not found", { status: 404 })
    }

    // Require enrollment ONLY for internal study module PDFs or exam PDFs
    if (examMatch || moduleMatch) {
        const session = await getSession()
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

        if (!isMockPaid) {
            if (!session?.userId) {
                return new NextResponse("Unauthorized", { status: 401 })
            }

            if (session.role !== "admin") {
                const { searchParams } = new URL(request.url)
                const courseId = searchParams.get("courseId")
                const supabase = await createClient()

                let isEnrolled = false
                if (courseId) {
                    const { data } = await supabase
                        .from("enrollments")
                        .select("user_id")
                        .eq("user_id", session.userId)
                        .eq("course_id", courseId)
                        .maybeSingle()
                    if (data) isEnrolled = true
                } else {
                    const { data } = await supabase
                        .from("enrollments")
                        .select("user_id")
                        .eq("user_id", session.userId)
                        .limit(1)
                    if (data && data.length > 0) isEnrolled = true
                }

                if (!isEnrolled) {
                    return new NextResponse("Enrollment Required", { status: 403 })
                }
            }
        }
    }

    // Generate a short-lived signed URL and redirect to it
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase.storage
        .from(MODULES_BUCKET)
        .createSignedUrl(storagePath, 3600) // 1 hour

    if (error || !data?.signedUrl) {
        console.error("Error creating signed URL for storagePath:", storagePath, error)
        return new NextResponse("File not found", { status: 404 })
    }

    // Redirect to the signed URL with strict no-cache headers so browser never caches old PDF versions
    const res = NextResponse.redirect(data.signedUrl, { status: 307 })
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    return res
}
